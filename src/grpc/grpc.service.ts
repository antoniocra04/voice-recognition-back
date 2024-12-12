// src/grpc/grpc.service.ts

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { Observable } from 'rxjs';
import {
  ModelsResponse,
  RecognitionRequest,
  RecognitionResponse,
} from './protos/asr_api_pb'; // Adjust paths as needed

@Injectable()
export class GrpcService {
  private readonly logger = new Logger(GrpcService.name);
  private sttClient: any;

  constructor() {
    const PROTO_PATH = join(__dirname, '..', 'grpc/protos', 'asr_api.proto');

    // Load the .proto file
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: false, // Convert to camelCase
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [
        join(__dirname, '..', 'proto'), // Path to your proto files
        // Add other include directories if necessary
      ],
    });

    // Load the package definition
    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as any;

    this.logger.debug('Proto Descriptor:', protoDescriptor); // For debugging

    // Access your package and service based on your .proto file
    const sttPackage = protoDescriptor.vox.asr;

    if (!sttPackage) {
      throw new Error("Failed to find package 'vox.asr' in the .proto file.");
    }

    this.sttClient = new sttPackage.SttService(
      '3i-vox.ru', // Ensure the address includes the port
      grpc.credentials.createSsl(),
    );

    if (!this.sttClient) {
      throw new Error(
        "Failed to create an instance of 'SttService'. Check package and service names.",
      );
    }
  }

  // Method for streaming speech recognition
  streamingRecognize(
    metadata?: grpc.Metadata,
  ): grpc.ClientDuplexStream<any, any> {
    return this.sttClient.StreamingRecognize(metadata);
  }

  getSupportedModels(token: string): Observable<ModelsResponse> {
    return new Observable<ModelsResponse>((observer) => {
      const metadata = new grpc.Metadata();
      metadata.add('authorization', `Bearer ${token}`);
      this.sttClient.GetSupportedModelsInfo(
        {},
        metadata,
        (error: grpc.ServiceError | null, response: ModelsResponse) => {
          if (error) {
            this.logger.error('GetSupportedModelsInfo Error:', error);
            observer.error(error);
          } else {
            this.logger.debug('GetSupportedModelsInfo Response:', response);
            observer.next(response);
            observer.complete();
          }
        },
      );
    });
  }

  // Method to recognize audio
  recognizeAudio(
    request: RecognitionRequest,
    token: string,
  ): Observable<RecognitionResponse> {
    return new Observable<RecognitionResponse>((observer) => {
      const metadata = new grpc.Metadata();
      metadata.add('authorization', `Bearer ${token}`);
      this.sttClient.Recognize(
        request,
        metadata,
        (error: grpc.ServiceError | null, response: RecognitionResponse) => {
          if (error) {
            this.logger.error('Recognize Error:', error);
            observer.error(error);
          } else {
            this.logger.debug('Recognize Response:', response);
            observer.next(response);
            observer.complete();
          }
        },
      );
    });
  }
}
