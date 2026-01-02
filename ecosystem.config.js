module.exports = {
  apps: [{
    name: "portfolio",
    script: "./server/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 80
    }
  }]
}