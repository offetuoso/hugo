---
title: "[스프링부트 JPA 활용] 엔티티 클래스 개발"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-05-08
slug: "entity-class-development"
description: "[스프링부트 JPA 활용] 엔티티 클래스 개발"
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 도메인 분석 설계
-------------------------------

## 목차
-------------------------------
> 1. 요구사항 분석
> 2. 도메인 모델과 테이블 설계
> 3. 엔티티 클래스 개발
> 4. 엔티티 설계시 주의점

## 엔티티 클래스 개발
----------------------------------
![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-007.png)

> - 예제에서는 설명을 쉽게하기 위해 엔타타 클래스에 Getter, Setter를 모두 열고, 최대한 단순하게 설계
> - 실무에서는 가급적 Getter, Setter는 꼭 필요한 경우에만 사용하는 것을 추천

> 참고 : 이론적으로 Getter, Setter를 모두 제공하지 않고, 꼭 필요한 별도의 메서드를 제공하는게 가장 이상적이다. 하지만 실무에서 엔티티의 데이는 조회할 일이 너무 많으므로, Getter의 경우 모두 열어 두는 것이 편리하다. Getter는 아무리 호출해도 호출하는 것 만으로 어떤 일이 발생하지는 않는다. 하지만 Setter는 문제가 다르다. Setter를 호출하면 데이터가 변한다. Setter를 막 열어두면 가까운 미래에 엔티티가 도대체 왜 변경되는지 추적하기 점점 힘들어진다. 그래서 엔티티를 변경할 때는 Setter 대신에 변경 지점이 명확하도록 변경을 위한 비지니스 메서드를 별도로 제공해야한다.

### 도메인 패키지 생성
----------------------------------
> jpabook/jpashop/domain 패키지를 생성하여 추가할 엔티티 클래스들을 모아두도록 하겠습니다.

> 기존의 jpabook/jpashop/entity의 패키지는 지우도록 하겠습니다.



### Member 엔티티
----------------------------------

> jpabook/jpashop/domain/Member.java 생성

```
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;
import org.graalvm.compiler.nodes.memory.address.AddressNode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.ArrayList;

@Entity
@Getter @Setter
public class Member {

    public Member() {
    }

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String name;

    private Address address;

    private List<Order> orders = new ArrayList<>();
}

```

> Address.java와 Order는 미리 껍데기 만이라도 생성해 둡니다.


### Address 값 타입 생성
----------------------------------

> jpabook/jpashop/domain/Address.java 생성 - @Embeddable 추가

```
package jpabook.jpashop.domain;

import lombok.Getter;

import javax.persistence.Embeddable;

@Embeddable
@Getter
public class Address {

    private String city;
    private String street;
    private String zipcode;

}

```

#### Member.java
> Member.java - @Embedded 어노테이션 추가


```
    @Embedded // << 추가해 줍니다. 
    private Address address;
```

> @Embeddable이나 @Embedded 하나만 추가해도 적용 되지만, 코드 가독성을 위해 둘다 추가해 줍니다.


### Order.java
-----------------------------

> jpabook/jpashop/domain/Order.java 생성

```
package jpabook.jpashop.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders") // order는 키워드므로 orders로 관습적으로 사용
@Getter @Setter
public class Order {

    @Id @GeneratedValue
    @Column(name="order_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;

    private List<OrderItem> orderItems = new ArrayList<>();

    private Delivery delivery;

    private LocalDateTime orderDate; //주문시간

    private OrderStatus status; // 주문상태 [ORDER, CANCEL]
}

```

### OrderStatus

> jpabook/jpashop/domain/OrderStatus.java 열거형 타입 생성

```
package jpabook.jpashop.domain;

public enum OrderStatus {
    ORDER, CANCEL
}

```

#### Order.java

> Order.java - @Enumerated(EnumType.STRING) 추가

```
	@Enumerated(EnumType.STRING) // EnumType.ORDINAL(숫자라 순서바뀌면 큰일)이 기본이지만 무조건 EnumType.STRING(문자 코드)
    private OrderStatus status; // 주문상태 [ORDER, CANCEL]
```


### OrderItem.java
-----------------------------

