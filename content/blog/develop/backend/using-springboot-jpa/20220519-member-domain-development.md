---
title: "[스프링부트 JPA 활용] 구현 요구사항"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-05-17
slug: "member-domain-development"
description: "[스프링부트 JPA 활용] 구현 요구사항"
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 애플리케이션 구현 준비
-------------------------------

## 목차
-------------------------------
> 1. 구현 요구사항
> 2. 애플리케이션 아키텍쳐

## 구현 요구사항
----------------------------------

> 이번에는 애플리케이션을 어떻게 구현할지에 대한 구현 요구사항이랑 애플리케이션 아키텍처에 대하여 정리하겠습니다.

> 도메인 설계가 다 끝났는데, 그것은 데이터 적인 설계였고 이번에는 어디까지 구현할지 범위에 대한 요구사항을 정리해 보도록 하겠습니다.

![contact](/images/develop/backend/using-springboot-jpa/requirement-analysis/img-001.png)


> - 회원 기능
> 	- 회원 등록
> 	- 회원 조회
> - 상품 기능
> 	- 상품 등록
> 	- 상품 수정
> 	- 상품 조회
> - 주문 기능
> 	- 상품 주문
> 	- 주문 내역 조회
> 	- 주문 취소

### 회원 기능
--------------------------------

#### 회원 등록

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-001.png)

> - 회원 등록하는 페이지이며, 비지니스 메서드를 통해 회원등록 구현 되어야 합니다.


#### 회원 조회

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-002.png)

> - 등록된 회원을 조회하고 화면에 리스트로 뿌려줘야 합니다.


### 회원 기능
--------------------------------

#### 상품 등록

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-003.png)

> - 상품을 등록하고 수정할 수 있어야 합니다. 
> - 상품종류를 선택하여, 각각의 상품을 등록할 수 있어야 합니다.

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-004.png)

> - 등록된 상품을 조회할 수 있어야 합니다. 
> - 수정버튼을 눌러 상품을 수정할 수 있습니다. 



### 주문 기능
--------------------------------


#### 상품 주문

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-005.png)

> - 등록된 회원과 재고가 있는 상품을 선택 후 주문수량을 입력해 주문을 등록합니다.
> - 주문 수량은 재고보다 많으면 안됩니다.
> - 주문수량이 적절하면 주문이 됩니다.


#### 주문 내역 조회

![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-006.png)

> - 주문을 하면 주문 내역에 리스트 형태로 조회가 됩니다.

#### 주문 취소
> - 주문을 하면, 주문한 물품 갯수에 따라 상품 재고가 줄어듭니다. 
> - 취소를 하면 주문한 상품의 재고가 다시 늘어납니다.

#### 검색 
> - 조건에 따라 조회가 가능합니다.


![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-007.png)



### 기능구현 제외 
------------------------------------------
> 선택과 집중을 하기 위하여 강좌에서 예제를 단순화 하여 다음 기능은 구현하지 않습니다. 

> - 로그인과 권한 관리 X
> - 파라미터 검증과 예외 처리 단순화
> - 상품은 도서만 사용
> - 카테고리는 사용 X
> - 배송 정보는 사용 X

> 강좌를 정리하고 추가적으로 공부할 여력이 된다면 추가 하도록 하겠습니다.


## 애플리케이션 아키텍처
----------------------------------
![contact](/images/develop/backend/using-springboot-jpa/preparing-for-application-implementation/img-008.png)

### 계층형 구조
----------------------------------
> Controller를 통해 Service, Repository를 거처 DB에 접근하지만, Controller에서 Repository를 바로 접근하여 DB에 접근할 수 있게 유연하게 개발하도록 하겠습니다.

> - controller, web : 웹 계층
> - service : 비즈니스 로직, 트랜잭션 처리
> - repository : JPA를 직접 사용하는 계층, 엔티티 매니저 사용
> - domain : 엔티티가 모여있는 계층, 모든 계층에서 사용

### 계층형 구조
----------------------------------
> - controller, web : 웹 계층
> - service : 비즈니스 로직, 트랜잭션 처리
> - repository : JPA를 직접 사용하는 계층, 엔티티 매니저 사용
> - domain : 엔티티가 모여있는 계층, 모든 계층에서 사용

### 패키지 구조
----------------------------------
> - jpabook.jpashop
>	- domain
>	- exection
>	- repository
>	- service
>	- web

### 개발 순서
----------------------------------
> 1. 서비스, 리포지토리 계층을 개발
> 2. 테스트 케이스를 작성 및 검증
> 3. 웹 계층 적용

