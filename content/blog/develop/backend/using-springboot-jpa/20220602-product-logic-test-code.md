---
title: "[스프링부트 JPA 활용] 상품 서비스 개발"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-06-02
slug: "product-logic-test-code"
description: "[스프링부트 JPA 활용] 상품 서비스 개발"
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

## 상품 기능 테스트
---------------------------


### 테스트 요구사항
---------------------------
> - 상품등록을 성공해야한다.
> - 음반, 책, 영화 각각 저장하여 성공하여야한다.


### 테스트 코드 작성
-----------------------------
> ItemService에서 Intelij IDEA의 단축키 Ctrl + Shift + T 
(이클립스 스타일 시 go to Test 단축키 변경)

> 생성된것을 확인 

> 이전에 생성한 tdd + Tab (라이브 템플릿) 사용

> tdd + Tab (라이브 템플릿)

```
@Test
    public void 회원가입() throws Exception{
        //given 
        
        //when 

        //then 
    }
```

> - given : 이렇게 주어졌을때
> - when : 이렇게 하면
> - then : 이렇게 된다.


> 아래 링크 참조

> <a href="https://offetuoso.github.io/blog/develop/backend/using-springboot-jpa/jpa-start/#%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%BD%94%EB%93%9C">[스프링부트 JPA 활용] JPA 동작확인</a>



#### 상품등록 테스트
> 상품은 Album, Book, Movie 3가지 종류가 있습니다. 이를 각각 저장해 저장된 엔티티객체와 DB에서 읽어온 객체를 비교해 보도록 하겠습니다.


> 음반 상품등록

```
	@Test
    public void 음반_상품등록() throws Exception{
        //given
        Item item = new Album();
        item.setName("멜론 TOP 100");
        ((Album) item).setArtist("Various Artists");
        ((Album) item).setEtc("방탄소년단 외 다수");
        item.setPrice(20000);
        item.addStock(50);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
```


> 책 상품등록

```
	@Test
    public void 책_상품등록() throws Exception{
        //given
        Item item = new Book();
        item.setName("JPA BOOK");
        ((Book) item).setAuthor("김영한");
        ((Book) item).setIsbn("11111");
        item.setPrice(15000);
        item.addStock(100);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
```


> 영화 상품등록

```
	@Test
    public void 영화_상품등록() throws Exception{
        //given
        Item item = new Movie();
        item.setName("쥬라기월드: 도미니언");
        ((Movie) item).setDirector("콜린 트레보로우");
        ((Movie) item).setActor("크리스 프랫");
        item.setPrice(15000);
        item.addStock(1000);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
```


> test/java/jpabook/jpashop/service/ItemServiceTest.java

```
package jpabook.jpashop.service;

import static org.junit.jupiter.api.Assertions.*;

import jpabook.jpashop.domain.item.Album;
import jpabook.jpashop.domain.item.Book;
import jpabook.jpashop.domain.item.Item;
import jpabook.jpashop.domain.item.Movie;
import jpabook.jpashop.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@SpringBootTest
@Transactional
class ItemServiceTest {
    // 테스트 케이스에서는 다른곳에서 참조할 곳이 없으므로 @Autowired로 사용
    @Autowired ItemRepository itemRepository;
    @Autowired ItemService itemService;
    @Autowired EntityManager em;

    @Test
    public void 음반_상품등록() throws Exception{
        //given
        Item item = new Album();
        item.setName("멜론 TOP 100");
        ((Album) item).setArtist("Various Artists");
        ((Album) item).setEtc("방탄소년단 외 다수");
        item.setPrice(20000);
        item.addStock(50);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
    
    @Test
    public void 책_상품등록() throws Exception{
        //given
        Item item = new Book();
        item.setName("JPA BOOK");
        ((Book) item).setAuthor("김영한");
        ((Book) item).setIsbn("11111");
        item.setPrice(15000);
        item.addStock(100);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
    
    @Test
    public void 영화_상품등록() throws Exception{
        //given
        Item item = new Movie();
        item.setName("쥬라기월드: 도미니언");
        ((Movie) item).setDirector("콜린 트레보로우");
        ((Movie) item).setActor("크리스 프랫");
        item.setPrice(15000);
        item.addStock(1000);

        //when
        Item savedItem = itemService.saveItem(item);

        //then
        em.flush();
        assertEquals(item, itemRepository.findOne(savedItem.getId()));
    }
}
```