> jpabook/jpashop/domain/OrderItem.java 생성


```
package jpabook.jpashop.domain;

import javax.persistence.*;

@Entity
public class OrderItem {

    @Id @GeneratedValue
    @Column(name = "order_item_id")
    private Long id;

    private Item item;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private int orderPrice; //주문 당시의 가격
    private int count; //주문 수량
}

```

#### Order.java

> Order.java - @OneToMany(mappedBy = "order") 추가

```
    @OneToMany(mappedBy = "order") // 연관관계의 주인인 OrderItem의 order로 매핑 되어있다는 뜻 
    private List<OrderItem> orderItems = new ArrayList<>();

```


### Item.java 
------------------------
> Item는 상속관계로 Album.java, Book.java, Movie.java를 같이 생성해야 하므로 따로 item 패키지를 추가해 모아둡니다.

> jpabook/jpashop/domain/item/Item.java 생성
> - @Inheritance(strategy = InheritanceType.SINGLE_TABLE) // 상속 테이블 전략 싱글테이블
> - @DiscriminatorColumn(name = "dtype") // 구분 컬럼명

```
package jpabook.jpashop.domain.item; 

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
@Getter @Setter
public abstract class Item {

    @Id @GeneratedValue
    @Column(name = "item_id")
    private Long id;

    private String name;
    private int price;
    private int stockQuantity;

}


```

#### Album.java

> jpabook/jpashop/domain/item/Album.java 생성
> - @DiscriminatorValue("A") //구분값 A

```
package jpabook.jpashop.domain.item;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("A") //구분값 A
@Getter @Setter
public class Album extends Item{
    private String artist;
    private String etc;
}

```

#### Book.java

> jpabook/jpashop/domain/item/Book.java 생성
> - @DiscriminatorValue("B") //구분값 B

```
package jpabook.jpashop.domain.item;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("B") //구분값 B
@Getter @Setter
public class Book extends Item{
    private String author;
    private String isbn;
}

```


#### Movie.java

> jpabook/jpashop/domain/item/Movie.java 생성
> - @DiscriminatorValue("M") //구분값 M

```
package jpabook.jpashop.domain.item;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("M") //구분값 M
@Getter @Setter
public class Movie extends Item{
    private String director;
    private String actor;
}

```

#### OrderItem.java 

> OrderItem.java - @JoinColumn(name = "item_id")

```
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
```


### Delivery.java
------------------------

> jpabook/jpashop/domain/Delivery.java 생성 - @Enumerated(EnumType.STRING)

```
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Delivery {

    public Delivery() {
    }

    @Id @GeneratedValue
    @Column(name = "delivery_id")
    private Long id;

    private Order order;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status; //READY, COMP

}

```


### DeliveryStatus.java
------------------------

> jpabook/jpashop/domain/DeliveryStatus.java 열거형 타입 생성

```
package jpabook.jpashop.domain;

public enum DeliveryStatus {
    READY, COMP
}

```


#### Order - Delivery
> 1:1 관계에서는 FK를 어느 위치에 둬도 상관은 없지만, Order에서 Delivery를 조회하는게 Delivery에서 Order를 조회 하는것보다 많기 때문에 FK를 더 많이 접근하는 엔티티에 FK를 위치 시킵니다. 


> Order - @JoinColumn(name = "delivery_id") 추가

```
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "orders")
public class Order {

    @Id @GeneratedValue
    @Column(name="order_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;

    @OneToMany(mappedBy = "order") // 연관관계의 주인인 OrderItem의 order로 매핑 되어있다는 뜻
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private LocalDateTime orderDate; //주문시간

    @Enumerated(EnumType.STRING) // EnumType.ORDINAL(숫자라 순서바뀌면 큰일)이 기본이지만 무조건 EnumType.STRING(문자 코드)
    private OrderStatus status; // 주문상태 [ORDER, CANCEL]
}

```

> Delivery.java - @OneToOne(mappedBy = "delivery") 추가

```
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Delivery {

    public Delivery() {
    }

    @Id @GeneratedValue
    @Column(name = "delivery_id")
    private Long id;

    @OneToOne(mappedBy = "delivery")
    private Order order;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status; //READY, COMP

}

```






#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
