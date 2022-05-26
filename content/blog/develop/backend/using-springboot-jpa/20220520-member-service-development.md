---
title: "[스프링부트 JPA 활용] 회원 서비스 개발"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-05-26
slug: "member-service-development"
description: "[스프링부트 JPA 활용] 회원 서비스 개발"
keywords: ["ORM"]
draft: false
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
------------------------

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

### Service 기능 설명 및 성능 향상
------------------------


#### @Service 
> @Service는 아래 게시물 링크에서 설명하도록 하겠습니다.

> <a href="https://offetuoso.github.io/blog/develop/framework/spring/contoller-service-repository-annotation/">[Spring] @Controller, @Service, @Repository 어노테이션</a>



#### @Transactional
> @Transactional를 import 하려고 보면, 'org.springframework.transaction.annotation.Transactional' 과 'javax.transaction.Transactional' 2개가 있습니다. 

> springframework에서 제공하는 기능들이 더 많기 때문에 @Transactional을 사용하는 것을 권장드립니다.

> MemberService.java

```
...

import javax.transaction.Transactional;


@Service
@Transactional
public class MemberService {

...
```

> Service에 @Transactional를 걸어둘 수 있지만 서비스 내부에서 JPA를 사용할때 @Transactional 설정에 따라 성능향상을 시킬 수 있습니다.

##### @Transactional(readOnly = true) 
> 스프링 프레임워크에서 어노테이션으로 트랜잭션을 읽기 전용 모드로 설정할 수 있다. <br>
> (boolean readOnly() default false; 기본값은 false) 

> 트랜젝션에 readOnly=true 옵션을 주면 스프링 프레임워크가 하이버네이트 세션 플러시 모드를 수동(Manual)로 설정한다. <br>
> 이렇게 되면 강제로 플러시를 호출 하지 않는 이상 플러시가 일어나지 않습니다. <br>
> 따라서 트랜잭션을 커밋하더라도 영속성 컨텍스트가 플러시 되지 않아서 엔티티의 등록, 수정, 삭제가 동작하지 않으며, 읽기 전용으로 영속성 컨텍스트는 변경 감지를 위한 스냅샷을 보관하지 않기 때문에 성능향상이 됩니다. 


> readOnly=true 옵션을 사용하면 엔티티의 등록, 수정, 삭제가 동작하지 않기 때문에 기본적으로 Service를 통으로 @Transactional(readOnly = true) 으로 세팅하고, 

> 등록, 수정, 삭제가 필요한 로직에 @Transactional(readOnly = false)를 지정하면, 지정된 로직만 오버라이딩 되어 readOnly = false의 옵션을 사용할 수 있습니다.

```
package jpabook.jpashop.service;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



@Service
@Transactional(readOnly = true) // 조회 모드
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    /**
     * 회원 가입
     */
    @Transactional(readOnly = false) // 등록, 수정, 삭제 가능 트랜잭션
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
    //@Transactional(readOnly = true) // 조회 모드
    public List<Member> findMembers(){
        return memberRepository.findAll();
    }

    /**
     * 회원 조회
     */
    //@Transactional(readOnly = true) // 조회 모드
    public Member findOne(Long memberId){
        return memberRepository.findOne(memberId);
    }

}

```

#### validateDuplicateMember 
> 해당 벨리데이션 함수는 예제를 위해 추가한 로직이기 때문에 중복체크를 이름만 걸었습니다. <br>

```
...
	private void validateDuplicateMember(Member member) {
        List<Member> findMembers = memberRepository.findByName(member.getName());
        if(findMembers.size() != 0){
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }

    }
...
```

> 또한 WAS 환경 상 멀티쓰레드를 지원하기 때문에 동시에 같은 이름으로 등록을 할 경우에도 등록이 되기 때문에 <br> 
> 최후의 보루로 name 컬럼에 UNIQUE 제약 조건을 추가해 두어야 합니다.



