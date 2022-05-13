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
@Getter //Getter만 
public class Address {

    private String city;
    private String street;
    private String zipcode;

    protected Address(){
    }

	//Setter 대신 생성자 사용
    public Address(String city, String street, String zipcode){
        this.city = city;
        this.street = street;
        this.zipcode = zipcode;
    }

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
@Getter @Setter
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

### CATEGORY.java

#### CATEGORY -  ITEM (N : M)
------------------------
> N:M 관계를 JPA로 구현하기 위해서는 테이블과 테이블 사이에 JoinTable을 추가해 N:1, 1:M 구조가 되게끔 생성합니다.

> Category.java 
> - @ManyToMany 추가
> - @JoinTable 추가

```
package jpabook.jpashop.domain;

import jpabook.jpashop.domain.item.Item;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Category {

    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(name = "category_item"
            , joinColumns = @JoinColumn(name = "category_id")
            , inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items = new ArrayList<>();

}

```

> Item.java - @ManyToMany(mappedBy = "items") 추가

```
package jpabook.jpashop.domain.item;

import jpabook.jpashop.domain.Category;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(mappedBy = "items")
    private List<Category> categories = new ArrayList<>();

}

```

#### Category의 계층형 관계 
------------------------
> 카테고리나 코드 같은 엔티티는 본인과 부모 관계의 계층형 관계의 구조로 구성할 수 있는데 
> parent와 child 모두 본인 엔티티에 가지게 된다. <br> 
> 코드성 테이블 생성시 부모(또는 그룹코드)를 가지고 있지만, JPA에서는 자식을 조회할 수 있도록 child도 가진다.

> - @ManyToOne - 추가
> - @OneToMany - 추가

```
package jpabook.jpashop.domain;

import jpabook.jpashop.domain.item.Item;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Category {

    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(name = "category_item"
            , joinColumns = @JoinColumn(name = "category_id")
            , inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> child = new ArrayList<>();
}

```


> 애플리케이션을 실행

![contact](/images/develop/backend/using-springboot-jpa/entity-class-development/img-001.png)

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-007.png)

> 테이블이 정상적으로 생성된것을 확인할 수 있습니다.


### 엔티티 설계 시 참고
--------------------------

#### 엔티티의 Getter와 Setter

> 이론적으로 Getter, Setter를 모두 제공하지 않고, 꼭 필요한 별도의 메서드를 제공하는게 가장 이상적이다. 하지만 실무에서 엔티티의 데이는 조회할 일이 너무 많으므로, Getter의 경우 모두 열어 두는 것이 편리하다. Getter는 아무리 호출해도 호출하는 것 만으로 어떤 일이 발생하지는 않는다. 하지만 Setter는 문제가 다르다. Setter를 호출하면 데이터가 변한다. Setter를 막 열어두면 가까운 미래에 엔티티가 도대체 왜 변경되는지 추적하기 점점 힘들어진다. 그래서 엔티티를 변경할 때는 Setter 대신에 변경 지점이 명확하도록 변경을 위한 비지니스 메서드를 별도로 제공해야한다.

#### 엔티티의 Id

> 엔티티의 식별자는 'id'를 사용하고 컬럼명은 'member_id' 이런식으로 엔티티_id를 사용했다. 엔티티는 타입이 있으므로 id 필드만으로 쉽게 구분할 수 있다. 테이블은 타입이 없으므로 구분이 어렵다. 그리고 테이블은 관례상 '테이블명 + id'를 많이 사용한다. 참고로 객체에서 'id' 대신에 'memberId'를 사용해도 된다. 중요한 것은 일관성이다.

#### 실무에서는 ManyToMany를 사용하지 말자.

> @ManyToMany는 편리할 것 같지만, 중간테이블(CATEGORY_ITEM)에 컬럼을 추가 할 수 없고, 세밀하게 쿼리를 실행하기 어렵기 때문에 실무엣 사용하기에는 한계가 있다. 중간 엔티티(CategoryItem)를 만들고 @ManyToOne @OneToMany로 매핑해서 사용하자. 정리하면 다대다 매핑을 일대다, 다대일 매핑으로 풀어내서 사용하자

#### 값 타입에 Setter를 추가 하지 않은 이유 

> Address.java

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
    
    proteted

}

