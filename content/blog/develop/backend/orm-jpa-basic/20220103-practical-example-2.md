---
title: "JPA 실전 예제 2 - 연관관계 매핑 시작"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-03
slug: "practical-example-2"
description: "연관관계 매핑 시작"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---


# 실전 예제 2 - 연관관계 매핑 시작

## 요구사항 분석
-------------
> 실전 예제 1 요구사항 분석과 기본 매핑에서 테이블에 맞춘 설계를 했던 것에 연관 관계 매핑을 적용 시켜 보도록 하겠습니다.

### 테이블 구조
-------------
> 테이블 구조는 이전과 같다.

![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-002.png)


### 객체 구조
-------------
> 참조를 사용하도록 변경

![contact](/images/develop/backend/orm-jpa-basic/practical-example-2/img-001.png)

> OrderItem과 Item에서 N:1이면서 화살표가 OrderItem에서 Item으로 단방향인 것을 알 수 있는데, 이는 주문된 아이템(OrderItem) 입장에서는 어떠한 아이템(Item)인지 알아야하지만, 아이템 입장에서는 통계 같은 프로그램을 하지 않는 이상 이 아이템이 어떠한 아이템 주문이 되었는지 알 필요가 없습니다.

> 또한 실제 개발을 할때는 Member에 굳이 Orders를 가지지 않는 것이 바람직하다고 합니다. 객체 지향적으로는 Member에 Orders가 있는게 맞지만, 
<br> Member에 Orders 그리고 Orders에서 Member와 OrderItem을 참조하며 모든 연관관계를 추가 하지 말고 (추가 하다보면 끝이 없습니다.)
<br> 적절하게 관심사를 분리하여 Order에 Member를 파라미터로 바로 Order에서 Member와 OrderItem을 참조하면 됩니다. 

> 현재는 예제이기 때문에, Member에 Orders를 추가하여 앙뱡향 연관관계를 실습해 보겠습니다.


#### 단방향 매핑 추가
> 우선 단방향 연관관계 매핑부터 진행 하도록 하겠습니다.

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

   
}

```

> Member.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Member {

    public Member(){}

    @Id @GeneratedValue
    @Column(name="MEMBER_ID")
    private Long id;
    private String name;
    private String cicy;
    private String street;
    private String zipcode;

}

```

> OrderItem.java

````
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class OrderItem {
    public OrderItem(){}

    @Id @GeneratedValue
    @Column(name = "OFDER_ITEM_ID")
    private Long id;

    private int orderPrice;

    private int count;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Item item;

}

````

> Item.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class Item {
    public Item(){}

    @Id @GeneratedValue
    @Column(name="ITEM_ID")
    private Long id;
    private String name;
    private int price;
    private int stockQuantity;

}

```


#### 양방향 매핑 추가
> 단방향 매핑을 하였으니 Member에서 Order로 Order에서 OrderItem 으로 역방향 매핑을 추가하도록 하겠습니다. 그리고 setter와 getter 또한 추가 하도록 하겠습니다.

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
}

```

> Member.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Member {

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

> OrderItem.java

````
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class OrderItem {
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

````

> Item.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
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


#### 연관관계 편의 메소드 추가  

> JpaMain.java 에서 

![contact](/images/develop/backend/orm-jpa-basic/practical-example-2/img-002.png)

> 메소드 생성을 하여 Order의 addOrderItem 편의 메소드 작성

> Order.java

```
	...
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    ...
```

![contact](/images/develop/backend/orm-jpa-basic/practical-example-2/img-003.png)

> Order.java

```
	...
    public void addMember(Member member) {
        this.member = member;
        member.getOrders().add(this);
    }
    ...
```

> 할 수 있다면 최대한 단방향으로 개발하여도 상관은 없으나 이후 복잡한 JPQL등 사용할때 그때 가서 고려해도 상관 없다. 그렇기 때문에 단방향 설계를 잘하는 것이 중요하다.


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
