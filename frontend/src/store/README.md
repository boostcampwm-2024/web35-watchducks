# 여기는 🧳store 디렉토리입니다

스토어관련 코드를 모아놓은 디렉토리입니다.
Zustand라이브러리를 사용해 스토어를 구현합니다.

구현방법

```ts
const useNavbarStore = create<NavbarState>((set) => ({
  generation: GENERATION_VALUE.NINTH,
  setGeneration: (generation) => set({ generation })
}));
```

- 커스텀훅 규칙처럼 이름을 짓고, 마지막에 Store를 붙여줍니다.
