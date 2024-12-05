import { Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

@Injectable()
export class GrpcService {
  private sttClient: any;

  constructor() {
    const PROTO_PATH = join(__dirname, '..', 'proto', 'asr_api.proto');

    // Загрузка .proto файла
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: false, // Используйте false, чтобы получить camelCase ключи
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      // Добавьте includeDirs, если необходимо
      includeDirs: [
        join(__dirname, '..', 'proto'), // Путь к вашим proto файчлам
        // Укажите путь к стандартным proto файлам, если требуется
        // Например: '/usr/local/include' на некоторых системах
      ],
    });

    // Загрузка описания пакета
    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as any;

    console.log('Proto Descriptor:', protoDescriptor); // Для отладки

    // Доступ к вашему пакету и сервису, основанный на вашем .proto файле
    const sttPackage = protoDescriptor.vox.asr; // Исправлено на 'vox.asr'

    if (!sttPackage) {
      throw new Error("Не удалось найти пакет 'vox.asr' в .proto файле.");
    }

    this.sttClient = new sttPackage.SttService(
      'stt.3i-vox.ru:443',
      grpc.credentials.createSsl(),
    );

    if (!this.sttClient) {
      throw new Error(
        "Не удалось создать экземпляр 'SttService'. Проверьте имена пакета и сервиса.",
      );
    }
  }

  // Метод для потокового распознавания речи
  streamingRecognize(
    metadata: grpc.Metadata,
  ): grpc.ClientDuplexStream<any, any> {
    return this.sttClient.StreamingRecognize(metadata);
  }
}
