export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // 현재 Node.js 버전을 타겟팅
        modules: 'auto', // 모듈 시스템 자동 결정
      },
    ],
    '@babel/preset-typescript', // TypeScript 지원
  ],
};