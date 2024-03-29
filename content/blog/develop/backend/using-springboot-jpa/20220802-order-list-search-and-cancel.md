---
title: "[스프링부트 JPA 활용] 주문 목록 검색 및 취소 개발"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-08-02
slug: "order-list-search-and-cancel"
description: "[스프링부트 JPA 활용] 주문 목록 검색 및 취소 개발"
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

## 홈 화면과 레이아웃 

### 주문 목록 검색 및 취소 개발
----------------------

#### 상품리스트와 상품 검색 

> OrderController.java

```
	@GetMapping("/orders")
    public String orderList(OrderSearch orderSearch, Model modal){
        log.info("call get /orderList");

		// 단순 조회가 목적이라면, 컨트롤러에서 바로 Repository로 호출해도 상관없다.
        List<Order> orders = orderService.findOrders(orderSearch);

        modal.addAttribute("orders", orders);

        return "order/orderList";
    }
```

> resources/templates/order/orderList.html

```
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head th:replace="fragments/header :: header"/>
<body>

<div class="container">

    <div th:replace="fragments/bodyHeader :: bodyHeader"/>

    <div>
        <div>
            <form th:object="${orderSearch}" class="form-inline">
                <div class="form-group mb-2">
                    <input type="text" th:field="*{memberName}" class="form-control" placeholder="회원명"/>
                </div>
                <div class="form-group mx-sm-1 mb-2">
                    <select th:field="*{orderStatus}" class="form-control">
                        <option value="">주문상태</option>
                        <option th:each="status : ${T(jpabook.jpashop.domain.OrderStatus).values()}"
                                th:value="${status}"
                                th:text="${status}">option
                        </option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary mb-2">검색</button>
            </form>
        </div>

        <table class="table table-striped">
            <thead>
            <tr>
                <th>#</th>
                <th>회원명</th>
                <th>대표상품 이름</th>
                <th>대표상품 주문가격</th>
                <th>대표상품 주문수량</th>
                <th>상태</th>
                <th>일시</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr th:each="item : ${orders}">
                <td th:text="${item.id}"></td>
                <td th:text="${item.member.name}"></td>
                <td th:text="${item.orderItems[0].item.name}"></td>
                <td th:text="${item.orderItems[0].orderPrice}"></td>
                <td th:text="${item.orderItems[0].count}"></td>
                <td th:text="${item.status}"></td>
                <td th:text="${item.orderDate}"></td>
                <td>
                    <a th:if="${item.status.name() == 'ORDER'}" href="#" th:href="'javascript:cancel('+${item.id}+')'"
                       class="btn btn-danger">CANCEL</a>
                </td>
            </tr>

            </tbody>
        </table>
    </div>

    <div th:replace="fragments/footer :: footer"/>

</div> <!-- /container -->

</body>
<script>
    function cancel(id) {
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/orders/" + id + "/cancel");

        console.log(form);

        document.body.appendChild(form);


        form.submit();
    }
</script>
</html>

```


> OrderController.java

```
	@PostMapping("/orders/{orderId}/cancel")
    public String cancelOrder(@PathVariable(name = "orderId") Long orderId){
        log.info("call get /orderList");

        orderService.cancelOrder(orderId);

        return  "redirect:/orders";
    }
```

> OrderService.java

```
    /**
     * 취소
     */
    @Transactional
    public void cancelOrder(Long orderId){
        // 주문 엔티티 조회
        Order order = orderRepository.findOne(orderId);
        // 주문 취소
        order.cancel();

    }
```
> OrderService.java

```
    /**
     * 취소
     */
    @Transactional
    public void cancelOrder(Long orderId){
        // 주문 엔티티 조회
        Order order = orderRepository.findOne(orderId);
        // 주문 취소
        order.cancel();

    }
```

> Order.java


