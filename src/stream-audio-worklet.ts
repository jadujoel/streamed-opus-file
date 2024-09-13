export class StreamAudioWorklet extends AudioWorkletNode {
  constructor(context: AudioContext) {
    super(context, 'stream-audio-processor', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2 })
  }
}
