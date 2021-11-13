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
draft: true
categories: ["VueJs"]
tags: ["Front","Vue","framework"]
math: false
toc: true
---

# Vue.js WebPack 설정하기

## Vue 설치

> 1. <a href="https://nodejs.org/ko/download/">node 설치</a> 최신의 LTS 버전 설치
> 최신버전 보다 안정화가 되어 검증된 LTS 버전 설치 권장

![contact](/images/develop/frontend/vue/vue-webpack/node001.png)


> 2. CMD 또는 powershell, VS_CODE의 프로젝트의 경로에서 터미널 열기

> 3. npm init
> 프로젝트 명 추가후 모두 엔터
> package.json이 생성된다.

![contact](/images/develop/frontend/vue/vue-webpack/webpack001.png)


```
npm init
```

> npm init 시 package 명 입력시 camel case 사용시 오류

```
package name: (3_끝말잇기) WordRelay
Sorry, name can no longer contain capital letters.
```

> 대문자 포함시 오류

```
package name: (3_끝말잇기) wordRelay
Sorry, name can no longer contain capital letters.
```

> why 
언젠가는 폴더나 파일이 자체 패키지로 추출될 수 있다고 상상해야 합니다. 패키지는 대문자를 포함할 수 없습니다.
새 패키지는 이름에 대문자가 없어야 합니다. https://docs.npmjs.com/files/package.json#이름
따라서 camelCase절대 사용해서는 안됩니다. 이 잎 snake_case과 kebab-case.
kebab-case오늘날 가장 일반적인 협약입니다. 밑줄의 유일한 사용은 내부 노드 패키지용이며 이는 단순히 초기부터의 관례입니다.

<a href="https://stackoverflow.com/questions/18927298/node-js-project-naming-conventions-for-files-folders">StackOverFlow</a>



> package.json

```
{
  "name": "example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "vue": "^2.6.14"
  },
  "devDependencies": {
    "webpack": "^5.64.0",
    "webpack-cli": "^4.9.1"
  }
}
```

> 4. vue 설치

```
npm install vue #npm i vue  # install i로 생략가능
```

> 5. webpack, webpack-cli 설치

```
npm i webpack webpack-cli
```

> 6. 프로젝트 경로에 webpack.config.js 생성

```
const path = require('path');

module.exports = { 
    resolve : {
    },
    entry : {
    },
    module : { 
    },
    plugins : [
    ],
    output : {
        filename : 'app.js',
        path : path.join(__dirname, 'dist'),
    }
};

```


> 7. 기타 설정
							> 7.1. main.js 작성

							```
							import Vue from 'vue'
							import WordRelay from './WordRelay';
							new Vue(WordRelay).$mount('#root');
							
							```
							
							> 7.2. webpack.config.js에  vue-loader 설정 
							
							```
							const VueLoaderPlugin = require('vue-loader');
							const path = require('path');
							
							module.exports = { 
							    resolve : {
									extension : ['.js','.vue']
							    },
							    entry : {
									app : path.join(__dirname,'main.js')
							    },
							    module : { 
									rules = [{
										test : /\.vue$/,
										loader : 'vue-loader'
									}]
							    },
							    plugins : [
									new VueLoaderPlugin(),
							    ],
							    output : {
							        filename : 'app.js',
							        path : path.join(__dirname, 'dist'),
							    }
							};
							
							```


> 8. webpack 실행

```
npm run build
```


> npm run build 실행, 첫번째 에러 

```

rules = [{

SyntaxError: Invalid shorthand property initializer
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1031:15)
    at Module._compile (node:internal/modules/cjs/loader:1065:27)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at WebpackCLI.tryRequireThenImport (C:\develop\Git\vue\example\3_끝말잇기\node_modules\webpack-cli\lib\webpack-cli.js:244:16)     
    at loadConfigByPath (C:\develop\Git\vue\example\3_끝말잇기\node_modules\webpack-cli\lib\webpack-cli.js:1710:30)
``` 




> npm run build 실행, 첫번째 에러 

```
Debugger attached.
[webpack-cli] Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.
 - configuration.output.path: The provided value "./dist" is not an absolute path!
   -> The output directory as **absolute path** (required).
```

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

> npm run build 실행, 2번째 오류 