```
    //==비즈니스 로직==//
    /**
     * 주문 취소
     */
    public void cancel(){
        // 배송이 완료된 주문은 취소가 불가
        if (delivery.getStatus() == DeliveryStatus.COMP){
            throw new IllegalStateException("이미 배송이 완료된 상품은 취소가 불가능합니다.");
        }

        this.setStatus(OrderStatus.CANCEL);

        for (OrderItem orderItem : this.orderItems){
            orderItem.cancel();
        }
    }
    
```

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
	
	import jpabook.jpashop.domain.item.Item;
	import lombok.AccessLevel;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	import javax.persistence.*;
	import java.time.LocalDateTime;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	@Getter @Setter
	@NoArgsConstructor(access = AccessLevel.PROTECTED)
	@Table(name = "orders")
	public class Order {
	
	    //protected Order() {}
	
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
	
	    //== 생성 메서드==//
	    public static Order createOrder(Member member, Delivery delivery, OrderItem... orderItems){ // OrderItem...  여러개를 넘길 수 있음
	
	        Order order = new Order();
	        order.setMember(member);
	        order.setDelivery(delivery);
	        for (OrderItem orderItem : orderItems){
	
	
	            System.out.println(
	                    orderItem
	            );
	            order.addOrderItem(orderItem);
	        }
	        order.setStatus(OrderStatus.ORDER);
	        order.setOrderDate(LocalDateTime.now());
	
	        return order;
	    }
	
	    //==비즈니스 로직==//
	    /**
	     * 주문 취소
	     */
	    public void cancel(){
	        // 배송이 완료된 주문은 취소가 불가
	        if (delivery.getStatus() == DeliveryStatus.COMP){
	            throw new IllegalStateException("이미 배송이 완료된 상품은 취소가 불가능합니다.");
	        }
	
	        this.setStatus(OrderStatus.CANCEL);
	
	        for (OrderItem orderItem : this.orderItems){
	            orderItem.cancel();
	        }
	    }
	
	
	    //==조회 로직==//
	    /**
	     * 전체 주문 가격 조회
	     */
	    public int getTotalPrice(){
	
	        /*
	        int totalPrice = 0;
	
	        for (OrderItem orderItem : this.orderItems) {
	            totalPrice += orderItem.getTotalPrice();
	        }
	
	        return totalPrice;
	        */
	
	
	        return this.orderItems.stream()
	                .mapToInt(OrderItem::getTotalPrice)
	                .sum();
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
	@NoArgsConstructor(access = AccessLevel.PROTECTED)
	public class OrderItem {
	    
	    //protected OrderItem() {} //생성자를 사용 불가로 하고 CteateOrderItem 사용 유도 //@NoArgsConstructor로 대체
	    
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
	
	
	    //==생성 메서드==//
	    public static OrderItem createOrderItem(Item item, int orderPrice, int count){ //orderPrice는 구매 당시의 가격을 받기 위함
	        OrderItem orderItem = new OrderItem();
	        orderItem.setItem(item);
	        orderItem.setOrderPrice(orderPrice);
	        orderItem.setCount(count);
	
	        item.removeStock(count);
	        return orderItem;
	    }
	
	
	    //==비즈니스 로직==//
	    /**
	     * 주문 취소
	     */
	    public void cancel() {
	        getItem().addStock(this.count);
	    }
	
	
	    //==조회 로직==//
	    /**
	     * 주문상품 전체 가격 조회
	     */
	    public int getTotalPrice() {
	        return getOrderPrice() * getCount();;
	    }
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
	
	package jpabook.jpashop.domain.item;
	
	import jpabook.jpashop.dto.ItemForm;
	import jpabook.jpashop.exception.NotEnoughStockException;
	import jpabook.jpashop.domain.Category;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
	//@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
	@DiscriminatorColumn(name = "dtype")
	@Getter @Setter
	public abstract class Item {
	
	    @Id @GeneratedValue
	    @Column(name = "item_id")
	    private Long id;
	
	    protected String name;
	    protected int price;
	    protected int stockQuantity;
	
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
	
	    public abstract Item createItem(ItemForm itemForm);
	
	}


</details> 


> java/jpabook/jpashop/domain/item/Item.java

<details title="펼치기/숨기기">
 	<summary> Item.java </summary>
	
	package jpabook.jpashop.domain.item;
	
	import jpabook.jpashop.dto.ItemForm;
	import jpabook.jpashop.exception.NotEnoughStockException;
	import jpabook.jpashop.domain.Category;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
	//@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
	@DiscriminatorColumn(name = "dtype")
	@Getter @Setter
	public abstract class Item {
	
	    protected final static String ALBUM = "음반";
	    protected final static String BOOK = "책";
	    protected final static String MOVIE = "영화";
	
	    @Id @GeneratedValue
	    @Column(name = "item_id")
	    private Long id;
	
	    protected String name;
	    protected int price;
	    protected int stockQuantity;
	
	    @Column(name="dtype", insertable = false, updatable = false)
	    protected String dtype;
	
	    public String getDtype() {
	        return dtype;
	    }
	
	    public String getDtypeNm() {
	        String dtypeNm = null;
	
	        if(dtype.equals("A")){
	            dtypeNm = Item.ALBUM;
	        }else if(dtype.equals("B")){
	            dtypeNm = Item.BOOK;
	        }else if(dtype.equals("M")){
	            dtypeNm = Item.MOVIE;
	        }
	        return dtypeNm;
	    }
	
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
	
	    public abstract Item createItem(ItemForm itemForm);
	
	    public abstract ItemForm transItemForm();
	
	    public abstract Item changeItem(ItemForm itemForm);
	
	
	
	
	    @Override
	    public String toString() {
	        return "Item{" +
	                "id=" + id +
	                ", name='" + name + '\'' +
	                ", dtype=" + dtype +
	                ", price=" + price +
	                ", stockQuantity=" + stockQuantity +
	                ", categories=" + categories +
	                '}';
	    }
	}


</details> 


> java/jpabook/jpashop/domain/item/Album.java

<details title="펼치기/숨기기">
 	<summary> Album.java </summary>
		
	package jpabook.jpashop.domain.item;
	
	import jpabook.jpashop.dto.ItemForm;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("A") //구분값 A
	@Getter //@Setter setter 지양
	public class Album extends Item{
	    private String artist;
	    private String etc;
	
	    @Override
	    public Item createItem(ItemForm itemForm) {
	        this.setId(itemForm.getId());
	        this.setName(itemForm.getName());
	        this.setPrice(itemForm.getPrice());
	        this.setStockQuantity(itemForm.getStockQuantity());
	        this.artist = itemForm.getArtist();
	        this.etc = itemForm.getEtc();
	        return this;
	    }
	
	    @Override
	    public ItemForm transItemForm() {
	        Album album = (Album) this;
	
	        ItemForm itemForm = new ItemForm();
	        itemForm.setDtype(album.getDtype());
	        itemForm.setId(album.getId());
	        itemForm.setName(album.getName());
	        itemForm.setPrice(album.getPrice());
	        itemForm.setStockQuantity(album.getStockQuantity());
	
	        itemForm.setArtist(album.getArtist());
	        itemForm.setEtc(album.getEtc());
	
	        return itemForm;
	    }
	
	    @Override
	    public Item changeItem(ItemForm itemForm) {
	        this.name = itemForm.getName();
	        this.price = itemForm.getPrice();
	        this.stockQuantity = itemForm.getStockQuantity();
	        this.artist= itemForm.getArtist();
	        this.etc = itemForm.getEtc();
	        return this;
	    }
	}

</details> 


> java/jpabook/jpashop/domain/item/Book.java

<details title="펼치기/숨기기">
 	<summary> Book.java </summary>
	
	package jpabook.jpashop.domain.item;
	
	import jpabook.jpashop.dto.ItemForm;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("B") //구분값 B
	@Getter //@Setter setter 지양
	public class Book extends Item{
	    private String author;
	    private String isbn;
	
	    @Override
	    public Item createItem(ItemForm itemForm) {
	        this.setId(itemForm.getId());
	        this.setName(itemForm.getName());
	        this.setPrice(itemForm.getPrice());
	        this.setStockQuantity(itemForm.getStockQuantity());
	        this.isbn = itemForm.getIsbn();
	        this.author = itemForm.getAuthor();
	        return this;
	    }
	
	    @Override
	    public ItemForm transItemForm() {
	        Book book = (Book) this;
	
	        ItemForm itemForm = new ItemForm();
	        itemForm.setDtype(book.getDtype());
	        itemForm.setId(book.getId());
	        itemForm.setName(book.getName());
	        itemForm.setPrice(book.getPrice());
	        itemForm.setStockQuantity(book.getStockQuantity());
	
	        itemForm.setAuthor(book.getAuthor());
	        itemForm.setIsbn(book.getIsbn());
	
	        return itemForm;
	    }
	
	    @Override
	    public Item changeItem(ItemForm itemForm) {
	        this.name = itemForm.getName();
	        this.price = itemForm.getPrice();
	        this.stockQuantity = itemForm.getStockQuantity();
	        this.author= itemForm.getAuthor();
	        this.isbn = itemForm.getIsbn();
	        return this;
	    }
	}

</details> 


> java/jpabook/jpashop/domain/item/Movie.java

<details title="펼치기/숨기기">
 	<summary> Movie.java </summary>
		
	package jpabook.jpashop.domain.item;
	
	import jpabook.jpashop.dto.ItemForm;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("M") //구분값 M
	@Getter //@Setter setter 지양
	public class Movie extends Item{
	    private String director;
	    private String actor;
	
	    @Override
	    public Item createItem(ItemForm itemForm) {
	        this.setId(itemForm.getId());
	        this.setName(itemForm.getName());
	        this.setPrice(itemForm.getPrice());
	        this.setStockQuantity(itemForm.getStockQuantity());
	        this.director = itemForm.getDirector();
	        this.actor = itemForm.getActor();
	        return this;
	    }
	
	    @Override
	    public ItemForm transItemForm() {
	        Movie movie = (Movie) this;
	        ItemForm itemForm = new ItemForm();
	        itemForm.setDtype(movie.getDtype());
	        itemForm.setId(movie.getId());
	        itemForm.setName(movie.getName());
	        itemForm.setPrice(movie.getPrice());
	        itemForm.setStockQuantity(movie.getStockQuantity());
	
	        itemForm.setDirector(movie.getDirector());
	        itemForm.setActor(movie.getActor());
	
	        return itemForm;
	    }
	
	    @Override
	    public Item changeItem(ItemForm itemForm) {
	        this.name = itemForm.getName();
	        this.price = itemForm.getPrice();
	        this.stockQuantity = itemForm.getStockQuantity();
	        this.director = itemForm.getDirector();
	        this.actor = itemForm.getActor();
	        return this;
	    }
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
	import jpabook.jpashop.dto.ItemDto;
	import lombok.RequiredArgsConstructor;
	import org.springframework.data.jpa.repository.Query;
	import org.springframework.data.repository.query.Param;
	import org.springframework.stereotype.Repository;
	
	import javax.persistence.EntityManager;
	import javax.persistence.TypedQuery;
	import java.util.List;
	
	@Repository
	@RequiredArgsConstructor
	public class ItemRepository {
	
	    private final EntityManager em;
	
	    public void save(Item item){
	        if (item.getId() == null){
	            em.persist(item);
	        }else{
	            Item merge = em.merge(item); //머지는 null도 모두 변경하기 때문에 변경감지로 사용 권장
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
	
	import jpabook.jpashop.domain.item.Album;
	import jpabook.jpashop.domain.item.Book;
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.domain.item.Movie;
	import jpabook.jpashop.dto.ItemDto;
	import jpabook.jpashop.dto.ItemForm;
	import jpabook.jpashop.exception.NotHasDiscriminator;
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
	        return item;
	    }
	
	    @Transactional
	    public Item updateItem(Long itemId, ItemForm itemForm){
	
	        if("A".equals(itemForm.getDtype())){
	            Album findItem = (Album) itemRepository.findOne(itemId);
	
	            return findItem.changeItem(itemForm);
	
	        }else if("B".equals(itemForm.getDtype())){
	            Book findItem = (Book) itemRepository.findOne(itemId);
	
	            return findItem.changeItem(itemForm);
	
	        }else if("M".equals(itemForm.getDtype())){
	            Movie findItem = (Movie) itemRepository.findOne(itemId);
	
	
	            return findItem.changeItem(itemForm);
	
	        }else{
	            throw new NotHasDiscriminator("Not Has Discriminator");
	        }
	    }
	
	    public List<Item> findItems(){
	        return itemRepository.findAll();
	    }
	
	    public Item findOne(Long item_id){
	        return itemRepository.findOne(item_id);
	    }
	
	    public Item transItemEntity(ItemForm itemForm) {
	        Item item = null;
	        String dtype = itemForm.getDtype();
	
	        if("A".equals(itemForm.getDtype())){
	            item = new Album().createItem(itemForm); // 앨범 생성
	        }else if("B".equals(itemForm.getDtype())){
	            item = new Book().createItem(itemForm); // 책 생성
	        }else if("M".equals(itemForm.getDtype())){
	            item = new Movie().createItem(itemForm);  // 영화 생성
	        }else{
	            throw new NotHasDiscriminator("Not Has Discriminator");
	        }
	
	        return item;
	    }
	}



</details> 

> java/jpabook/jpashop/repository/OrderRepository.java

<details title="펼치기/숨기기">
 	<summary> OrderRepository.java </summary>

	package jpabook.jpashop.repository;
	
	import jpabook.jpashop.domain.Order;
	import jpabook.jpashop.dto.OrderSearch;
	import lombok.RequiredArgsConstructor;
	import org.springframework.stereotype.Repository;
	import org.springframework.util.StringUtils;
	
	import javax.persistence.EntityManager;
	import javax.persistence.TypedQuery;
	import javax.persistence.criteria.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Repository
	@RequiredArgsConstructor
	public class OrderRepository {
	
	    private final EntityManager em;
	
	    public void save(Order order){
	        em.persist(order);
	    }
	
	    public Order findOne(Long orderId){
	        return em.find(Order.class, orderId);
	    }
	
	    public List<Order> findAllByString(OrderSearch orderSearch){
	
	        String jpql = "select o from Order o left join o.member m";
	
	        boolean isFirstCondition = true;
	
	        //주문 상태 검색
	        if(orderSearch.getOrderStatus() != null){
	            if(isFirstCondition){
	                jpql += " where ";
	                isFirstCondition = false;
	            }else{
	                jpql += " and ";
	            }
	            jpql += "o.status = :status";
	        }
	
	        //회원 이름 검색
	        if(StringUtils.hasText(orderSearch.getMemberName())){
	            if(isFirstCondition){
	                jpql += " where ";
	                isFirstCondition = false;
	            }else{
	                jpql += " and ";
	            }
	            jpql += "m.name like concat('%',:name ,'%')";
	        }
	
	
	        TypedQuery<Order> query = em.createQuery(jpql, Order.class)
	                .setMaxResults(1000);
	
	        //주문 상태 검색 setParameter
	        if(orderSearch.getOrderStatus() != null){
	            query.setParameter("status", orderSearch.getOrderStatus());
	        }
	
	        //회원 이름 검색 setParameter
	        if(StringUtils.hasText(orderSearch.getMemberName())){
	            query.setParameter("name", orderSearch.getMemberName());
	        }
	
	        return query.getResultList();
	    }
	
	    /**
	     *  JPA Criteria
	     * */
	    public List<Order> findAllByCriteria(OrderSearch orderSearch){
	
	        CriteriaBuilder cb = em.getCriteriaBuilder(); //엔티티 매니저에서 CriteriaBuilder를 가져옴
	
	        CriteriaQuery<Order> cq = cb.createQuery(Order.class); //CriteriaQuery 생성
	
	        Root<Order> o = cq.from(Order.class); // o를 Alias로 Root 생성
	
	        Join<Object, Object> m = o.join("member", JoinType.INNER); // m을 Alias로 join 한 Member 생성
	
	        List<Predicate> criteria = new ArrayList<>(); // 동적 쿼리에 대한 컨디션 조합을 배열을 통해 만들 수 있습니다.
	
	        //주문 상태 검색
	        if(orderSearch.getOrderStatus() != null){
	            Predicate status = cb.equal(o.get("status"), orderSearch.getOrderStatus());
	            criteria.add(status);
	        }
	
	        //회원 이름 검색
	        if(StringUtils.hasText(orderSearch.getMemberName())){
	            Predicate name = cb.like(m.<String>get("name"), "%"+orderSearch.getMemberName()+"%");
	            criteria.add(name);
	        }
	
	        cq.where(cb.and(criteria.toArray(new Predicate[criteria.size()])));
	
	        TypedQuery<Order> query = em.createQuery(cq).setMaxResults(1000);
	        return query.getResultList();
	
	    }
	
	    /**
	     *  Querydsl
	     * */
	    // public List<Order> findAll(OrderSearch orderSearch){}
	}


</details> 


> java/jpabook/jpashop/service/OrderService.java

<details title="펼치기/숨기기">
 	<summary> OrderService.java </summary>
	
	package jpabook.jpashop.service;
	
	import jpabook.jpashop.domain.*;
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.dto.OrderDto;
	import jpabook.jpashop.dto.OrderSearch;
	import jpabook.jpashop.repository.ItemRepository;
	import jpabook.jpashop.repository.MemberRepository;
	import jpabook.jpashop.repository.OrderRepository;
	import lombok.RequiredArgsConstructor;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;
	
	import java.util.ArrayList;
	import java.util.List;
	
	@Service
	@Transactional(readOnly = true)
	@RequiredArgsConstructor
	public class OrderService {
	
	    private final OrderRepository orderRepository;
	    private final MemberRepository memberRepository;
	    private final ItemRepository itemRepository;
	
	    /**
	     * 주문
	     */
	    @Transactional
	    public Long order(Long memberId, Long itemId, int count){
	
	        // 엔티티 조회
	        Member member = memberRepository.findOne(memberId);
	        Item item = itemRepository.findOne(itemId);
	
	        // 배송정보 생성
	        Delivery delivery = new Delivery();
	        delivery.setAddress(member.getAddress());
	        delivery.setStatus(DeliveryStatus.READY);
	
	        // 주문상품 생성
	        OrderItem orderItem = OrderItem.createOrderItem(item, item.getPrice(), count);
	
	        // 주문생성
	        Order order = Order.createOrder(member, delivery , orderItem);
	
	        // 주문 저장
	        orderRepository.save(order);
	
	        return order.getId();
	    }
	
	    @Transactional
	    public Long orderByList(List<OrderDto> orderDtoList) {
	        Member member = null;
	        Item item = null;
	        Delivery delivery = new Delivery();
	        OrderItem [] orderItems = new OrderItem[orderDtoList.size()];
	
	        int idx=0;
	        for (OrderDto orderDto : orderDtoList) {
	
	            // 엔티티 조회
	            member = memberRepository.findOne(orderDto.getMemberId());
	            item = itemRepository.findOne(orderDto.getItemId());
	
	            // 배송정보 생성
	            if(idx == 0){
	                delivery.setAddress(member.getAddress());
	                delivery.setStatus(DeliveryStatus.READY);
	            }
	
	            // 주문상품 생성
	            OrderItem orderItem = OrderItem.createOrderItem(item, item.getPrice(), orderDto.getCount());
	
	            orderItems[idx] = orderItem;
	
	            idx++;
	        }
	
	        // 주문생성
	        Order order = Order.createOrder(member, delivery, orderItems);
	
	        // 주문 저장
	        orderRepository.save(order);
	
	        return order.getId();
	
	    }
	
	    /**
	     * 취소
	     */
	     
	     @Transactional
	    public void cancelOrder(Long orderId){
	        // 주문 엔티티 조회
	        Order order = orderRepository.findOne(orderId);
	        // 주문 취소
	        order.cancel();
	
	    }
	
	
	    /**
	     * 검색
	     */
	    public List<Order> findOrders(OrderSearch orderSearch){
	        return orderRepository.findAllByString(orderSearch);
	    }
	
	
	}

</details> 



#### 컨트롤러


> java/jpabook/jpashop/HelloController.java

<details title="펼치기/숨기기">
 	<summary> HelloController.java </summary>

	package jpabook.jpashop;
	
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.GetMapping;
	
	@Controller
	public class HelloController {
	
	    @GetMapping("hello") // hello 라는 응답을 받으면
	    public String hello(Model model){
	
	        model.addAttribute("data", "hello !!"); // addAttribute data의 값에 "hello !!" 를 넣어서
	        System.out.println(1121);
	
	        return "hello"; /* view 라는 페이지를 오픈*/
	    }
	}


</details> 


> java/jpabook/jpashop/controller/HomeController.java

<details title="펼치기/숨기기">
 	<summary> HomeController.java </summary>
	
	package jpabook.jpashop.controller;
	
	import lombok.extern.slf4j.Slf4j;
	import org.slf4j.Logger;
	import org.slf4j.LoggerFactory;
	import org.springframework.stereotype.Controller;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.servlet.ModelAndView;
	
	@Controller
	@Slf4j
	public class HomeController {
	
	    //@Slf4j 사용
	    //Logger log = LoggerFactory.getLogger(getClass());
	
	    @RequestMapping("/")
	    public String Home(){
	        log.info("home controller");
	        return "home";
	    }
	}


</details> 

> java/jpabook/jpashop/controller/MemberController.java

<details title="펼치기/숨기기">
 	<summary> MemberController.java </summary>

	package jpabook.jpashop.controller;

	import jpabook.jpashop.domain.Address;
	import jpabook.jpashop.domain.Member;
	import jpabook.jpashop.dto.MemberForm;
	import jpabook.jpashop.service.MemberService;
	import lombok.RequiredArgsConstructor;
	import lombok.extern.slf4j.Slf4j;
	import org.springframework.stereotype.Controller;
	import org.springframework.validation.BindingResult;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.ui.Model;
	
	import javax.validation.Valid;
	import java.util.List;
	
	@Controller
	@RequiredArgsConstructor
	@Slf4j
	public class MemberController {
	    //@Slf4j 사용
	    //Logger log = LoggerFactory.getLogger(getClass());
	    private final MemberService memberService;
	
	    @GetMapping("/members/new")
	    public String newMembersForm(Model modal){
	        log.info("call get members/new");
	
	        modal.addAttribute("memberForm", new MemberForm());
	        return "members/newMembersForm";
	
	    }
	
	    @PostMapping("/members/new")
	    public String newMembers(@Valid MemberForm memberForm, BindingResult result, Model modal){
	        log.info("call post members/new");
	
	        if(result.hasErrors()){
	            return "members/newMembersForm";
	        }
	
	        Member newMember = new Member();
	        newMember.setName(memberForm.getName());
	        newMember.setAddress(memberForm.getAddress());
	
	        memberService.join(newMember);
	
	
	        return "redirect:/"; //첫번째 화면으로 이동
	    }
	
	    @GetMapping("/members")
	    public String memberList(Model modal){
	        log.info("call get members");
	
	        List<Member> members = memberService.findMembers();
	        modal.addAttribute("members", members);
	
	        return "members/memberList";
	
	
	    }
	}

</details> 

> java/jpabook/jpashop/controller/ItemController.java

<details title="펼치기/숨기기">
 	<summary> ItemController.java </summary>

	package jpabook.jpashop.controller;
	
	import jpabook.jpashop.domain.item.Album;
	import jpabook.jpashop.domain.item.Book;
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.domain.item.Movie;
	import jpabook.jpashop.dto.ItemDto;
	import jpabook.jpashop.dto.ItemForm;
	import jpabook.jpashop.exception.NotHasDiscriminator;
	import jpabook.jpashop.service.ItemService;
	import lombok.RequiredArgsConstructor;
	import lombok.extern.slf4j.Slf4j;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.validation.BindingResult;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.ModelAttribute;
	import org.springframework.web.bind.annotation.PathVariable;
	import org.springframework.web.bind.annotation.PostMapping;
	
	import javax.validation.Valid;
	import javax.validation.constraints.NotEmpty;
	import java.util.List;
	
	@Controller
	@RequiredArgsConstructor
	@Slf4j
	public class ItemController {
	
	    private final ItemService itemService;
	
	    @GetMapping("/items/new")
	    public String newItemsForm(Model modal){
	        log.info("call get /items/new");
	
	        modal.addAttribute("itemForm", new ItemForm());
	        return "items/newItemForm";
	    }
	
	    @PostMapping("/items/new")
	    public String newItems(@Valid ItemForm itemForm, BindingResult result, Model modal){
	        log.info("call post members/new");
	
	        if(result.hasErrors()){
	            return "items/newItemForm";
	        }
	
	        Item item = itemService.transItemEntity(itemForm);
	
	        itemService.saveItem(item);
	
	        return  "redirect:/items";
	
	    }
	
	    @GetMapping("/items")
	    public String itemList(Model modal){
	        log.info("call get /items");
	
	        List<Item> items = itemService.findItems();
	
	        modal.addAttribute("items", items);
	        return "items/itemList";
	    }
	
	    @GetMapping("/items/{itemId}/edit")
	    public String editItemsForm(@PathVariable("itemId") Long itemId, Model modal){
	        log.info("call get /items/edit");
	
	        Item item = itemService.findOne(itemId);
	
	        ItemForm itemForm = item.transItemForm();
	
	        modal.addAttribute("itemForm", itemForm);
	
	        return "items/editItemForm";
	    }
	
	    @PostMapping("items/{itemId}/edit")
	    public String updateItem(@ModelAttribute("form") ItemForm itemForm){
	
	        Item item = itemService.transItemEntity(itemForm);
	        //itemService.saveItem(item);
	        itemService.updateItem(itemForm.getId(), itemForm);
	
	        return "redirect:items";
	
	    }
	
	
	
	}
</details> 

> java/jpabook/jpashop/controller/OrderController.java

<details title="펼치기/숨기기">
 	<summary> ItemController.java </summary>

	package jpabook.jpashop.controller;
	
	import jpabook.jpashop.domain.Member;
	import jpabook.jpashop.domain.Order;
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.dto.ItemDto;
	import jpabook.jpashop.dto.ItemForm;
	import jpabook.jpashop.dto.OrderDto;
	import jpabook.jpashop.dto.OrderSearch;
	import jpabook.jpashop.service.ItemService;
	import jpabook.jpashop.service.MemberService;
	import jpabook.jpashop.service.OrderService;
	import lombok.RequiredArgsConstructor;
	import lombok.extern.slf4j.Slf4j;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.RequestBody;
	import org.springframework.web.bind.annotation.RequestParam;
	
	import java.util.List;
	
	@Controller
	@RequiredArgsConstructor
	@Slf4j
	public class OrderController {
	
	    private final OrderService orderService;
	    private final MemberService memberService;
	    private final ItemService itemService;
	
	    @GetMapping("/order")
	    public String orderForm(Model modal){
	        log.info("call get /order");
	
	        List<Member> members = memberService.findMembers();
	        //List<Item> items = itemService.findItems();
	
	        List<ItemDto> items = itemService.findItemDtoList();
	
	        System.out.println(items);
	
	        modal.addAttribute("members", members);
	        modal.addAttribute("items", items);
	        modal.addAttribute("orderFrom", new ItemForm());
	        return "order/orderForm";
	    }
	
	    @PostMapping("/order")
	    public String order( OrderDto orderDto
	                        , Model modal){
	        log.info("call post /order");
	
	        System.out.println(orderDto);
	
	        //단건 상품 주문
	        //Long order = orderService.order(memberid, itemId, count);
	
	        //여러 상품 주문
	        Long order = orderService.orderByList(orderDto.getOrderDtoList());
	
	        return  "redirect:/orders";
	
	    }
	
	    @GetMapping("/orders")
	    public String orderList(OrderSearch orderSearch, Model modal){
	        log.info("call get /orderList");
	
	        List<Order> orders = orderService.findOrders(orderSearch);
	
	        modal.addAttribute("orders", orders);
	
	        return "order/orderList";
	    }
	}

</details> 



#### DTO

> java/jpabook/jpashop/dto/OrderSearch.java

<details title="펼치기/숨기기">
 	<summary> OrderSearch.java </summary>

	package jpabook.jpashop.dto;

	import jpabook.jpashop.domain.OrderStatus;
	import lombok.Getter;
	import lombok.Setter;
	
	@Getter @Setter
	public class OrderSearch {
	
	    private String memberName; // 회원 이름
	    private OrderStatus orderStatus; //주문 상태 [ORDER, CANCEL]
	
	}

</details> 

> java/jpabook/jpashop/dto/MemberForm.java

<details title="펼치기/숨기기">
 	<summary> MemberForm.java </summary>

	package jpabook.jpashop.dto;
	
	
	import jpabook.jpashop.domain.Address;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.validation.constraints.NotEmpty;
	
	
	@Getter @Setter
	public class MemberForm {
	
	    @NotEmpty(message = "회원 이름은 필수 입니다.")
	    private String name;
	
	    private String city;
	    private String street;
	    private String zipcode;
	
	    public Address getAddress(){
	        return new Address(this.city, this.street, this.getZipcode());
	    }
	
	    @Override
	    public String toString() {
	        return "MemberForm{" +
	                "name='" + name + '\'' +
	                ", city='" + city + '\'' +
	                ", street='" + street + '\'' +
	                ", zipcode='" + zipcode + '\'' +
	                '}';
	    }
	}


</details> 

> java/jpabook/jpashop/dto/OrderDto.java

<details title="펼치기/숨기기">
 	<summary> OrderDto.java </summary>
	 	
	package jpabook.jpashop.dto;
	
	import jpabook.jpashop.domain.item.Item;
	import lombok.Getter;
	import lombok.Setter;
	
	import java.util.List;
	
	@Getter @Setter
	public class OrderDto {
	
	    private long id;
	    private long memberId;
	    private long itemId;
	    private int count;
	
	    private List<OrderDto> orderDtoList;
	
	    @Override
	    public String toString() {
	        return "OrderDto{" +
	                "id=" + id +
	                ", memberId=" + memberId +
	                ", itemId=" + itemId +
	                ", count=" + count +
	                ", orderDtoList=" + orderDtoList +
	                '}';
	    }
	}


````

> java/jpabook/jpashop/dto/ItemDto.java

<details title="펼치기/숨기기">
 	<summary> OrderDto.java </summary>
	 	
	package jpabook.jpashop.dto;
	
	import jpabook.jpashop.domain.item.Item;
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.validation.constraints.NotEmpty;
	
	@Getter @Setter
	public class ItemDto {
	    public ItemDto(long id, String name, int price, int stockQuantity, String dtype, String artist, String etc, String author, String isbn, String director, String actor) {
	        this.id = id;
	        this.name = name;
	        this.price = price;
	        this.stockQuantity = stockQuantity;
	        this.dtype = dtype;
	        this.artist = artist;
	        this.etc = etc;
	        this.author = author;
	        this.isbn = isbn;
	        this.director = director;
	        this.actor = actor;
	    }
	
	    private long id;
	
	    private String name;
	
	    private int price;
	
	    private int stockQuantity;
	
	    private String dtype;
	
	    private String dtypeNm;
	
	    public String getDtypeNm() {
	        String dtypeNm = null;
	
	        if(dtype.equals("A")){
	            dtypeNm = Item.ALBUM;
	        }else if(dtype.equals("B")){
	            dtypeNm = Item.BOOK;
	        }else if(dtype.equals("M")){
	            dtypeNm = Item.MOVIE;
	        }
	        return dtypeNm;
	    }
	
	    private String artist;
	    private String etc;
	    private String author;
	    private String isbn;
	    private String director;
	    private String actor;
	
	    @Override
	    public String toString() {
	        return "ItemDto{" +
	                "id=" + id +
	                ", name='" + name + '\'' +
	                ", price=" + price +
	                ", stockQuantity=" + stockQuantity +
	                ", dtype='" + dtype + '\'' +
	                ", dtypeNm='" + dtypeNm + '\'' +
	                ", artist='" + artist + '\'' +
	                ", etc='" + etc + '\'' +
	                ", author='" + author + '\'' +
	                ", isbn='" + isbn + '\'' +
	                ", director='" + director + '\'' +
	                ", actor='" + actor + '\'' +
	                '}';
	    }
	}

````

> java/jpabook/jpashop/dto/ItemForm.java

<details title="펼치기/숨기기">
 	<summary> ItemForm.java </summary>
	 	
	package jpabook.jpashop.dto;
	
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.validation.constraints.NotEmpty;
	
	@Getter @Setter
	public class ItemForm {
	    private long id;
	
	    @NotEmpty(message = "상품명은 필수 입니다.")
	    private String name;
	
	    private int price;
	
	    private int stockQuantity;
	
	    @NotEmpty(message = "상품 구분을 선택해 주세요.")
	    private String dtype;
	
	    private String artist;
	    private String etc;
	    private String author;
	    private String isbn;
	    private String director;
	    private String actor;
	
	    @Override
	    public String toString() {
	        return "ItemForm{" +
	                "id=" + id +
	                ", name='" + name + '\'' +
	                ", price=" + price +
	                ", stockQuantity=" + stockQuantity +
	                ", dtype='" + dtype + '\'' +
	                ", artist='" + artist + '\'' +
	                ", etc='" + etc + '\'' +
	                ", author='" + author + '\'' +
	                ", isbn='" + isbn + '\'' +
	                ", director='" + director + '\'' +
	                ", actor='" + actor + '\'' +
	                '}';
	    }
	}

````

> java/jpabook/jpashop/dto/ItemForm.java

<details title="펼치기/숨기기">
 	<summary> ItemForm.java </summary>
	 	
	package jpabook.jpashop.dto;
	
	import lombok.Getter;
	import lombok.Setter;
	
	import javax.validation.constraints.NotEmpty;
	
	@Getter @Setter
	public class ItemForm {
	    private long id;
	
	    @NotEmpty(message = "상품명은 필수 입니다.")
	    private String name;
	
	    private int price;
	
	    private int stockQuantity;
	
	    @NotEmpty(message = "상품 구분을 선택해 주세요.")
	    private String dtype;
	
	    private String artist;
	    private String etc;
	    private String author;
	    private String isbn;
	    private String director;
	    private String actor;
	
	    @Override
	    public String toString() {
	        return "ItemForm{" +
	                "id=" + id +
	                ", name='" + name + '\'' +
	                ", price=" + price +
	                ", stockQuantity=" + stockQuantity +
	                ", dtype='" + dtype + '\'' +
	                ", artist='" + artist + '\'' +
	                ", etc='" + etc + '\'' +
	                ", author='" + author + '\'' +
	                ", isbn='" + isbn + '\'' +
	                ", director='" + director + '\'' +
	                ", actor='" + actor + '\'' +
	                '}';
	    }
	}

````



#### 뷰

> resources/templates/fragments/bodyHeader.html

<details title="펼치기/숨기기">
 	<summary> bodyHeader.html </summary>

	<!DOCTYPE html>
	<html xmlns:th="http://www.thymeleaf.org">
	<div class="header" th:fragment="bodyHeader">
	    <ul class="nav nav-pills pull-right">
	        <li><a href="/">Home</a></li>
	    </ul>
	    <a href="/"><h3 class="text-muted">HELLO SHOP</h3></a>
	</div>

</details> 


> resources/templates/fragments/footer.html

<details title="펼치기/숨기기">
 	<summary> footer.html </summary>

	<!DOCTYPE html>
	<html xmlns:th="http://www.thymeleaf.org">
	<div class="footer" th:fragment="footer">
	    <p>&copy; Hello Shop V2</p>
	</div>

</details> 



> resources/templates/fragments/header.html

<details title="펼치기/숨기기">
 	<summary> header.html </summary>

	<!DOCTYPE html>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:fragment="header">
	    <!-- Required meta tags -->
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	
	    <!-- Bootstrap CSS -->
	    <link rel="stylesheet" href="/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	    <!-- Custom styles for this template -->
	    <link href="/css/jumbotron-narrow.css" rel="stylesheet">
	
	    <title>Hello, world!</title>
	</head>


</details> 


> resources/templates/home.html

<details title="펼치기/숨기기">
 	<summary> home.html </summary>

	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header">
	    <title>Hello</title>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	</head>
	
	<body>
	
	<div class="container">
	
	    <div th:replace="fragments/bodyHeader :: bodyHeader" />
	
	    <div class="jumbotron">
	        <h1>HELLO SHOP</h1>
	        <p class="lead">회원 기능</p>
	        <p>
	            <a class="btn btn-lg btn-secondary" href="/members/new">회원 가입</a>
	            <a class="btn btn-lg btn-secondary" href="/members">회원 목록</a>
	        </p>
	        <p class="lead">상품 기능</p>
	        <p>
	            <a class="btn btn-lg btn-dark" href="/items/new">상품 등록</a>
	            <a class="btn btn-lg btn-dark" href="/items">상품 목록</a>
	        </p>
	        <p class="lead">주문 기능</p>
	        <p>
	            <a class="btn btn-lg btn-info" href="/order">상품 주문</a>
	            <a class="btn btn-lg btn-info" href="/orders">주문 내역</a>
	        </p>
	    </div>
	
	    <div th:replace="fragments/footer :: footer" />
	
	</div> <!-- /container -->
	
	</body>
	</html>



</details> 

> resources/templates/members/newMembersForm.html

<details title="펼치기/숨기기">
 	<summary> newMembersForm.html </summary>

		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<style>
	  .fieldError {
	    border-color: #bd2130;
	  }
	</style>
	<body>
	
	<div class="container">
	  <div th:replace="fragments/bodyHeader :: bodyHeader"/>
	
	  <form role="form" action="/members/new" th:object="${memberForm}" method="post">
	    <div class="form-group">
	      <label th:for="name">이름</label>
	
	      <input type="text" th:field="*{name}" class="form-control" placeholder="이름을 입력하세요"
	             th:class="${#fields.hasErrors('name')}? 'form-control fieldError' : 'form-control'">
	      <p th:if="${#fields.hasErrors('name')}" th:errors="*{name}">Incorrect date</p>
	
	    </div>
	    <div class="form-group">
	      <label th:for="city">도시</label>
	      <input type="text" th:field="*{city}" class="form-control" placeholder="도시를 입력하세요">
	    </div>
	    <div class="form-group">
	      <label th:for="street">거리</label>
	      <input type="text" th:field="*{street}" class="form-control" placeholder="거리를 입력하세요">
	    </div>
	    <div class="form-group">
	      <label th:for="zipcode">우편번호</label>
	      <input type="text" th:field="*{zipcode}" class="form-control" placeholder="우편번호를 입력하세요">
	    </div>
	    <button type="submit" class="btn btn-primary">Submit</button>
	  </form>
	  <br/>
	  <div th:replace="fragments/footer :: footer" />
	</div> <!-- /container -->
	
	</body>
	</html>

</details> 

> resources/templates/members/memberList.html

<details title="펼치기/숨기기">
 	<summary> memberList.html </summary>
		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<body>
	
	<div class="container">
	    <div th:replace="fragments/bodyHeader :: bodyHeader" />
	    <div>
	        <table class="table table-striped">
	            <thead>
	            <tr>
	                <th>#</th>
	                <th>이름</th>
	                <th>도시</th>
	                <th>주소</th>
	                <th>우편번호</th>
	            </tr>
	            </thead>
	            <tbody>
	            <tr th:each="member : ${members}">
	                <td th:text="${member.id}"></td>
	                <td th:text="${member.name}"></td>
	                <td th:text="${member.address?.city}"></td>
	                <td th:text="${member.address?.street}"></td>
	                <td th:text="${member.address?.zipcode}"></td>
	            </tr>
	            </tbody>
	        </table>
	    </div>
	
	    <div th:replace="fragments/footer :: footer" />
	
	</div> <!-- /container -->
	
	</body>
	</html>


</details> 

> resources/templates/items/newItemForm.html

<details title="펼치기/숨기기">
 	<summary> newItemForm.html </summary>
		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<script src="https://code.jquery.com/jquery-latest.min.js"></script>
	<style>
	    .hidden{
	        display: none;
	        width : inherit;
	        height : 400px;
	    }
	     .fieldError {
	         border-color: #bd2130;
	     }
	</style>
	<script>
	    $(document).ready(function(){
	        fn_change_dtype();
	    });
	
	    let fn_submit = function() {
	        let dtype = $("#dtype").val();
	        $(".fieldError").removeClass("fieldError");
	        $(".errorMsg").remove();
	
	        if(dtype == ''){
	            //alert("상품구분을 선택하세요.");
	            $("#dtype").addClass("fieldError");
	            $("#dtype").parent().append("<p class='errorMsg'>상품 구분을 선택해 주세요.</p>");
	            return false;
	        }
	        if($.trim($("#name").val()) == ""){
	            //alert("이름을 입력하세요.");
	            $("#name").addClass("fieldError");
	            $("#name").parent().append("<p class='errorMsg'>상품 이름을 입력하세요.</p>");
	            return false;
	        }
	        if($.trim($("#stockQuantity").val()) == "" || $("#stockQuantity").val() == 0){
	            //alert("수량을 1이상 입력하세요.");
	            $("#stockQuantity").addClass("fieldError");
	            $("#stockQuantity").parent().append("<p class='errorMsg'>수량을 1이상 입력하세요.</p>");
	            return false;
	        }
	
	        if(dtype == 'A'){
	            if($.trim($("#artist").val()) == ""){
	                //alert("아티스트를 입력하세요.");
	                $("#artist").addClass("fieldError");
	                $("#artist").parent().append("<p class='errorMsg'>아티스트를 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#etc").val()) == ""){
	                //alert("ETC를 입력하세요.");
	                $("#etc").addClass("fieldError");
	                $("#etc").parent().append("<p class='errorMsg'>ETC를 입력하세요.</p>");
	                return false;
	            }
	        }else if(dtype == 'B'){
	            if($.trim($("#author").val()) == ""){
	                //alert("저자를 입력하세요.");
	                $("#author").addClass("fieldError");
	                $("#author").parent().append("<p class='errorMsg'>저자를 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#isbn").val()) == ""){
	                //alert("ISBN을 입력하세요.");
	                $("#isbn").addClass("fieldError");
	                $("#isbn").parent().append("<p class='errorMsg'>ISBN을 입력하세요.</p>");
	                return false;
	            }
	
	        }else if(dtype == 'M'){
	            if($.trim($("#director").val()) == ""){
	                //alert("감독을 입력하세요.");
	                $("#director").addClass("fieldError");
	                $("#director").parent().append("<p class='errorMsg'>감독을 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#actor").val()) == ""){
	                //alert("배우를 입력하세요.");
	                $("#actor").addClass("fieldError");
	                $("#actor").parent().append("<p class='errorMsg'>배우를 입력하세요.</p>");
	                return false;
	            }
	        }
	
	        $("#itemForm").submit();
	
	    };
	
	    let fn_change_dtype = function() {
	        let dtype = $("#dtype").val();
	        $("#itemForm")[0].reset();
	        $("#dtype").val(dtype);
	
	        //초기화
	        $(".hidden").css("display","none");
	
	        if(dtype == ''){
	            return false;
	        }else if(dtype == 'A'){
	            $("#sub-form-A").css("display","inline");
	        }else if(dtype == 'B'){
	            $("#sub-form-B").css("display","inline");
	        }else if(dtype == 'M'){
	            $("#sub-form-M").css("display","inline");
	        }
	
	
	    };
	</script>
	<body>
	
	<div class="container">
	    <div th:replace="fragments/bodyHeader :: bodyHeader"/>
	
	    <form id="itemForm" th:action="@{/items/new}" th:object="${itemForm}" method="post">
	        <div class="form-group">
	            <label th:for="dtype">상품구분</label>
	            <select th:field="*{dtype}" class="form-control" onchange="fn_change_dtype()">
	                <option value="">상품구분</option>
	                <option value="A">앨범</option>
	                <option value="B">책</option>
	                <option value="M">영화</option>
	            </select>
	        </div>
	        <!--<p class="fieldError" th:if="${#fields.hasErrors('dtype')}" th:errors="*{dtype}">Incorrect date</p>-->
	
	        <div class="form-group">
	            <label th:for="name">상품명</label>
	            <input type="text" th:field="*{name}" class="form-control" placeholder="이름을 입력하세요">
	        </div>
	        <!--<p class="fieldError" th:if="${#fields.hasErrors('name')}" th:errors="*{name}">Incorrect date</p>-->
	
	        <div class="form-group">
	            <label th:for="price">가격</label>
	            <input type="number" th:field="*{price}" class="form-control" placeholder="가격을 입력하세요">
	        </div>
	        <div class="form-group">
	            <label th:for="stockQuantity">수량</label>
	            <input type="number" th:field="*{stockQuantity}" class="form-control" placeholder="수량을 입력하세요">
	        </div>
	
	        <div id="sub-form-A" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="artist">아티스트</label>
	                <input type="text" th:field="*{artist}" class="form-control" placeholder="아티스트를 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="etc">ETC</label>
	                <input type="text" th:field="*{etc}" class="form-control" placeholder="ETC를 입력하세요">
	            </div>
	        </div>
	
	        <div id="sub-form-B" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="author">저자</label>
	                <input type="text" th:field="*{author}" class="form-control" placeholder="저자를 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="isbn">ISBN</label>
	                <input type="text" th:field="*{isbn}" class="form-control" placeholder="ISBN을 입력하세요">
	            </div>
	        </div>
	
	        <div id="sub-form-M" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="director">감독</label>
	                <input type="text" th:field="*{director}" class="form-control" placeholder="감독을 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="actor">배우</label>
	                <input type="text" th:field="*{actor}" class="form-control" placeholder="배우를 입력하세요">
	            </div>
	        </div>
	
	        <button type="button" class="btn btn-primary" onclick="fn_submit();">Submit</button>
	    </form>
	    <br/>
	    <div th:replace="fragments/footer :: footer" />
	
	</div> <!-- /container -->
	
	
	</body>
	</html>


</details> 


> resources/templates/items/itemList.html

<details title="펼치기/숨기기">
 	<summary> itemList.html </summary>
		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<body>
	
	<div class="container">
	    <div th:replace="fragments/bodyHeader :: bodyHeader"/>
	
	    <div>
	        <table class="table table-striped">
	            <thead>
	            <tr>
	                <th>#</th>
	                <th>상품구분</th>
	                <th>상품명</th>
	                <th>가격</th>
	                <th>재고수량</th>
	                <th></th>
	            </tr>
	            </thead>
	            <tbody>
	            <tr th:each="item : ${items}">
	                <td th:text="${item.id}"></td>
	                <td th:text="${item.dtypeNm}"></td>
	                <td th:text="${item.name}"></td>
	                <td th:text="${item.price}"></td>
	                <td th:text="${item.stockQuantity}"></td>
	                <td>
	                    <a href="#" th:href="@{/items/{id}/edit (id=${item.id})}" class="btn btn-primary" role="button">수정</a>
	                </td>
	            </tr>
	            </tbody>
	        </table>
	    </div>
	
	    <div th:replace="fragments/footer :: footer"/>
	
	</div> <!-- /container -->
	
	</body>
	</html>



</details> 

> resources/templates/items/editItemForm.html

<details title="펼치기/숨기기">
 	<summary> editItemForm.html </summary>
		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<script src="https://code.jquery.com/jquery-latest.min.js"></script>
	<style>
	    .hidden{
	        display: none;
	        width : inherit;
	        height : 400px;
	    }
	     .fieldError {
	         border-color: #bd2130;
	     }
	</style>
	<script>
	    $(document).ready(function(){
	        fn_change_dtype();
	    });
	
	    let fn_submit = function() {
	        let dtype = $("#dtype").val();
	        $(".fieldError").removeClass("fieldError");
	        $(".errorMsg").remove();
	
	        if(dtype == ''){
	            //alert("상품구분을 선택하세요.");
	            $("#dtype").addClass("fieldError");
	            $("#dtype").parent().append("<p class='errorMsg'>상품 구분을 선택해 주세요.</p>");
	            return false;
	        }
	        if($.trim($("#name").val()) == ""){
	            //alert("이름을 입력하세요.");
	            $("#name").addClass("fieldError");
	            $("#name").parent().append("<p class='errorMsg'>상품 이름을 입력하세요.</p>");
	            return false;
	        }
	        if($.trim($("#stockQuantity").val()) == "" || $("#stockQuantity").val() == 0){
	            //alert("수량을 1이상 입력하세요.");
	            $("#stockQuantity").addClass("fieldError");
	            $("#stockQuantity").parent().append("<p class='errorMsg'>수량을 1이상 입력하세요.</p>");
	            return false;
	        }
	
	        if(dtype == 'A'){
	            if($.trim($("#artist").val()) == ""){
	                //alert("아티스트를 입력하세요.");
	                $("#artist").addClass("fieldError");
	                $("#artist").parent().append("<p class='errorMsg'>아티스트를 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#etc").val()) == ""){
	                //alert("ETC를 입력하세요.");
	                $("#etc").addClass("fieldError");
	                $("#etc").parent().append("<p class='errorMsg'>ETC를 입력하세요.</p>");
	                return false;
	            }
	        }else if(dtype == 'B'){
	            if($.trim($("#author").val()) == ""){
	                //alert("저자를 입력하세요.");
	                $("#author").addClass("fieldError");
	                $("#author").parent().append("<p class='errorMsg'>저자를 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#isbn").val()) == ""){
	                //alert("ISBN을 입력하세요.");
	                $("#isbn").addClass("fieldError");
	                $("#isbn").parent().append("<p class='errorMsg'>ISBN을 입력하세요.</p>");
	                return false;
	            }
	
	        }else if(dtype == 'M'){
	            if($.trim($("#director").val()) == ""){
	                //alert("감독을 입력하세요.");
	                $("#director").addClass("fieldError");
	                $("#director").parent().append("<p class='errorMsg'>감독을 입력하세요.</p>");
	                return false;
	            }
	            if($.trim($("#actor").val()) == ""){
	                //alert("배우를 입력하세요.");
	                $("#actor").addClass("fieldError");
	                $("#actor").parent().append("<p class='errorMsg'>배우를 입력하세요.</p>");
	                return false;
	            }
	        }
	
	        $("#itemForm").submit();
	
	    };
	
	    let fn_change_dtype = function() {
	        let dtype = $("#dtype").val();
	        $("#itemForm")[0].reset();
	        $("#dtype").val(dtype);
	
	        //초기화
	        $(".hidden").css("display","none");
	
	        if(dtype == ''){
	            return false;
	        }else if(dtype == 'A'){
	            $("#sub-form-A").css("display","inline");
	        }else if(dtype == 'B'){
	            $("#sub-form-B").css("display","inline");
	        }else if(dtype == 'M'){
	            $("#sub-form-M").css("display","inline");
	        }
	
	
	    };
	</script>
	<body>
	
	<div class="container">
	    <div th:replace="fragments/bodyHeader :: bodyHeader"/>
	
	    <form id="itemForm" th:action="@{/items/new}" th:object="${itemForm}" method="post">
	
	        <input type="hidden" th:field="*{id}" />
	
	        <div class="form-group">
	            <label th:for="dtype">상품구분</label>
	            <select th:field="*{dtype}" class="form-control" onchange="fn_change_dtype()">
	                <option value="" >상품구분</option>
	                <option value="A">앨범</option>
	                <option value="B">책</option>
	                <option value="M">영화</option>
	            </select>
	        </div>
	
	       <!-- <select class="form-group form-control">
	            <th:block th:each="num : ${#numbers.sequence(1,10)}">
	                <option th:value="${num}" th:text="${num}" th:selected="${num} == ${itemForm.dtype}">
	                </option>
	            </th:block>
	        </select>-->
	
	        <!-- id -->
	        <input type="hidden" th:field="*{id}" />
	
	        <div class="form-group">
	            <label th:for="name">상품명</label>
	            <input type="text" th:field="*{name}" class="form-control" placeholder="이름을 입력하세요">
	        </div>
	        <!--<p class="fieldError" th:if="${#fields.hasErrors('name')}" th:errors="*{name}">Incorrect date</p>-->
	
	        <div class="form-group">
	            <label th:for="price">가격</label>
	            <input type="number" th:field="*{price}" class="form-control" placeholder="가격을 입력하세요">
	        </div>
	        <div class="form-group">
	            <label th:for="stockQuantity">수량</label>
	            <input type="number" th:field="*{stockQuantity}" class="form-control" placeholder="수량을 입력하세요">
	        </div>
	
	        <div id="sub-form-A" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="artist">아티스트</label>
	                <input type="text" th:field="*{artist}" class="form-control" placeholder="아티스트를 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="etc">ETC</label>
	                <input type="text" th:field="*{etc}" class="form-control" placeholder="ETC를 입력하세요">
	            </div>
	        </div>
	
	        <div id="sub-form-B" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="author">저자</label>
	                <input type="text" th:field="*{author}" class="form-control" placeholder="저자를 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="isbn">ISBN</label>
	                <input type="text" th:field="*{isbn}" class="form-control" placeholder="ISBN을 입력하세요">
	            </div>
	        </div>
	
	        <div id="sub-form-M" class="sub-form hidden">
	            <div class="form-group">
	                <label th:for="director">감독</label>
	                <input type="text" th:field="*{director}" class="form-control" placeholder="감독을 입력하세요">
	            </div>
	            <div class="form-group">
	                <label th:for="actor">배우</label>
	                <input type="text" th:field="*{actor}" class="form-control" placeholder="배우를 입력하세요">
	            </div>
	        </div>
	
	        <button type="button" class="btn btn-primary" onclick="fn_submit();">Submit</button>
	    </form>
	    <br/>
	    <div th:replace="fragments/footer :: footer" />
	
	</div> <!-- /container -->
	
	
	</body>
	</html>