```

> 값 타입인 Address에는 Getter만 추가하고 Setter는 만들지 않았습니다. 
> 값 타입 변경해 사용하는 것이 아니라, 새로 생성 또는 복사를 통해 새로 등록 해야한다.

> 값 타입은 변경 불가능하게 설계해야한다. 
> '@Setter'를 제거하고, 생성자에서 값을 모두 초기화 해서 변경 불가능한 클래스를 만들자. JPA 스펙상 엔티티나 임베디드 타입(@Embeddable)은 자바 기본 생성자를 public 또는 protected로 설정해야 한다.
public으로 두는 것 보다는 protected로 설정하는 것이 그나마 인전 하다. JPA가 이런 제약을 두는 이유는 JPA 구현 라이브러리가 객체를 생성할 때 리플랙션 같은 기술을 사용할 수 있도록 지원해야 하기 때문이다.

## 엔티티 설계시 주의점
----------------------------------

### 엔티티에는 가급적으로 Setter를 사용하지 말자.
-----------------------------------
> - Setter가 모두 열려있으면, 변경 포인트가 너무 많아 유지보수가 어렵다.
> - Setter 대신 비즈니스 메서드를 구현해 사용한다.

### 모든 연관관계는 지연로딩으로 설정!
-----------------------------------
> - 즉시로딩(EAGER)은 예측이 어렵고, 어떤 SQL이 실행될지 추적하기 어렵다. 특히 JPQL을 실행할 떄 N+1 문제가 자주 발생한다. 
> - 실무에서 모든 연관관계는 지연로딩(LAZY)으로 설정해야 한다.
> - 연관된 엔티티를 함께 DB에서 조회해야 하면, fetch join 또는 엔티티 그래프 기능을 사용한다.
> - @XToOne(OneToOne, ManyToOne) 관계는 기본이 즉시로딩이므로 직접 지연로딩으로 설정해야한

> 즉시로딩의 최악의 경우 테이블에 연관된 데이터를 다 불러오기 때문에 어떤 쿼리가 나오는지 정확히 알수 없습니다.

> 예를들어 Order 엔티티에 같이 설정이 되어 있습니다.

```
@ManyToOne(fetch = FetchType.EAGER) // FetchType.EAGER가 Defualt(설정 안해두면 FetchType.EAGER)
@JoinCoulmn(name = "member_id")
private Member member;
```

> 즉, Order와 Member는 N:1 관계로 즉시로딩으로 기본 설정되어 있습니다.<br>
> 이런 상황에서 JPQL로 100 ROW의 ORDERS를 조회합니다. 

```
//JPQL "SELECTo FROM ORDER p" -> SQL "SELECT * FROM ORDERS"
```

> 즉시 로딩은 엔티티의 각각의 Row당 Member를 즉시 쿼리를 날려 호출하기 때문에 N+1 의 문제점을 발생시킵니다. 

> 즉시로딩은 Order를 조회하는 시점에 어떻게든 Member를 조회하겠다는 뜻입니다.

> 지연로딩으로 세팅 후 fetch join이나 엔티티 그래프 기능을 사용해야 합니다.


#### ToOne 전체 검색 후 (fetch = FetchTpye.LAZY)로 세팅


### 컬렉션은 필드에서 초기화하자
--------------
> 컬렉션은 필드에서 바로 초기화 하는 것이 안전하다.
> - null 문제에서 안전하다.
> - 하이버네이트는 엔티티를 영속화 할 때, 컬렉션을 감싸서 하이버네이트가 제공하는 내장 컬렉션으로 변경한다. 만약 getOrders() 처럼 임의의 메서드에서 컬렉션을 잘못 생성하면 하이버네이트 내부 메커니즘에 문제가 발생할 수 있다. 따라서 필드레벨에서 생성하는 것이 가장 안전하고, 코드도 간결하다.


#### 컬렉션은 초기화 후 변경하면 절대 안됨

> JAVA

```

Member member = new Member();
System.out.println(member.getOrders().getClass());
em.persist(member);
System.out.println(member.getOrders().getClass());

//출력결과 
class java.util.ArrayList
class org.hibernate.collection.internal.PersistentBag

```

> JPA에서 컬렉션을 JPA에서 추적할 수 있는 객체로 변경합니다.

> JPA가 기껏 컬렉션을 PersistentBag으로 변환 했는데, set을 통해 새로 객체를 생성한다면 Hibernate가 원하는 메커니즘으로 동작 못하게 됩니다.

> 그렇기 때문에 최초 객체를 생성해서 컬렉션을 생성하면, 변경하면 안됩니다. 


### 테이블, 컬럼명 생성 전략
--------------
> 스프링 부트에서 하이버네이트 기본 매핑 전략을 변경해서 실제 테이블 필드명은 다름

> - <a href="https://docs.spring.io/spring-boot/docs/2.1.3.RELEASE/reference/htmlsingle/#howto-configure-hibernate-naming-strategy">https://docs.spring.io/spring-boot/docs/2.1.3.RELEASE/reference/htmlsingle/#howto-configure-hibernate-naming-strategy</a>
> - <a href="https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html">https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html</a>


#### 하이버네이트 기존 구현
> 엔티티의 필드명을 그대로 테이블 명으로 사용되었지만, 아래와 같은 방식으로 변경 되었습니다.


#### 스프링부트 기본 네이밍 전략

```
'SpringPhysicalNamingStrategy'
```

> 스프링 부트 신규 설정(엔티티(필드) -> 테이블(컬럼))
>	1. 카멜 케이스 -> 언더스코어(memberPoint -> member_point)
>	2. .(점) -> _(언더스코어)
>	3. 대문자 -> 소문자


> 예를 들면

> Order.java

```
// order_date
private LocalDateTime orderDate; //주문시간
```

![contact](/images/develop/backend/using-springboot-jpa/entity-class-development/img-002.png)

> 카멜케이스를 언더스코어 방식으로 변경하는 것을 알 수 있습니다. 

> H2 DB에서 컬럼이 대문자로 보이지만, 소문자로 컬럼을 사용 가능합니다. <code>SELECT order_date FROM ORDERS</code>


#### 적용 2단계(설정)

> 1. 논리명 생성 : 명시적으로 컬럼, 테이블명을 직접 적지 않으면 ImplicitNamingStrategy 사

```
'spring.jpa.hibernate.naming.implicit-strategy' //테이블이나, 컬럼명을 명시 하지 않을 때 논리명 적용
```

> 2. 물리명 적용 :

```
'spring.jpa.hibernate.naming.physical-strategy' //모든 논리명에 적용됨, 실제 테이블에 적용(username -> usernm 등으로 회사 룰로 바꿀 수 있음)
```

#### 스프링 부트 기본 설정
```
'spring.jpa.hibernate.naming.implicit-strategy : org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamimgStrategy'

