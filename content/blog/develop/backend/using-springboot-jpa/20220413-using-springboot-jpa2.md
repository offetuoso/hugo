---
title: "[스프링부트 JPA 활용] View 환경 설정"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-13
slug: "view-preferences"
description: "[스프링부트 JPA 활용]  View 환경 설정"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---


# View 환경 설정
-----------------------------------

## Thymeleaf
------------------------------------------
> <a href="https://www.thymeleaf.org/">Thymeleaf</a>

> Spring에서도 밀고 있고, 스프링과 많은 기능을 제공하고 있어, Jsp 보다 Thymeleaf를 사용하는 추세입니다.

> 장점은 

> 자연 템플릿 (Natural Templates) <br>
> 마크업을 깨트리지 않고 html 마커 안에 프로그래밍 문법을 넣어 기능을 
개발 할 수 있습니다. WAS 없이도 브라우저만으로도 템플릿의 결과물을 볼 수 있습니다.

```
<table>
  <thead>
    <tr>
      <th th:text="#{msgs.headers.name}">Name</th>
      <th th:text="#{msgs.headers.price}">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr th:each="prod: ${allProducts}">
      <td th:text="${prod.name}">Oranges</td>
      <td th:text="${#numbers.formatDecimal(prod.price, 1, 2)}">0.99</td>
    </tr>
  </tbody>
</table>
```


> 단점은 마크업을 <br></br> 이런식으로 정확하게 닫아줘야 인식 하는 문제가 있었지만, 3.0에서는 개선되어 <br>로 사용가능합니다.

> 또 기존 JSP 문법과 다르기 때문에 메뉴얼을 참조해 사용해야합니다.

> 최근에는 서버 사이드 뷰 템플릿 보다 리액트나 뷰js 등 좋은 프론트엔드 프레임워크가 있기 때문에 그쪽을 더 많이 사용합니다.

### 스프링부트 thymeleaf viewName 매핑
-------------------------
> resuources:templates/[viewName].html




> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
