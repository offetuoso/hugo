---
title: "JPA 실전 예제 4 - 상속관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-17
slug: "practical-example-4"
description: "상속관계 매핑"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 실전 예제 4 - 상속관계 매핑
------------------------

## 요구사항 추가
--------------------------
> - 상품의 종류는 음반, 도서, 영화가 있고 이후 더 확장될 수 있다.
> - 모든 데이터는 등록일과 수정일이 필수다.

### 도메인 모델
-----------------------------
![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-001.png)


### 도메인 모델 상세
-----------------------------
![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-002.png)

### 테이블 설계
![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-003.png)


#### 상속관계 매핑 추가 

> Item.java

> - Item.java를 abstract로 바꾼다.
> - 단일 테이블 전략이기 때문에 Item.java에 @Inheritance(strategy = InheritanceType.SINGLE_TABLE) 를 추가한다.
> - @DiscriminatorColumn를 추가하여 DTYPE를 추가한다.

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn
public abstract class Item {
    public Item(){
    }

    public Item(String name, int price, int stockQuantity) {
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    @Id @GeneratedValue
    @Column(name="ITEM_ID")
    private Long id;
    private String name;
    private int price;
    private int stockQuantity;

    @ManyToMany(mappedBy = "items")
    private List<Category> categories = new ArrayList<>();

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

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}

```

> Album.java Item을 상속받는다.
> - @DiscriminatorValue("A")를 추가하여, 구분값을 코드로 관리

```
package jpabasic.jpashop.domain;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("M")
public class Movie extends Item{
    private String director;
    private String actor;

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }
}

```


> Album.java Item을 상속받는다.
> - @DiscriminatorValue("A")를 추가하여, 구분값을 코드로 관리

```
package jpabasic.jpashop.domain;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("M")
public class Movie extends Item{
    private String director;
    private String actor;

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }
}

```



> console

````
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        author varchar(255),
        isbn varchar(255),
        artist varchar(255),
        etc varchar(255),
        actor varchar(255),
        director varchar(255),
        primary key (ITEM_ID)
    )
````


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
