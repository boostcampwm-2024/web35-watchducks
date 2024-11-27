# 여기는 🧩component 디렉토리입니다

공통으로 사용되는 컴포넌트들을 모아놓은 디렉토리 입니다.

구현방법

```tsx

type Props = {
	...
}

export default function Components({props}:Props) { //기명함수 선언식으로 린팅되어있습니다.
	return (<div>...</div>)
}
```

- 아토믹디자인에 따라 컴포넌트를 구분합니다

  - atom, molecule, organism, page 단위로 나뉩니다.
  - 반드시 이전 단위뿐만 아니라 하위 단위도 포함하여 만들어도 됩니다 (ex. atom + molcule = organism)
  - atom: 최소단위의 컴포넌트
  - molecule: atom을 조합한 컴포넌트
  - organism: molecule을 조합한 컴포넌트
  - page: template, organism을 조합한 컴포넌트

- 컴포넌트는 함수형 컴포넌트로 작성합니다
- 컴포넌트 이름은 카멜케이스로 작성합니다
- 컴포넌트 이름으로 디렉토리를 짓습니다
- 컴포넌트의 props는 type으로 정의합니다
- 컴포넌트의 props는 구조분해할당으로 받습니다
- 컴포넌트의 props는 필수값은 defaultProps로 정의합니다
