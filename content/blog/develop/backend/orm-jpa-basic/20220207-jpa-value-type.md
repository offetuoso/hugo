---
title: "JPA 값 타입"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-07
slug: "jpa-value-type"
description: "JPA 값 타입"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# 값 타입
--------------------------------

## 목차
--------------------------------
> - 기본값 타입
> - 임베디드 타입(복합 값 타입)
> - 값 타입과 불변 객체
> - 값 타입의 비교
> - 값 타입 컬렉션

### 기본값 타입
--------------------------------

#### JPA의 데이터 타입 분류

> - 엔티티 타입
>	- @Entity로 정의하는 객체
>	- 데이터가 변해도 식별자로 지속해서 추적 가능
> 	- 예) 회원의 엔티티의 키나 나이 값을 변경해도 식별자로 인식 가능

> - 값 타입
>	- int, Integer, String처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체
>	- 식별자가 없고 값만 있으므로 변경시 추적불가
>	- 예)숫자 100을 200으로 변경하면 완전히 다른 값으로 대체


#### 값 타입 분류
> - 기본값 타입
> 	- 자바 기본 타입(int, double)
>	- 래퍼 클래스(Integer, Long)
>	- String
> - <mark>임베디드 타입</mark>(embedded type, 복합 값 타입)
> 예) 좌표 X,Y 묶어서 Position 객체 하나로 사용

> - <mark>컬렉션 값 타입</mark>(collection value type)
> 자바 컬렉션 객체안에 기본값 타입 혹은 임베디드 타입 등을 추가해 사용

#### 기본값 타입
---------------------------------------
> - 예) String name, int age
> - 생명주기를 엔티티에 의존
>	- 예) 회원을 삭제하면 이름, 나이 필드도 함께 삭제
> - 값 티입은 공유하면 안됨(사이드 이팩트, 부수효과 조심)
>	- 예) 회원 이름 변경시 다른 회원의 이름도 함께 변경되면 안됨 

#### 참고 : 자바의 기본 타입은 절대 공유 X
> - int, double 같은 기본 타입(primitive type)은 절대 공유 되면 안됨
> - 기본 타입은 항상 값을 복사함
> - Integer같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 변경X

> ValueMain.java

```
package relativemapping;

public class ValueMain {
    public static void main(String[] args) {

        int a = 10;
        int b = a; // 참조가 아니라, a의 값 세팅

        a = 20;

        System.out.println("a = " + a); // a = 20
        System.out.println("b = " + b); // b = 10
    }
}

```

> ValueMain.java

```
package relativemapping;

public class ValueMain {
    public static void main(String[] args) {

        Integer a = new Integer(10);
        Integer b = a;

        //a.setValue(20); //만약 Integer를 수정할 수 있는 함수가 있었다면, a와 b 모두 20으로 수정될 것입니다.

        System.out.println("a = " + a);
        System.out.println("b = " + b);

    }
}

```

> 자바의 기본값 타입을 썻을때 사이드 이펙트 없이 안전하게 개발할 수 있는 이유였습니다.

> 여기까지는 자바 기초에서 다루었던 내용인데 왜 또 다룰까 하겠지만 JPA에서는 이것이 당연하지 않고 매우 중요합니다. <br>








#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>