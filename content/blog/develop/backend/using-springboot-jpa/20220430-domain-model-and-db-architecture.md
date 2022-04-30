---
title: "[스프링부트 JPA 활용] 도메인 모델과 테이블 설계"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-30
slug: "domain-model-and-db-architecture"
description: "[스프링부트 JPA 활용] 도메인 모델과 테이블 설계"
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

## 도메인 모델과 테이블 설계
----------------------------------

### 도메인 모델 설계
----------------------------------
![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-001.png)


![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-002.png)

> 회원은 주문 여러개를 주문 할 수 있습니다. 
> 회원과 주문은 1:N의 관계 입니다.


![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-003.png)

> 회원은 주문을 할때 한번에 여러 상품을 주문할 수 있습니다. 
> 상품은 또한 여러개의 각각의 주문에 담길 수 있습니다. 
> 주문에 여러개의 상품이 담길 수 있기 때문에
 
> 주문과 상품은 N:M 이기 때문에 1:N, M:1로 풀어서 가운데 주문상품을 둡니다.


![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-004.png)

> 1개의 주문당 1개의 배송지가 입력됩니다.

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-005.png)

> 상품은 여거래의 카테고리를 가질수 있고, 카테고리는 여러 상품을 포함할 수 있기 때문에 N:M 의 괸계입니다.

> 상품은 도서, 음반, 영화로 구분되는데 상품이라는 공통속성을 이용하므로 상속 구조로 표현 했습니다.

### 엔티티 설계
-----------------------------------------------------------

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-006.png)

#### 회원(Member) 
> JPA에서 생성해주는 회원 SEQ(PK)인 Id, Name, 임베디드 타입의 Address, Orders 리스트를 가진다. 

#### 주소(Address) 임베디드 타입 
> 값 타입 또는 임베디드 타입이며, city, street, zipcode를 가진다.

#### 주문(Order)  
> 한 번 주문시 여러 상품을 주문할 수 있으므로 주문과 주문 상품은 1:N관계 
> 주문은 상품을 주문한 회원과 주문 정보, 주문 날짜, 주문 상태를 가지고 있다.
> 주문 상태는 열거형을 이용했는데 ORDER와 CANCEL을 표현할 수 있다.

#### 배송(Delivery)
> 배송정보는 어떤 주문으로 인한 배송인지 알아야하기 때문에, 배송정보와 
> 주소 값타입 그리고 주문상태를 가지고 있습니다. 


#### 상품(Item)
> 상품의 이름, 가격, 재고수량, 어느 카테고리에 포함되는지 카테고리 리스트를 가지고 있습니다.
> 상품에는 앨범, 책, 영화가 있으며 앨범은 가수와 기타, 책은 저자와 ISBN,  영화는 감독과 배우 등 각각의 개별 속성들이 있습니다. 

#### 카테고리(Category)
> 카테고리는 계층구조로 부모 카테고리를 가지고 있습니다. 


> 예제로는 JPA에서 나올 수 있는 모든 연관관계가 포함되었습니다. 
> 하지만 N:M이나 양방향 관계는 실무에서 사용하면 안되는것이며 N:1, 1:M 으로 변환하여 사용해야합니다. 
> 관련 내용은 저번 강의 내용을 확인 해 보시면 될듯합니다. 

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/mapping-various-associations/">[자바 ORM 표준 JPA] JPA 다양한 연관관계 매핑</a>


> 회원과 주문의 관계에서 
> 회원이 주문을 했기 때문에 회원에 주문리스트가 있어야 할 것 같지만, 
> 시스템의 입장에서 데이터를 구성할 때 주문에 주문한 회원이 있는것이 바람직 합니다. 

> 주문에서 필터를 통해 회원을 식별하는 것이 가능하기 떄문에 회원에서 주문으로의 리스트는 사실 필요 없다고 보면 됩니다. 


### 테이블 분석 
-----------------------------------------------------------

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-007.png)
 
#### 회원(MEMBER)
> 회원의 CITY, STREET, ZIPCODE는 값 타입(임베디드) ADRESS의 정보들이 세팅된 것을 볼 수 있습니다. 

#### 배송(DELIVERY)
> 회원과 마찬가지로 CITY, STREET, ZIPCODE는 값 타입(임베디드) ADRESS의 정보들이 세팅된 것을 볼 수 있습니다. 

#### 상품(ITEM) 
> 상속구조로 되어있던 구조가 한개의 테이블로 생성되었습니다. 또한 DTYPE라는 컬럼이 추가되었습니다. 
> 이것은 Single Table 전략을 적용된것입니다. 

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/inheritance-mapping/">[자바 ORM 표준 JPA] JPA 상속관계 매핑</a>



