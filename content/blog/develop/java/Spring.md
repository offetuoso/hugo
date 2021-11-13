
---
title: "Spring Framework"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-11-06
slug: "spring"
description: "스프링"	
keywords: ["Spring"]
draft: true
categories: ["Spring"]
tags: ["Spring","Framework","SpringFramework"]
math: false
toc: true
---

# 스프링 프레임워크 (Spring Framework)

## 스프링 

> 스프링이 처음 나왔을 당시, 자바 엔터프라이즈 애플리케이션을 개발하는 가장 일반적인 방법은 EJB(Enterprice Java Beans)를 사용한는 것이였습니다. 그러나 EJB는 학습 시간이 오래 걸리고 개발 및 유지보수가 어렵다는 점, EJB 컴포넌트를 배치하기 위한 WAS가 굉장히 고가의 장비였기 때문에 개발자들에게 외면 받기 시작했습니다. 이 시기를 개발자들은 자바의 겨울에 비유했고, 스프링이 등장함으로써 그 EJB를 사용하던 시기가 끝나고 봄이 찾아오게 될 것이라는 의미로 이 framework를 스프링이라 이름지었다고 합니다.

## 스프링의 특징

> 1. 경량
> 2. DI
> 3. 제어의 역행 (IoC)
> 4. 관점지향 프로그래밍 (AOP)

### DI(Dependency Injection) 종속성 주입
> 클래스 B의 객체를 부품으로 사용하는 클래스 A가 있습니다. 이런 경우 A에서 B를 사용하는 2가지 방식이 있습니다. 

> 1. B를 포함하고 있는 일체형으로 개발 (Composition Has a)

```
class A
{
	private B b; // B는 A의 종속되어 있다. B는 A의 부품(Dependency)이다.
	
	public A(){
		b = new B();
	}
}

~~~~~~~ 
// A 생성
A a = new A(); 

```


> 2. B를 외부에서 생성하는 조립형 (Association has a)
```
class A
{
	private B b;
	
	public A(){
		//b = new B();
	}
	
	public A(B b){
		this.b = b;
	}
	
	public void setB(B b){
		this.b = b;
	}
}

~~~~~~~ 
// setter Injection
B b = new B(); // Dependency
A a = new A();

a.setB(b); << injection

// Construction Injection 
B b = new B(); // Dependency
A a = new A(b);

```

> 용산에서 컴퓨터를 구매할때도 대리점에서 완제품을 구매할 수도 있고, 조립식 컴퓨터를 구매할 수도 있습니다. 
> 조립식 컴퓨터를 구매하면 원하는 부품으로 컴퓨터를 구성하고, 업그레이드도 용이하지만 조립을 해야하는 번거로움이 있습니다. 
> 이런 불편함을 해결하는 방식으로는 금액을 좀더 지불하면 조립을 해주는 서비스가 있습니다. 이처럼 소프트웨어에서도 객체를 조립해주는 서비스를 DI라고 부르며, 스프링이 이러한 기능을 제공해줍니다. 


> PC를 구매할때도, 조립식 컴퓨터를 구매하면 원하는 부품으로 구성하고, 업그레이드도 용이하지만 조립을 해야하는 번거로움이 있습니다. 
> 이런 불편함을 해결하는 방법은 조립을 해주는 서비스를 받으면 좀더 편리할텐데, 이를 DI 라고 합니다. 소프트웨어에서도 객체를 조립해주는 도구가 있습니다. Spring이 그것을 해줍니다.  


### IoC 컨테이너
> 스프링의 가장 기본적인 기능중 부품을 조립해주는 능력이 있는데, 이를 위해서 여러가지 부품(Dependency)를 주문서에 입력해서 Spring에게 제공해 줘야 합니다. 스프링은 우리가 제공한 주문서 대로 부품을 조립하게 되는데, 어떠한 부품이 필요하고 그 부품들이 어떠한 조립관계를 가져야하는지 명세화 할 수 있어야 하는데 그것을 하기 위해 XML과 Annotation를 이용해 설정을 합니다.


> 주문서에 있는 부품들(Dependency 객체)을 담기위해서 컨테이너를 이용합니다. 부품들을 담기 때문에 Dependency Container라고 할 수 있는데, 스프링에서는 이를 IoC Container라고 부릅니다. 

> IoC 컨테이너에게 어떤 부품로 어떻게 조립해주세요 라고 전달한다면 부품을 생성하고 조립까지 해줍니다. 심지어는 더 큰 단위로 결합까지 해줍니다. 만들어지는 순서를 보면 작은 부품(Dependency, 종속 객체) 부터 만들고 큰부품을 만들고 결합시킵니다. 

> 일반적으로 일체형 (B를 포함하고 있는 일체형으로 개발)할 경우

```
A -> B
```

> A라는 클래스가 만들어지고, A에서 B객체를 만들게 되고, 사용자는 A객체만 만들뿐, B는 자동적으로 만들어집니다. 

> 하지만 반대로 결합(조립)형으로 만들어지는 프로그램은 더 작은 부품부터 만들어집니다. 
> 주문한 부품과 조립에 대한 설명대로 IoC가 생성하게 되는데 객체를 생성하는 순서를 보게되면 B가 만들어지고 A에 결합되는 순서로 만들어 집니다. 

```
B -> A
```

> 결합이라고 하게되는 것들은 순서가 역순입니다. 역순이라는 것을 다르게 말하면 Inversion of Control 입니다. 

> IoC Container는 역순으로 Dependency 구성하는 컨테이터입니다. 


### Bean 
> 스프링 IoC 컨테이너가 관리하는 객체







 









## 느슨한 결합력과 인터페이스 


https://velog.io/@outstandingboy/Spring-%EC%99%9C-%EC%8A%A4%ED%94%84%EB%A7%81-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0%EA%B9%8C-Spring-vs-EJB-JavaEE#-%EC%8B%9C%EB%A6%AC%EC%A6%88---%EC%8A%A4%ED%94%84%EB%A7%81-50

https://ybdeveloper.tistory.com/29
