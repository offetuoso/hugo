---
title: "[스프링부트 JPA 활용] 회원 서비스 개발"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-05-20
slug: "member-service-development"
description: "[스프링부트 JPA 활용] 회원 서비스 개발"
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 애플리케이션 구현
-------------------------------

## 목차
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

## 회원 서비스 개발
---------------------------

#### 서비스 디렉토리 생성
> java/jpabook/jpashop/service 위치에 리포지토리 경로 생성

![contact](/images/develop/backend/using-springboot-jpa/member-service-development/img-001.png)

### 회원 서비스 생성

> java/jpabook/jpashop/service/MemberService.java

```
package jpabook.jpashop.service;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    /**
     * 회원 가입
     */
    public Long join(Member member){
        validateDuplicateMember(member); //중복 회원 검증
        memberRepository.save(member);
        return member.getId(); //save()를 통해 em.persist()를 수행하므로 Member 엔티티의 키 생성을 보장함
    }

    private void validateDuplicateMember(Member member) {
        List<Member> findMembers = memberRepository.findByName(member.getName());
        if(findMembers.size() != 0){
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }

    }

    /**
     * 회원 전체 조회
     */
    public List<Member> findMembers(){
        return memberRepository.findAll();
    }

    /**
     * 회원 조회
     */
    public Member findOne(Long memberId){
        return memberRepository.findOne(memberId);
    }
}

```


#### @Component-scan

> 기존에 오래된 버전의 스프링으로 프로젝트를 진행했을때, 가장 어려운 점이 XML을 이용한 설정이였고, 그중에 생성한 Java 파일들이 Bean으로 사용할 수 있도록 각각 추가하여 설정하는 부분이 있었습니다. 

> component-scan은 이러한 일련의 작업을 드라마틱하게 줄여주는 기능입니다.

> component-scan의 대상으로는 




component-scan이란, 우리가 스프링에서 위의 이미지와 같은 어노테이션을 클래스에 함께 선언하게 되면 스프링이 자동으로 해당 어노테이션이 붙은 클래스들을 스캔하여 bean으로서 생성해주는 것을 가능하게 해주는 설정이다. 





#### @Component

#### @Service 
> @Controller, @Service, @Repository 모두 @Component를 상속 받으며, 
비즈니스 로직에 (*Service.java) @Service 어노테이션을 추가하면, 컴포넌트 스캔에 의해서 자동으로 스프링 빈으로 관리가 되게 됩니다.

> - 비즈니스 로직이나 리포지토리 layer 호출하는 함수에 사용
> - 다른 어노테이션과 다르게 @Component에 추가된 기능은 없음
> - 비즈니스 로직에 @Service 어노테이션을 추가해야 나중에 추가적인 exception handling을 해줄 수도 있음


#### @Repository

이것은 Annotation based Configuration, @Repository의 작업은 플랫폼 별 예외를 잡아서 Spring의 통합 검사되지 않은 예외 중 하나로 다시 던지는 것입니다. 이를 위해 PersistenceExceptionTranslationPostProcessor이 제공되며 다음과 같이 Spring의 애플리케이션 컨텍스트에 추가해야합니다.


4.10.1 @Component와 스테레오타입(stereotype) 어노테이션
스프링 2.0 이상의 버전에서 @Repository 어노테이션은 어떤 클래스가 그 역할을 충족시켰거나 레파지토리의 stereotype (또는 데이터 접근계층이나 DAO로 알려진)이라는 표시이다. 이 표시의 사용은 Section 14.2.2, “Exception translation”에서 설명했듯이 예외의 자동 변환이다.

스프링 2.5에 도입된 스테레오타입 어노테이션: @Component, @Service, @Controller. @Component 는 스프링이 관리하는 모든 컴포넌트에 대한 제너릭 스테레오타입이다. @Repository, @Service, @Controller는 더 특정한 유즈케이스에 대한 @Component의 특수한 형태이다. 예를 들어 퍼시스턴스, 서비스, 프리젠테이션 계층에서 각각 사용한다. 그러므로 컴포넌트 클래스에 @Component 어노테이션을 붙힐 수도 있지만 대신 @Repository, @Service, @Controller 어노테이션을 붙힘으로써 클래스들이 도구가 처리하는데 더 적합하도록 할 수 있고 관점에 더 연관성이 있게 한 수 있다. 예를 들어 이러한 스테레오타입 어노테이션은 포인트컷에 대한 이상적인 타겟을 만든다. 또한 @Repository, @Service, @Controller는 스프링 프레임웍의 차기 릴리즈버전에서 추가적인 의미가 생길 가능성도 있다. 그래서 서비스계층에 @Component나 @Service 중에서 어느 것을 사용할기 선택해야 한다면 @Service가 명확하게 더 나은 선택이다. 비슷하게 앞에서 얘기했듯이 @Repository는 퍼시스턴스 계층에서 자동 예외변환에 대한 표시로서 이미 지원된다.







#### 



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


> java/jpabook/jpashop/repository/MemberRepository.java

<details title="펼치기/숨기기">
 	<summary> MemberRepository.java </summary>

	package jpabook.jpashop.repository;
	
	import jpabook.jpashop.domain.Member;
	import org.springframework.stereotype.Repository;
	
	import javax.persistence.EntityManager;
	import javax.persistence.PersistenceContext;
	import javax.persistence.TypedQuery;
	import java.util.List;
	
	@Repository
	public class MemberRepository {
	
	    @PersistenceContext
	    private EntityManager em;
	
	    public void save(Member member){
	        em.persist(member);
	    }
	
	    public Member findOne(Long id){
	        return em.find(Member.class, id);
	    }
	
	    public List<Member> findAll(){
	
	        return em.createQuery("select m from Member m", Member.class)
	                .getResultList();
	    }
	
	    public List<Member> findByName(String name){
	        return em.createQuery("select m from Member m where m.name = :name", Member.class)
	                .setParameter("name",name).getResultList();
	    }
	
	}

</details> 


#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
