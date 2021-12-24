---
title: "[자바 ORM 표준 JPA] 객체와 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-24
slug: "entity-mapping"
description: "객체와 매핑"	
keywords: ["ORM"]
draft: ture
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 객체와 매핑

## 객체와 테이블 매핑

### 목차
> - 객체와 테이블 매핑
> - 필드와 컬럼 매핑
> - 기본 키 매핑
> - 실전 예제 - 1. 요구사항 분석과 기본 매핑


### 엔티티 매핑 소개
> - 객체와 테이블 매핑 : @Entity, @Table
> - 필드와 컬럼 매핑 : @Column
> - 기본키 매핑 : @Id
> - 연관관계 매핑 : @ManyToOne, @JoinColumn

### 객체와 테이블 매핑

#### @Entity
> - @Entity가 붙은 클래스는 JPA가 관리, 엔티티라 부른다.
> - JPA를 사용해서 테이블과 매핑할 클래스는 <mart>@Entity</mark> 필수
> - 주의
	> - 기본 생성자 필수 (파라미터가 없는 public 또는 proteted 생성자)
	> - final 클래스, enum, interface, inner 클래스 사용 X
	> - 저장할 필드에 final 사용 X

#### @Entity 속성 정리
> - 속성 : name
	> - JPA에서 사용할 엔티티 이름을 지정한다.
	> - 기본값 : 클래스 이름을 그대로 사용 
	> - 같은 클래스 이름이 없으면 가급적 기본값을 사용한다.
	

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity //JPA가 관리하는 객체 Entity
//@Entity(name="Member") //기본 값이 아닌 다른 이름으로 Entity 명을 지정할때 사용
public class Member {

    @Id
    private Long id;
    private String name;

    public Member() {
    }

    public Member(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```

### @Table

> - @Table은 엔티티와 매핑할 테이블 지정


속성      | 기능          | 기본값
---------|--------------|--------------
name     | 매핑할 이름 	| 엔티티 이름을 사용
catalog     | 데이터베이스 catalog 매핑 	| 
schema     | 데이터베이스 schema 매핑 	| 
uniqueConstraints(DDL)     |  DDL 생성시에 유니크 제약조건 생성 	| 


![contact](/images/develop/backend/orm-jpa-basic/persistence_manage/img-021.png)



### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
