const scripts = await Array.fromAsync(new Bun.Glob('src/**/*{.ts,.js}').scan());
await Bun.build({
  entrypoints: scripts,
  sourcemap: 'inline',
  minify: true,
  outdir: 'dist'
})

const statics = await Array.fromAsync(new Bun.Glob('src/**/*{.html,.css,.wasm,.opus}').scan())
for (const file of statics) {
  await Bun.write(file.replace('src/', 'dist/'), Bun.file(file))
}

console.log({ scripts, statics})
