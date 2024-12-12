// package: vox.asr
// file: asr_api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as asr_api_pb from "./asr_api_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";

interface ISttServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getSupportedModelsInfo: ISttServiceService_IGetSupportedModelsInfo;
    recognize: ISttServiceService_IRecognize;
    streamingRecognize: ISttServiceService_IStreamingRecognize;
}

interface ISttServiceService_IGetSupportedModelsInfo extends grpc.MethodDefinition<asr_api_pb.Empty, asr_api_pb.ModelsResponse> {
    path: "/vox.asr.SttService/GetSupportedModelsInfo";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<asr_api_pb.Empty>;
    requestDeserialize: grpc.deserialize<asr_api_pb.Empty>;
    responseSerialize: grpc.serialize<asr_api_pb.ModelsResponse>;
    responseDeserialize: grpc.deserialize<asr_api_pb.ModelsResponse>;
}
interface ISttServiceService_IRecognize extends grpc.MethodDefinition<asr_api_pb.RecognitionRequest, asr_api_pb.RecognitionResponse> {
    path: "/vox.asr.SttService/Recognize";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<asr_api_pb.RecognitionRequest>;
    requestDeserialize: grpc.deserialize<asr_api_pb.RecognitionRequest>;
    responseSerialize: grpc.serialize<asr_api_pb.RecognitionResponse>;
    responseDeserialize: grpc.deserialize<asr_api_pb.RecognitionResponse>;
}
interface ISttServiceService_IStreamingRecognize extends grpc.MethodDefinition<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse> {
    path: "/vox.asr.SttService/StreamingRecognize";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<asr_api_pb.StreamingRecognitionRequest>;
    requestDeserialize: grpc.deserialize<asr_api_pb.StreamingRecognitionRequest>;
    responseSerialize: grpc.serialize<asr_api_pb.StreamingRecognitionResponse>;
    responseDeserialize: grpc.deserialize<asr_api_pb.StreamingRecognitionResponse>;
}

export const SttServiceService: ISttServiceService;

export interface ISttServiceServer extends grpc.UntypedServiceImplementation {
    getSupportedModelsInfo: grpc.handleUnaryCall<asr_api_pb.Empty, asr_api_pb.ModelsResponse>;
    recognize: grpc.handleUnaryCall<asr_api_pb.RecognitionRequest, asr_api_pb.RecognitionResponse>;
    streamingRecognize: grpc.handleBidiStreamingCall<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
}

export interface ISttServiceClient {
    getSupportedModelsInfo(request: asr_api_pb.Empty, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    getSupportedModelsInfo(request: asr_api_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    getSupportedModelsInfo(request: asr_api_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    recognize(request: asr_api_pb.RecognitionRequest, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    recognize(request: asr_api_pb.RecognitionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    recognize(request: asr_api_pb.RecognitionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    streamingRecognize(): grpc.ClientDuplexStream<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
    streamingRecognize(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
    streamingRecognize(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
}

export class SttServiceClient extends grpc.Client implements ISttServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getSupportedModelsInfo(request: asr_api_pb.Empty, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    public getSupportedModelsInfo(request: asr_api_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    public getSupportedModelsInfo(request: asr_api_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: asr_api_pb.ModelsResponse) => void): grpc.ClientUnaryCall;
    public recognize(request: asr_api_pb.RecognitionRequest, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    public recognize(request: asr_api_pb.RecognitionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    public recognize(request: asr_api_pb.RecognitionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: asr_api_pb.RecognitionResponse) => void): grpc.ClientUnaryCall;
    public streamingRecognize(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
    public streamingRecognize(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<asr_api_pb.StreamingRecognitionRequest, asr_api_pb.StreamingRecognitionResponse>;
}
