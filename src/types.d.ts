declare var AudioData: {
  new(options: AudioDataOptions): AudioData
}

declare var AudioEncoder: {
  new(options: AudioEncoderOptions): AudioEncoder
}

declare var EncodedAudioChunk: {
  new(options: EncodedAudioChunkOptions): EncodedAudioChunk
}

declare var AudioDecoder: {
  new(options: AudioDecoderOptions): AudioDecoder
}

declare global {
  interface Window {
    AudioData: typeof AudioData,
    AudioEncoder: typeof AudioEncoder
  }
}

interface AudioEncoder {
  configure: (options: ConfigureOptions) => void
  encode: (data: AudioDataInit) => void
  flush: () => void
}

interface AudioEncoderOptions {
  output: (encodedChunk: EncodedAudioChunk) => void
  error: (err: Error) => void
}

interface ConfigureOptions {
  codec: string,
  sampleRate: number,
  numberOfChannels: number,
  bitrate: number
}


interface EncodedAudioChunkOptions {
  type: 'key' | 'delta',
  timestamp: number,
  duration: number,
  byteLength: number,
  data: ArrayBuffer
}

interface EncodedAudioChunk {
  type: 'key' | 'delta',
  timestamp: number,
  duration: number,
  byteLength: number,
  copyTo: (dest: ArrayBuffer, offset: number) => void
}

interface AudioData {
  timestamp: number
  duration: number
  format: 'f32'
  sampleRate: number
  numberOfChannels: number
  numberOfFrames: number
  copyTo: (dest: ArrayBuffer | TypedArray | DataView, options: AudioDataCopyToOptions) => void
}

interface AudioDataOptions {
  timestamp: number, // microseconds
  data: ArrayBufferLike,
  format: 's16',
  sampleRate: number,
  numberOfChannels: number
  numberOfFrames: number,
}

interface AudioDecoderOptions {
  output: (data: AudioData) => void;
  error: (err: Error) => void;
}

interface AudioDecoder {
  decode: (data: EncodedAudioChunk) => void;
  configure: (options: ConfigureOptions) => void;
}

interface AudioDataInit {
  timestamp: number;
  data?: ArrayBuffer;
  format: string;
  sampleRate: number;
  numberOfChannels: number;
  numberOfFrames: number;
}

interface AudioDataCopyToOptions {
  planeIndex: number;
  frameOffset?: number;
  frameCount: number;
  format: AudioSampleFormat;
}

type AudioSampleFormat = 'u8' | 's16' | 's32' | 'f32' | 'u8-planar' | 's16-planar' | 's32-planar' | 'f32-planar';

enum AudioSampleFormat {
  "u8",
  "s16",
  "s32",
  "f32",
  "u8-planar",
  "s16-planar",
  "s32-planar",
  "f32-planar",
};
