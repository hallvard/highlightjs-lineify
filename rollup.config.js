export default {
  input: 'src/LineifyPlugin.js',
  plugins: [],
  external: [],
  output: [
    {
      file: 'dist/highlightjs-lineify.min.js',
      format: 'iife',
      name: "hljsLineifyPlugin",
      interop: "default",
      globals: {
      },
    },
    {
      file: 'dist/highlightjs-lineify.esm.min.js',
      format: 'es',
      interop: "default",
      exports: 'default',
    },
  ],
};