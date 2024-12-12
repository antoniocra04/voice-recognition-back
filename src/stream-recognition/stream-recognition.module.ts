import { Module } from '@nestjs/common';
import { StreamRecognitionController } from './stream-recognition.controller';
import { StreamRecognitionService } from './stream-recognition.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { StreamRecognitionGateway } from './stream-recognition.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SRS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'vox.asr',
          protoPath: join(__dirname, '../proto/asr_api.proto'),
          url: 'stt.3i-vox.ru:443',
        },
      },
    ]),
  ],
  controllers: [StreamRecognitionController],
  providers: [StreamRecognitionService, StreamRecognitionGateway],
})
export class StreamRecognitionModule {}
