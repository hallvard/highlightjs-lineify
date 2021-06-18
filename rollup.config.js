export default {
  input: 'src/LineifyPlugin.js',
  plugins: [],
  external: [],
  output: [
    {
      file: 'dist/highlightjs-lineify.min.js',
      format: 'iife',
      name: "LineifyPlugin",
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
