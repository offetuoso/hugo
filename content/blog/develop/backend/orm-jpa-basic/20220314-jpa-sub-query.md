---
title: "JPA 서브 쿼리(Sub Query)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-14
slug: "sub-query"
description: "JPA 서브 쿼리(Sub Query)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# JPA 서브 쿼리(Sub Query)
-------------------------------------

## 서브 쿼리
----------------------------------------------
> - 나이가 평균보다 많은 회원

```
SELECT m FROM Member m 
WHERE m.age > (SELECT AVG(m2.age) FROM Member m2)
```

> - 한 건이라도 주문한 고객 

```
SELECT m FROM Member m 
WHERE (SELECT COUNT(o) FROM Order o WHERE m = o.member) > 0
```

> 일반적인 SQL과 같이 서브 쿼리를 사용할 수 있습니다. 

### 서브 쿼리 지원 함수
----------------------------------------------
> - [NOT] EXISTS (subquery) : 서브쿼리에 결과가 존재하면 참
>	- {ALL|ANY|SOME} (subquery) 
>	- ALL 모두 만족하면 참
>	- ANY, SOME: 같은 의미, 조건을 하나라도 만족하면 참
> - [NOT] IN (subquery) : 서브쿼리의 결과 중 하나라도 같은 것이 있으면 참 

#### 서브 쿼리 지원 함수 - 예제
> - 팀A 소속인 회원

```
SELECT m FROM Member m
WHERE EXISTS (SELECT t FROM m.team t WHERE t.name = '팀A')
```

> - 전체 상품 각각의 재고보다 주문량이 많은 주문들

```
SELECT o FROM Order o
WHERE o.orderAmount > ALL (SELECT p.stockAmount FROM Product p)
```

> - 어떤 팀이든 팀에 소속된 회원

```
SELECT m FROM Member m 
WHERE m.team = ANY(SELECT t FROM Team t)
```

### JPA 서브 쿼리 한계
-------------------------------------------------
> - JPA(표준스펙에서)는 WHERE, HAVING 절에서만 서브 쿼리 사용 가능
> - SELECT 절도 가능(하이버네이트에서 지원)

```
SELECT m, (SELECT AVG(m2.age) FROM Member m2) AS AVG_AGE FROM Member m 
```

> - <mark>FROM 절의 서브 쿼리는 현재 JPQL에서 불가능</mark>
>	<mark>1. 조인으로 풀 수 있으면 풀어서 해결</mark>
>   2. 애플리케이션 서비스에서 쿼리를 나누어 날리고 서비스에서 데이터 조합
>   3. Native Query로 작성 
 
> FROM 절의 서브 쿼리 예제 (JPA에서 지원 안됨)

```
SELECT mm.age, mm.username FROM (SELECT m.age, m.username FROM Member m) mm
```

> 서브 쿼리를 이용해 데이터 타입을 변경하거나 뷰에 대한 로직이 있거나 뷰가 원하는 식으로 문자를 바꾸거나 그런 경우는 JPA를 사용하면 애플리케이션 서비스로 끌고가서 서비스에서 처리하는 것이 FROM 절의 서브 쿼리를 줄일 수 있는 방법입니다.  

#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>