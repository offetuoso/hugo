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
draft: true
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

> 회원과 주문의 관계에서 
> 회원이 주문을 했기 때문에 회원에 주문리스트가 있어야 할 것 같지만, 
> 시스템의 입장에서 데이터를 구성할 때 주문에 주문한 회원이 있는것이 바람직 합니다. 

> 주문에서 필터를 통해 회원을 식별하는 것이 가능하기 떄문에 회원에서 주문으로의 리스트는 사실 필요 없다고 보면 됩니다. 


### 테이블
-----------------------------------------------------------

![contact](/images/develop/backend/using-springboot-jpa/domain-model-and-db-architecture/img-007.png)
 
#### 회원(MEMBER)
> 회원의 CITY, STREET, ZIPCODE는 값 타입(임베디드) ADRESS의 정보들이 세팅된 것을 볼 수 있습니다. 

#### 배송(DELIVERY)
> 회원과 마찬가지로 CITY, STREET, ZIPCODE는 값 타입(임베디드) ADRESS의 정보들이 세팅된 것을 볼 수 있습니다. 

#### 상품(ITEM) 
> 상속구조로 되어있던 구조가 한개의 테이블로 생성되었습니다. 또한 DTYPE라는 컬럼이 추가되었습니다. 
> 이것은 Single Table 전략을 적용된것입니다. 

> <a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/proxy-and-relation/"></a>




 

> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
