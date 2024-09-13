import wasmDecoder from './opus-stream-decoder.mjs';
const { OpusStreamDecoder } = wasmDecoder();

export interface StartMessage {
  readonly type: 'start'
  readonly url: string
}

export type ParsedPostMessage = StartMessage

interface OndecodeProps {
  left: Float32Array,
  right: Float32Array,
  samplesDecoded: number,
  sampleRate: number
}

self.addEventListener('message', (ev: MessageEvent<string>) => {
  const parsed: ParsedPostMessage = JSON.parse(ev.data)
  console.log("worker recieved", parsed)
  if (parsed.type === 'start') {
    start(parsed.url)
    return
  }
})

async function start(
  url: string,
) {
  console.log('start', url)
  let totalSamplesDecoded = 0;
  /**
   * @param {{left: Float32Array, right: Float32Array, samplesDecoded: number, sampleRate: number}} obj
   */
  const onDecode = ({left, right, samplesDecoded}: OndecodeProps) => {
    self.postMessage({
      left: left.buffer,   // Use buffer for transferable object
      right: right.buffer, // Use buffer for transferable object
      index: totalSamplesDecoded
    }, [left.buffer as ArrayBuffer, right.buffer as ArrayBuffer]); // Transfer the buffers for efficiency
    totalSamplesDecoded += samplesDecoded
  }
  const decoder = new OpusStreamDecoder({ onDecode })
  const file = url ?? '/48kb.2ch.366384529314489.opus';
  const response = await fetch(file)
  if (!response.body) {
    console.error('Response body is null');
    return;
  }
  const reader = response.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        console.log('stream', value?.length)
        if (done) {
          controller.close();
          return;
        }
        await decoder.ready
        decoder.decode(value)
        controller.enqueue(value);
      }
    }
  });
  const streamResponse = new Response(stream);
  await streamResponse.blob();
}
