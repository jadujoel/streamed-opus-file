main()
async function main() {
  const context = new AudioContext();

  const decoder = new Worker(new URL('opus-stream-decoder.worker.js', import.meta.url).href, { type: 'module' })
  await context.audioWorklet.addModule(new URL('stream-audio-processor.js', import.meta.url).href);

  const node = new AudioWorkletNode(context, 'stream-audio-processor', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
  decoder.addEventListener('message', (ev: MessageEvent<{ left: Float32Array, right: Float32Array, index: number }>) => {
    node.port.postMessage(ev.data);
  });

  node.connect(context.destination);

  decoder.postMessage(JSON.stringify(({
    type: 'start',
    url: '/48kb.2ch.366384529314489.opus'
  })))
}
