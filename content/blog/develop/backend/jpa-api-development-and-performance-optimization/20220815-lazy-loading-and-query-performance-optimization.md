---
title: "[스프링부트 JPA API개발 성능최적화] 지연 로딩과 조회 성능 최적화"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-09-04
slug: "lazy-loading-and-query-performance-optimization"
description: "[스프링부트 JPA API개발 성능최적화] 지연 로딩과 조회 성능 최적화"
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA API개발 성능최적화","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 스프링부트 JPA API개발 성능최적화
-------------------------------

## 목차
----------------------------------
> 5. API 개발 기본
>	- 회원 등록 API
>	- 회원 수정 API
>	- 회원 조회 API
> 6. API 개발 고급
>	- 조회용 샘플 데이터 입력
>	- 지연 로딩과 조회 성능 최적화
>	- 컬렉션 조회 최적화
>	- 페이징과 한계 돌파
>	- OSIV와 성능 최적화
> 7. 다음으로
>	- 스프링 데이터 JPA 소개
>	- QueryDSL 소개
>	- 마무리

## API 개발 고급
-----------------------------------------
> 대부분 조회에서 성능 이슈가 많이 나오는데 어떻게 조회 API를 성능 최적화 할지 심도 깊게 공부해 보도록 하겠습니다.

### 지연 로딩과 조회 성능 최적화
> 주문 + 배송정보 회원을 조회하는 API를 생성 <br>
> 지연 로딩 때문에 발생하는 성능 문제를 단계적으로 해결해보겠습니다.

> 해당 내용은 매우 중요하며, 실무에서 JPA를 사용하려면 100%이해해야 합니다. 

### 간단한 주문 조회 V1 : 엔티티 직접 노출
> xToOne(ManyToOne,OneToOne) 관계에서 성능 최적화할 것인가

> - Order -> Member // @ManyToOne(fetch = FetchType.LAZY)
> - Order -> Delivery // @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)

> java/jpabook/jpashop/api/OrderSimpleApiController.java

```
package jpabook.jpashop.api;

import jpabook.jpashop.domain.Order;
import jpabook.jpashop.dto.OrderSearch;
import jpabook.jpashop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


/*
*   xToOne (ManyToOne, OneToOne)
*   Order
*   Order -> Member
*   Order -> Delivery
* */
@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {

    private  final OrderRepository orderRepository;

    @GetMapping("/api/v1/simple-orders")
    public List<Order> getOrdersV1(){
        return orderRepository.findAllByString(new OrderSearch());
    }
}

```

> /api/v1/simple-orders는 이전에 하면 안된다고 하였던, 엔티티 반환을 적용하여 바로 실행해 보겠습니다.

```

java.lang.IllegalStateException: Cannot call sendError() after the response has been committed
	at org.apache.catalina.connector.ResponseFacade.sendError(ResponseFacade.java:472) ~[tomcat-embed-core-9.0.60.jar:9.0.60]
	at org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver.sendServerError(DefaultHandlerExceptionResolver.java:552) ~[spring-webmvc-5.3.18.jar:5.3.18]
	a [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.http.converter.HttpMessageNotWritableException: Could not write JSON: Infinite recursion (StackOverflowError); nested exception is com.fasterxml.jackson.databind.JsonMappingException: Infinite recursion (StackOverflowError) (through reference chain: jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]-

...
...

2022-08-15 17:07:32.472 ERROR 18680 --- [nio-8080-exec-2] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.http.converter.HttpMessageNotWritableException: Could not write JSON: Infinite recursion (StackOverflowError); nested exception is com.fasterxml.jackson.databind.JsonMappingException: Infinite recursion (StackOverflowError) (through reference chain: jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"]->org.hibernate.collection.internal.PersistentBag[0]->jpabook.jpashop.domain.Order["member"]->jpabook.jpashop.domain.Member$HibernateProxy$6NSrsuFZ["orders"])] with root cause

java.lang.StackOverflowError: null

```

> 위와 같은 오류가 납니다. 

> 이전 게시물에서 말씀드렸던 엔티티의 무한루프 문제가 또 발생합니다. 

> <a href="https://offetuoso.github.io/blog/develop/troubleshooting/jpa/java.lang.illegalstateexception-cannot-call-senderror-after-the-response-has-been-committed/">
JPA 양방향 무한 루프 java.lang.IllegalStateException: ...</>

