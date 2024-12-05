import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { PassThrough } from 'stream';

@WebSocketGateway({
  cors: {
    origin: '*', // Замените на ваш фронтенд домен для безопасности
    methods: ['GET', 'POST'],
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly appService: AppService) {}

  handleConnection(client: Socket) {
    console.log('Клиент подключен:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Клиент отключен:', client.id);
  }

  @SubscribeMessage('startRecognition')
  async handleStartRecognition(client: Socket, payload: any) {
    const { token, model } = payload;

    // Создаем PassThrough поток для передачи аудиоданных
    const audioStream = new PassThrough();

    // Обработчик завершения распознавания
    const onRecognitionEnd = () => {
      console.log('Распознавание завершено для клиента:', client.id);
      client.emit('recognitionEnd');
    };

    // Запускаем распознавание
    try {
      await this.appService.recognizeStream(
        audioStream,
        token,
        model,
        (text: string) => {
          client.emit('recognizedText', { text });
        },
      );
      onRecognitionEnd();
    } catch (error) {
      console.error('Ошибка распознавания:', error);
      client.emit('error', { message: error.message });
      onRecognitionEnd();
    }

    // Обработка поступающих аудиоданных от клиента
    client.on('audioData', (data: Buffer) => {
      audioStream.write(data);
    });

    // Обработка сигнала остановки распознавания от клиента
    client.on('stopRecognition', () => {
      audioStream.end();
    });
  }
}
