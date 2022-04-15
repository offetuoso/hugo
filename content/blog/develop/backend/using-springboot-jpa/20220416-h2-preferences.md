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

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/start-jpa/">JPA 시작</a> 과거 포스팅 참조

#### 데이터베이스 파일 생성 방법
> - <a href="http://localhost:8082">http://localhost:8082</a> 접속
> - jdbc:h2:~/jpashop 
>	(최초 1회, 세션키 유지한 상태로 실행)
> - ~/jpashop.mv.db 파일 생성 확인
>	(C:\Users\UserId\에 위치) 
> - 이후 부터는 jdbc:h2:tcp://localhost/~/jpashop 으로 접속



> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
