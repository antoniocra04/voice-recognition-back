import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StreamRecognitionModule } from './stream-recognition/stream-recognition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigModule доступным во всех модулях без необходимости импортировать его
      envFilePath: '.env', // Указывает путь к файлу .env (по умолчанию ищет в корне)
    }),
    AuthModule,
    StreamRecognitionModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
