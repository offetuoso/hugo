---
title: "Vue.js WebPack 설정하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-11-12
slug: "vue-webpack"
description: "Vue.js WebPack 설정하기"	
keywords: ["Vue"]
draft: false
categories: ["VueJs"]
tags: ["Front","Vue","framework"]
math: false
toc: true
---

# Vue.js WebPack 설정하기

## Node.js 설치

> 1. <a href="https://nodejs.org/ko/download/">node 설치</a> 최신의 LTS 버전 설치
> 최신버전 보다 안정화가 되어 검증된 LTS 버전 설치 권장

![contact](/images/develop/frontend/vue/vue-webpack/node001.png)



## Vue 프로젝트에 WebPack 적용 순서

### 1. npm init 
> 1.1. webpack을 적용할 vue project의 경로에서 터미널을 열음. 

> 1.2. npm init 명령을 실행해서 node_modules을 설치하고, package.json 생성됨 <br>
> npm init을 실행하고 package 명을 입력하고 그 뒤로는 엔터, 엔터로 끝까지 진행 <br>
> 주의할점은 package name은 kebab-case로 작성 ex) word-relay, camelCase나 UpperCamelCase 시 오류 하단 참조 

![contact](/images/develop/frontend/vue/vue-webpack/webpack001.png)

> 생성된 package.json 설정

```
/* package.json */

{
  "name": "word-relay",		// <<-- 입력한 package 
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

> 해당 파일은 npm으로 필요한 패키지(디팬던시, 라이브러리 또는 플러그인)를 설치시 package.json에 자동으로 등록되며 이름과 패키지의 버전이 명시되어 빌드나 배포 시 사용된다.


### 2. 필요 패키지 설치

```
npm install vue -D 								//뷰 설치
npm i vue-loader -D								//뷰 로더 설치
npm i vue-template-compiler@{vue version ex-2.6.14} -D 	//뷰 템플릿 컴파일러 설치 
npm i vue-style-loader -D 							//뷰 스타일 로더 설치
npm i css-loader -D								//CSS 로더 설치

```

> 설치 이후 

```

/* package.json */

{
  "name": "word-relay",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"  // <<-- 직접 수정해주어야함, npm run build 시 webpack을 사용함
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "css-loader": "^6.5.1",
    "vue": "^2.6.14",
    "vue-loader": "^15.9.8",
    "vue-style-loader": "^4.1.3",
    "vue-template-compiler": "^2.6.14",
    "webpack": "^5.64.0",
    "webpack-cli": "^4.9.1"
    "style-loader": "^3.3.1"
  }
}

```


### 3. html 파일 생성 
> 프로젝트의 root 디렉토리에 html 파일 생성 ex) WordRelay.html


```
<!-- WordRelay.html -->

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>끝말잇기</title>
    </head>
    <body>
        <h2>끝말잇기</h2>
        <div id="root"></div>	// vue의 인스턴스를 연결할 root div 
        <script src="./dist/app2.js"></script> //webpack을 통해 생성될 통합 app.js의 경로 webpack 빌드후 추가 해도됨
    </body>
</html>

```

### 4. vue 파일 생성 
> 프로젝트의 root 디렉토리에 vue 파일 생성 ex) WordRelay.vue <br>

```
<!-- WordRelay.vue -->

<template>
    <div>
        <h3>제시어: {{ word }}</h3>
        <form @submit.prevent="onSubmitForm">
            <input ref="answer" minlength="2" maxlength="3" v-model="value" />
            <button type="submit">입력</button>
        </form>
        <div>{{ result }}</div>
        <br />
        <p>사용한 단어는 사용할 수 없습니다.</p>
    </div>
</template>
<script>
let arr = new Array();
let first_word = "공부";
arr.push(first_word);