</details> 

> resources/templates/order/orderForm.html

<details title="펼치기/숨기기">
 	<summary> orderForm.html </summary>
		
	<!DOCTYPE HTML>
	<html xmlns:th="http://www.thymeleaf.org">
	<head th:replace="fragments/header :: header" />
	<style>
	    .form-orders > li{
	        list-style-type: none;
	        width:inherit;
	        border-top: 1px solid black;
	        border-bottom: 1px solid black;
	        padding-top:25px;
	        padding-left:10px;
	        padding-bottom:20px;
	        padding-righr:10px;
	    }
	
	</style>
	<script>
	
	    let fn_choose_item = (obj) => {
	
	        let memberId = $("#member").val();
	
	        if(memberId == ""){
	            alert("회원을 먼저 선택해 주세요.");
	            $("#item").val("");
	            return false;
	        }
	
	        let item = $(obj).find("option:selected");
	
	        let itemId = $(item).val();
	        let itemNm = $(item).text();
	        let dtype = $(item).attr("data-dtype");
	        let dtypeNm = $(item).attr("data-dtype-nm");
	        let value1 = null;
	        let value2 = null;
	        let labelValue1 = null;
	        let labelValue2 = null;
	
	        if(dtype == 'A'){
	            value1 = $(item).attr("data-artist");
	            value2 = $(item).attr("data-etc");
	            labelValue1 = "아티스트";
	            labelValue2 = "기타";
	        }else if(dtype = 'B'){
	            value1 = $(item).attr("data-author");
	            value2 = $(item).attr("data-isbn");
	            labelValue1 = "저자";
	            labelValue2 = "ISBN";
	        }else{
	            value1 = $(item).attr("data-director");
	            value2 = $(item).attr("data-actor");
	            labelValue1 = "감독";
	            labelValue2 = "배우";
	        }
	
	        let idx = $(".form-orders").find("li").length;
	
	        $(".form-disabled").find(".form-order").clone().appendTo(".form-orders");
	
	
	        let chose = $(".form-orders").find("li").eq(idx);
	
	        $(chose).find("input[name=memberId]")
	            .attr("name", "orderDtoList["+idx+"].memberId")
	            .val(memberId);
	
	        $(chose).find("input[name=itemId]")
	            .attr("name", "orderDtoList["+idx+"].itemId")
	            .val( itemId );
	        $(chose).find("input[name=count]")
	            .attr("name", "orderDtoList["+idx+"].count");
	        $(chose).find(".item-dtype-nm").text(dtypeNm );
	        $(chose).find(".item-name").text(itemNm );
	        $(chose).find(".item-value1").text(value1 );
	        $(chose).find(".label-value1").text(labelValue1 );
	        $(chose).find(".item-value2").text(value2 );
	        $(chose).find(".label-value2").text(labelValue2 );
	
	        $(".form-orders").find(".form-order").css("display","");
	
	        $(".memberWrap").hide();
	        $(".textMemberWrap").show();
	        $("#textMember").val($(item).text());
	
	
	        $("#item").val("");
	
	    }
	
	    let fn_minus_count = (obj) => {
	        let cnt = parseInt($(obj).parent().find("input").val(), 0);
	
	        if( (cnt-1) > 0 ){
	            $(obj).parent().find("input").val(cnt-1);
	        }else{
	            if(confirm("선택된 상품을 제거하시겠습니까?")){
	                $(obj).parent().parent().remove();
	            }
	
	            if($(".form-orders").find("li").length == 0){
	                $(".memberWrap").show();
	                $("#member").val("");
	                $("#textMember").val("");
	                $(".textMemberWrap").hide();
	            }
	        }
	    }
	
	    let fn_plus_count = (obj) => {
	        let cnt = parseInt($(obj).parent().find("input").val(), 0);
	
	        console.log(cnt)
	
	        $(obj).parent().find("input").val(cnt+1);
	    }
	
	</script>
	<body>
	
	<div class="container">
	    <div th:replace="fragments/bodyHeader :: bodyHeader"/>
	
	    <form role="form" action="/order" method="post">
	
	        <div class="form-group memberWrap">
	            <label for="member">주문회원</label>
	            <select id="member" class="form-control">
	                <option value="">회원선택</option>
	                <option th:each="member : ${members}"
	                        th:value="${member.id}"
	                        th:text="${member.name}" />
	            </select>
	        </div>
	        <div class="form-group textMemberWrap"  style="display: none;">
	            <label for="textMember">주문회원</label>
	            <input id="textMember" class="form-control"  style="background-color: #dddddd"  readonly="readonly"/>
	        </div>
	
	
	        <div class="form-group">
	            <label for="item">상품명</label>
	            <select id="item" class="form-control" onchange="fn_choose_item(this)">
	                <option value="">상품선택</option>
	                <option th:each="item : ${items}"
	                        th:value="${item.getId()}"
	                        th:text="${item.getName()}"
	                        th:data-dtype="${item.getDtype()}"
	                        th:data-dtype-nm="${item.getDtypeNm()}"
	                        th:data-price="${item.getPrice()}"
	                        th:data-artist="${item.getArtist()}"
	                        th:data-etc="${item.getEtc()}"
	                        th:data-author="${item.getAuthor()}"
	                        th:data-isbn="${item.getIsbn()}"
	                        th:data-director="${item.getDirector()}"
	                        th:data-actor="${item.getActor()}"
	                />
	            </select>
	        </div>
	        <ul class="form-orders" style="list-style-type: none;">
	        </ul>
	
	        <!--<div class="form-group">
	            <label for="count">주문수량</label>
	            <input type="number" name="count" class="form-control" id="count" placeholder="주문 수량을 입력하세요">
	        </div>-->
	
	        <button type="submit" class="btn btn-primary">Submit</button>
	    </form>
	    <ul class="form-disabled">
	        <li class="form-order" style="display: none;">
	            <h5><span class="item-dtype-nm"></span> > <span class="item-name"></span></h5>
	            <h6>
	                <span class="label-value1"></span> : <span class="item-value1"></span></br>
	                <span class="label-value2"></span> : <span class="item-value2"></span>
	            </h6>
	
	            <input type="hidden" name="memberId">
	            <input type="hidden" name="itemId">
	            <div>
	                <button type="button" onclick="fn_minus_count(this)">-</button><input name = "count" value="1"><button type="button" onclick="fn_plus_count(this)">+</button>
	            </div>
	        </li>
	    </ul>
	
	    <br/>
	    <div th:replace="fragments/footer :: footer" />
	
	</div> <!-- /container -->
	
	</body>
	</html>

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


