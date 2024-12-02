export default {
    preset: 'ts-jest/presets/default-esm', // ES 모듈 지원을 위한 프리셋
    testEnvironment: 'node', // 테스트 환경 설정
    extensionsToTreatAsEsm: ['.ts'], // ESM으로 취급할 파일 확장자
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true, // ts-jest에서 ESM 사용 설정
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // 모듈 경로 매핑
        '^domain/(.*)$': '<rootDir>/src/domain/$1',
    },
    // 모듈 경로 해석을 위한 설정 추가
    moduleDirectories: ['node_modules', 'src'],
};