export default {
    data() {
        return {
            word: first_word,
            value: "",
            result: "",
            history: arr,
        };
    },
    methods: {
        onSubmitForm() {
            if (
                this.word.charAt(this.word.length - 1) ===
                    this.value.charAt(0) &&
                !this.history.includes(this.value)
            ) {
                this.result = "";
                this.history.push(this.value);
                this.word = this.value;
                this.value = "";
            } else if (this.history.includes(this.value)) {
                this.result = "땡, 이전에 사용한 단어입니다.";
            } else {
                this.result = "땡";
            }
        },
    },
};
</script>
<style>
</style>

```





### 5. main.js 생성
> 프로젝트의 root 디렉토리에 vue 인스턴스를 생성할 js 파일 생성 ex) main.js <br>

```
import Vue from 'vue' 					//npm으로 설치후 node_modules에 설치된 vue를 임포트
import WordRelay from './WordRelay.vue';	// 프로젝트에 생성한 .vue 파일 이후 webpack.config.js 의 resolve, extensions 속성에 .vue 추가하면
									// extensions import WordRelay from './WordRelay'; 로 .vue 생략가능

new Vue(WordRelay).$mount('#root');  //Vue(.vue 파일 객체).$mount(.html root div id)
 
```

### 6. webpack.config.js 생성
> 프로젝트의 root 디렉토리에 webpack.config.js 생성


```
const { VueLoaderPlugin } = require('vue-loader'); // @@@ plugins에 추가해야됨 @@@
const path = require('path');

module.exports = { //웹패킹을 할때 모듈을 사용
    mode : 'development', 	// 프로젝트의 모드 설정 개발 'development', 운영 'production'
    devtool : 'eval',	// 하단 링크 참조
    resolve : {	// 모듈을 해석하는 방식을 설정
        extensions : ['.js','.vue','.html'],	//사용자가 import 할 때 확장자를 생략 할 수 있도록 함
    },
    entry : { //하나로 합쳐질 파일의 이름 스크립트 및 그외 파일들 rules로 js로 변환해서 통합 저장됨
		
        app2 : path.join(__dirname,'main.js') // [name] (합쳐질 파일의 이름) : main.js (vue의 인스턴스가 선언된 js) 의 위치 

    },
    module : { //모듈의 핵심 어떻게 합칠것인지 
        rules : [{	
            test : /\.vue$/, 	// 정규식으로 .vue 파일인 경우 캐치 
            loader :  'vue-loader',  // vue-loader로 변환하여 app.js에 적용
        }],
    },
    plugins : [
        new VueLoaderPlugin(),
    ],
    output : {	// 프로젝트 산출물 
        filename : '[name].js',//'app2.js',
        path : path.join(__dirname, 'dist'),
    }
};

```

<a href="https://webpack.kr/configuration/devtool/">devtool 옵션</a>


### 7. 빌드 및 webpack 실행

```
npm run build
```

#### 성공시 출력

```
PS C:\develop\Git\vue\example\3_끝말잇기> npm run build

> word-relay@1.0.0 build
> webpack

