---
title: "JPA 실전 예제 6 - 값 타입 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-24
slug: "practical-example-6"
description: "값 타입 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# 실전 예제 6 - 값 타입 매핑
------------------------

## 값 타입 추가
--------------------------
> - city, street, zipcode 는 Address 값 타입으로 변경

### 값 타입 추가 순서
---------------------------
> 1. 값 타입 클래스 추가 - Address.java

> 2. @Embeddable 어노테이션 추가

> 3. 불변 객체로 생성
>	3.1. 필드(맴버 변수) 추가
>	3.2. getter 추가
>	3.3. setter private로 생성 또는 생성 X 
>	- 값 타입은 공유해서 사용시 변경이 되면 같이 사용하는 값 모두 변경되므로 주의 
>	- 값 타입은 변경하지 말고 객체를 새로 생성해서 갈아껴야함.
>	3.4. .equals()와 hashcode() 오버라이딩
>	- == 비교에서 값 전체 비교로 변경

> 4. 값 타입을 사용(Embedded)할 엔티티에 생성한 값 타입 추가 

![contact](/images/develop/backend/orm-jpa-basic/practical-example-6/img-001.png)

> Address.java - value type

```
package jpabasic.jpashop.domain;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
    
    @Column(length = 10)
    private String cicy;
     
    @Column(length = 30)
    private String street;

    @Column(length = 5)    
    private String zipcode;
	
    // Address 를 사용하는 곳에서 같이 사용할 수 있는 메소드
    public String fullAddress(){
        return getCicy() +" "+ getStreet() +" ("+getZipcode()+")";
    }
    
    public String getCicy() {
        return cicy;
    }

    private void setCicy(String cicy) {
        this.cicy = cicy;
    }

    public String getStreet() {
        return street;
    }

    private void setStreet(String street) {
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    private void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}

```

![contact](/images/develop/backend/orm-jpa-basic/practical-example-6/img-002.png)

> code generation 할때, 아래 옵션을 선택하면, 필드에 직접 접근하는게 아니라 클래스의 Getter 메서드를 사용. 

> 프록시일 경우 필드에 직접 접근하면 계산이 안되기 때문에 getter 메소드를 이용해서 equals()와 hashcode()를 오버라이딩해야함.

#### 수정된 소스

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
	
	// ***
    @Embedded // Address 에서 @Embeddable 추가시 생략가능
    private Address address;

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

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
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

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;


    @OneToOne(mappedBy = "delivery" , fetch = FetchType.LAZY)
    private Order order;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}

```

#### 이전과 동일 소스

> Album.java

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

> Book.java

```
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

```

> Category.java

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

    @ManyToOne(fetch = FetchType.LAZY)
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

> DeliveryStatus.java

```
package jpabasic.jpashop.domain;

public enum DeliveryStatus {
    ORDER, CANCEL
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

> Movie.java

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

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>(); //관례상 초기 값을 두어 NullPointer Exception을 방지

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
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

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
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

> OrderStatus.java

```
package jpabasic.jpashop.domain;

public enum OrderStatus {
    ORDER, CANCEL
}

```

> JpaMain.java

```
package jpabasic.jpashop;

import jpabasic.jpashop.domain.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpashop");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        tx.begin();

        try{
            Book book = new Book();
            book.setName("JPA");
            book.setAuthor("김영한");
            em.persist(book);

            tx.commit();

        }catch (Exception e){
            e.printStackTrace();
            tx.rollback();
        }finally {
            em.close();
        }
        emf.close();

    }
}
```

> JpaMain.java - 애플리케이션 재시작

> console 

```
Hibernate: 
    
    create table Delivery (
       DELIVERY_ID bigint not null,
        MOD_ID varchar(255),
        MOD_DT timestamp,
        REG_ID varchar(255),
        REG_DT timestamp,
        cicy varchar(10),
        street varchar(30),
        zipcode varchar(5),
        status varchar(255),
        primary key (DELIVERY_ID)
    )
Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        MOD_ID varchar(255),
        MOD_DT timestamp,
        REG_ID varchar(255),
        REG_DT timestamp,
        cicy varchar(10),
        street varchar(30),
        zipcode varchar(5),
        name varchar(255),
        primary key (MEMBER_ID)
    )
```

### 값 타입의 장점
------------------------------------
> 1. 공통 메소드 같이 사용
> 2. 컬럼의 길이 등 옵션 동일 적용
> 3. 제약조건 동일 적용



#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>