### 목차
----------------------------------
> 1. 회원 도메인 개발
>	- 회원 리포지토리 개발
>	- 회원 서비스 개발
>	- 기능 테스트
> 2. 상품 도메인 개발
>	- 상품 엔티티개발(비즈니스 로직추가)
>	- 상품 리포지토리 개발
>	- 상품 서비스 개발
> 3. 주문 도메인 개발
>	- 주문, 주문상품 엔티티 개발
>	- 주문 리포지토리 개발
>	- 주문 서비스 개발
> 4. 웹 계층 개발
>	- 홈 화면과 레이아웃
>	- 회원 등록
>	- 회원 목록 조회
>	- 상품 등록
>	- 상품 목록
>	- 상품 수정
>	- 변경 감지와 병함(merge)
>	- 상품 주문
>	- 주문 목록 검색, 취소
> 5. API 개발 기본
>	- 회원 등록 API
>	- 회원 수정 API
>	- 회원 조회 API
> 6. API 개발 고급
>	- 조회용 샘플 데이터 입력
>	- 지연 로딩과 조회 성능 최적화
>	- 페이징과 한계 돌파
>	- OSIV와 성능 최적화
> 7. 다음으로
>	- 스프링 데이터 JPA 소개
>	- QueryDSL 소개
>	- 마무리







### 이전 소스
---------------------

> java/jpabook/jpashop/domain/Member.java

<details title="펼치기/숨기기">
 	<summary> Member.java </summary>

	package jpabook.jpashop.domain;
	
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	@Getter @Setter
	public class Member {
	
	    public Member() {
	    }
	
	    @Id @GeneratedValue
	    @Column(name = "member_id")
	    private Long id;
	
	    private String name;
	
	    @Embedded
	    private Address address;
	
	
	    @OneToMany(mappedBy = "member")
	    private List<Order> orders = new ArrayList<>();
	
	}

	
</details>


> java/jpabook/jpashop/domain/Address.java


<details title="펼치기/숨기기">
 	<summary> Address.java </summary>
 
	package jpabook.jpashop.domain;

	import lombok.Getter;
	
	import javax.persistence.Embeddable;
	
	@Embeddable
	@Getter
	public class Address {
	
	    private String city;
	    private String street;
	    private String zipcode;
	
	    protected Address(){
	    }
	
	    public Address(String city, String street, String zipcode){
	        this.city = city;
	        this.street = street;
	        this.zipcode = zipcode;
	    }
	
	}

 	
</details> 	


> java/jpabook/jpashop/domain/Order.java

<details title="펼치기/숨기기">
 	<summary> Order.java </summary>
 	
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

 	
</details> 


> java/jpabook/jpashop/domain/OrderItem.java

<details title="펼치기/숨기기">
 	<summary> OrderItem.java </summary>

	package jpabook.jpashop.domain;

	import jpabook.jpashop.domain.item.Item;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.*;
	
	@Entity
	@Getter @Setter
	public class OrderItem {
	
	    @Id @GeneratedValue
	    @Column(name = "order_item_id")
	    private Long id;
	
	    @ManyToOne(fetch = FetchType.LAZY) // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
	    @JoinColumn(name = "item_id")
	    private Item item;
	
	    @ManyToOne(fetch = FetchType.LAZY) // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
	    @JoinColumn(name = "order_id")
	    private Order order;
	
	    private int orderPrice; //주문 당시의 가격
	    private int count; //주문 수량
	}

</details> 



> java/jpabook/jpashop/domain/OrderStatus.java


<details title="펼치기/숨기기">
 	<summary> OrderStatus.java </summary>
 	
	package jpabook.jpashop.domain;

	import jpabook.jpashop.domain.item.Item;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.*;
	
	@Entity
	@Getter @Setter
	public class OrderItem {
	
	    @Id @GeneratedValue
	    @Column(name = "order_item_id")
	    private Long id;
	
	    @ManyToOne(fetch = FetchType.LAZY) // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
	    @JoinColumn(name = "item_id")
	    private Item item;
	
	    @ManyToOne(fetch = FetchType.LAZY) // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
	    @JoinColumn(name = "order_id")
	    private Order order;
	
	    private int orderPrice; //주문 당시의 가격
	    private int count; //주문 수량
	}

</details> 
 	

> java/jpabook/jpashop/domain/Delivery.java

<details title="펼치기/숨기기">
 	<summary> Delivery.java </summary>

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
	
	    @OneToOne(fetch = FetchType.LAZY  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
	            , mappedBy = "delivery")
	    private Order order;
	
	    @Embedded
	    private Address address;
	
	    @Enumerated(EnumType.STRING)
	    private DeliveryStatus status; //READY, COMP
	
	}

</details> 


> java/jpabook/jpashop/domain/item/Item.java

<details title="펼치기/숨기기">
 	<summary> Item.java </summary>

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


</details> 


> java/jpabook/jpashop/domain/item/Album.java

<details title="펼치기/숨기기">
 	<summary> Album.java </summary>

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



</details> 


> java/jpabook/jpashop/domain/item/Book.java

<details title="펼치기/숨기기">
 	<summary> Book.java </summary>

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


</details> 


> java/jpabook/jpashop/domain/item/Movie.java

<details title="펼치기/숨기기">
 	<summary> Movie.java </summary>

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


</details> 


> java/jpabook/jpashop/domain/Category.java

<details title="펼치기/숨기기">
 	<summary> Category.java </summary>

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



</details> 





#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
