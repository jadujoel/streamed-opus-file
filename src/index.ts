document.querySelector('button')?.addEventListener('click', main);
async function main() {
  const decoderUrl = new URL('opus-stream-decoder.worker.js', import.meta.url).href;
  const processorUrl = new URL('stream-audio-processor.js', import.meta.url).href;
  const opusUrl = new URL('48kb.2ch.366384529314489.opus', import.meta.url).href;

  const context = new AudioContext();

  const decoder = new Worker(decoderUrl, { type: 'module' });
  await context.audioWorklet.addModule(processorUrl);

  const node = new AudioWorkletNode(context, 'stream-audio-processor', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
  decoder.addEventListener('message', (ev: MessageEvent<{ left: ArrayBuffer, right: ArrayBuffer, index: number }>) => {
    node.port.postMessage({
      left: ev.data.left,
      right: ev.data.right,
      index: ev.data.index
    }, [ev.data.left, ev.data.right])
  });

  node.connect(context.destination);
  decoder.postMessage(JSON.stringify(({
    type: 'start',
    url: opusUrl
  })))
}