'spring.jpa.hibernate.naming.physical-strategy : org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamimgStrategy'
```

### 영속화 전파 (Cascade)
--------------

> Order.java  - cascade = CascadeType.ALL 추가

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

    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;


    // mappedBy 연관관계의 주인인 OrderItem의 order로 매핑 되어있다는 뜻
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();


    // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)  
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private LocalDateTime orderDate; //주문시간

    @Enumerated(EnumType.STRING) // EnumType.ORDINAL(숫자라 순서바뀌면 큰일)이 기본이지만 무조건 EnumType.STRING(문자 코드)
    private OrderStatus status; // 주문상태 [ORDER, CANCEL]
}

```

> Order를 저장(.persist())할때, orderItems를 따로 저장해줘야 하는데 Cascade를 추가해 같이 저장시킬 수 있다.

> 예를들어 orderItemA,B,C 를 가지는 order를 저장 시 

```
persist(orderItemA)
persist(orderItemB)
persist(orderItemC)

persist(order)

```

> 각각의 객체들을 저장해 줘야 하지만, 

> Cascade를 적용했다면

```
//persist(orderItemA)
//persist(orderItemB)
//persist(orderItemC)

persist(order)

```

> order에 저장되는 각각의 orderItemA,B,C를 persist 안해도 persist를 전파(cascade) 합니다.



### 연관관계 편의 메서드
--------------

> 양방향 연관관계를 세팅하려고 하면

> 예를 들어 Member가 Order를 추가 하게 되면 member.orders 추가해 줘야합니다.

> Java

```
public static void main(String[] args){
	Member member = new Member();
	Order order = new Order();
	
	member.getOrders().add(order); //orders 컬렉션에 order 추가
	order.setMember(member); // order에 member 추가
}

```

> 위와 같이 양쪽다 세팅을 해줘야 합니다. 하지만 개발을 하다보면, 한쪽을 빼먹고 안넣는 경우가 발생 할 수 있습니다. 

> 그래서 연관관계 편의 메서드를 추가해 2개를 같이 세팅하는 메서드를 만들어 제공하면 휴먼 에러를 줄일 수 있습니다.


> Order.java - 연관관계 편의 메서드 추가

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

    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;


    // mappedBy 연관관계의 주인인 OrderItem의 order로 매핑 되어있다는 뜻
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();


    // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private LocalDateTime orderDate; //주문시간

    @Enumerated(EnumType.STRING) // EnumType.ORDINAL(숫자라 순서바뀌면 큰일)이 기본이지만 무조건 EnumType.STRING(문자 코드)
    private OrderStatus status; // 주문상태 [ORDER, CANCEL]


    //==연관관계 메서드 (양방향 연관관계시 추가)==//
    public void setMember(Member member){
        this.member = member;
        member.getOrders().add(this);
    }

    public void addOrderItem(OrderItem orderItem){
        this.orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void setDelivery(Delivery delivery){
        this.delivery = delivery;
        delivery.setOrder(this);
    }


}

```

> Category.java

```
package jpabook.jpashop.domain;

import jpabook.jpashop.domain.item.Item;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Category {

    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(name = "category_item"
            , joinColumns = @JoinColumn(name = "category_id")
            , inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> child = new ArrayList<>();

    //==연관관계 메서드 (양방향 연관관계시 추가)==//
    public void addChildCategory(Category child){
        this.child.add(child);
        child.setParent(this);
    }
}

```


> 여기까지 세팅은 어느정도 된것 같고 다음 강의 부터는 실제 요구사항을 보며 비즈니스 서비스를 개발해보도록 하겠습니다.




#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
