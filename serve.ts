Bun.serve({
  async fetch(request) {
    if (request.method !== 'GET' || !request.url.startsWith('http://localhost:3000')) {
      return new Response(null, { status: 405 });
    }
    const url = new URL(request.url);
    const pathname = url.pathname;
    let path = pathname.endsWith('/') ? 'src/index.html' : `src${pathname}`;
    if (path.endsWith('.js')) {
      path = path.replace('.js', '.ts');
    }

    console.log('Serving', path);
    const file = Bun.file(path);
    if (await file.exists()) {
      if (path.endsWith('.ts')) {
        const buildResult = await Bun.build({
          entrypoints: [path],
          sourcemap: 'inline'
        })
        const js = await buildResult.outputs[0].text();
        return new Response(js, {
          headers: {
            'Content-Type': 'application/javascript'
          }
        });
      }
      return new Response(file);
    }
    return new Response(null, { status: 404 });
  }
})

console.log('Listening on http://localhost:3000')
