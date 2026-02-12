// // #region agent log
// fetch("http://127.0.0.1:7242/ingest/3b65d82b-08eb-4b7c-a5c6-3ee1c1a92bf7", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     location: "postcss.config.js:1",
//     message: "PostCSS config loaded",
//     data: {},
//     timestamp: Date.now(),
//     runId: "post-fix",
//     hypothesisId: "H1",
//   }),
// }).catch(() => {});
// // #endregion

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};