> console

```
	insert 
	  into 
	  	item 
	  		(name, price, stock_quantity, author, isbn, dtype, item_id) 
	  	values 
	  		('JPA BOOK', 15000, 100, '김영한', '11111', 'B', 1);
2022-06-02 23:39:12.492  INFO 5672 --- [    Test worker] p6spy                                    : #1654180752492 | took 0ms | rollback | connection 4| url jdbc:h2:mem:1b70f279-db65-46bd-a9f3-0b1d472f66ad


	insert 
	  into 
	  	item 
	  		(name, price, stock_quantity, artist, etc, dtype, item_id) 
	  	values 
	  		('멜론 TOP 100', 20000, 50, 'Various Artists', '방탄소년단 외 다수', 'A', 2);
2022-06-02 23:39:12.524  INFO 5672 --- [    Test worker] p6spy                                    : #1654180752524 | took 0ms | rollback | connection 5| url jdbc:h2:mem:1b70f279-db65-46bd-a9f3-0b1d472f66ad


	insert 
	  into 
	  	item 
	  		(name, price, stock_quantity, actor, director, dtype, item_id) 
	  	values 
	  		('쥬라기월드: 도미니언', 15000, 1000, '크리스 프랫', '콜린 트레보로우', 'M', 3);
2022-06-02 23:39:12.540  INFO 5672 --- [    Test worker] p6spy                                    : #1654180752540 | took 0ms | rollback | connection 6| url jdbc:h2:mem:1b70f279-db65-46bd-a9f3-0b1d472f66ad

```

> 각각 dtype에 맞게 잘 저장된것을 확인 할 수 있습니다. 또한 모든 테스트가 통과된 것을 확인 할 수 있습니다.

### 이전 소스
---------------------

#### 설정

> /main/resources/application.properties

<details title="펼치기/숨기기">
 	<summary> application.properties </summary>

	spring.devtools.restart.enabled=true
	spring.devtools.restart.poll-interval=2s
	spring.devtools.restart.quiet-period=1s
	spring.thymeleaf.cache=false
	spring.jpa.properties.hibernate.format_sql=true
	
</details>

> main/resources/application.yml

<details title="펼치기/숨기기">
 	<summary> application.yml </summary>

	spring:
	  datasource:
	    url: jdbc:h2:tcp://localhost/~/jpashop; # MVCC=true H2 1.4.200 버전부터 MVCC 옵션이 제거되었습니다.
	    username: sa
	    password:
	    driver-class-name: org.h2.Driver
	  jpa:
	    hibernate:
	      ddl-auto: create-drop # 애플리케이션 동작 시점에 엔티티 재생성
	      use_sql_comments: true
	    database: h2
	
	  devtools:
	    livereload:
	      enabled: true # livereload 사용시 활성화
	    restart:
	      enabled: false #운영 에서는 제거.
	
	  thymeleaf:
	    cache: false
	
	logging:
	  level:
	    org.hibernate.SQL: debug
	    org.hibernate.type: trace #파라미터 로깅
	    org.hibernate.type.descriptor.sql: trace
	
	decorator:
	  datasource:
	    p6spy:
	      enable-logging : true
	      multiline: true
	      logging: slf4j
	
</details>

> test/resources/application.properties

<details title="펼치기/숨기기">
 	<summary> application.properties </summary>

	spring.devtools.restart.enabled=true
	spring.devtools.restart.poll-interval=2s
	spring.devtools.restart.quiet-period=1s
	spring.thymeleaf.cache=false
	spring.jpa.properties.hibernate.format_sql=true

</details> 

> test/resources/application.yml

<details title="펼치기/숨기기">
 	<summary> application.yml </summary>

	spring:
	#  datasource:
	  #    url: jdbc:h2:mem:test
	  #    username: sa
	  #    password:
	  #    driver-class-name: org.h2.Driver
	  #  jpa:
	  #    hibernate:
	  #      ddl-auto: create-drop # 애플리케이션 동작 시점에 엔티티 재생성
	  #     use_sql_comments: true
	  #   database: h2
	
	  devtools:
	    livereload:
	      enabled: true # livereload 사용시 활성화
	    restart:
	      enabled: false #운영 에서는 제거.
	
	  thymeleaf:
	    cache: false
	
	logging:
	  level:
	    org.hibernate.SQL: debug
	    org.hibernate.type: trace #파라미터 로깅
	    org.hibernate.type.descriptor.sql: trace
	
	decorator:
	  datasource:
	    p6spy:
	      enable-logging : true
	      multiline: true
	      logging: slf4j

