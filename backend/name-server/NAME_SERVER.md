## Express, Fastify 뭘 할까?

어떤 것을 선택해야하나?

### Express
- 간단하다, 가볍다
- 학습곡선 낮음
- 함수 기반
- 미들웨어 기반

### Fastify
- 빠르다
- 학습곡선 가파름
- 함수 기반
- Plugin 기반

네임 서버는 딱히 성능이 크게 뛰어나지 않아도 되고
학습 곡선이 낮은 Express가 적절하지 않나?

# 환경 설정

## 프레임워크

- Express : 

## 타입 스크립트 실행 도구

#### tsx (선택)
TypeScript/ESM 전용 프로젝트
- 빠른 개발 반복이 필요한 경우
- 간단한 설정을 선호하는 경우

#### nodemon
다양한 파일 형식 지원 필요
- 복잡한 재시작 규칙 필요
- 레거시 프로젝트
- 특별한 실행 스크립트 필요


## Lint


### Rules
```typescript
rules: {
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  '@typescript-eslint/no-non-null-assertion': 'error',
}
```

### 1. @typescript-eslint/no-empty-interface
빈 인터페이스 선언을 금지합니다.

```typescript
// ❌ 잘못된 예
interface Foo {}

// ✅ 좋은 예
interface Foo {
  name: string;
}

// ✅ 확장 목적의 빈 인터페이스는 허용
interface Foo extends Bar {}
```

### 2. @typescript-eslint/no-explicit-any
`any` 타입의 사용을 금지합니다.

```typescript
// ❌ 잘못된 예
function foo(bar: any) {}
const foo: any[] = [];

// ✅ 좋은 예
function foo(bar: unknown) {}
const foo: string[] = [];
```

### 3. @typescript-eslint/explicit-function-return-type
함수의 반환 타입을 명시적으로 지정하도록 강제합니다.

```typescript
// ❌ 잘못된 예
function foo() {
  return 'hello';
}

// ✅ 좋은 예
function foo(): string {
  return 'hello';
}
```

### 4. @typescript-eslint/explicit-module-boundary-types
모듈의 공개 API(exported functions/classes)에 명시적인 타입을 지정하도록 강제합니다.

```typescript
// ❌ 잘못된 예
export function foo(bar) {
  return bar;
}

// ✅ 좋은 예
export function foo(bar: string): string {
  return bar;
}
```

### 5. @typescript-eslint/no-unused-vars
사용되지 않는 변수를 금지하되, 특정 패턴의 변수는 허용합니다.

설정:
- `argsIgnorePattern: '^_'` - _ 로 시작하는 매개변수 무시
- `varsIgnorePattern: '^_'` - _ 로 시작하는 변수 무시
- `caughtErrorsIgnorePattern: '^_'` - _ 로 시작하는 catch 문의 에러 변수 무시

```typescript
// ❌ 잘못된 예
const unused = 'never used';      // 에러: 사용되지 않는 변수
function foo(unused) {}           // 에러: 사용되지 않는 매개변수

// ✅ 좋은 예
const _unused = 'ignored';        // 허용: _ 로 시작
function foo(_unused) {}          // 허용: _ 로 시작
try {
  // ...
} catch (_error) {}              // 허용: _ 로 시작
```

### 6. @typescript-eslint/consistent-type-imports
type import를 사용하도록 강제합니다.

```typescript
// ❌ 잘못된 예
import { User } from './types';

// ✅ 좋은 예
import type { User } from './types';
```

### 7. @typescript-eslint/no-non-null-assertion
Non-null assertion operator(!)의 사용을 금지합니다.

```typescript
// ❌ 잘못된 예
function foo(bar: string | null) {
  console.log(bar!.length);  // ! 연산자 사용
}

// ✅ 좋은 예
function foo(bar: string | null) {
  if (bar) {
    console.log(bar.length);  // 명시적인 null 체크
  }
}
```
