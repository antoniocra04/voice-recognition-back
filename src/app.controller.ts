import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ModelsResponse,
  RecognitionRequest,
  RecognitionResponse,
} from './grpc/protos/asr_api_pb';
import { GrpcService } from './grpc/grpc.service';

@Controller()
export class AppController {
  constructor(private readonly grpcService: GrpcService) {}

  @Get('models')
  getSupportedModels(
    @Headers('authorization') authHeader: string,
  ): Observable<ModelsResponse> {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.grpcService.getSupportedModels(token);
  }

  @Post('recognize')
  recognizeAudio(
    @Body() recognitionRequest: RecognitionRequest,
    @Headers('authorization') authHeader: string,
  ): Observable<RecognitionResponse> {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.grpcService.recognizeAudio(recognitionRequest, token);
  }

  // Helper method to extract token from header
  private extractToken(authHeader: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  }
}
