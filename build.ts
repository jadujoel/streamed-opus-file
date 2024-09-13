const scripts = await Array.fromAsync(new Bun.Glob('src/**/*{.ts,.js}').scan());
await Bun.build({
  entrypoints: scripts,
  sourcemap: 'inline',
  minify: true
})

const staticGlob = Array.fromAsync(new Bun.Glob('src/**/*{.html,.css,.wasm,.opus}').scan())
for (const file of await staticGlob) {
  await Bun.write(Bun.file(file), file.replace('src/', 'dist/'))
}