> 이러한 문제가 운영시 생기면 큰 장애로 번질수 있기 때문에 조심해야합니다. 

> Order와 연결된 연관관계 중 Order와 반대편 엔티티에 @JsonIgnore를 해주시면 됩니다.

> Member.java

```
package jpabook.jpashop.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
//@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "id")
public class Member {


    public Member() {
    }

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String name;

    @Embedded
    private Address address;

    @JsonIgnore
    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();

}

```

> OrderItem.java

```
package jpabook.jpashop.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jpabook.jpashop.domain.item.Item;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    //protected OrderItem() {} //생성자를 사용 불가로 하고 CteateOrderItem 사용 유도

    @Id @GeneratedValue
    @Column(name = "order_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "item_id")
    private Item item;

    @JsonIgnore
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
        return getOrderPrice() * getCount();
    }
}

```

> Delivery

```
package jpabook.jpashop.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
            , mappedBy = "delivery")
    private Order order;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status; //READY, COMP
}

```

> 이후 다시 돌려보면 새로운 오류에 빠지게 됩니다. 


```
{
    "timestamp": "2022-08-15T08:24:46.374+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "org.springframework.http.converter.HttpMessageConversionException: Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]; nested exception is com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])\r\n\tat org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter.writeInternal(AbstractJackson2HttpMessageConverter.java:462)\r\n\tat org.springframework.http.converter.AbstractGenericHttpMessageConverter.write(AbstractGenericHttpMessageConverter.java:104)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.AbstractMessageConverterMethodProcessor.writeWithMessageConverters(AbstractMessageConverterMethodProcessor.java:290)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.handleReturnValue(RequestResponseBodyMethodProcessor.java:183)\r\n\tat org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite.handleReturnValue(HandlerMethodReturnValueHandlerComposite.java:78)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:135)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)\r\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1067)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:963)\r\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)\r\n\tat org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:655)\r\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)\r\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)\r\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)\r\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)\r\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)\r\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)\r\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)\r\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)\r\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)\r\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:889)\r\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)\r\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)\r\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\r\n\tat java.base/java.lang.Thread.run(Thread.java:834)\r\nCaused by: com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])\r\n\tat com.fasterxml.jackson.databind.exc.InvalidDefinitionException.from(InvalidDefinitionException.java:77)\r\n\tat com.fasterxml.jackson.databind.SerializerProvider.reportBadDefinition(SerializerProvider.java:1300)\r\n\tat com.fasterxml.jackson.databind.DatabindContext.reportBadDefinition(DatabindContext.java:400)\r\n\tat com.fasterxml.jackson.databind.ser.impl.UnknownSerializer.failForEmpty(UnknownSerializer.java:46)\r\n\tat com.fasterxml.jackson.databind.ser.impl.UnknownSerializer.serialize(UnknownSerializer.java:29)\r\n\tat com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.java:728)\r\n\tat com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.java:774)\r\n\tat com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.java:178)\r\n\tat com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.java:728)\r\n\tat com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.java:774)\r\n\tat com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.java:178)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serializeContents(CollectionSerializer.java:145)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serialize(CollectionSerializer.java:107)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serialize(CollectionSerializer.java:25)\r\n\tat com.fasterxml.jackson.databind.ser.DefaultSerializerProvider._serialize(DefaultSerializerProvider.java:480)\r\n\tat com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.serializeValue(DefaultSerializerProvider.java:400)\r\n\tat com.fasterxml.jackson.databind.ObjectWriter$Prefetch.serialize(ObjectWriter.java:1514)\r\n\tat com.fasterxml.jackson.databind.ObjectWriter.writeValue(ObjectWriter.java:1007)\r\n\tat org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter.writeInternal(AbstractJackson2HttpMessageConverter.java:456)\r\n\t... 48 more\r\n",
    "message": "Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]; nested exception is com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])",
    "path": "/api/v1/simple-orders"
}
```

> 지연로딩으로 설정된 엔티티를 API에서 내려줄 때, Jackson이 데이터를 변환하다가 알 수 없는 타입이라는 에러가 발생합니다. 


#### Jackson으로 Order 엔티티를 Serialize를 할때, LAZY(LAZY 옵션은 필요할 때 조회) 설정으로 비어있는 객체를 Serialize 하려고 해서 발생되는 문제 해결방법 

