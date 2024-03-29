---
title: "RESTFULL API (RESTful API)"
image: "bg-rest.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-29
slug: "restful-api"
description: "레스트풀 API"	
keywords: ["Restful"]
draft: false
categories: ["Backend"]
subcategories: ["RESTful"]
tags: ["REST","RESTful","Api"]
math: false
toc: true
---

# 레스트풀 API(Restful Api)

## REST (Representational state transfer) 

> REST(Representational State Transfer)는 월드 와이드 웹과 같은 분산 하이퍼미디어 시스템을 위한 소프트웨어 아키텍처의 한 형식이다.
> REST는 로이 필딩(Roy Fielding)의 2000년 박사학위 논문에서 소개
> 엄격한 의미로 REST는 네트워크 아키텍처 원리의 모음이다.
> 여기서 '네트워크 아키텍처 원리'란 자원을 정의하고 자원에 대한 주소를 지정하는 방법 전반을 일컫는다.
> 간단한 의미로는, 웹 상의 자료를 HTTP위에서 SOAP이나 쿠키를 통한 세션 트랙킹 같은 별도의 전송 계층 없이 전송하기 위한 아주 간단한 인터페이스를 말한다.

### REST 구성

> 1.자원(RESOURCE) - URI
> 2.행위(Verb) - HTTP METHOD
> 3.표현(Representations)

### REST의 목표
> REST의 목표는 성능, 확장 성, 단순성, 수정 가능성, 가시성, 이식성 및 안정성을 높이는 것. 
이는 REST 아키텍처에 적용되는 제약 조건을 통해 달성됩니다.

### REST 아키텍처 원칙(아키텍처 스타일, 아키텍처의 제약 조건)
> 해당 <mark>6가지 원칙을 모두 만족</mark>한다면, REST하다 이야기 할 수 있습니다.


> 1. 인터페이스 일관성 (using a uniform interface): URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일을 말합니다.

> 2. 무상태성(Stateless): 상태정보를 따로 저장하고 관리하지 않습니다. 세션 정보나 쿠키정보를 별도로 저장하고 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 됩니다. 때문에 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않음으로써 구현이 단순해집니다.
	
> 3. 캐시 가능(Cacheability): REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹표준을 그대로 사용하기 때문에, 웹에서 사용하는 기존 인프라를 그대로 활용이 가능합니다. 따라서 HTTP가 가진 캐싱 기능이 적용 가능합니다. 

> 4. 클라이언트/서버 구조 (client–server architecture): REST 서버는 API 제공, 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보)등을 직접 관리하는 구조로 각각의 역할이 확실히 구분되기 때문에 클라이언트와 서버에서 개발해야 할 내용이 명확해지고 서로간 의존성이 줄어들게 됩니다.

> 5. 계층화(Layered System): REST 서버는 다중 계층으로 구성될 수 있으며 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고 PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있게 합니다.

> 6. Code on demand (optional) - 클라이언트는 리소스에 대한 표현을 응답으로 받고 처리해야 하는데, 어떻게 처리해야 하는지에 대한 Code를 서버가 제공하는 것을 의미한다. Html에서의 javascript가 가장 대표적인 예이다. 하지만 서버에서 제공되는 코드를 실행해야 하기 때문에 보안 문제를 야기할 수 있습니다.
(이 제약조건은 필수는 아님.)


### REST가 필요한 이유 
> - 애플리케이션 분리 및 통합
> - 다양한 클라이언트의 등장
> - 최근의 서버 프로그램은 다양한 브라우저와 안드로이드폰, 아이폰과 같은 모바일 디바이스에서도 통신을 할 수 있어야 한다.
> - 이러한 멀티 플랫폼에 대한 지원을 위해 서비스 자원에 대한 아키텍처를 세우고 이용하는 방법을 모색한 결과, REST에 관심을 가지게 되었다.


## RESTful API ?
> RESTful은 위의 REST 아키텍처의 원칙을 모두 만족하는 것을 의미한다.
> RESTful API란 REST라는 아키텍처 스타일과 원칙을 모두 만족하는 모두 만족하는 API라는 뜻이다.

![contact](/images/develop/backend/restapi/rest-api-002.png)
 
### REST API 메소드

> HTTP Method는 크게 GET, POST, PUT, PATCH DELETE가 있으며, <br>
CRUD에 빗대면 GET은 조회, POST는 저장, PUT과 PATCH는 수정, DELETE는 삭제로 이해하면 된다.

#### POST와 PUT의 모호함 

> GET과 DELETE와 다르게 POST와 PUT은 큰 차이가 없어 보이지만 Idempotence(멱등성)이란 개념을 이해하면 도움이 됩니다.

> 멱등성이란 여러번 수행해도 결과가 같음을 의미합니다.

> POST를 제외한 나머지들은 Idempotence하다. 특정 데이터를 수정하는 PUT을 몇번이나 수정해도 같은 결과가 나오며, 한번 처리 한것과 10번 처리한 것이 같지만, 

> POST는 수행한 만큼 새로운 데이터가 Insert 됩니다.

> POST는 입력 받은 값을 새로운 Row로 인서트하는 행위이며, 

