// src/app.service.ts

import { Injectable } from '@nestjs/common';
import { GrpcService } from './grpc/grpc.service';
import * as grpc from '@grpc/grpc-js';
import { PassThrough } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { v4 as uuidv4 } from 'uuid';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class AppService {
  constructor(private readonly grpcService: GrpcService) {}

  async recognizeStream(
    audioStream: PassThrough,
    token: string,
    model: string,
    onTextReceived: (text: string) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const metadata = new grpc.Metadata();
      metadata.add('authorization', `Bearer ${token}`);
      const uniqueFileName = `audio_stream_${token}_${uuidv4()}`;

      const call = this.grpcService.streamingRecognize(metadata);

      // Отправляем конфигурационный запрос
      const configRequest = {
        config: {
          model,
          file_name: uniqueFileName, // Добавлено поле file_name
          enable_automatic_punctuation: true,
        },
        only_new: false, // Добавлено поле only_new
      };
      call.write(configRequest);

      call.on('data', (response: any) => {
        if (response.text) {
          onTextReceived(response.text);
        }
      });

      call.on('error', (error: any) => {
        console.error('gRPC Error:', error);
        reject(error);
      });

      call.on('end', () => {
        console.log('gRPC Stream ended.');
        resolve();
      });

      // Настройка ffmpeg для преобразования в PCM 16-bit
      const pcmStream = new PassThrough();

      ffmpeg(audioStream)
        .inputFormat('webm') // Замените на актуальный формат, если необходимо
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(16000)
        .format('s16le')
        .on('error', (err) => {
          console.error('FFmpeg Error:', err);
          reject(err);
        })
        .pipe(pcmStream);

      pcmStream.on('data', (chunk: Buffer) => {
        const audioRequest = {
          audio_content: chunk,
        };
        call.write(audioRequest);
      });

      pcmStream.on('end', () => {
        call.end();
      });
    });
  }
}
