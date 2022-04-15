---
title: "[자바 ORM 표준 JPA] JPA 실전 예제 1 - 요구사항 분석과 기본 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-26
slug: "practical-example-1"
description: "요구사항 분석과 기본 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---


# 실전 예제 1 - 요구사항 분석과 기본 매핑
-------------

## 요구사항 분석
-------------
> - 회원은 상품을 주문할 수 있다.
> - 주문 시 여러 종류의 상품을 선택할 수 있다.

### 기능 목록
-----------
> - 회원 기능
> 	-  회원등록
> 	-  회원조회

> - 상품 기능
> 	-  상품등록
> 	-  상품수정
> 	-  상품조회

> - 주문 기능
> 	-  상품주문
> 	-  주문내역조회
> 	-  주문취소

### 도메인 모델 분석
-----------
> - 회원과 주문의 관계 : 회원은 여러 번 주문할 수 있다. (1:n)

> - 주문과 상품의 관계 : 주문할 때 여러 상품을 선택할 수 있다. 반대로 같은 상픔도 여러번 주문될 수 있다. 주문상품 이라는 모델을 만들어서 다대다 관계를 일대다, 다대일 괸계로 풀어냄

![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-001.png)

### 테이블 설걔
-----------
![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-002.png)


### 엔티티 설계와 매핑
-----------
![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-003.png)


### Maven Project 생성

![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-004.png)

![contact](/images/develop/backend/orm-jpa-basic/practical-example-1/img-005.png)

> pom.xml - 수정 depency 추가

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>jpa-basic</groupId>
    <artifactId>jpa-shop</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- JPA 하이버네이트 -->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-entitymanager</artifactId>
            <version>5.3.10.Final</version>
        </dependency>
        <!-- H2 데이터베이스 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>1.4.200</version>
        </dependency>
    </dependencies>
    
</project>
```

> jpashop > src > main > resources > persistence.xml 생성

````
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="jpashop">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/jpashop"/>
            <!--
                <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL5Dialect"/>
                <property name="hibernate.dialect" value="org.hibernate.dialect.Oracle8iDialect"/>
                <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>


            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>  <!-- 실행 sql 로깅 -->
            <property name="hibernate.format_sql" value="true"/>  <!-- 실행 sql 포메팅 -->

            <!-- /* insert hellojpa.Member */ JPA가 Inser 를 해서 이 쿼리가 나왔다는 것을 주석으로 설명 -->
            <property name="hibernate.use_sql_comments" value="true"/>

            <!-- 한번에 같은 데이터 베이스에 데이터를 집어넣을때 모아서 한번에 인서트 하는 jdbc batch의 수를 지정-->
            <property name="hibernate.jdbc.batch_size" value="10"/>

            <!-- create, create-drop, update, validate, none -->
            <property name="hibernate.hbm2ddl.auto" value="create" /> 
        </properties>
    </persistence-unit>
</persistence>
```

> jpa-shop > src > java > jpabasic > jpashop > domain - 패키지 생성

> domain 패키지 안에 엔티티 추가 

> Member.java 생성

```
package jpabasic.jpashop.domain;

import javax.persistence.*;

@Entity
public class Member {

    public Member(){
    }

    @Id @GeneratedValue
    @Column(name="MEMBER_ID")
    private Long id;
    private String name;
    private String cicy;
    private String street;
    private String zipcode;

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
}


```


> Order.java

```
package jpabasic.jpashop.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "ORDERS") // DB에 따라 ORDER가 예약어일 경우가 있어 ORDERS
public class Order {
    public Order(){
    }

    @Id
    @GeneratedValue
    @Column(name="ORDER_ID")
    private Long id;

    @Column(name="MEMBER_ID")
    private Long memberId;
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
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
}


```

> OrderStatus.java

````
package jpabasic.jpashop.domain;

public enum OrderStatus {
    ORDER, CANCEL
}

````

> Item.java

```
package jpabasic.jpashop.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Item {
    public Item(){
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

> OrderItem.java

````
package jpabasic.jpashop.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class OrderItem {
    public OrderItem(){
    }

    @Id @GeneratedValue
    @Column(name = "OFDER_ITEM_ID")
    private Long id;

    @Column(name = "ORDER_ID")
    private Long orderId;

    @Column(name = "ITEM_ID")
    private Long itemId;

    private int orderPrice;
    private int count;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
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
}

````

> jpashop > src > main > java > jpabasic > jpashop > JpaMain.java 생성 

```

package jpabasic.jpashop;

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

> 애플리케이션 재시작 

```
Hibernate: 
    
    drop table Item if exists
Hibernate: 
    
    drop table Member if exists
Hibernate: 
    
    drop table OrderItem if exists
Hibernate: 
    
    drop table ORDERS if exists
Hibernate: 
    
    drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: 
    
    create table Item (
       ITEM_ID bigint not null,
        name varchar(255),
        price integer not null,
        stockQuantity integer not null,
        primary key (ITEM_ID)
    )
Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        cicy varchar(255),
        name varchar(255),
        street varchar(255),
        zipcode varchar(255),
        primary key (MEMBER_ID)
    )

Hibernate: 
    
    create table OrderItem (
       OFDER_ITEM_ID bigint not null,
        count integer not null,
        ITEM_ID bigint,
        ORDER_ID bigint,
        orderPrice integer not null,
        primary key (OFDER_ITEM_ID)
    )
Hibernate: 
    
    create table ORDERS (
       ORDER_ID bigint not null,
        MEMBER_ID bigint,
        orderDate timestamp,
        status varchar(255),
        primary key (ORDER_ID)
    )
    
Process finished with exit code 0

```

> 엔티티 매핑을 하고 이상한 점을 발견하게 되었는데 Order에서 주문한 memberId를 조회하려면 

> JpaMain.java

```
  ...
  Order order = em.find(Order.class, 1L); //오더를 찾고 
  Long memberId = order.getMemberId();	  //오더에서 memberId를 찾아서

  Member member = em.find(Member.class, memberId); //member를 찾는다. 
  ...          
```

> 뭔가 복잡하고 객체지향적이지 않습니다.


> Order.java

```
   ...
   private Member member;   
   
   public Member getMember() {
        return member;
   }
   ...
   
```

> JpaMain.java

```
  ...
  Order order = em.find(Order.class, 1L); //오더를 찾고 
  Member member = order.getMember(); //member를 찾는다. 
  Long memberId = member.getMemberId();
  ...          
```

> 이런 설계를 데이터 중심 설계라고 합니다.

### 데이터 중심 설계의 문제점
---------------------

> - 현재 방식은 객체 설계를 테이블 설계에 맞춘 방식
> - 테이블의 외래키 객체에 그대로 가져옴
> - 객체 그래프 탐색이 불가능
> - 참조가 없으므로 UML도 잘못됨

### 해결법
> 이것을 해결하기 위해 연관관계 매핑을 사용하게 됩니다.


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>