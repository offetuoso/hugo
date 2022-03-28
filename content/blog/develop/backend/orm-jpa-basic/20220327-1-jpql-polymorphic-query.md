---
title: "JPQL 다형성 쿼리(Polymorphic Query)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-21
slug: "jpql-polymorphic-query"
description: "JPQL 다형성 쿼리(Polymorphic Query)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# JPQL 다형성 쿼리(Polymorphic Query)
-------------------------------------
> 이번 시간에는 다형성 쿼리에 대해 정리를해 보겠습니다. 


## 다형성 쿼리
--------------------

![contact](/images/develop/backend/orm-jpa-basic/polymorphic-query/img-001.png)

> JPA가 이러한 다형성을 위해 제공하는 특수한 기능들이 있습니다. 

### TYPE
--------------------
> 조회 대상을 특정 자식으로 한정

> 예) Item 중에 Book, Movie를 조회해라

>  [JPQL]

```
SELECT i FROM Item i
 WHERE TYPE(i) IN (Book, Movie)
```
<br>


> [SQL]

```
SELECT i.* from Item i
 WHERE i.DTYPE IN ('B', 'M')

```

### TREAT (JPA2.1)
--------------------
> - 자바의 타입 캐스팅과 유사 (다운 캐스팅 : 자식 타입으로 캐스팅)
> - 상속 구조에서 부모 타입을 특정 자식 타입으로 다룰 때 사용
> - FROM, WHERE, SELECT(하이버네이트 지원) 사용

> 예) 부모인 Item과 자식 Book이 있다.

>  [JPQL]

```
SELECT i FROM Item i
 WHERE TREAT(i AS Book).author = 'Kim' 
 ```
<br>



> [SQL]

```
SELECT i.* from Item i
 WHERE i.DTYPE = 'B' and i.author = 'Kim'

```

> 자식과 부모의 어떤 전략으로 구성이 되어있느냐에 따라 SQL이 다르게 나가게 되며, 해당 SQL문은 싱글 테이블 전략 시 나오는 쿼리


### 이전 소스
---------------------

> 실전 예제 프로젝트 jpa-shop 프로젝트의 소스 


<details title="펼치기/숨기기">
 	<summary> Item.java </summary>

	package jpabasic.jpashop.domain;

	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
	@DiscriminatorColumn
	public abstract class Item extends BaseEntity{
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
	
		
</details>

<details title="펼치기/숨기기">
 	<summary> Album.java </summary>

	package jpabasic.jpashop.domain;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("A")
	public class Album extends Item{
	    private String artist;
	    private String etc;
	
	    public String getArtist() {
	        return artist;
	    }
	
	    public void setArtist(String artist) {
	        this.artist = artist;
	    }
	
	    public String getEtc() {
	        return etc;
	    }
	
	    public void setEtc(String etc) {
	        this.etc = etc;
	    }
	}

	
		
</details>

<details title="펼치기/숨기기">
 	<summary> Book.java </summary>
	
	package jpabasic.jpashop.domain;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("B")
	public class Book extends Item{
	    private String author;
	    private String isbn;
	
	    public String getAuthor() {
	        return author;
	    }
	
	    public void setAuthor(String author) {
	        this.author = author;
	    }
	
	    public String getIsbn() {
	        return isbn;
	    }
	
	    public void setIsbn(String isbn) {
	        this.isbn = isbn;
	    }
	}

		
</details>

<details title="펼치기/숨기기">
 	<summary> Movie.java </summary>
	
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

		
</details>



#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
