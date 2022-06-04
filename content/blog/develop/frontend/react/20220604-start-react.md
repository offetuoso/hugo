---
title: "React 시작하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-06-04
slug: "start-react"
description: "react 시작하기"	
keywords: ["React"]
draft: true
categories: ["frontend"]
subcategories: ["React"]
tags: ["Front","React","framework"]
math: false
toc: true
---

# React
-----------------------------------------

## 목차
-----------------------------------------
> 1. 구구단
>	1-1. 리액트를 왜 쓰는가
>	1-2. 첫 리액트 컴포넌트
>	1-3. HTML 속성과 상태(state)
>	1-4. JSX와 바벨(babel)
>	1-5. 첫 번째 Q&A
>	1-6. 구구단 리액트로 만들기
>	1-7. 클래스 메서드
>	1-8. Fragment와 기타 팁들
>	1-9. 함수형 setState
>	1-10. ref
> 2. 끝말잇기
>	2-1. React Hooks 사용하기
>	2-2. Class와 Hooks 비교하기
>	2-3. 웹팩 설치하기
>	2-4. 모듈 시스템과 웹팩 설정
>	2-5. 웹팩으로 빌드하기
>	2-6. 구구단 웹팩으로 빌드하기
>	2-7. @babel/preset-env와 plugins
>	2-8. 끝말잇기 Class 만들기
>	2-9. 웹팩 데브 서버와 핫 리로딩
>	2-10. 끝말잇기 Hooks로 전환하기
> 3. 숫자야구
>	3-1. import와 require 비교
>	3-2. 리액트 반복문(map)
>	3-3. 리액트 반복문(key)
>	3-4. 컴포넌트 분리와 props
>	3-5. 주석과 메서드 바인딩
>	3-6. 숫자야구 만들기
>	3-7. Q&A
>	3-8. 숫자야구 Hooks로 전환하기
>	3-9. React Devtools
>	3-10. shouldComponentUpdate
>	3-11. PureComponent와 React.memo
>	3-12. React.createRef
>	3-13. props와 state 연결하기
> 4. 반응속도체크
> 5. 가위바위보
> 6. 로또 추첨기
> 7. 틱택토
> 8. 지뢰찾기
> 9. React-router

## 1. 구구단
---------------------

### 1-1. 리액트를 왜 쓰는가
---------------------------
> - 사용자 UX/UI (사용자 사용성 향상)
> - 싱글 페이지 애플리케이션 (페이지 이동으로 인한 리로딩 ↓)
> - 데이터와 화면과의 동기화 
> - 재활용 가능한 컴포넌트

#### InteliJ에서 리액트 프로젝트 생성 해보기

> 새 프로젝트 > JavaScript > React

![contact](/images/develop/frontend/react/start-react/img-001.png)


![contact](/images/develop/frontend/react/start-react/img-002.png)
> 프로젝트를 생성합니다. 

![contact](/images/develop/frontend/react/start-react/img-003.png)
> 생성된 프로젝트 입니다.

![contact](/images/develop/frontend/react/start-react/img-004.png)
> npm이 설치 되어있기 때문에 자동으로 react를 설치 하는 것으 확인 할 수 있습니다.

![contact](/images/develop/frontend/react/start-react/img-005.png)
> Alt + Shift + X 또는 상단 우측에 실행 버튼을 눌러 실행해 봅니다. 

![contact](/images/develop/frontend/react/start-react/img-006.png)
> http://localhost:3000/로 실행된 React 앱 화면입니다.


### 1-2. 첫 리액트 컴포넌트
----------------------------
> 리액트는 기본적으로 자바스크립트 언어로 되어있어 .js 파일을 생성합니다. <br>
그리고 웹이기 때문에, html 파일을 사용합니다. 






#### 참고 
> - <a href="https://www.inflearn.com/course/web-game-react">웹 게임을 만들며 배우는 React - 조현영</a>

