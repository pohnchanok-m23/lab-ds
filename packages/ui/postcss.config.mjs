// Used by tsup (and Vitest) to compile *.module.css with Tailwind before
// esbuild hashes the class names.
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
