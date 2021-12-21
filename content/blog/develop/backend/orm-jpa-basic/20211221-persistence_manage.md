---
title: "[자바 ORM 표준 JPA] 영속성 관리"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-21
slug: "persistence-manage"
description: "JPA 내부 동작 방식"	
keywords: ["ORM"]
draft: true
categories: ["ORM"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# JPA 영속성 관리 - 내부 동작 방식

## 영속성 컨텍스트

### JPA에서 가장 중요한 2가지 
> - 객체와 관계형 데이터베이트 매핑하기 (Object Relational Mapping)
> - <mark>영속성 컨텍스트</mark>

### 엔티티 매니저 팩토리와 앤티티 매니저
> 요청이 오면 앤티티 매니저 팩토리를 통해 엔티티 매니저를 생성하고, 앤티티 매니저는 커넥션풀을 이용해 DB에 접근 합니다.

![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-001.png)


### 영속성 컨텍스트
> - JPA를 이해하는데 가장 중요한 용어
> - "엔티티를 영구 저장하는 환경"이라는 뜻
> - EntitiyManager.persist(entity); 
// persist 메소드는 DB에 저장하는게 아니라 entity를 영속성 컨텍스트에 저장한다는 것

### 엔티티 매니저? 영속성 컨텍스트?
> - 영속성 컨텍스트는 논리적인 개념
> - 눈에 보이지 않는다.
> - 엔티티 매니저를 통해서 영속성 컨텍스트에 접근

#### J2SE 환경
> 엔티티 매니저와 영속성 컨텍스트가 1:1
![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-002.png)

#### J2EE, 스프링 프레임워크 같은 컨테이너 환경
> 엔티티 매니저와 영속성 컨텍스트가 N:1
![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-003.png)


### 엔티티의 생명주기
> - 비영속 (new/transient)
> 영속성 컨텍스트와 전혀 관계가 없는 <mark>새로운</mark> 상태

> - 영속 (managed)
> 영속성 컨텍스트에 <mark>관리</mark>되는 상태


> - 준영속 (datached)
> 영속성 컨텍스트에 저장되었다가 <mark>분리</mark>된상태


> - 삭제 (removed)
> <mark>삭제</mark>된 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-004.png)

#### 비영속 (new/transient)
> 객체만 생성하고 세팅한 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-005.png)

```
// 객체를 생성한 상태(비영속)
Member member = new Mamber();
member.setId(2L);
member.setName("회원2")
```

#### 영속 (managed)
> 객체만 생성하고 세팅한 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-006.png)

```
// 객체를 생성한 상태(비영속)
Member member = new Mamber();
member.setId(2L);
member.setName("회원2")

EntitiyManager em = emf.createEntityManager();
em.getTransaction().begin();

// 객체를 저장한 상태(영속)
em.persist(member);
```







### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