<a href="https://offetuoso.github.io/blog/develop/troubleshooting/jpa/no-serializer-found-for-class/">JPA Lazy 로딩 Jackson Serialize 에러 - No serializer found for class...</a>

#### 1. DTO로 바꾸어 사용할 데이터만 반환하여 사용
##### 2. hibernate5 :  Jackson을 위한 새로운 Hibernate 모듈을 위한 빈을 생성

> Gradle
```
	implementation 'com.fasterxml.jackson.datatype:jackson-datatype-hibernate5'
```
##### Hibernate5Module Bean 등록
> JpashopApplication.java

```
@Bean
Hibernate5Module hibernate5Module() {
    Hibernate5Module hibernate5Module = new Hibernate5Module();
    // 강제로 지연로딩 해서 엔티티 정보를 가져오도록 설정 한다.
    hibernate5Module.configure(Hibernate5Module.Feature.FORCE_LAZY_LOADING, true);
    return hibernate5Module;
}
```

> jackson-datatype-hibernate5 모듈을 추가하고 Bean 등록을 하게 되면, 지연로딩으로 설정된 프록시 엔티티를 무시하고 null 값으로 설정합니다. 

##### Hibernate5Module LAZY Loding 강제 데이터 로딩
> Hibernate5Module의 설정을 Hibernate5Module.Feature.FORCE_LAZY_LOADING 을 True로 변경해 강제 LAZY 로딩 설정된 데이터를 가져옵니다.

```
	@Bean
		Hibernate5Module hibernate5Module(){
		Hibernate5Module hibernate5Module = new Hibernate5Module();
		hibernate5Module.configure(Hibernate5Module.Feature.FORCE_LAZY_LOADING, true);
		return hibernate5Module;
	}
```


##### FORCE_LAZY_LOADING 없이 원하는 엔티티 조회

> JpashopApplication

```
@Bean
		Hibernate5Module hibernate5Module(){
		Hibernate5Module hibernate5Module = new Hibernate5Module();
		//hibernate5Module.configure(Hibernate5Module.Feature.FORCE_LAZY_LOADING, true);
		return hibernate5Module;
	}

```

> OrderSimpleApiController.java

```
 @GetMapping("/api/v1/simple-orders")
    public List<Order> getOrdersV1(){


        List<Order> orders = orderRepository.findAllByString(new OrderSearch());

        for (Order order : orders){
            order.getMember().getName(); // LAZY 강제 초기화
            order.getDelivery();
        }

        return orders;
    }
```


#### 3. yml spring.jackson.serialization.fail-on-empty-beans 값 false 

```
  jackson:
    serialization:
      fail-on-empty-beans: false
```

#### 4. 오류가 나는 컬럼에 @JsonIgnore를 설정해주기
#### 5. LAZY를 EAGER로 변경

> 해당 방법을 사용하면 안되는 이유는 

> 요구사항이 Order와 Member, Delivery의 정보를 가져 오고 싶은데, 해당 모든 데이터들을 가져오다 보니 

> /api/v1/simple-orders - response

```
[
    {
        "id": 35,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 37,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": [],
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            }
        ],
        "delivery": {
            "id": 36,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-07-30T15:23:25.537696",
        "status": "CANCEL",
        "totalPrice": 20000
    },
    {
        "id": 88,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 90,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": [],
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 91,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": [],
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 3,
                "totalPrice": 633
            }
        ],
        "delivery": {
            "id": 89,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-08-01T23:19:02.252476",
        "status": "ORDER",
        "totalPrice": 20633
    },
    {
        "id": 92,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 94,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": [],
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 95,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": [],
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 1,
                "totalPrice": 10000
            },
            {
                "id": 96,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": [],
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 1,
                "totalPrice": 211
            }
        ],
        "delivery": {
            "id": 93,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-08-02T00:58:44.937685",
        "status": "CANCEL",
        "totalPrice": 30211
    }
]
```

> OrderItem까지 모두 조회해 온것을 알 수 있습니다.

> 이로인해 로우만큼 또 OrderItem을 조회하여 성능에도 문제가 있으며,

> 엔티티가 변경 되었을때 API스팩이 모두 변경될 수 있습니다. 

> 그렇기 때문에 엔티티를 그대로 반환하는 것은 안좋습니다.

