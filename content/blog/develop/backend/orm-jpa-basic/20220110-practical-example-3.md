---
title: "[자바 ORM 표준 JPA] JPA 실전 예제 3 - 다양한 연관관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-10
slug: "practical-example-3"
description: "다양한 연관관계 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
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
> - 주 객체은 외래키를 가지고 있는 Order.java
>	- @OneToOne <br>
      @JoinColumn(name = "DELIVERY_ID") <br>
      private Delivery delivery;

> - 대상 객체는 상대 객체인 Delivery.java
>	- @OneToOne(mappedBy = "delivery")	<br>
	  private Order order; 



> Order.java - Delivery 객체 추가 <br> 
> 외래키를 가지고 있는 주 객체

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
public class Order {

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

> Delivery.java -  <br>
> 대상 테이블 @OneToOne(mappedBy = "delivery")

```
package jpabasic.jpashop.domain;

import javax.persistence.*;

@Entity
public class Delivery {

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

> console - ORDERS - Delivery

```
	create table ORDERS (
       ORDER_ID bigint not null,
        orderDate timestamp,
        status varchar(255),
        DELIVERY_ID bigint,
        member_MEMBER_ID bigint,
        primary key (ORDER_ID)
    )
    
	create table Delivery (
       DELIVERY_ID bigint not null,
        city varchar(255),
        status varchar(255),
        street varchar(255),
        zipcode varchar(255),
        primary key (DELIVERY_ID)
    )
    
    alter table ORDERS 
       add constraint FKdbs21f1yi0coxy9y0kxw4g9jf 
       foreign key (DELIVERY_ID) 
       references Delivery
```


#### 다대다 양방향 관계 Category.java - Item.java
> - 주 객체은 외래키를 가지고 있는 Category.java
>	- @ManyToMany <br>
      @JoinTable( <br>
	      			name = "CATEGORY_ITEM", <br>
	                joinColumns = @JoinColumn(name = "CATEGORY_ID"), <br>
	                inverseJoinColumns = @JoinColumn(name ="ITEM_ID") <br>
                ) <br>
    private List<Item> items = new ArrayList<>();
    
> - 대상 객체는 상대 객체인 Item.java
>	- @ManyToMany(mappedBy = "items") <br>
      private List<Category> categories = new ArrayList<>();

##### 부모 자식 구조의 연관관계 Category.java - Item.java
> - 부모 
>	- @ManyToOne <br>
      @JoinColumn(name = "parent_id") <br>
      private Category parent; // 상위 카테고리

> - 자식 
>	- @OneToMany(mappedBy = "parent") <br>
      private List<Category> child = new ArrayList<>();   // 자식 카테고리


> Category.java 

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Category {

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


> Item.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Item {
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


> console

````
    create table Category (
       CATEGORY_ID bigint not null,
        name varchar(255),
        parent_id bigint,
        primary key (CATEGORY_ID)
    )
    
	create table CATEGORY_ITEM (
       CATEGORY_ID bigint not null,
        ITEM_ID bigint not null
    )
    
    create table Item (
       ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        primary key (ITEM_ID)
    )
    
    alter table Category 
       add constraint FK5s5t2pfpxo0vnd1ihc43721ty 
       foreign key (parent_id) 
       references Category
    
    alter table CATEGORY_ITEM 
       add constraint FKf1uerpnmn49vl1spbbplgxaun 
       foreign key (ITEM_ID) 
       references Item
    
    alter table CATEGORY_ITEM 
       add constraint FKjip0or3vemixccl6vx0kluj03 
       foreign key (CATEGORY_ID) 
       references Category
    

````


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
