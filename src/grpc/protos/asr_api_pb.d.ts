// package: vox.asr
// file: asr_api.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";

export class ModelsResponse extends jspb.Message { 
    clearModelsList(): void;
    getModelsList(): Array<Model>;
    setModelsList(value: Array<Model>): ModelsResponse;
    addModels(value?: Model, index?: number): Model;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ModelsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ModelsResponse): ModelsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ModelsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ModelsResponse;
    static deserializeBinaryFromReader(message: ModelsResponse, reader: jspb.BinaryReader): ModelsResponse;
}

export namespace ModelsResponse {
    export type AsObject = {
        modelsList: Array<Model.AsObject>,
    }
}

export class Model extends jspb.Message { 
    getName(): string;
    setName(value: string): Model;
    getSampleRateHertz(): number;
    setSampleRateHertz(value: number): Model;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Model.AsObject;
    static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Model;
    static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
    export type AsObject = {
        name: string,
        sampleRateHertz: number,
    }
}

export class RecognitionRequest extends jspb.Message { 

    hasConfig(): boolean;
    clearConfig(): void;
    getConfig(): RecognitionConfig | undefined;
    setConfig(value?: RecognitionConfig): RecognitionRequest;
    getAudioContent(): Uint8Array | string;
    getAudioContent_asU8(): Uint8Array;
    getAudioContent_asB64(): string;
    setAudioContent(value: Uint8Array | string): RecognitionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RecognitionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RecognitionRequest): RecognitionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RecognitionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RecognitionRequest;
    static deserializeBinaryFromReader(message: RecognitionRequest, reader: jspb.BinaryReader): RecognitionRequest;
}

export namespace RecognitionRequest {
    export type AsObject = {
        config?: RecognitionConfig.AsObject,
        audioContent: Uint8Array | string,
    }
}

export class StreamingRecognitionRequest extends jspb.Message { 

    hasConfig(): boolean;
    clearConfig(): void;
    getConfig(): RecognitionConfig | undefined;
    setConfig(value?: RecognitionConfig): StreamingRecognitionRequest;

    hasAudioContent(): boolean;
    clearAudioContent(): void;
    getAudioContent(): Uint8Array | string;
    getAudioContent_asU8(): Uint8Array;
    getAudioContent_asB64(): string;
    setAudioContent(value: Uint8Array | string): StreamingRecognitionRequest;
    getOnlyNew(): boolean;
    setOnlyNew(value: boolean): StreamingRecognitionRequest;

    getStreamingRequestCase(): StreamingRecognitionRequest.StreamingRequestCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamingRecognitionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StreamingRecognitionRequest): StreamingRecognitionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamingRecognitionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamingRecognitionRequest;
    static deserializeBinaryFromReader(message: StreamingRecognitionRequest, reader: jspb.BinaryReader): StreamingRecognitionRequest;
}

export namespace StreamingRecognitionRequest {
    export type AsObject = {
        config?: RecognitionConfig.AsObject,
        audioContent: Uint8Array | string,
        onlyNew: boolean,
    }

    export enum StreamingRequestCase {
        STREAMING_REQUEST_NOT_SET = 0,
        CONFIG = 1,
        AUDIO_CONTENT = 2,
    }

}

export class RecognitionConfig extends jspb.Message { 
    getModel(): string;
    setModel(value: string): RecognitionConfig;
    getFileName(): string;
    setFileName(value: string): RecognitionConfig;
    getEnableAutomaticPunctuation(): boolean;
    setEnableAutomaticPunctuation(value: boolean): RecognitionConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RecognitionConfig.AsObject;
    static toObject(includeInstance: boolean, msg: RecognitionConfig): RecognitionConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RecognitionConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RecognitionConfig;
    static deserializeBinaryFromReader(message: RecognitionConfig, reader: jspb.BinaryReader): RecognitionConfig;
}

export namespace RecognitionConfig {
    export type AsObject = {
        model: string,
        fileName: string,
        enableAutomaticPunctuation: boolean,
    }
}

