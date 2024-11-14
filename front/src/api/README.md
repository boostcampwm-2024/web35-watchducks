# 여기는 🖥️api 디렉토리입니다

백엔드와 통신하는 api함수들을 모아놓은 디렉토리 입니다.

구현방법

```ts
const postFunctionName = async (): => {
	const response = await axios.post('/api/register', data);
	return response.data;
};
```

- 카멜케이스를 사용합니다.
- http메소드명을 함수이름앞에 작성합니다.
