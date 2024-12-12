// src/stt/interfaces/stt.interface.ts

import { Observable } from 'rxjs';
import * as grpc from '@grpc/grpc-js';
import {
  Empty,
  ModelsResponse,
  RecognitionRequest,
  RecognitionResponse,
  StreamingRecognitionResponse,
} from './asr_api_pb';

export interface SttService {
  GetSupportedModelsInfo(data: Empty): Observable<ModelsResponse>;
  Recognize(data: RecognitionRequest): Observable<RecognitionResponse>;
  StreamingRecognize(): Observable<StreamingRecognitionResponse>;
}

export interface VoxAsrPackage {
  vox: {
    asr: {
      SttService: new (address: string, creds: grpc.ChannelCredentials) => any;
    };
  };
}
