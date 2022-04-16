---
title: "[스프링부트 JPA 활용] H2 데이터베이스 설치 및 세팅"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-13
slug: "h2-preferences"
description: "[스프링부트 JPA 활용] H2 데이터베이스 설치 및 세팅"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---


# H2 데이터베이스 설치 및 세팅
-------------------------------

## H2 데이터베이스
-------------------------------
> 개발이나 테스트 용도로 가볍고 편리한 DB, 웹 화면 제공

### 다운로드 및 설치
> <a href="http://h2database.com">

![contact](/images/develop/backend/using-springboot-jpa/h2-preferences/img-001.png)

> 사용 환경에 따라 받으시면 되며, 저는 1.4.200 버전을 받아 설치 하였습니다.

### H2 Database 설치
-------------

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/start-jpa/">JPA 시작</a> 과거 포스팅 참조

<details title="펼치기/숨기기">
 	<summary> H2 Database 설치 </summary>

> <a href="https://www.h2database.com/html/main.html">H2 홈페이지</a>에서 OS에 맞는 설치 파일을 다운로드한다.

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-001.png)


> C:\Program Files (x86)\H2\bin\h2.bat 실행


![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-002.png)

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-003.png)

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-004.png)

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-005.png)

> jdbc:h2:~/jpashop (최초 1회, 세션키 유지한 상태로 실행)

> 이후 부터는 jdbc:h2:tcp://localhost/~/jpashop 으로 접속

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-006.png)

> http://localhost:8082/login.jsp 에서 연결버튼 클릭

![contact](/images/develop/backend/orm-jpa-basic/start-jpa/img-007.png)

</details> 

#### 데이터베이스 파일 생성 방법
> - <a href="http://localhost:8082">http://localhost:8082</a> 접속
> - jdbc:h2:~/jpashop 
>	(최초 1회, 세션키 유지한 상태로 실행)
> - ~/jpashop.mv.db 파일 생성 확인
>	(C:\Users\UserId\에 위치) 
> - 이후 부터는 jdbc:h2:tcp://localhost/~/jpashop 으로 접속


## JPA와 DB 설정, 동작확인
-------------------------------

### JPA 설정
-------------------------------
> 여태까지 application.properties 를 이용해왔는데, 간혹 yml을 사용하는 것을 봐왔는데 이번에 사용하게 되었습니다.

> resources/application.properties를 확장자를 변경하여 백업(또는 제거) 하고 같은 resources/ 위치에 application.yml 생성

![contact](/images/develop/backend/using-springboot-jpa/h2-preferences/img-002.png)

> resources/application.yml

```
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/jpashop;MVCC=true #MVCC=true 권장이지만 버전별 애플리케이션 동작x 이슈 있음
    username: sa
    password:
    driver-class-name: org.h2.Driver

  jpa:
    hibernate:
      ddl-auto: create # 애플리케이션 동작 시점에 엔티티 재생성
    properties:
#      show_sql: true #sysout을 통해 남기는 sql
      format_sql: true

  devtools:
    livereload:
      enabled: true # livereload 사용시 활성화
    restart:
      enabled: false #운영 에서는 제거.

  thymeleaf:
    cache: false


logging:
  level:
    org.hibernate.SQL: debug
```

> 이렇게만 세팅하여도 SpringBoot에서 커넥션풀(HikariCP) 설정을 해줍니다.

> 이러한 설정에 대한 메뉴얼은 스프링부트의 LEARN의 버전별 Reference Doc.에 있습니다. 

<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/">
https://docs.spring.io/spring-boot/docs/current/reference/html/
</a>

![contact](/images/develop/backend/using-springboot-jpa/h2-preferences/img-003.png)

![contact](/images/develop/backend/using-springboot-jpa/h2-preferences/img-004.png)



<details title="펼치기/숨기기">
 	<summary> MVCC=true 옵션 설명 </summary>

#### MVCC=true
> - 다중 버전 동시성 제어 (Multi-Version Concurrency Control)
> - 동시성을 제어하기 위해 사용하는 매커니즘 중 하나

> 동시성이란 데이터베이스에 동시 접근하는 것을 의미 

> 일관성과 동시성은 반비례관계 동시성↑일관성↓ / 동시성↓일관성↑

> 동시에 DB에 접근하는 사람이 많으면 데이터가 일관적이지 않을 수 있기 때문에 동시성을 낮출수 밖에 없다.

> '동시성 제어'란 동시에 실행되는 트랜잭션을 최소화하며, 일관성을 최대화 하여 데이터 무결성 유지 되도록 하는것이 목표

> 읽기와 쓰기가 서로의 작업을 방해해 동시성 저하와 리소스 Lock을 사용함에도 데이터 일관성이 훼손될 수 있는 문제를 해결하기 위해 MVCC 매커니즘을 사용

#### MVCC 매커니즘 

> - 데이터를 변경 할 때 변경사항을 Undo 영역에 저장.
> - 데이터를 읽다가 트랜잭션 시작한 시점 이후 변경된 값을 발견하면 Undo 영역에 저장된 정보를 이용해 버전을 생성하고 그것을 읽는다.
 

#### 장점
> - Lock을 기다릴 필요가 없어 일반적인 RDBMS보다 빠르다.
> - 데이터를 읽을 때 다른 사용자의 CRUD에 영향을 받지 않는다. 

#### 단점
> - 데이터의 버전 충돌이 있을 수 있다. 
>	- 애플리케이션 영역에서 문제를 해결해야함.
> - 사용하지 않는 버전들에 대한 정리가 필요하다.


</details>





#### 참고
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