> java/jpabook/jpashop/exception/NotHasDiscriminator.java

<details title="펼치기/숨기기">
 	<summary> NotHasDiscriminator.java </summary>

	package jpabook.jpashop.exception;
	
	public class NotHasDiscriminator extends RuntimeException{
	    public NotHasDiscriminator() {
	        super();
	    }
	
	    public NotHasDiscriminator(String message) {
	        super(message);
	    }
	
	    public NotHasDiscriminator(String message, Throwable cause) {
	        super(message, cause);
	    }
	
	    public NotHasDiscriminator(Throwable cause) {
	        super(cause);
	    }
	
	    protected NotHasDiscriminator(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
	        super(message, cause, enableSuppression, writableStackTrace);
	    }
	}


</details> 



#### 리소스

> <a href="https://drive.google.com/file/d/1-ZXtQaaeVmqKKquXKHrp_F3-se4O-R2k/view?usp=sharing">bootstrap-4.3.1-dist.zip</a>

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


> test/java/jpabook/jpashop/service/ItemServiceTest.java

<details title="펼치기/숨기기">
 	<summary> ItemServiceTest.java </summary>
 	
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
</details>


> test/java/jpabook/jpashop/service/OrderServiceTest.java

<details title="펼치기/숨기기">
 	<summary> OrderServiceTest.java </summary>
 	
	package jpabook.jpashop.service;
	import jpabook.jpashop.domain.Address;
	import jpabook.jpashop.domain.Member;
	import jpabook.jpashop.domain.Order;
	import jpabook.jpashop.domain.OrderStatus;
	import jpabook.jpashop.domain.item.Book;
	import jpabook.jpashop.domain.item.Item;
	import jpabook.jpashop.repository.ItemRepository;
	import jpabook.jpashop.repository.MemberRepository;
	import jpabook.jpashop.repository.OrderRepository;
	import org.junit.jupiter.api.Assertions;
	import org.junit.jupiter.api.Test;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.boot.test.context.SpringBootTest;
	import org.springframework.transaction.annotation.Transactional;
	
	import javax.persistence.EntityManager;
	
	import static org.junit.jupiter.api.Assertions.*;
	
	@SpringBootTest
	@Transactional
	class OrderServiceTest {
	
	    @Autowired ItemRepository itemRepository;
	    @Autowired MemberRepository memberRepository;
	    @Autowired OrderRepository orderRepository;
	    @Autowired OrderService orderService;
	    @Autowired EntityManager em;
	
	    @Test
	    public void 상품주문() throws Exception{
	        //given
	        Member member = createMember(); //회원1 생성
	
	        int stockQuantity = 10;
	        Book book = createBook("JPA 기본서",100000,stockQuantity);
	
	        //when
	        int orderCount = 2;
	        Long orderId = orderService.order(member.getId(), book.getId(), orderCount);
	
	        //then
	        Order getOrder = orderRepository.findOne(orderId);
	
	        assertEquals( OrderStatus.ORDER, getOrder.getStatus(), "상품 주문시 상태는 ORDER");
	        assertEquals( 1, getOrder.getOrderItems().size(), "주문한 상품 종류 수가 일치해야한다.");
	        assertEquals( 100000 * orderCount, getOrder.getTotalPrice(), "주문 가격은 가격 * 수량이다.");
	        assertEquals( stockQuantity-orderCount, book.getStockQuantity(), "주문 수량만큼 재고가 줄어야 한다.");
	
	    }
	
	    @Test
	    public void 상품주문_재고수량초과() throws Exception{
	        //given
	        Member member = createMember(); //회원1 생성
	
	        int stockQuantity = 10;
	        Item item = createBook("JPA 기본서",100000,stockQuantity);
	
	        //when
	        int orderCount = 11;
	
	        assertThrows(NotEnoughStockException.class, () -> {
	            orderService.order(member.getId(), item.getId(), orderCount);
	        });
	
	        //then
	        //fail("재고 수량 부족 예외가 발생해야 한다.");
	
	    }
	
	    @Test
	    public void 주문취소() throws Exception{
	        //given
	        Member member = createMember(); //회원1 생성
	
	        int stockQuantity = 10;
	        Item item = createBook("JPA 기본서",100000,stockQuantity);
	
	        int orderCount = 2;
	
	        Long orderId = orderService.order(member.getId(), item.getId(), orderCount);
	
	        //when
	        orderService.cancelOrder(orderId);
	
	
	        //then
	        Order getOrder = orderRepository.findOne(orderId);
	        assertEquals( OrderStatus.CANCEL, getOrder.getStatus(), "상품 주문 취소시 상태는 CANCEL");
	        assertEquals( 10, item.getStockQuantity(), "주문이 취소된 상품은 그만큼 재고가 증가해야한다.");
	
	
	    }
	
	    private Member createMember() {
	        Member member = new Member();
	        member.setName("회원1");
	        member.setAddress(new Address("서울", "강변로", "123-123"));
	        em.persist(member);
	        return member;
	    }
	    
	    private Book createBook(String name, int price, int stockQuantity) {
	        Book book = new Book();
	        book.setName(name);
	        book.setPrice(price);
	        book.setStockQuantity(stockQuantity);
	        em.persist(book);
	        return book;
	    }
	}
</details>	

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