> 또 API SPEC에서 필요한 것만 노출해야 하는 것이 모든 데이터 들을 제공해줄 경우 제공받은 팀에서 다른 컬럼들을 사용하고 있다면, API를 수정할때 사용하는 모든 팀들과 소스를 같이 수정해야하는 문제도 가지고 있습니다.

#### 주의 
> - 엔티티를 직접 노출할 때는 양방향 연관관계가 걸린 곳은 꼭 한쪽을 @JsonIgnore 처리 해야 한다. 안그러면 양쪽을 서로 호출하면서 무한 루프에 걸린다.

> - 앞에서 계속 강조했듯이 정말 간단한 애플리케이션이 아니라면 엔티티를 API 응답으로 외부로 노출하는 것은 좋지 않다. 따라서 <code>Hibernate5Module</code>를 사용하는 것보다 DTO로 반환하는 것이 더 좋은 방법이다.

> - 지연(LAZY) 로딩을 피하기 위해 즉시(EAGER) 로딩으로 설정하면 안된다. 즉시 로딩 때문에  연관관계가 필요 없는 경우에도 데이터를 항상 조회해소 성능 이슈를 발생시킬수 있다. 즉시 로딩으로 실행하면 성능 튜닝이 매우 어려워 진다. 항상 지연 로딩을 기본으로 하고, 성능 최적화가 필요한 경우에는 페치 조인을 사용해라(V3)



### 간단한 주문 조회 V2 : Simple OrderDto 사용
> - 최적화 하여 api 요구사항과 스펙에 따라 개발
> - 엔티티를 DTO로 변환하는 일반적인 방법
> - 쿼리가 총 1+N+N 번 수행 ( v1과 쿼리 결과 수는 같다.)
>	- Order 조회 1번 (Order의 결과 로우 수가 N이 된다.)
>	- Order -> Member 지연 로딩 조회 N번
>	- Order -> Delivery 지연로딩 조히 N번
>	- 예) Order의 결과가 4면 1+4+4번 수행된다.(최악의 경우)
>		- 지연로딩은 영속성 컨텍스트에서 조회하므로, 이미 조회된 경우 쿼리를 생략한다.


> OrderSimpleApiController.java 

```
  @GetMapping("/api/v2/simple-orders")
    public Result getOrdersV2(){
        List<Order> orders = orderRepository.findAllByString(new OrderSearch());
        List<SimpleOrderDto> collect = orders.stream()
                .map(o -> new SimpleOrderDto(o))
                .collect(Collectors.toList());

        return new OrderSimpleApiController.Result(collect.size(), collect);
    }
    
    @Data
    static class SimpleOrderDto {
        private long orderId;
        private String name;
        private LocalDateTime orderDate;
        private OrderStatus orderStatus;
        private Address address;

        public SimpleOrderDto(Order order) {
            this.orderId = order.getId();
            this.name = order.getMember().getName();
            this.orderDate = order.getOrderDate();
            this.orderStatus = order.getStatus();
            this.address = order.getDelivery().getAddress();
        }

    }

    @Data
    @AllArgsConstructor
    public class Result<T> {
        private int count;
        private T data;
    }
```

> /api/v2/simple-orders - response

```
{
    "count": 3,
    "data": [
        {
            "orderId": 35,
            "name": "회원1",
            "orderDate": "2022-07-30T15:23:25.537696",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 88,
            "name": "회원1",
            "orderDate": "2022-08-01T23:19:02.252476",
            "orderStatus": "ORDER",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 92,
            "name": "회원1",
            "orderDate": "2022-08-02T00:58:44.937685",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        }
    ]
}
```

> OrderSimpleApiController.java 
> 코드 리팩토링

```
    @GetMapping("/api/v2/simple-orders")
	public Result getOrdersV2(){
        List<Order> orders = orderRepository.findAllByString(new OrderSearch());
        List<SimpleOrderDto> collect = orders.stream()
                //.map(o -> new SimpleOrderDto(o))
                .map(SimpleOrderDto::new)
                .collect(toList()); //static import - import static java.util.stream.Collectors.*;

        return new OrderSimpleApiController.Result(collect.size(), collect);
    }
```

> v1과 v2의 고질적인 문제가 있는데, Lazy Loading으로 인해 SQL이 너무 많이 조회하게 됩니다.

> console

