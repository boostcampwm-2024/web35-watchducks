# 여기는 ⚒️hook 디렉토리입니다

리액트 커스텀 훅들을 모아놓은 디렉토리 입니다.

구현방법

```ts
export default function useFetch<T>(fetchFunction: () => Promise<T>): FetchState<T> {}
```

- export하는 function이름으로 파일이름을 짓습니다.
- 리액트 커스텀훅 규칙에 따라 use + 카멜케이스를 사용합니다.