export class RecognitionResponse extends jspb.Message { 
    clearChunksList(): void;
    getChunksList(): Array<SpeechRecognitionChunk>;
    setChunksList(value: Array<SpeechRecognitionChunk>): RecognitionResponse;
    addChunks(value?: SpeechRecognitionChunk, index?: number): SpeechRecognitionChunk;
    getText(): string;
    setText(value: string): RecognitionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RecognitionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RecognitionResponse): RecognitionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RecognitionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RecognitionResponse;
    static deserializeBinaryFromReader(message: RecognitionResponse, reader: jspb.BinaryReader): RecognitionResponse;
}

export namespace RecognitionResponse {
    export type AsObject = {
        chunksList: Array<SpeechRecognitionChunk.AsObject>,
        text: string,
    }
}

export class StreamingRecognitionResponse extends jspb.Message { 
    clearChunksList(): void;
    getChunksList(): Array<SpeechRecognitionChunk>;
    setChunksList(value: Array<SpeechRecognitionChunk>): StreamingRecognitionResponse;
    addChunks(value?: SpeechRecognitionChunk, index?: number): SpeechRecognitionChunk;
    getSessionId(): string;
    setSessionId(value: string): StreamingRecognitionResponse;
    getText(): string;
    setText(value: string): StreamingRecognitionResponse;
    getFinal(): boolean;
    setFinal(value: boolean): StreamingRecognitionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamingRecognitionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StreamingRecognitionResponse): StreamingRecognitionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamingRecognitionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamingRecognitionResponse;
    static deserializeBinaryFromReader(message: StreamingRecognitionResponse, reader: jspb.BinaryReader): StreamingRecognitionResponse;
}

export namespace StreamingRecognitionResponse {
    export type AsObject = {
        chunksList: Array<SpeechRecognitionChunk.AsObject>,
        sessionId: string,
        text: string,
        pb_final: boolean,
    }
}

export class SpeechRecognitionChunk extends jspb.Message { 

    hasStartTime(): boolean;
    clearStartTime(): void;
    getStartTime(): google_protobuf_duration_pb.Duration | undefined;
    setStartTime(value?: google_protobuf_duration_pb.Duration): SpeechRecognitionChunk;

    hasEndTime(): boolean;
    clearEndTime(): void;
    getEndTime(): google_protobuf_duration_pb.Duration | undefined;
    setEndTime(value?: google_protobuf_duration_pb.Duration): SpeechRecognitionChunk;
    clearWordsList(): void;
    getWordsList(): Array<string>;
    setWordsList(value: Array<string>): SpeechRecognitionChunk;
    addWords(value: string, index?: number): string;
    getConfidence(): number;
    setConfidence(value: number): SpeechRecognitionChunk;
    getLoudness(): number;
    setLoudness(value: number): SpeechRecognitionChunk;
    getSpeakerId(): string;
    setSpeakerId(value: string): SpeechRecognitionChunk;
    getPhraseId(): number;
    setPhraseId(value: number): SpeechRecognitionChunk;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SpeechRecognitionChunk.AsObject;
    static toObject(includeInstance: boolean, msg: SpeechRecognitionChunk): SpeechRecognitionChunk.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SpeechRecognitionChunk, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SpeechRecognitionChunk;
    static deserializeBinaryFromReader(message: SpeechRecognitionChunk, reader: jspb.BinaryReader): SpeechRecognitionChunk;
}

export namespace SpeechRecognitionChunk {
    export type AsObject = {
        startTime?: google_protobuf_duration_pb.Duration.AsObject,
        endTime?: google_protobuf_duration_pb.Duration.AsObject,
        wordsList: Array<string>,
        confidence: number,
        loudness: number,
        speakerId: string,
        phraseId: number,
    }
}

export class Empty extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Empty.AsObject;
    static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Empty;
    static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
    export type AsObject = {
    }
}
