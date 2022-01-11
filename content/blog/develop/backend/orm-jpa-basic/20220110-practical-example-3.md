---
title: "JPA 실전 예제 3 - 다양한 연관관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-10
slug: "practical-example-3"
description: "다양한 연관관계 매핑"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 실전 예제 3 - 다양한 연관관계 매핑
------------------------

## 요구사항 분석
--------------------------

### 배송, 카테고리 추가 - 엔티티
-----------------------------
> - 주문과 뱌송은 1:1(@OneToOne)
> - 상품과 카테고리는 N:M(@ManyToMany)

![contact](/images/develop/backend/orm-jpa-basic/practical-example-3/img-001.png)

### 배송, 카테고리 추가 - ERD
-----------------------------


![contact](/images/develop/backend/orm-jpa-basic/practical-example-3/img-002.png)


> Delivery.java 와 Category.java를 생성합니다.

#### 일대일 양방향 관계 Order.java - Delivery.java
 

#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
