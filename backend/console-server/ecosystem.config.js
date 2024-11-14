module.exports = {
  apps: [
    {
      name: 'console-server',
      script: 'dist/main.js', // 빌드된 애플리케이션 진입점
      instances: 'max', // CPU 코어 수에 따라 인스턴스 수 자동 조절
      exec_mode: 'cluster',
    },
  ],
};