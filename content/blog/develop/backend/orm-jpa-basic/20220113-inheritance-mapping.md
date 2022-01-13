---
title: "JPA 상속관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-13
slug: "inheritance-mapping"
description: "상속관계 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 상속관계 매핑
-------------

## 목차
-------------
> - 상속관계 매핑
> - @MappedSuperclass

### 상속관계 매핑
-------------
> - 객체는 상속관계가 있지만, 관계형 데이터베이스에는 상속 관계 없음
> - 슈퍼타입 서브타입 관계라는 모델링 기법이 객체 상속과 유사
> - 상속관계 매핑 : 객체의 상속과 구조와 DB의 슈퍼타입 관계를 매핑

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-001.png)



#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
