import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { StreamRecognitionService } from './stream-recognition.service';
import {
  StreamingRecognitionRequest,
  StreamingRecognitionResponse,
} from 'src/grpc/protos/asr_api_pb';
import { PassThrough } from 'stream';
import * as grpc from '@grpc/grpc-js';

interface StreamInfo {
  call: grpc.ClientDuplexStream<
    StreamingRecognitionRequest,
    StreamingRecognitionResponse
  >;
  resampleStream: PassThrough;
  active: boolean;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class StreamRecognitionGateway {
  @WebSocketServer()
  server: Server;

  private sessions = new Map<string, StreamInfo>();

  constructor(private readonly recognitionService: StreamRecognitionService) {}

  @SubscribeMessage('startRecognition')
  handleStartRecognition(
    @MessageBody() data: { config: any; token?: string; onlyNew?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { config, token, onlyNew = true } = data;

    const { call, resampleStream } =
      this.recognitionService.createStreamingCall(config, token, onlyNew);

    call.on('data', (response) => {
      client.emit('recognitionResult', {
        text: response.text,
        chunks: response.chunks,
        final: response.final,
        sessionId: response.session_id,
      });
    });

    call.on('end', () => {
      client.emit('recognitionFinished');
      const session = this.sessions.get(client.id);
      if (session) {
        session.active = false;
      }
      this.sessions.delete(client.id);
    });

    call.on('error', (err) => {
      client.emit('recognitionError', err.message);
      const session = this.sessions.get(client.id);
      if (session) {
        session.active = false;
      }
      this.sessions.delete(client.id);
    });

    this.sessions.set(client.id, {
      call,
      resampleStream,
      active: true,
    });

    return { status: 'ok', message: 'Recognition started' };
  }

  @SubscribeMessage('audioData')
  handleAudioData(
    @MessageBody() data: Buffer,
    @ConnectedSocket() client: Socket,
  ) {
    const streamInfo = this.sessions.get(client.id);
    if (!streamInfo || !streamInfo.active) {
      client.emit('recognitionError', 'No active recognition session');
      return;
    }

    const { call, resampleStream } = streamInfo;
    this.recognitionService.sendAudioChunk(call, resampleStream, data);
  }

  @SubscribeMessage('stopRecognition')
  handleStopRecognition(@ConnectedSocket() client: Socket) {
    const streamInfo = this.sessions.get(client.id);
    if (!streamInfo) {
      client.emit('recognitionError', 'No active recognition session to stop');
      return;
    }

    const { call, resampleStream } = streamInfo;
    this.recognitionService.endCall(call, resampleStream);

    streamInfo.active = false;

    this.sessions.delete(client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const streamInfo = this.sessions.get(client.id);
    if (streamInfo) {
      const { call, resampleStream } = streamInfo;
      this.recognitionService.endCall(call, resampleStream);

      streamInfo.active = false;

      this.sessions.delete(client.id);
    }
  }
}
