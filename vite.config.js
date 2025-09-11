export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.clickup.com/api/v2/task/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
