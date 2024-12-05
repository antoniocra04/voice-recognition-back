import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcService } from './grpc/grpc.service';
import { AppGateway } from './app.gateway';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigModule доступным во всех модулях без необходимости импортировать его
      envFilePath: '.env', // Указывает путь к файлу .env (по умолчанию ищет в корне)
    }),
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, GrpcService, AppGateway],
})
export class AppModule {}
