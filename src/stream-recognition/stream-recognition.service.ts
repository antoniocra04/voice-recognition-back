import { loadSync } from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { VoxAsrPackage } from 'src/grpc/protos/asr_api_interface';
import {
  RecognitionConfig,
  StreamingRecognitionRequest,
  StreamingRecognitionResponse,
} from 'src/grpc/protos/asr_api_pb';
import * as ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

const PROTO_PATH = join(__dirname, '../grpc/protos/asr_api.proto');
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as VoxAsrPackage;

@Injectable()
export class StreamRecognitionService {
  private client: any;

  constructor() {
    const creds = grpc.credentials.createSsl();
    this.client = new proto.vox.asr.SttService('3i-vox.3itech-ca.kz', creds);
  }

  createStreamingCall(
    config: RecognitionConfig,
    token?: string,
    onlyNew = true,
  ): {
    call: grpc.ClientDuplexStream<
      StreamingRecognitionRequest,
      StreamingRecognitionResponse
    >;
    resampleStream: PassThrough;
  } {
    const metadata = new grpc.Metadata();
    if (token) {
      metadata.add('authorization', `Bearer ${token}`);
    }

    const call = this.client.StreamingRecognize(metadata);
    call.write({ config, only_new: onlyNew });

    // Создаём поток для ресэмплинга
    const resampleStream = new PassThrough();

    // Настраиваем ffmpeg для ресэмплинга с 48000 до 16000 Гц
    const ffmpegProcess = ffmpeg()
      .input(resampleStream)
      .inputFormat('s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec('pcm_s16le')
      .format('s16le')
      .on('error', (err) => {
        console.error('ffmpeg error:', err);
        call.end();
      })
      .pipe();

    ffmpegProcess.on('data', (data: Buffer) => {
      call.write({ audio_content: data, only_new: true });
    });

    ffmpegProcess.on('end', () => {
      call.end();
    });

    return { call, resampleStream };
  }

  sendAudioChunk(
    call: grpc.ClientDuplexStream<
      StreamingRecognitionRequest,
      StreamingRecognitionResponse
    >,
    resampleStream: PassThrough,
    chunk: Buffer,
  ) {
    // Записываем данные в поток ресэмплинга
    resampleStream.write(chunk);
  }

  endCall(
    call: grpc.ClientDuplexStream<
      StreamingRecognitionRequest,
      StreamingRecognitionResponse
    >,
    resampleStream: PassThrough,
  ) {
    // Завершаем поток ресэмплинга и gRPC вызов
    resampleStream.end();
    call.end();
  }
}
