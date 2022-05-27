---
title: "[스프링부트 JPA 활용] 회원 기능 테스트"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-05-27
slug: "member-logic-test-code"
description: "[스프링부트 JPA 활용] 회원 기능 테스트"
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

## 회원 기능 테스트
---------------------------

### 테스트 요구사항
-----------------------------
> - 회원가입을 성공해야한다.
> - 회원가입 할 때 같은 이름이 있으면 예외가 발생해야 한다.


### 테스트 코드 작성
-----------------------------
> MemberService에서 Intelij IDEA의 단축키 Ctrl + Shift + T 
(이클립스 스타일 시 go to Test 단축키 변경)

![contact](/images/develop/backend/using-springboot-jpa/member-logic-test-code/img-001.png)

![contact](/images/develop/backend/using-springboot-jpa/member-logic-test-code/img-002.png)

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



#### 회원가입 테스트

> java/jpabook/jpashop/service/MemberServiceTest.java

```
package jpabook.jpashop.service;

import static org.junit.jupiter.api.Assertions.*;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.repository.MemberRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

//@RunWith(SpringRunner.class) //Unit4 전용
@ExtendWith(SpringExtension.class) //Unit5 이후 사용
@SpringBootTest
@Transactional
class MemberServiceTest {
    
    @Autowired MemberService memberService; // 테스트 케이스에서는 다른곳에서 참조할 곳이 없으므로 @Autowired로 사용
    @Autowired MemberRepository memberRepository; // 테스트 케이스에서는 다른곳에서 참조할 곳이 없으므로 @Autowired로 사용

    @Test
    public void 회원가입() throws Exception{
        //given //given : 이렇게 주어졌을때
        Member member = new Member();
        member.setName("userA");
        
        //when //when : 이렇게 하면
        Long savedId = memberService.join(member);

        //then //then : 이렇게 된다.
        // JPA안에서 하나의 트랜잭션에서 같은 엔티티에서 PK 키가 같으면 같은 영속성 컨텍스트 1차 캐시로 같은 객체로 관리
        assertEquals(member, memberRepository.findOne(savedId));
    }
    
}
```

> console 

```
...
...

2022-05-27 23:28:38.297  INFO 1724 --- [    Test worker] j.jpashop.service.MemberServiceTest      : Started MemberServiceTest in 5.799 seconds (JVM running for 8.277)
2022-05-27 23:28:38.455  INFO 1724 --- [    Test worker] o.s.t.c.transaction.TransactionContext   : Began transaction (1) for test context [DefaultTestContext@1deb2c43 testClass = MemberServiceTest, testInstance = jpabook.jpashop.service.MemberServiceTest@8aafd70, testMethod = 회원가입@MemberServiceTest, testException = [null], mergedContextConfiguration = [WebMergedContextConfiguration@3bb9efbc testClass = MemberServiceTest, locations = '{}', classes = '{class jpabook.jpashop.JpashopApplication}', contextInitializerClasses = '[]', activeProfiles = '{}', propertySourceLocations = '{}', propertySourceProperties = '{org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true}', contextCustomizers = set[org.springframework.boot.test.autoconfigure.actuate.metrics.MetricsExportContextCustomizerFactory$DisableMetricExportContextCustomizer@7756c3cd, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@0, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizerFactory$Customizer@328cf0e1, org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@183e8023, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@67ab1c47, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@14b030a0, org.springframework.boot.test.context.SpringBootTestArgs@1, org.springframework.boot.test.context.SpringBootTestWebEnvironment@30b6ffe0], resourceBasePath = 'src/main/webapp', contextLoader = 'org.springframework.boot.test.context.SpringBootContextLoader', parent = [null]], attributes = map['org.springframework.test.context.web.ServletTestExecutionListener.activateListener' -> true, 'org.springframework.test.context.web.ServletTestExecutionListener.populatedRequestContextHolder' -> true, 'org.springframework.test.context.web.ServletTestExecutionListener.resetRequestContextHolder' -> true, 'org.springframework.test.context.event.ApplicationEventsTestExecutionListener.recordApplicationEvents' -> false]]; transaction manager [org.springframework.orm.jpa.JpaTransactionManager@3986b9e9]; rollback [true]
2022-05-27 23:28:38.809 DEBUG 1724 --- [    Test worker] org.hibernate.SQL                        : 
    select
        member0_.member_id as member_i1_4_,
        member0_.city as city2_4_,
        member0_.street as street3_4_,
        member0_.zipcode as zipcode4_4_,
        member0_.name as name5_4_ 
    from
        member member0_ 
    where
        member0_.name=?
2022-05-27 23:28:38.818 TRACE 1724 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [userA]
2022-05-27 23:28:38.828  INFO 1724 --- [    Test worker] p6spy                                    : #1653661718828 | took 7ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name=?
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name='userA';
2022-05-27 23:28:38.843 DEBUG 1724 --- [    Test worker] org.hibernate.SQL                        : 
    call next value for hibernate_sequence
2022-05-27 23:28:38.845  INFO 1724 --- [    Test worker] p6spy                                    : #1653661718845 | took 1ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
call next value for hibernate_sequence
call next value for hibernate_sequence;
2022-05-27 23:28:38.909  INFO 1724 --- [    Test worker] p6spy                                    : #1653661718909 | took 0ms | rollback | connection 3| url jdbc:h2:tcp://localhost/~/jpashop

...
...

BUILD SUCCESSFUL in 11s
4 actionable tasks: 2 executed, 2 up-to-date
오후 11:28:39: 작업 실행이 완료되었습니다 ':test --tests "jpabook.jpashop.service.MemberServiceTest"'.

```

