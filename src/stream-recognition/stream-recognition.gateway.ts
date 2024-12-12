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
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface StreamInfo {
  call: grpc.ClientDuplexStream<
    StreamingRecognitionRequest,
    StreamingRecognitionResponse
  >;
  resampleStream: PassThrough;
  active: boolean;
  audioChunks: Buffer[]; // Добавляем массив для накопления аудио-фрагментов
}

@WebSocketGateway({ cors: { origin: '*' } })
export class StreamRecognitionGateway {
  @WebSocketServer() server: Server;
  private sessions = new Map<string, StreamInfo>();

  constructor(private readonly recognitionService: StreamRecognitionService) {}

  @SubscribeMessage('startRecognition')
  handleStartRecognition(
    @MessageBody() data: { config: any; token?: string; onlyNew?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { config, token, onlyNew = true } = data;
    const clientId = client.id;

    // Создаём gRPC вызов и поток ресэмплинга
    const { call, resampleStream } =
      this.recognitionService.createStreamingCall(config, token, onlyNew);

    // Инициализируем массив для накопления аудио-фрагментов
    const audioChunks: Buffer[] = [];

    // Обработка ответов от gRPC сервиса
    call.on('data', (response) => {
      this.server.to(client.id).emit('recognitionResult', {
        text: response.text,
        chunks: response.chunks,
        final: response.final,
        sessionId: response.session_id,
      });
    });

    call.on('end', () => {
      this.server.to(client.id).emit('recognitionFinished');
      const session = this.sessions.get(client.id);
      if (session) {
        session.active = false;
        this.saveAudio(clientId, session.audioChunks, config.file_name);
      }
      this.sessions.delete(client.id);
    });

    call.on('error', (err) => {
      this.server.to(client.id).emit('recognitionError', err.message);
      const session = this.sessions.get(client.id);
      if (session) {
        session.active = false;
        this.saveAudio(clientId, session.audioChunks, config.file_name);
      }
      this.sessions.delete(client.id);
    });

    // Сохраняем сессию
    this.sessions.set(client.id, {
      call,
      resampleStream,
      active: true,
      audioChunks,
    });

    return { status: 'ok', message: 'Recognition started' };
  }

  @SubscribeMessage('audioData')
  handleAudioData(
    @MessageBody() data: Buffer, // Принимаем Buffer напрямую
    @ConnectedSocket() client: Socket,
  ) {
    const streamInfo = this.sessions.get(client.id);
    if (!streamInfo || !streamInfo.active) {
      this.server
        .to(client.id)
        .emit('recognitionError', 'No active recognition session');
      return;
    }

    const { call, resampleStream, audioChunks } = streamInfo;

    // Логируем первые байты для отладки
    console.log(
      `Received audio chunk from ${client.id}:`,
      data.slice(0, 10).toString('hex'),
    );

    // Отправляем данные в поток ресэмплинга
    this.recognitionService.sendAudioChunk(call, resampleStream, data);

    // Добавляем полученный фрагмент в массив
    audioChunks.push(data);
  }

  @SubscribeMessage('stopRecognition')
  handleStopRecognition(@ConnectedSocket() client: Socket) {
    const streamInfo = this.sessions.get(client.id);
    if (!streamInfo) {
      this.server
        .to(client.id)
        .emit('recognitionError', 'No active recognition session to stop');
      return;
    }
    const { call, resampleStream, audioChunks } = streamInfo;
    this.recognitionService.endCall(call, resampleStream);

    // Обновляем флаг активности
    streamInfo.active = false;

    // Сохраняем аудио-файлы
    this.saveAudio(client.id, audioChunks, 'session.wav');

    this.sessions.delete(client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const streamInfo = this.sessions.get(client.id);
    if (streamInfo) {
      const { call, resampleStream, audioChunks } = streamInfo;
      this.recognitionService.endCall(call, resampleStream);

      // Обновляем флаг активности
      streamInfo.active = false;

      // Сохраняем аудио-файлы
      this.saveAudio(client.id, audioChunks, 'session.wav');

      this.sessions.delete(client.id);
    }
  }

  /**
   * Функция для сохранения аудио-фрагментов в WAV-файл
   * @param clientId Идентификатор клиента
   * @param audioChunks Массив аудио-фрагментов
   * @param fileName Имя файла
   */
  private saveAudio(clientId: string, audioChunks: Buffer[], fileName: string) {
    if (audioChunks.length === 0) {
      console.warn(`No audio data to save for client ${clientId}`);
      return;
    }

    // Объединяем все аудио-фрагменты
    const totalLength = audioChunks.reduce(
      (acc, chunk) => acc + chunk.length,
      0,
    );
    const combinedBuffer = Buffer.concat(audioChunks, totalLength);

    // Добавляем WAV-заголовок
    const wavBuffer = this.addWavHeader(combinedBuffer, 16000, 1, 16);

    // Определяем путь для сохранения
    const outputDir = join(__dirname, '../../debug_chunks');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = join(outputDir, `${clientId}_${Date.now()}_${fileName}`);

    // Сохраняем файл
    writeFileSync(outputPath, wavBuffer);
    console.log(`Saved audio for client ${clientId} to ${outputPath}`);
  }

  /**
   * Функция для добавления WAV-заголовка к PCM данным
   * @param buffer Буфер с PCM данными
   * @param sampleRate Частота дискретизации
   * @param numChannels Количество каналов
   * @param bitsPerSample Битовая глубина
   * @returns Буфер с WAV-заголовком
   */
  private addWavHeader(
    buffer: Buffer,
    sampleRate: number = 16000,
    numChannels: number = 1,
    bitsPerSample: number = 16,
  ): Buffer {
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataLength = buffer.length;
    const chunkSize = 36 + dataLength;

    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(chunkSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size
    header.writeUInt16LE(1, 20); // AudioFormat PCM
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);

    return Buffer.concat([header, buffer]);
  }
}