#### 주문(ORDERS)
> 회원ID와 주문ID를 가지고, 날짜와 상태를 가집니다. 
> 또 ORDER는 키워드이기 때문에 ORDERS라는 이름으로 관례상 많이 사용합니다. 

#### 주문 상품(ORDER_ITEM) 
> 주문ID와 상품ID를 외래키로 가지고 있습니다. 
> 주문했을 당시의 ITEM 단가, 구매 수량 등을 가지고 있습니다. 


#### 카테고리(CATEGORY), 상품(ITEM)
> 객체지향에서는 양방향 관계에서 각각 List를 가질 수 있지만, 
> 관계형 DB에서는 불가하기 때문에 중간에 CATEGORY_ITEM 라는 매핑 테이블을 두고 N:1, 1:M 관계로 풀어야 합니다. 

> 참고로 생성할 때에는 테이블 명과 컬럼은 소문자 그리고 언더스코어 스타일로 사용합니다.



### 연관관계 분석 
-----------------------------------------------------------

#### 회원 - 주문
> N:1, 1:M의 스타일로 회원에서 주문으로 주문에서 회원으로 모두 가능하며, 
> 연관관계의 주인을 정해야 하는데 외래키가 있는 주문을 연관관계의 주인으로 정하는게 좋다. 
> 그러므로 Order.member를 ORDERS.MEMBER_ID 외래 키와 매핑한다.

> 관계형 DB에서는 1:N이라면 N인 위치에 외래키를 두게 됩니다. 

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-007.png)

> 외래키가 있는 Oder에 연관관계를 두고 Member에는 mappedBy를 써서 연결을 해둡니다. 
> 연관관계의 반대 쪽은 단순 조회 용으로 사용하며 연관관계의 주인을 등록 할때 데이터 세팅을 같이 해줘야 사용할 수 있습니다. 

#### 주문 - 주문상품ㄷ
![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-003.png)

> 주문을 할때 여러개의 상품을 주문할 수 있고 
> 주문 할때 상품 수량과 가격을 가지게 되는데 원 데이터인 상품을 수정할 수 없기 때문에 중간에 테이블 하나를 더 둡니다. 

> Order가 1이고 OrderItem이 N이 됩니다. 그렇기 때문에 
> 외래키는 OrderItem에 두게 되며 연관관계의 주인은 OrderItem이 되게 됩니다.
> OrderItem.order를 ORDER_ITEM.ITEM_ID 와 매핑합니다.


#### 주문상품 - 상품

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-003.png)

> 주문상품과 상품은 N : 1 관계이며 단방향 관계 입니다. 
> OrderItem은 Item을 가지고 있으며 Item을 갈 수있지만, Item에서는 OrderItem으로 갈 수 없습니다.
> OrderItem * - 1 Item의 *도 지워야하지만, N:1의 관계를 설명하기 위해 추가하고 대신 단방향이라고 설명하기 위해서 화살표를 추가하였습니다. 

> 다대일 단방향 관계 OrderItem.order를 ORDER_ITEM.ITEM_ID 외래키랑 매핑한다.

#### 주문 - 배송
> 일대일 단방향 관계 Order.Delivery를 ORDERS.DELIVERY_ID 외래키랑 매핑한다.

#### 카테고리 - 상품
> @ManyToMany를 사용해서 사용한다<mark>실무에서 @ManyToMany는 사용하지 말자, 공부 예제를 위해 사용</mark>

##### 연관관계의 주인
> 외래키가 있는 곳을 연관관계의 주인으로 정해야한다.
> 연관관계의 주인은 단순히 외래키를 누가 관리하나의 문제지 비즈니스상 우위에 있다고 주인으로 정하면 안된다.
> 예를 들어서 자동차의 바퀴가 있으면, 일대다 관계에서 항상 다쪽에  외래키가 있으므로 바퀴를 연관관계의 주인으로 정하면 된다. 물론 자동차를 연관관계의 주인으로 정하는 것이 불가능 하지 않지만 자동차를 연관관계의 주인으로 정하면 자동차가 관리하지 않는 바퀴테이블의 외래 키 값이 업데이트 되므로 관리와 유지보수가 어렵고 추가적으로 별도의 업데이트 쿼리가 발생하는 성능 문제도 있다. 

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/mapping-various-associations/">[자바 ORM 표준 JPA] JPA 다양한 연관관계 매핑</a>



#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