> 신기한 것은 Insert Query가 없는데 JPA에서는  memberRepository.save(member); 까지 하여도 
> em.persist() 까지 한 상태이고 flush() 가 되어야 Insert SQL이 수행됩니다.

> Transaction Commit이 발생되어야 flush()가 수행되는데, <br>
> @Transactional은 기본적으로 RollBack을 합니다.

> 그래도 DB에 Insert 되는 것까지 보고싶다 하면 @Rollback(value = false)을 추가합니다.

> MemberServiceTest.java

```
@Test
    @Rollback(value = false)
    public void 회원가입() throws Exception{
        //given //given : 이렇게 주어졌을때
        Member member = new Member();
        member.setName("userA");
        
        //when //when : 이렇게 하면
        Long savedId = memberService.join(member);

        //then //then : 이렇게 된다.
        // JPA안에서 하나의 트랜잭션에서 같은 엔티티에서 PK 키가 같으면 같은 영속성 컨텍스트 1차 캐시로 같은 객체로 관리
        assertEquals(member, memberRepository.findOne(savedId));
```

> console 

```
...
...

    select
        member0_.member_id as member_i1_4_,
        member0_.city as city2_4_,
        member0_.street as street3_4_,
        member0_.zipcode as zipcode4_4_,
        member0_.name as name5_4_ 
    from
        member member0_ 
    where
        member0_.name=?
2022-05-27 23:41:33.726 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [userA]
2022-05-27 23:41:33.735  INFO 3504 --- [    Test worker] p6spy                                    : #1653662493735 | took 6ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name=?
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name='userA';
2022-05-27 23:41:33.748 DEBUG 3504 --- [    Test worker] org.hibernate.SQL                        : 
    call next value for hibernate_sequence
2022-05-27 23:41:33.749  INFO 3504 --- [    Test worker] p6spy                                    : #1653662493749 | took 0ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
call next value for hibernate_sequence
call next value for hibernate_sequence;
2022-05-27 23:41:33.816 DEBUG 3504 --- [    Test worker] org.hibernate.SQL                        : 
    insert 
    into
        member
        (city, street, zipcode, name, member_id) 
    values
        (?, ?, ?, ?, ?)
2022-05-27 23:41:33.817 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [null]
2022-05-27 23:41:33.818 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [VARCHAR] - [null]
2022-05-27 23:41:33.818 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [3] as [VARCHAR] - [null]
2022-05-27 23:41:33.818 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [4] as [VARCHAR] - [userA]
2022-05-27 23:41:33.819 TRACE 3504 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [5] as [BIGINT] - [1]
2022-05-27 23:41:33.821  INFO 3504 --- [    Test worker] p6spy                                    : #1653662493821 | took 0ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
insert into member (city, street, zipcode, name, member_id) values (?, ?, ?, ?, ?)
insert into member (city, street, zipcode, name, member_id) values (NULL, NULL, NULL, 'userA', 1);
...
...
```

> 또한 @Rollback(value = false) 옵션을 사용하지 않고도 <br>
> @Autowired EntityManager em; 를 추가하고 em.flush();으로 같은 효과를 볼 수 있습니다.


```
...
...
@ExtendWith(SpringExtension.class) //Unit5 이후 사용
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

}

...
...
```

> console

```
2022-05-27 23:47:07.462 DEBUG 5664 --- [    Test worker] org.hibernate.SQL                        : 
    select
        member0_.member_id as member_i1_4_,
        member0_.city as city2_4_,
        member0_.street as street3_4_,
        member0_.zipcode as zipcode4_4_,
        member0_.name as name5_4_ 
    from
        member member0_ 
    where
        member0_.name=?
2022-05-27 23:47:07.462 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [userA]
2022-05-27 23:47:07.477  INFO 5664 --- [    Test worker] p6spy                                    : #1653662827477 | took 6ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name=?
select member0_.member_id as member_i1_4_, member0_.city as city2_4_, member0_.street as street3_4_, member0_.zipcode as zipcode4_4_, member0_.name as name5_4_ from member member0_ where member0_.name='userA';
2022-05-27 23:47:07.486 DEBUG 5664 --- [    Test worker] org.hibernate.SQL                        : 
    call next value for hibernate_sequence
2022-05-27 23:47:07.493  INFO 5664 --- [    Test worker] p6spy                                    : #1653662827493 | took 0ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
call next value for hibernate_sequence
call next value for hibernate_sequence;
2022-05-27 23:47:07.540 DEBUG 5664 --- [    Test worker] org.hibernate.SQL                        : 
    insert 
    into
        member
        (city, street, zipcode, name, member_id) 
    values
        (?, ?, ?, ?, ?)
2022-05-27 23:47:07.540 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [null]
2022-05-27 23:47:07.540 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [2] as [VARCHAR] - [null]
2022-05-27 23:47:07.540 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [3] as [VARCHAR] - [null]
2022-05-27 23:47:07.540 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [4] as [VARCHAR] - [userA]
2022-05-27 23:47:07.540 TRACE 5664 --- [    Test worker] o.h.type.descriptor.sql.BasicBinder      : binding parameter [5] as [BIGINT] - [1]
2022-05-27 23:47:07.540  INFO 5664 --- [    Test worker] p6spy                                    : #1653662827540 | took 0ms | statement | connection 3| url jdbc:h2:tcp://localhost/~/jpashop
insert into member (city, street, zipcode, name, member_id) values (?, ?, ?, ?, ?)
insert into member (city, street, zipcode, name, member_id) values (NULL, NULL, NULL, 'userA', 1);
2022-05-27 23:47:07.571  INFO 5664 --- [    Test worker] p6spy                                    : #1653662827571 | took 0ms | rollback | connection 3| url jdbc:h2:tcp://localhost/~/jpashop

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

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
