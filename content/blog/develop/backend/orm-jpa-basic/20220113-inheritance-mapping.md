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

> 음반, 영화, 책의 공통 속성은 물품에 두고, 각각의 속성들을 밑의 서브 타입에 지정하여 논리 모델을 구성합니다.

> 객체는 Item이라는 추상 클래스를 만들고 Item을 상속받는 Album, Movie, Book 객체를 구성할 수 있습니다.

### 슈퍼타입 서브타입 논리 모델을 실제 물리 모델로 구현하는 방법

> 1. 통합 테이블로 변환 -> 단일 테이블 전략
> 2. 각각 테이블로 변환 -> 조인전략
> 3. 서브타입 테이블로 변환 -> 구현 클래스마다 테이블 전략


#### 1. 단일(통합) 테이블 전략
> JPA Default
![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-003.png)


#### 2. 조인전략 

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-002.png)

> ITEM, ALBUM, MOVIE, BOOK 테이블을 만들고, JOIN으로 이를 구성. <BR>
ALBUM의 데이터를 추가하면, ITEM에 이름, 가격을 넣고 ALBUM에는 아티스트 같은 데이터는 ALBUM에 넣습니다. <BR>
ITEM과 ALBUM 두번의 인서트와 조회는 ITEM_ID로 조인을 해서 가져옴 <BR>
어떤 타입의 서브타입 테이블을 사용하는지(어떤 데이터 인지) 구분하기 위해서 구분 컬럼을(DTYPE) 추가


#### 3. 구현 클래스 마다 테이블 생성 전략

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-004.png)

> ITEM의 속성들을 각각 가진 ALBUM, MOVIE, BOOK 생성

> 하나의 테이블 ITEM에 속성들을 모두 모아놓고 PK와 DTYPE로 구분하여 하용하는 방식

> <mark>객체 입장에서는 상속 관계를 지원하기 때문에 어떤것을 사용해도 똑같으며, JPA에서는 모두 매핑 가능합니다.</mark>

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-005.png)

### 주요 어노테이션
-------------------------------
> - @Inhritance(strategy=InheritanceType.XXX)
>	1. SINGLE_TABLE : 단일 테이블 전략
>	2. JOINED : 조인전략
>	3. TABLE_PER_CLASS : 구현 클래스 마다 테이블 생성 전략
> - @DiscriminatorColumn(name="DTYPE")
> - @DiscriminaterValue("XXX")

#### 1. 단일(통합) 테이블 전략

> Item.java


```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Item {

    @Id @GeneratedValue
    private Long id;

    private String name;

    private int price;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}

```


> Album.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Album extends Item{

    private String artist;
}

```


> Movie.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;

@Entity
public class Movie extends Item{
    private String director;
    private String actor;

}
```


> Book.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;

@Entity
public class Book extends Item{
    private String author;
    private String isbn;

}


```

> JpaMain 애플리케이션 재시작

```
Hibernate: 
    
    drop table if exists Item CASCADE 
Hibernate: 
    
    drop table if exists Locker CASCADE 
Hibernate: 
    
    drop table if exists Member CASCADE 
Hibernate: 
    
    drop table if exists ORDERS CASCADE 
Hibernate: 
    
    drop table if exists Product CASCADE 
Hibernate: 
    
    drop table if exists Team CASCADE 
Hibernate: 
    
    drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        author varchar(255),
        isbn varchar(255),
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Locker (
       LOCKER_ID bigint not null,
        name varchar(255),
        primary key (LOCKER_ID)
    )
Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        USERNAME varchar(255),
        LOCKER_ID bigint,
        TEAM_ID bigint,
        primary key (MEMBER_ID)
    )
Hibernate: 
    
    create table ORDERS (
       id bigint not null,
        ORDERAMOUNT integer,
        ORDERCOUNT integer,
        ORDERDATE date,
        MEMBER_ID bigint,
        PRODUCT_ID bigint,
        primary key (id)
    )
Hibernate: 
    
    create table Product (
       id bigint not null,
        name varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Team (
       TEAM_ID bigint not null,
        NAME varchar(255),
        primary key (TEAM_ID)
    )
Hibernate: 
    
    alter table Member 
       add constraint FK332130jlg9s5hyeuk7gfgi052 
       foreign key (LOCKER_ID) 
       references Locker

Hibernate: 
    
    alter table Member 
       add constraint FKl7wsny760hjy6x19kqnduasbm 
       foreign key (TEAM_ID) 
       references Team
Hibernate: 
    
    alter table ORDERS 
       add constraint FKh0db7kqr88ed8hqtcqw3jkcia 
       foreign key (MEMBER_ID) 
       references Member
Hibernate: 
    
    alter table ORDERS 
       add constraint FKtlx3qxs8vwir2b80i3oumx2qm 
       foreign key (PRODUCT_ID) 
       references Product

Process finished with exit code 0

```

> 따로 설정을 하지 않으니 단일(통합) 테이블 전략을 사용하여, ITEM 하나의 테이블에 모든 속성들이 생성되는것을 확인할 수 있습니다.

#### 2. 조인전략 - 예제



#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
