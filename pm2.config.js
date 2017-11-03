module.exports = {
  apps: [{
    name: 'individual',
    script: './server/dist/app.js',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
