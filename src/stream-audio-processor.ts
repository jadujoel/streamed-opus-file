console.log(globalThis)

class StreamAudioProcessor extends globalThis.AudioWorkletProcessor {
  leftBuffer: Float32Array = new Float32Array(globalThis.sampleRate * 390);
  rightBuffer: Float32Array = new Float32Array(globalThis.sampleRate * 390);
  first = true;
  index: number = 0;
  existingSamples: number = 0;
  constructor(...args: any[]) {
    super(...args);

    this.port.onmessage = (ev: MessageEvent<{ left: ArrayBuffer, right: ArrayBuffer, index: number }>) => {
      const { left, right, index } = ev.data;
      if (index > this.leftBuffer.length) {
        return
      }
      this.leftBuffer.set(new Float32Array(left), index);
      this.rightBuffer.set(new Float32Array(right), index);
    };
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const output = outputs[0];

    // Check if we have buffered data to play
    if (this.leftBuffer.length > 0 && this.rightBuffer.length > 0) {
      const leftChannel = output[0];
      const rightChannel = output[1];
      if (this.first) {
        console.log({ outputs })
        console.log('Processor first frame', this.leftBuffer.length, this.rightBuffer.length, this.index, leftChannel.length, rightChannel.length);
        this.first = false;
      }

      for (let i = 0; i < leftChannel.length; i++) {
        const sourceIndex = this.index + i
        leftChannel[i] = this.leftBuffer[sourceIndex] || 0;
        rightChannel[i] = this.rightBuffer[sourceIndex] || 0;
      }
      this.index += leftChannel.length;
    }

    return true;
  }
}

globalThis.registerProcessor('stream-audio-processor', StreamAudioProcessor);

declare var globalThis: {
  sampleRate: number
  currentTime: number
  currentFrame: number
  postMessage: (data: any) => void
  addEventListener: (type: string, listener: (ev: MessageEvent) => void) => void
  AudioWorkletProcessor: any
  registerProcessor: (name: string, processor: any) => void
}