```
PS C:\develop\Git\vue\example\0.WebPack> npm run build
Debugger attached.

> example@1.0.0 build
> webpack

Debugger attached.
asset app.js 63.7 KiB [emitted] [minimized] (name: app) 1 related asset
orphan modules 223 KiB [orphan] 1 module
runtime modules 221 bytes 1 module
./main.js + 1 modules 224 KiB [built] [code generated]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

webpack 5.64.0 compiled with 1 warning in 2554 ms
Waiting for the debugger to disconnect...
Waiting for the debugger to disconnect...
PS C:\develop\Git\vue\example\0.WebPack> 
```

> npm run build 실행, main.js 에 생성한 뷰 임포트하기 

```

import Vue from 'vue'
import example from './example.vue';
new Vue().$mount('#root');


```

> webpack.config.js에 rules 추가


> webpack.config.js

```
const path = require('path');

module.exports = { //웹패킹을 할때 모듈을 사용
    entry : {
        app : path.join(__dirname,'main.js') //하나로 합쳐질 파일의 이름 스크립트 및 그외 파일들 rules로 js로 변환해서 통합 저장됨

    },
    module : { //모듈의 핵심 어떻게 합칠것인지 
        rules : [{
            test : /\.vue$/,
            use :  'vue-loader', //loader:
        }],
    },
    plugins : [],
    output : {
        filename : '[name].js',//'app.js',
        path : path.join(__dirname, 'dist'),
    }
};

```

> 뷰로더 설치 npm i vue-loader -D

```
npm i vue-loader -D
```

> npm run build 실행, main.js 에 생성한 뷰 임포트하기 

```

Debugger attached.

> example@1.0.0 build
> webpack

Debugger attached.
assets by status 64.2 KiB [cached] 1 asset
orphan modules 223 KiB [orphan] 1 module
runtime modules 221 bytes 1 module
cacheable modules 224 KiB
  ./main.js + 1 modules 224 KiB [built] [code generated]
  ./example.vue 39 bytes [built] [code generated] [3 errors]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.

ERROR in ./example.vue
Module Error (from ./node_modules/vue-loader/lib/index.js):
[vue-loader] vue-template-compiler must be installed as a peer dependency, or a compatible compiler implementation must be passed via options.      
 @ ./main.js 2:0-36

ERROR in ./example.vue
Module Error (from ./node_modules/vue-loader/lib/index.js):
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.

ERROR in ./example.vue
Module build failed (from ./node_modules/vue-loader/lib/index.js):
TypeError: Cannot read properties of undefined (reading 'parseComponent')
    at parse (C:\develop\Git\vue\example\0.WebPack\node_modules\@vue\component-compiler-utils\dist\parse.js:15:23)
    at Object.module.exports (C:\develop\Git\vue\example\0.WebPack\node_modules\vue-loader\lib\index.js:67:22)
 @ ./main.js 2:0-36

2 errors have detailed information that is not shown.
```


> 뷰템플릿 컴파일러 설치 
> 뷰템플릿 컴파일러는 vue 버전과 동일하게 설치

```
npm i vue-template-compiler@2.6.14 -D
```



> npm run build 실행

```

Debugger attached.
assets by status 64.6 KiB [cached] 1 asset
orphan modules 227 KiB [orphan] 4 modules
runtime modules 221 bytes 1 module
modules with errors 228 KiB [errors]
  ./main.js + 4 modules 227 KiB [built] [code generated] [1 error]
  ./example.vue?vue&type=template&id=063a7d4c& 217 bytes [built] [code generated] [1 error]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

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

> style로더, css로더 설치

```
npm i vue-style-loader -D

npm i css-loader -D 

```


> npm run build 실행

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

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

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
        new VueLoaderPlugin()
    ],
    output : {
        filename : '[name].js',//'app.js',
        path : path.join(__dirname, 'dist'),
    }
};

```




```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```


>  모드 추가 
> mode : 'development', //production


```

//const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');

module.exports = { //웹패킹을 할때 모듈을 사용
    mode : 'development', //production
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
        new VueLoaderPlugin()
    ],
    output : {
        filename : '[name].js',//'app.js',
        path : path.join(__dirname, 'dist'),
    }
};

```