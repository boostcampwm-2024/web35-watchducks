# 여기는 🔃router 디렉토리입니다

라우팅 관련 컴포넌트를 모아놓은 디렉토리 입니다.

구현방법

```ts
export default createBrowserRouter([
	{
        path: '/',
        element: <MainPage />
    },
]);
```

- path는 라우팅 경로입니다.
- element는 해당 경로에 렌더링할 컴포넌트입니다.
