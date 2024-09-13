main()
async function main() {
  const decoder = new Worker(new URL('opus-stream-decoder.worker.ts', import.meta.url).href, { type: 'module' })
  const context = new AudioContext();
  await context.audioWorklet.addModule('stream-audio-processor.ts');
  const node = new AudioWorkletNode(context, 'stream-audio-processor', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
  node.connect(context.destination);

  decoder.addEventListener('message', (ev: MessageEvent<{ left: Float32Array, right: Float32Array, index: number }>) => {
    node.port.postMessage(ev.data);
  });

  node.connect(context.destination);

  decoder.postMessage(JSON.stringify(({
    type: 'start',
    url: '/48kb.2ch.366384529314489.opus'
  })))
}