> PUT은 입력받은 모든 값들로 기존의 값을 대체 합니다. 

#### PUT과 PATCH
> PUT과 PATCH 모두 수정을 위한 메서드 입니다. 하지만 어떨때 PUT을 쓰고 어떠한 경우에 PATCH를 쓰는지 이름만으로 알수 없습니다. 

> 두 PUT과 PATCH의 차이를 확인해 보겠습니다.

> PUT method requests that the state of the target resource be created or replaced with the state defined by the representation enclosed in the request message payload


##### PUT

> PUT 메서드는 대상 리소스의 상태가 요청 메시지 페이로드에 포함된 표현에 의해 정의된 상태로 생성되거나 대체되도록 요청합니다.

> PUT은 파라미터로 일부만 보냈을 경우 나머지 값은 Defult 값으로 수정하는 게 원칙 이므로 

> request

````
PUT    /api/v2/members/110
{
"name": "홍길동"
}
````

> response

````
HTTP/1.1 200 OK
{
    "name": "홍길동",
    "age": null
}
````

> 전달할때 수정할 파라미터 및 나머지 모든 파라미터를 채워 보내줘야합니다.
 

##### PATCH
> 그러나 PATCH를 통하여 특정 수정할 파라미터만 보내면 새로 바뀐 데이터만 적용되고 기존의 값은 유지됩니다.

````
PUT    /api/v2/members/110
{
"name": "홍길동"
}
````

> response

````
HTTP/1.1 200 OK
{
    "name": "홍길동",
    "age": 28
}
````

> 전체적인 데이터를 수정할때는 PUT, 특정 값만 수정할 경우에는 PATCH를 사용하면 됩니다.


### REST API 디자인

> 1. URL을 심플하고 직관적으로 만들자
> - REST API를 URL만 보고도, 직관적으로 이해할 수 있어야 한다
> - URL을 길게 만드는것 보다, 최대 2 depth 정도로 간단하게 만드는 것이 이해하기 편하다.


> - BAD

``` 
http://restapi.example.com/customerUsers
http://restapi.example.com/sellerUsers
```

> - Good

``` 
http://restapi.example.com/users/customer
http://restapi.example.com/users/seller

```



> 2. 소문자를 사용한다.
> - 도메인 주소명은 대소문자를 구분하지 않는다. 
> - 디렉터리 명 이하의 주소는 서버의 운영체제에 따라 다르다. 
> - 대소문자를 혼용하여 사용하는 주소는 권장되지 않는다.

> - BAD

````
http://restapi.example.com/users/customer/

````

> - Good

``` 
http://restapi.example.com/users/customer/get-adress
```

> 3. 언더바를 대신 하이픈을 사용한다.
> 가급적 하이픈의 사용도 최소화하며, 정확한 의미나 표현을 위해 단어의 결합이 불가피한 경우에 사용한다.

> - Bad

```
http://restapi.example.com/users/customer/get_adress
```

> - Good

```
http://restapi.example.com/users/customer/get-adress
```
 

>  4.  마지막에 슬래시를 포함하지 않는다.
> - 슬래시는 계층을 구분하는 것으로, 마지막에는 사용하지 않는다.


> - Bad

```
http://restapi.example.com/users/customer/

```

> - Good

```
http://restapi.example.com/users/customer
```

> 5. 행위는 포함하지 않는다. 
> - 행위(동사)는 URL대신 Method를 사용하여 전달한다.(GET, POST, PUT, DELETE 등)

   Resource   | GET(read)     | POST(create) | PUT/PACTH(update)     | DELETE(delete)
--------------|---------------|--------------|-----------------|------
  /goods      | 상품목록        | 상품추가        | -              |   -          
  /goods/{id} | {id}값 상품상세  | -            | {id}값 상품 수정  | {id}값 상품 삭제 


> - Bad

```
POST :  http://restapi.example.com/users/customer/delete-post/1
```

> - Good

```
DELETE :  http://restapi.example.com/users/customer/post/1
```




> 6. 가급적 명사를 사용하되, 제어 자원을 의미하는 경우 예외적으로 동사를 허용한다.


> - Bad

```
POST :  http://restapi.example.com/users/customer/duplication
```

> - Good

```
POST :  http://restapi.example.com/users/customer/duplicate
```
 

> 7.파일 확장자는 URI에 포함시키지 않는다.
> - REST API에서는 메시지 바디 내용의 포맷을 나타내기 위한 파일 확장자를 URI 안에 포함시키지 않습니다. Accept header를 사용하도록 한다.

> - Bad

```
GET :  http://restapi.example.com/users/customer/profile.png
```

> - Good

```
GET http://restapi.example.com/users/customer/profile
HTTP/1.1 Host: restapi.example.com Accept: image/jpg

```
 

> 8.     오류 처리를 명확하게 해라.
> -  HTTP 상태코드를 정하고(많아도 안좋음), 다른 개발자들을 위한 오류 메시지 정의, 상세 정보 링크 등을 넣어주면 도움이 된다.


#### 참고
> - <a href="https://ko.wikipedia.org/wiki/REST">REST wiki</a>