</details> 

#### 엔티티

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
	
	import jpabook.jpashop.exception.NotEnoughStockException;
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
	
	    //==비즈니스 로직==//
	
	    /**
	     * 재고 증가
	     * @param quantity
	     */
	    public void addStock(int quantity){
	        this.stockQuantity += quantity;
	    }
	
	    /**
	     * 재고 감소
	     * @param quantity
	     */
	    public void removeStock(int quantity){
	        int restStock = this.stockQuantity - quantity;
	
	        if (restStock < 0) {
	            throw new NotEnoughStockException("need more stock");
	        }
	        this.stockQuantity = restStock;
	    }
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

#### 도메인

> java/jpabook/jpashop/repository/MemberRepository.java

<details title="펼치기/숨기기">
 	<summary> MemberRepository.java </summary>
	 
	package jpabook.jpashop.repository;
	
	import jpabook.jpashop.domain.Member;
	import lombok.RequiredArgsConstructor;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Repository;
	
	import javax.persistence.EntityManager;
	import javax.persistence.PersistenceContext;
	import javax.persistence.TypedQuery;
	import java.util.List;
	
	@Repository
	@RequiredArgsConstructor
	public class MemberRepository {
	
	    /*
	    //최초 소스이며 아래 소스로 대체
	    @PersistenceContext // EntityManager는 @PersistenceContext라는 표준 어노테이션을 통해서만 가능 (@AutoWired 불가)
	    private EntityManager em;
	    */
	
	    /*
	    //2번째 버전의 소스이며, @RequiredArgsConstructor로 대체
	    @Autowired //스프링 DATA JPA 에서 지원
	    private EntityManager em;
	
	    public MemberRepository(EntityManager em){
	        this.em = em;
	    }
	    */
	
	    private final EntityManager em;
	
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



> java/jpabook/jpashop/service/MemberService.java

<details title="펼치기/숨기기">
 	<summary> MemberService.java </summary>
	
	package jpabook.jpashop.service;
	
	import jpabook.jpashop.domain.Member;
	import jpabook.jpashop.repository.MemberRepository;
	import lombok.RequiredArgsConstructor;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;
	
	import java.util.List;
	
	
	
	@Service
	@Transactional(readOnly = true)
	@RequiredArgsConstructor  // 생성자 주입
	public class MemberService {
	
	    /*
	    // 최초 코드 이며, Setter Injection로 대체
	    @Autowired
	    private MemberRepository memberRepository;
	    */
	
	    /*
	    //Constructor Injection로 대체
	    private MemberRepository memberRepository;
	
	    public void setMemberService(MemberRepository memberRepository) { //Setter Injection
	        this.memberRepository = memberRepository;
	    }
	    */
	
	    /*
	    // @RequiredArgsConstructor로 대체
	    private final MemberRepository memberRepository;
	
	    public MemberService(MemberRepository memberRepository) { //Constructor Injection
	        this.memberRepository = memberRepository;
	    }
	    */
	
	    private final MemberRepository memberRepository;
	
	    /**
	     * 회원 가입
	     */
	    @Transactional(readOnly = false)
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
	    //@Transactional(readOnly = true)
	    public List<Member> findMembers(){
	        return memberRepository.findAll();
	    }
	
	    /**
	     * 회원 조회
	     */
	    //@Transactional(readOnly = true)
	    public Member findOne(Long memberId){
	        return memberRepository.findOne(memberId);
	    }
	
	}


</details> 

	
> java/jpabook/jpashop/repository/ItemRepository.java

<details title="펼치기/숨기기">
 	<summary> ItemRepository.java </summary>
	
	package jpabook.jpashop.repository;
	
	import jpabook.jpashop.domain.item.Item;
	import lombok.RequiredArgsConstructor;
	import org.springframework.stereotype.Repository;
	
	import javax.persistence.EntityManager;
	import java.util.List;
	
	@Repository
	@RequiredArgsConstructor
	public class ItemRepository {
	
	    private final EntityManager em;
	
	    public void save(Item item){
	        if (item.getId() == null){
	            em.persist(item);
	        }else{
	            em.merge(item);
	        }
	    }
	
	    public Item findOne(Long id){
	        return em.find(Item.class, id);
	    }
	
	    public List<Item> findAll(){
	        return em.createQuery("select i from Item i", Item.class)
	                .getResultList();
	    }
	}


</details> 


> java/jpabook/jpashop/service/ItemService.java

<details title="펼치기/숨기기">
 	<summary> ItemService.java </summary>
	
	package jpabook.jpashop.service;
	
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.repository.ItemRepository;
	import lombok.RequiredArgsConstructor;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;
	
	import java.util.List;
	
	@Service
	@Transactional(readOnly = true)
	@RequiredArgsConstructor  // 생성자 주입
	public class ItemService {
	
	    private final ItemRepository itemRepository;
	
        @Transactional
	    public Item saveItem(Item item){
	        itemRepository.save(item);
	        return item; //등록한 엔티티 정보 리턴, api response 리턴 및 test code 검증용
	    }
	
	    public List<Item> findItems(){
	        return itemRepository.findAll();
	    }
	
	    public Item findItem(Long item_id){
	        return itemRepository.findOne(item_id);
	    }
	
	}

</details> 



#### Exception

> java/jpabook/jpashop/exception/NotEnoughStockException.java

<details title="펼치기/숨기기">
 	<summary> NotEnoughStockException.java </summary>

	package jpabook.jpashop.exception;
	
	public class NotEnoughStockException extends RuntimeException{
	    public NotEnoughStockException() {
	        super();
	    }
	
	    public NotEnoughStockException(String message) {
	        super(message);
	    }
	
	    public NotEnoughStockException(String message, Throwable cause) {
	        super(message, cause);
	    }
	
	    public NotEnoughStockException(Throwable cause) {
	        super(cause);
	    }
	
	    protected NotEnoughStockException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
	        super(message, cause, enableSuppression, writableStackTrace);
	    }
	}

