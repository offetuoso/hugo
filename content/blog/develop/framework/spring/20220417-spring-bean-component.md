
---
title: "[Spring] @Bean과 @Component"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-17
slug: "spring-bean-component"
description: "@Bean과 @Component"	
keywords: ["Spring"]
draft: false
categories: ["Java"]
subcategories: ["Spring"]
tags: ["Spring","Framework","SpringFramework"]
math: false
toc: true
---

# [Spring] @Bean 과 @Component
--------------------------

## @Bean 과 @Component 어노테이션이란 ? 
--------------------------

> IoC Container는 특정 어노테이션이 달려있는 클래스를 빈으로 만들기 위해 빈 스캐닝을 합니다. 

> - @Configuration
> - @Bean
> - @Component
> - @Repository
> - @Service
> - @Controller

> 대표적으로 빈으로 사용 할 수 있게 해주는 어노테이션은 대표적으로 빈으로 사용 할 수 있도록 해주는 어노테이션은 @Bean과 @Component이 있습니다.

## @Bean VS @Component
--------------------------

### @Bean
--------------------------
> 개발자가 작성한 <mark>메소드를 통해 반환되는 객체를 Bean으로 만듬.</mark>
> - @Bean은 개발자가 직접 제어가 불가능한 외부 라이브러리를 사용할 때 사용.
> - @Configuration을 선언한 클래스 내부에서 사용


### @Component
--------------------------
> @Component는 개발자가 직접 작성한 <mark>Class를 Bean으로 만듬.</mark>


