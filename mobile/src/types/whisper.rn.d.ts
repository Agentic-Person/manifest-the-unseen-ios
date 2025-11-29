/**
 * Type declarations for whisper.rn
 * https://github.com/mybigday/whisper.rn
 */

declare module 'whisper.rn' {
  export interface TranscribeOptions {
    language?: string;
    maxLen?: number;
    tokenTimestamps?: boolean;
    translate?: boolean;
    onProgress?: (progress: number) => void;
    onNewSegments?: (result: TranscribeNewSegmentsResult) => void;
  }

  export interface TranscribeSegment {
    t0: number;
    t1: number;
    text: string;
  }

  export interface TranscribeResult {
    result: string;
    segments: TranscribeSegment[];
  }

  export interface TranscribeNewSegmentsResult {
    nNew: number;
    totalNNew: number;
    result: string;
    segments: TranscribeSegment[];
  }

  export interface ContextOptions {
    filePath: string | number;
    coreMLModelAsset?: {
      filename: string;
      assets: string[] | number[];
    };
    isBundleAsset?: boolean;
    useCoreMLIos?: boolean;
    useGpu?: boolean;
    useFlashAttn?: boolean;
  }

  export class WhisperContext {
    ptr: number;
    id: number;
    gpu: boolean;
    reasonNoGPU: string;

    transcribe(
      filePathOrBase64: string | number,
      options?: TranscribeOptions
    ): {
      stop: () => Promise<void>;
      promise: Promise<TranscribeResult>;
    };

    transcribeData(
      data: string | ArrayBuffer,
      options?: TranscribeOptions
    ): {
      stop: () => Promise<void>;
      promise: Promise<TranscribeResult>;
    };

    bench(maxThreads: number): Promise<any>;
    release(): Promise<void>;
  }

  export function initWhisper(options: ContextOptions): Promise<WhisperContext>;
  export function releaseAllWhisper(): Promise<void>;

  export const libVersion: string;
  export const isUseCoreML: boolean;
  export const isCoreMLAllowFallback: boolean;
}