</details> 



#### 테스트

> test/java/jpabook/jpashop/service/MemberServiceTest.java

<details title="펼치기/숨기기">
 	<summary> MemberServiceTest.java </summary>

	package jpabook.jpashop.service;
	
	import static org.junit.jupiter.api.Assertions.*;
	
	import jpabook.jpashop.domain.Member;
	import jpabook.jpashop.repository.MemberRepository;
	import org.junit.jupiter.api.Test;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.boot.test.context.SpringBootTest;
	import org.springframework.transaction.annotation.Transactional;
	
	import javax.persistence.EntityManager;
	
	@SpringBootTest
	@Transactional
	class MemberServiceTest {
	
	    // 테스트 케이스에서는 다른곳에서 참조할 곳이 없으므로 @Autowired로 사용
	    @Autowired MemberRepository memberRepository;
	    @Autowired MemberService memberService;
	    @Autowired EntityManager em;
	
	    @Test
	    //@Rollback(value = false)
	    public void 회원가입() throws Exception{
	        //given //given : 이렇게 주어졌을때
	        Member member = new Member();
	        member.setName("userA");
	        
	        //when //when : 이렇게 하면
	        Long savedId = memberService.join(member);
	
	        //then //then : 이렇게 된다.
	        // JPA안에서 하나의 트랜잭션에서 같은 엔티티에서 PK 키가 같으면 같은 영속성 컨텍스트 1차 캐시로 같은 객체로 관리
	        em.flush();
	        assertEquals(member, memberRepository.findOne(savedId));
	    }
	
	
	    @Test
	    public void 중복_회원_예외() throws Exception{
	        //given
	
	        String username = "user";
	        Member member1 = new Member();
	        member1.setName(username);
	
	        Member member2 = new Member();
	        member2.setName(username);
	
	        //when
	        memberService.join(member1);
	
	        //then
	        IllegalStateException thrown = assertThrows(IllegalStateException.class, () -> memberService.join(member2));
	
	    }
	}

</details> 




#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