asset app2.js 246 KiB [compared for emit] (name: app2)
runtime modules 891 bytes 4 modules
cacheable modules 229 KiB
  modules by path ./*.vue 2.73 KiB
    ./WordRelay.vue 1.1 KiB [built] [code generated]
    ./WordRelay.vue?vue&type=template&id=39324767& 204 bytes [built] [code generated]
    ./WordRelay.vue?vue&type=script&lang=ts& 268 bytes [built] [code generated]
    ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./WordRelay.vue?vue&type=template&id=39324767& 1.05 KiB [built] [code generated]
    ./node_modules/vue-loader/lib/index.js??vue-loader-options!./WordRelay.vue?vue&type=script&lang=ts& 126 bytes [built] [code generated]
  modules by path ./node_modules/ 226 KiB
    ./node_modules/vue/dist/vue.runtime.esm.js 223 KiB [built] [code generated]
    ./node_modules/vue-loader/lib/runtime/componentNormalizer.js 2.71 KiB [built] [code generated]
  ./main.js 189 bytes [built] [code generated]
webpack 5.64.0 compiled successfully in 911 ms
```

## nom run build 시 나올 수 있는 오류 정리

### configuration.output.path: The provided value "./dist" is not an absolute path! , The output directory as **absolute path** (required).

````
Debugger attached.
[webpack-cli] Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.
 - configuration.output.path: The provided value "./dist" is not an absolute path!
   -> The output directory as **absolute path** (required).
 
````

> webpack.config.js의 path : './dist', << 이부분을 절대경로로

```

const path = require('path'); /// 추가

module.exports = { //웹패킹을 할때 모듈을 사용
	entry : {
		app : path.join(__dirname,'main.js') //하나로 합쳐질 파일의 이름 스크립트 및 그외 파일들 js로 변환해서 통합 저장됨

	},
	module : { //모듈의 핵심 어떻게 합칠것인지 
		rules : [{

		}],
	},
	plugins : [],
	output : {
		filename : '[name].js',//'app.js',
		path : path.join(__dirname, 'dist'), ///변경 
	}
};


```


### 오류 없이 빌드 되지만 실행시 html에 root가 그리드 되지 않는 경우

#### main.js에 뷰 인스턴스 생성시 파라미터로 .vue 파일 객체 안넘긴 경우

```
import Vue from 'vue'
import WordRelay from './WordRelay.vue';
new Vue().$mount('#root'); //<<< Vue(WordRelay).$mount('#root');

```

#### html에 webpack이 생성한 파일 ex) app2.js 추가 안한경우 

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>끝말잇기</title>
        <style ref="./dist/style.css"></style>
    </head>
    <body>
        <h2>끝말잇기</h2>
        <div id="root"></div>

        <!-- <script src="./dist/app.js"></script> -->
    </body>
</html>

```

### WARNING in configuration The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.

```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

> 이런 경고가 계속 뜰경우 webpack.config.js module.exports 에 mode : 'development' 추가


### You may need an additional loader to handle the result of these loaders.
> loader 모듈이 필요하다는 오류, 

```
Debugger attached.

> example@1.0.0 build
> webpack

Debugger attached.
assets by status 64.6 KiB [cached] 1 asset
orphan modules 227 KiB [orphan] 4 modules
runtime modules 221 bytes 1 module
modules with errors 228 KiB [errors]
  ./main.js + 4 modules 227 KiB [built] [code generated] [1 error]
  ./example.vue?vue&type=template&id=063a7d4c& 217 bytes [built] [code generated] [1 error]



ERROR in ./example.vue?vue&type=template&id=063a7d4c& 2:0
Module parse failed: Unexpected token (2:0)
File was processed with these loaders:
 * ./node_modules/vue-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
|
> <div>
|       <h1>{{result}}</h1>
|       <form v-on:submit="onSubmitForm">
 @ ./example.vue 1:0-86 10:2-8 11:2-17
 @ ./main.js 2:0-36

ERROR in ./example.vue
Module Error (from ./node_modules/vue-loader/lib/index.js):
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
Error: vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
    at Object.module.exports (C:\develop\Git\vue\example\0.WebPack\node_modules\vue-loader\lib\index.js:36:29)
 @ ./main.js 2:0-36
```

> 아래의 부분을 처리할 수 없으며, 로더가 필요하다는 뜻 

```
|
> <div>
|       <h1>{{result}}</h1>
|       <form v-on:submit="onSubmitForm">

```

> 로더를 import 했지만 오류가 나던 상황이여서 골치를 앓고 있었는데, 내가 발생했던 이유는 <br>
> webpack.config.js plugins에 VueLoaderPlugin()를 넣지 않아서 오류

```
//const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');

module.exports = { //웹패킹을 할때 모듈을 사용
    entry : {
        app : path.join(__dirname,'main.js') //하나로 합쳐질 파일의 이름 스크립트 및 그외 파일들 rules로 js로 변환해서 통합 저장됨

    },
    module : { //모듈의 핵심 어떻게 합칠것인지 
        rules : [{
            test : /\.vue$/,
            loader :  'vue-loader', 
        }],
    },
    plugins : [
        new VueLoaderPlugin() // <<--- 이것이 빠져있었음
    ], 
    output : {
        filename : '[name].js',//'app.js',
        path : path.join(__dirname, 'dist'),
    }
};

```
