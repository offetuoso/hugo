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


```


> Movie.java Item을 상속받는다.
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


> JpaMain.java - Book 객체 추가

```
  			 Book book = new Book();
            book.setName("JPA");
            book.setAuthor("김영한");
            em.persist(book);

            tx.commit();

```

> console

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert jpabasic.jpashop.domain.Book
        */ insert 
        into
            Item
            (name, price, stockQuantity, author, isbn, DTYPE, ITEM_ID) 
        values
            (?, ?, ?, ?, ?, 'B', ?)
```

![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-004.png)

> Joined로 변경해서 다시 애플리케이션을 재시작 해보겠습니다.

> Item.java - @Inheritance(strategy = InheritanceType.JOINED)

```

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
public abstract class Item {

```

```
   create table Item (
       DTYPE varchar(31) not null,
        ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        primary key (ITEM_ID)
    )
    
    Hibernate: 
    
    create table Album (
       artist varchar(255),
        etc varchar(255),
        ITEM_ID bigint not null,
        primary key (ITEM_ID)
    )
	
	Hibernate: 
    
    create table Book (
       author varchar(255),
        isbn varchar(255),
        ITEM_ID bigint not null,
        primary key (ITEM_ID)
    )
    
	Hibernate: 
    
    create table Movie (
       actor varchar(255),
        director varchar(255),
        ITEM_ID bigint not null,
        primary key (ITEM_ID)
    )
    
	Hibernate: 
    /* insert jpabasic.jpashop.domain.Book
        */ insert 
        into
            Item
            (name, price, stockQuantity, DTYPE, ITEM_ID) 
        values
            (?, ?, ?, 'B', ?)
            
	Hibernate: 
    /* insert jpabasic.jpashop.domain.Book
        */ insert 
        into
            Book
            (author, isbn, ITEM_ID) 
        values
            (?, ?, ?)
```

> ITEM과 BOOK 모두 ITEM_ID가 들어가며, DTYPE가 B로 들어간다.

![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-005.png)

> TABLE_PER_CLASS로 변경해서 다시 애플리케이션을 재시작 해보겠습니다.

> Item.java - @Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)

```

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn
public abstract class Item {

```

```
Hibernate: 
    
    create table Album (
       ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        artist varchar(255),
        etc varchar(255),
        primary key (ITEM_ID)
    )
Hibernate: 
    
    create table Book (
       ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        author varchar(255),
        isbn varchar(255),
        primary key (ITEM_ID)
    )
Hibernate: 
    
    create table Movie (
       ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        actor varchar(255),
        director varchar(255),
        primary key (ITEM_ID)
    )
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert jpabasic.jpashop.domain.Book
        */ insert 
        into
            Book
            (name, price, stockQuantity, author, isbn, ITEM_ID) 
        values
            (?, ?, ?, ?, ?, ?)
```

![contact](/images/develop/backend/orm-jpa-basic/practical-example-4/img-006.png)

> Item.java는 생성안되는것과 Item.java의 속성들이 Album.java, Book.java, Movie.java 들에 추가된 것을 확인할 수 있습니다. 

> InheritanceType.TABLE_PER_CLASS은 사용하면 안되는것을 다시 상기시키고,
소스는 설계와 같이 InheritanceType.SINGLE_TABLE 로 수정해둡니다. 

> Item.java - @Inheritance(strategy = InheritanceType.SINGLE_TABLE)

```

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn
public abstract class Item {

```


#### @MappedSuperclass를 추가

> BaseEntity를 추가하고 @MappedSuperclass를 추가해보겠습니다.

> BaseEntity.java

```
package jpabasic.jpashop.domain;


import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity {
    @Column(name = "REG_ID")
    private String createBy;

    @Column(name = "REG_DT")
    private LocalDateTime createDate;

    @Column(name = "MOD_ID")
    private String LastModifiedBy;

    @Column(name = "MOD_DT")
    private LocalDateTime LastModifiedDate;

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public String getLastModifiedBy() {
        return LastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        LastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastModifiedDate() {
        return LastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        LastModifiedDate = lastModifiedDate;
    }
}

```

> 모든 엔티티에 extends BaseEntity를 추가합니다.

> Category.Java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Category extends BaseEntity{

    @Id @GeneratedValue
    @Column(name = "CATEGORY_ID")
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent; // 상위 카테고리

    @OneToMany(mappedBy = "parent")
    private List<Category> child = new ArrayList<>();   // 자식 카테고리

    @ManyToMany
    @JoinTable(name = "CATEGORY_ITEM",
                joinColumns = @JoinColumn(name = "CATEGORY_ID"),
                inverseJoinColumns = @JoinColumn(name ="ITEM_ID")
    )
    private List<Item> items = new ArrayList<>();

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}

```

> Delivery.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;

@Entity
public class Delivery extends BaseEntity{

    @Id @GeneratedValue
    @Column(name = "DELIVERY_ID")
    private Long id;
    private String city;
    private String street;
    private String zipcode;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;


    @OneToOne(mappedBy = "delivery")
    private Order order;


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}

```

> Item.java

```
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

```

> Member.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Member extends BaseEntity{

    public Member(){}

    @Id @GeneratedValue
    @Column(name="MEMBER_ID")
    private Long id;
    private String name;
    private String cicy;
    private String street;
    private String zipcode;

    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>(); //관례상 초기 값을 두어 NullPointer Exception을 방지

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

    public String getCicy() {
        return cicy;
    }

    public void setCicy(String cicy) {
        this.cicy = cicy;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}

```

> Order.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import jpabasic.jpashop.domain.Member;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ORDERS") // DB에 따라 ORDER가 예약어일 경우가 있어 ORDERS
public class Order extends BaseEntity{

    public Order(){}

    @Id
    @GeneratedValue
    @Column(name="ORDER_ID")
    private Long id;

    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne
    private Member member;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems = new ArrayList<>(); //관례상 초기 값을 두어 NullPointer Exception을 방지

    @OneToOne
    @JoinColumn(name = "DELIVERY_ID")
    private Delivery delivery;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void addMember(Member member) {
        this.member = member;
        member.getOrders().add(this);
    }
}

```

> OrderItem.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class OrderItem extends BaseEntity{
    public OrderItem(){
    }

    @Id @GeneratedValue
    @Column(name = "OFDER_ITEM_ID")
    private Long id;

    private int orderPrice;

    private int count;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Item item;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(int orderPrice) {
        this.orderPrice = orderPrice;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}

```

> Album.java, Book.java, Movie.java는 Item을 상속받기 때문에 BaseEntity를 상속 받을 필요가 없습니다.





#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>

