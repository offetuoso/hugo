---
title: "[자바 ORM 표준 JPA] 실전 예제 1 - 요구사항 분석과 기본 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-26
slug: "practical-example-1"
description: "요구사항 분석과 기본 매핑"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 실전 예제 1 - 요구사항 분석과 기본 매핑

## 요구사항 분석
-------------
> - 회원은 상품을 주문할 수 있다.
> - 주문 시 여러 종류의 상품을 선택할 수 있다.

### 기능 목록
-----------
> - 회원 기능
> 	-  회원등록
> 	-  회원조회

> - 상품 기능
> 	-  상품등록
> 	-  상품수정
> 	-  상품조회

> - 주문 기능
> 	-  상품주문
> 	-  주문내역조회
> 	-  주문취소

### 도메인 모델 분석
-----------
> - 회원과 주문의 관계 : 회원은 여러 번 주문할 수 있다. (1:n)

> - 주문과 상품의 관계 : 주문할 때 여러 상품을 선택할 수 있다. 반대로 같은 상픔도 여러번 주문될 수 있다. 주문상품 이라는 모델을 만들어서 다대다 관계를 일대다, 다대일 괸계로 풀어냄

![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-001.png)












#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
