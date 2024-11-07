# 여기는 🌫️boundary 디렉토리입니다

에러처리를 위한 컴포넌트들을 모아놓은 디렉토리입니다.

사용방법

```tsx
import CustomErrorBoundary from 'boundary/CustomErrorBoundary';

<CustomErrorBoundary>
  <App />
</CustomErrorBoundary>;
```

- UI관련 Suspense 처리를 하고싶을 때, CustomErrorBoundary컴포넌트로 감싸주면 됩니다.
