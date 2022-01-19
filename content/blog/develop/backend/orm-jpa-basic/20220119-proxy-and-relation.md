---
title: "JPA 프록시와 연관관계"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-19
slug: "proxy-and-relation"
description: "프록시와 연관간계"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 프록시와 상속관계
-------------

## 목차
-------------
> - 프록시
> - 즉시 로딩과 지연 로딩
> - 지연 로딩 활용
> - 영속성 전이 : CASCADE
> - 고아 객체
> - 영속성 전이 + 고아객체, 생명주기



### 프록시
-------------

#### Member를 조회할때 Team도 함께 조회해야 할까?

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-001.png)

#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