```

2022-09-04 18:34:23.088 DEBUG 29132 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_,
        order0_.delivery_id as delivery4_6_,
        order0_.member_id as member_i5_6_,
        order0_.order_date as order_da2_6_,
        order0_.status as status3_6_ 
    from
        orders order0_ 
    left outer join
        member member1_ 
            on order0_.member_id=member1_.member_id limit ?
...

2022-09-04 18:34:23.097 DEBUG 29132 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        member0_.member_id as member_i1_4_0_,
        member0_.city as city2_4_0_,
        member0_.street as street3_4_0_,
        member0_.zipcode as zipcode4_4_0_,
        member0_.name as name5_4_0_ 
    from
        member member0_ 
    where
        member0_.member_id=?

...

2022-09-04 18:34:23.100 DEBUG 29132 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?

...        

2022-09-04 18:34:23.102 DEBUG 29132 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?

...

2022-09-04 18:34:23.104 DEBUG 29132 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?
```

> Lazy Loading의 메커니즘을 알아야 왜 위의 콘솔처럼 조회 되는지 알 수 있습니다.

> 1. Order -> Sql 1번 -> 결과 주문 수 2개 	- sql 1개

```

	List<Order> orders = orderRepository.findAllByString(new OrderSearch());
```

> 2. 루프 결과 주문 수 만큼  					- sql 4개 (row 2 * Lazy Loading 대상 테이블 2)
> 	N + 1 문제 (1(Order) + N(회원) + N(배송)

`````

	     public SimpleOrderDto(Order order) {
            this.orderId = order.getId();
            this.name = order.getMember().getName(); // Lazy Loading 초기화
            this.orderDate = order.getOrderDate();
            this.orderStatus = order.getStatus();
            this.address = order.getDelivery().getAddress(); ; // Lazy Loading 초기화
        }
`````

> 이를 해결하기 위해 Lazy Loading 에서 Eager로 바꾸면 해결될것 같지만, <br>
> 해결 되지 않을 뿐만 아니라 예측할 수 없는 쿼리가 실행됩니다. 


> Order.java

````

...

    @ManyToOne(fetch = FetchType.EAGER)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;


    // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;
...

````

>  console

```

2022-09-04 19:00:10.544 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_,
        order0_.delivery_id as delivery4_6_,
        order0_.member_id as member_i5_6_,
        order0_.order_date as order_da2_6_,
        order0_.status as status3_6_ 
    from
        orders order0_ 
    left outer join
        member member1_ 
            on order0_.member_id=member1_.member_id limit ?

...

2022-09-04 19:00:10.594 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?

...

2022-09-04 19:00:10.603 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_2_,
        order0_.delivery_id as delivery4_6_2_,
        order0_.member_id as member_i5_6_2_,
        order0_.order_date as order_da2_6_2_,
        order0_.status as status3_6_2_,
        delivery1_.delivery_id as delivery1_2_0_,
        delivery1_.city as city2_2_0_,
        delivery1_.street as street3_2_0_,
        delivery1_.zipcode as zipcode4_2_0_,
        delivery1_.status as status5_2_0_,
        member2_.member_id as member_i1_4_1_,
        member2_.city as city2_4_1_,
        member2_.street as street3_4_1_,
        member2_.zipcode as zipcode4_4_1_,
        member2_.name as name5_4_1_ 
    from
        orders order0_ 
    left outer join
        delivery delivery1_ 
            on order0_.delivery_id=delivery1_.delivery_id 
    left outer join
        member member2_ 
            on order0_.member_id=member2_.member_id 
    where
        order0_.delivery_id=?

...

2022-09-04 19:00:10.618 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?
        

...

2022-09-04 19:00:10.620 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_2_,
        order0_.delivery_id as delivery4_6_2_,
        order0_.member_id as member_i5_6_2_,
        order0_.order_date as order_da2_6_2_,
        order0_.status as status3_6_2_,
        delivery1_.delivery_id as delivery1_2_0_,
        delivery1_.city as city2_2_0_,
        delivery1_.street as street3_2_0_,
        delivery1_.zipcode as zipcode4_2_0_,
        delivery1_.status as status5_2_0_,
        member2_.member_id as member_i1_4_1_,
        member2_.city as city2_4_1_,
        member2_.street as street3_4_1_,
        member2_.zipcode as zipcode4_4_1_,
        member2_.name as name5_4_1_ 
    from
        orders order0_ 
    left outer join
        delivery delivery1_ 
            on order0_.delivery_id=delivery1_.delivery_id 
    left outer join
        member member2_ 
            on order0_.member_id=member2_.member_id 
    where
        order0_.delivery_id=?

...

2022-09-04 19:00:10.622 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?

...

2022-09-04 19:00:10.624 DEBUG 33748 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_2_,
        order0_.delivery_id as delivery4_6_2_,
        order0_.member_id as member_i5_6_2_,
        order0_.order_date as order_da2_6_2_,
        order0_.status as status3_6_2_,
        delivery1_.delivery_id as delivery1_2_0_,
        delivery1_.city as city2_2_0_,
        delivery1_.street as street3_2_0_,
        delivery1_.zipcode as zipcode4_2_0_,
        delivery1_.status as status5_2_0_,
        member2_.member_id as member_i1_4_1_,
        member2_.city as city2_4_1_,
        member2_.street as street3_4_1_,
        member2_.zipcode as zipcode4_4_1_,
        member2_.name as name5_4_1_ 
    from
        orders order0_ 
    left outer join
        delivery delivery1_ 
            on order0_.delivery_id=delivery1_.delivery_id 
    left outer join
        member member2_ 
            on order0_.member_id=member2_.member_id 
    where
        order0_.delivery_id=?
```

>
     
```
    @GetMapping("/api/v2/simple-orders")
    public Result getOrdersV2(){
        List<Order> orders = orderRepository.findAllByString(new OrderSearch()); //Order 조회
        
        List<SimpleOrderDto> collect = orders.stream() 						 //Order 결과만큼 루프
                .map(SimpleOrderDto::new)    
                .collect(toList()); //static import - import static java.util.stream.Collectors.*;

        return new OrderSimpleApiController.Result(collect.size(), collect);
    }
    
    
    @Data
    static class SimpleOrderDto {
        private long orderId;
        private String name;
        private LocalDateTime orderDate;
        private OrderStatus orderStatus;
        private Address address;

        public SimpleOrderDto(Order order) {
            this.orderId = order.getId();
            this.name = order.getMember().getName(); 	//Eager로 Order와 Member 합쳐진 쿼리 수행
            this.orderDate = order.getOrderDate();
            this.orderStatus = order.getStatus();
            this.address = order.getDelivery().getAddress(); //Eager로 Order와 Delivery 합쳐진 쿼리 수행
        }

    }
    
```

### 간단한 주문 조회 V3 : Fetch Join
> Order에 member와 delivery가 Lazy로 되어있지만, 무시하고 fetch 조인을 이용해 한방 쿼리로 조회


> OrderSimpleApiController.java

```
 @GetMapping("/api/v3/simple-orders")
    public Result getOrdersV3(){
        List<Order> orders = orderRepository.findAllWithMemberDelivery(); //새로운 Member,Delivery를 같이 조회 하는 메서드 생성

        List<SimpleOrderDto> collect = orders.stream()
                .map(SimpleOrderDto::new)
                .collect(toList()); //static import - import static java.util.stream.Collectors.*;

        return new OrderSimpleApiController.Result(collect.size(), collect);
    }
```

> OrderRepository.java

```
    public List<Order> findAllWithMemberDelivery() {
        return em.createQuery(
                "SELECT o from Order o" +
                        " join fetch o.member m "+
                        " join fetch o.delivery d ", Order.class
        ).getResultList();
    }
```

> /api/v3/simple-orders - response

```
{
    "count": 3,
    "data": [
        {
            "orderId": 35,
            "name": "회원1",
            "orderDate": "2022-07-30T15:23:25.537696",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 88,
            "name": "회원1",
            "orderDate": "2022-08-01T23:19:02.252476",
            "orderStatus": "ORDER",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 92,
            "name": "회원1",
            "orderDate": "2022-08-02T00:58:44.937685",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        }
    ]
}
```

> console

```
2022-09-09 15:28:13.079 DEBUG 26180 --- [nio-8080-exec-1] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_0_,
        member1_.member_id as member_i1_4_1_,
        delivery2_.delivery_id as delivery1_2_2_,
        order0_.delivery_id as delivery4_6_0_,
        order0_.member_id as member_i5_6_0_,
        order0_.order_date as order_da2_6_0_,
        order0_.status as status3_6_0_,
        member1_.city as city2_4_1_,
        member1_.street as street3_4_1_,
        member1_.zipcode as zipcode4_4_1_,
        member1_.name as name5_4_1_,
        delivery2_.city as city2_2_2_,
        delivery2_.street as street3_2_2_,
        delivery2_.zipcode as zipcode4_2_2_,
        delivery2_.status as status5_2_2_ 
    from
        orders order0_ 
    inner join
        member member1_ 
            on order0_.member_id=member1_.member_id 
    inner join
        delivery delivery2_ 
            on order0_.delivery_id=delivery2_.delivery_id
```

> 이전 쿼리와 다르게 N+1 대신 1건의 쿼리가 발생 되는 것을 확인할 수 있습니다. 

> JPA 모든 성능 이슈 중에 90%는 N+1 문제이며, 이 문제는 fetch 조인을 사용함으로 해결할 수 있습니다. 

> 다시말하면 JPA의 90% 이상은 Lazy로 설정하고, fetch join을 사용하면 거진 성능 최적화 문제를 해결 할 수 있습니다.


### 간단한 주문 조회 V4 : 변환 없이 DTO로 바로 조회
> - 일반적인 SQL을 사용할 때 처럼 원하는 값을 선택해서 조회
> - new 명령어를 사용해서 JPQL의 결과를 DTO로 바로 변환
> - SELECT절에서 원하는 데이터를 직접 선택하므로 DB -> 애플리케이션 네트웍 용량 최적화(생각보다 미비)
> - 리포지토리 재사용성 떨어짐, API 스펙에 맞춘 코드가 리포지토리에 들어가는 단점
>	리포지토리가 API 스펙(화면)에 의존하게 되어, API 스펙이 변경되면 리포지토리를 뜯어 고쳐야 하는 상황이 발생



> OrderSimpleApiController에 있던 SimpleOrderDto를 새로운 class로 OrderSimpleQueryDto로 생성합니다. 

> OrderRepository에서 OrderSimpleApiController의 SimpleOrderDto를 사용하게 되면 종속성이 생기기 때문입니다. 

> java/jpabook/jpashop/dto/OrderSimpleQueryDto.java

```
package jpabook.jpashop.dto;

import jpabook.jpashop.domain.Address;
import jpabook.jpashop.domain.Order;
import jpabook.jpashop.domain.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderSimpleQueryDto {
    private long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    public OrderSimpleQueryDto( Long orderId
                              , String name
                              , LocalDateTime orderDate
                              , OrderStatus orderStatus
                              , Address address
                              ) {
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }

}
```

> OrderRepository.java

```
 public List<OrderSimpleQueryDto> findOrderDtos() {
        String orderSimpleQueryDto = "jpabook.jpashop.dto.OrderSimpleQueryDto";
        
        return em.createQuery(
                "SELECT new "+orderSimpleQueryDto+"(o.id, m.name, o.orderDate, o.status, d.address) "+
                        " from Order o" +
                        " join o.member m "+
                        " join o.delivery d ", OrderSimpleQueryDto.class
        ).getResultList();
    }

```

> new jpabook.jpashop.dto.OrderSimpleQueryDto(o) 를 통해 엔티티를 넘기게 되면 엔티티가 아니라 식별자를 넘기게 되어 각각 o.id, m.name, o.orderDate, o.status, d.address 컬럼을 풀어서 넣어줘야합니다. 

> Address는 엔티티가 아니라 값 타입이기 때문에 o.address로 넘겨도 괜찮습니다.


> /api/v4/simple-orders - response

```
{
    "count": 3,
    "data": [
        {
            "orderId": 35,
            "name": "회원1",
            "orderDate": "2022-07-30T15:23:25.537696",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 88,
            "name": "회원1",
            "orderDate": "2022-08-01T23:19:02.252476",
            "orderStatus": "ORDER",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        {
            "orderId": 92,
            "name": "회원1",
            "orderDate": "2022-08-02T00:58:44.937685",
            "orderStatus": "CANCEL",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        }
    ]
}

```


> console 

````
    select
        order0_.order_id as col_0_0_,
        member1_.name as col_1_0_,
        order0_.order_date as col_2_0_,
        order0_.status as col_3_0_,
        delivery2_.city as col_4_0_,
        delivery2_.street as col_4_1_,
        delivery2_.zipcode as col_4_2_ 
    from
        orders order0_ 
    inner join
        member member1_ 
            on order0_.member_id=member1_.member_id 
    inner join
        delivery delivery2_ 
            on order0_.delivery_id=delivery2_.delivery_id
````

> fetch 조인과 from 이하 동일한 쿼리가 발생하는 것을 확인 할 수 있고, 원하는 컬럼만 조회 한것을 알 수 있습니다.

> V3와 V4는 우열을 가르기 힘들 정도로 크게 성능차이는 없습니다. 

> V3는 사용하는 엔티티만, fetch 조인으로 가져와 모든 컬럼을 사용할 수 있지만,

> V4는 원하는 컬럼만 OrderSimpleQueryDto에 담았기 때문에 해당 DTO 떄만 사용가능해 재사용성이 떨어지게 됩니다.

> 또한 V3는 엔티티를 조회했기 때문에 비즈니스로직에서 조회하여 데이터를 조작할 수 있지만, 
V4 같은 경우 DTO이기 때문에 데이터를 조작할 수 없는 단점도 있습니다.

> 그러면 V3가 무조건 좋은가 하면 상황에 따라 고객이 계속 조회해야 하거나 컬럼의 갯수가 30~40개가 넘어간다면 DTO로 필요한 컬럼만 조회하는 V4가 좋을 수 있습니다. 

#### OderSimpleQueryRepository로 소스 분리
> repository 폴더 아래 order/simpleQuery 2 depth 패키지 구조를 추가해 특정 쿼리용 레포지토리를 분리합니다. 

> java/jpabook/jpashop/repository/order/simpleQuery/OrderSimepleQueryRepository.java

````
package jpabook.jpashop.repository.order.simpleQuery;

import jpabook.jpashop.dto.OrderSimpleQueryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrderSimepleQueryRepository {

    private final EntityManager em;

    public List<OrderSimpleQueryDto> findOrderDtos() {
        String orderSimpleQueryDto = "jpabook.jpashop.dto.OrderSimpleQueryDto";
        return em.createQuery(
                "SELECT new "+orderSimpleQueryDto+"(o.id, m.name, o.orderDate, o.status, d.address) "+
                        " from Order o" +
                        " join o.member m "+
                        " join o.delivery d ", OrderSimpleQueryDto.class
        ).getResultList();
    }
}

````

> 또한 OrderSimpleQueryDto도 dto/order/simpleQuery 에 위치해 주고 참조한 주소들을 수정합니다.

> java/jpabook/jpashop/dto/order/simpleQuery/OrderSimpleQueryDto.java

```
package jpabook.jpashop.dto.order.simpleQuery;

import jpabook.jpashop.domain.Address;
import jpabook.jpashop.domain.Order;
import jpabook.jpashop.domain.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderSimpleQueryDto {
    private long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    public OrderSimpleQueryDto( Long orderId
                              , String name
                              , LocalDateTime orderDate
                              , OrderStatus orderStatus
                              , Address address
                              ) {
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }
}
```

> 이렇게 분리한 이유는 Repository와 DTO는 순수한 엔티티를 조회하는데 사용하고, <br>
> queryRepository, queryDTO는 특정 쿼리나 통계와 같은 화면(요구사항)에 맞춰 사용하는게 유지보수에도 도움이 됩니다.


#### 정리 
> 엔티티를 DTO로 변환하거나, DTO로 바로 조회하는 두가지 방법은 각각 장단점이 있습니다.
> 둘중 상황에 따라서 더 나은 방법을 선택하면 됩니다. 
> 엔티티로 조회하면 리포지토리의 재사용성도 좋고, 개발도 단순해 집니다. 

> 따라서 권장하는 방법은 아래와 같습니다.

> 1. 우선 엔티티를 DTO로 변환하는 방법을 선택한다.
> 2. 필요하면 fetch조인으로 성능을 최적화 한다. -> 대부분 성능 이슈가 해결
> 3. 그래도 안되면 DTO로 직접 조회하는 방법을 사용한다.
> 4. 최후의 방법은 JPA가 제공하는 네이티브 SQL이나 스프링 JDBC Template를 사용해서 SQL을 직접 사용한다.





### 이전 소스
---------------------
> - <a href="https://github.com/offetuoso/jpa-practice.git">https://github.com/offetuoso/jpa-practice.git<a>

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94">실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - 김영한</a>