#### @Autowired
> 해당 어노테이션은 스프링 빈에 등록된 객체를 주입(Injection) 해줍니다. 

> MemberService.java

```
...

@Service
@Transactional(readOnly = true)
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

...
```

> 위와 같은 방식을 필드 인젝션(field injection)이라 합니다. <br>
> 필드 인젝션은 강한 결합으로 @Autowired로 지정된 객체를 변경한다면 소스를 모두 수정해야하는 단점이 있습니다. <br>
> 이를 해결하기 위하여 수정자(Setter) 주입 방식으로 변경하면 됩니다. 


##### 수정자(Setter) 주입

> MemberService.java

```
...

@Service
@Transactional(readOnly = true)
public class MemberService {

    private MemberRepository memberRepository;
    
    @Autowired
    public void setMemberRepository(MemberRepository memberRepository){
    		this.memberRepository = memberRepository;
    }

...
```

> 

> 위와 같이 변경해줍니다.

> 하지만 수정자(Setter) 주입 방식에도 큰 단점이 있습니다. <br>
> setter를 이용해 최초 1회만 세팅되고 나면 수정될일이 없지만, <br>
> setMemberRepository()를 코드에서 직접 호출해 수정할 수 있는 여지가 있기 때문에 이 방법보다 더 좋은 방법이 있습니다. 

#### 생성자(Constructor) 주입

> 심지어 InteliJ IDEA에서도 경고를 통해 생성자 주입 방식으로 수정을 권고하고 있습니다. 

![contact](/images/develop/backend/using-springboot-jpa/member-service-development/img-002.png)


```
    // 생성 시점에 세팅하고 변경하지 않기 때문에 fianl로 지정하고, 컴파일 시점에 주입을 빼먹었을때도 체크를 해주기 때문에 final 키워드 추가하는 것을 권장
    private final MemberRepository memberRepository; 
    
    //@Autowired // 또한 최신의 스프링 버전 사용시 1개의 생성자는 @Autowired를 생략해도 자동으로 Autowired를 해줌 
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

```

> 생성자 주입방식을 사용하면 생성시 세팅이 되어 끝나 버리기 때문에 중간에 수정을 할 수 없습니다. 

> 또한 좋은점은 테스트케이스 작성할 때, 

```
public static void main(String[] args){
	MemberService memberService = new MemberService(Mock()); //가짜객체 주입 
}

```

> 가짜 객체를 주입하여 테스트를 할 수 도 있습니다.

> 여기에 lombok 까지 적용을 하게 된다면 !! 

#### 생성자(Constructor) 주입 lombok 적용
> - @AllArgsConstructor : 모든 필드 값을 파라미터로 받는 생성자를 만들어 줍니다.
> - @RequiredArgsConstructor : final로 지정된 필드 값을 파라미터로 받는 생성자를 만들어 줍니다.

> 물론 생성자 주입을 위한 생성자를 만들어주기 때문에, @RequiredArgsConstructor를 추가합니다.

```
...
@Service
@Transactional(readOnly = true)
@RequireArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository; 
    
    /*
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
    */

```

> 그리고 생성했던 Repository에서 

> MemberRepository.java

```
...
@Repository
public class MemberRepository {

    @PersistenceContext
    private EntityManager em;
...
```

> 추가된 EntityManager또한 생성자 주입을 할 수 있습니다.

> MemberRepository.java 

```
@Repository
@RequiredArgsConstructor // 생성자 주입
public class MemberRepository {

    /*
    //최초 소스이며 아래 소스로 대체
    @PersistenceContext
    private EntityManager em;
    */

    /*
    //2번째 버전의 소스이며, @RequiredArgsConstructor로 대체
    @Autowired //스프링 DATA 지원
    private EntityManager em;

    public MemberRepository(EntityManager em){
        this.em = em;
    }
    */

    private final EntityManager em;
```


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
