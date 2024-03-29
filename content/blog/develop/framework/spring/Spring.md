
---
title: "Spring Framework - 작성중"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-11-06
slug: "spring"
description: "스프링"	
keywords: ["Spring"]
draft: true
categories: ["Java"]
subcategories: ["Spring"]
tags: ["Spring","Framework","SpringFramework"]
math: false
toc: true
---

# 스프링 프레임워크 (Spring Framework)

## 스프링 

> 스프링이 처음 나왔을 당시, 자바 엔터프라이즈 애플리케이션을 개발하는 가장 일반적인 방법은 EJB(Enterprice Java Beans)를 사용한는 것이였습니다. 그러나 EJB(Enterprise Java Beans)는 학습 시간이 오래 걸리고 개발 및 유지보수가 어렵다는 점, EJB 컴포넌트를 배치하기 위한 WAS가 굉장히 고가의 장비였기 때문에 개발자들에게 외면 받기 시작했습니다. 이 시기를 개발자들은 자바의 겨울에 비유했고, 스프링이 등장함으로써 그 EJB를 사용하던 시기가 끝나고 봄이 찾아오게 될 것이라는 의미로 이 framework를 스프링이라 이름지었다고 합니다.


## 스프링의 역사 
> - 2002년 로드 존슨 책 출간
> - EJB의 문제점 지적
> - EJB 없이 충분한 고품질의 확장 가능한 애플리케이션을 개발할 수 있다는 것을 보여주고 30000라인 이상의 기반 기술을 코드로 선보임
> - 여기에 지금의 스프링 핵심 개념과 기반 코드가 들어가 있음
> - 책 출간이후 유겐 휠러, 얀 카로프가 로드 존슨에게 오픈소스 프로젝트 제안
> - 스프링의 핵심 코드는 유겐 휠러가 지금도 개발
> - 스프링의 이름은 전통적인 J2EE(EJB)라는 겨울을 지나 새로운 시작이라는 뜻으로 지음


### 스프링 릴리스
> - 2003 스프링 프레임워크 1.0 출시 - XML
> - 2006 스프링 프레임워크 2.0 출시 - XML 편의기능 지원
> - 2009 스프링 프레임워크 3.0 출시 - 자바 코드로 설정
> - 2013 스프링 프레임워크 4.0 출시 - 자바8
> - 2014 스프링 부트 1.0 출시
> - 2017 스프링 프레임워크 5.0, 스프링부트 2.0 출시 - <a href="https://juneyr.dev/reactive-programming">리액티브 프로그래밍</a> 지원
> - 2020 스프링 프레임워크 5.2, 스프링부트 2.3
> - 2021 스프링 프레임워크 5.3, 스프링부트 2.6

### 스프링부트 
> 스프링프레임워크는 설정이나 서버에 배포등 어려움이 있었는데, 프레임워크에 톰캣 같은 서버를 내장하는 것들이 유행하기 시작하고 
스프링에서도 그것을 받아들여 만들어진 것이 스프링부트이다. 

### 리액티브 프로젝트
> node.js와 같은 <a href="https://velog.io/@nittre/%EB%B8%94%EB%A1%9C%ED%82%B9-Vs.-%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9-%EB%8F%99%EA%B8%B0-Vs.-%EB%B9%84%EB%8F%99%EA%B8%B0">논블로킹(NonBlocking)<a> 프로그래밍


### 스프링 프레임워크
> - 핵심 기술: 스프링 DI, AOP, 이벤트, 기타
> - 웹 기술: 스프링 MVC, 스프링 WebFlux
> - 데이터 접근 기술: 트랜젝션, JDBC, ORM지원, XML 지원
> - 기술 통합: 캐시, 이메일, 원격접근, 스케줄링
> - 테스트: 스프링 기반 테스트 지원
> - 언어: 코틀린, 그루비

### 스프링 부트
> - 스프링을 편리하게 사용할 수 있도록 지원, 최근에는 기본으로 사용
> - 단독으로 실행할 수 있는 Tomcat 같운 웹 서버 내장
> - 손쉬운 빌드 구성을 위한 starer 종속성 제공
> - 스프링과 3rd parth(외부) 라이브러리 자동구성
> - 메트릭, 상태확인, 외부 구성 같은 프로덕션 준비 기능 제공

 
## 스프링의 핵심 개념
> 스프링 이전에는 EJB에 종속되어 객체지향의 좋은 장점을 버리고 EJB 개발에 적합한 스타일고 개발을 하게되어, POJO 라는 말이 생겨나며,
스프링에 그것들을 가능하게 해주는 DI라는 기능이 있었음

> - 스프링은 자바 언어 기반의 프레임워크 
> - 자바 언어의 가장 큰 특징 - 객체지향언어
> - 스프링은 객체 지향 언어가 가진 특징을 살려내는 프레임워크
> - 스프링은 좋은 객체 지향 애플리케이션을 개발할 수 있도록 도와주는 프레임워크


## 객체지향 프로그래밍
> - 객체 지향 프로그래밍은 컴퓨터 프로그램을 명령어의 목록으로 보는 시각에서 벗어나 여러개의 독립된 단위, 즉 "객체"들의 모임으로 파악하고자 하는 것이다. 각각 객체는 메시지를 주고받고, 데이터를 처리할 수 있다. (협력)
> - 객체 지향 프로그래밍은 프로그램을 유연하고 변경이 용이하게 만들기 때문에 대규모 소프트웨어 개발에 많이 사용된다.

> 유연하고, 변경이 용이? 
> 레고 블럭 조립하듯이
> 컴퓨터 부품 갈이 끼우듯이
> 컴포넌트를 쉽고 유연하게 변경하면서 개발할 수 있는 방법

### 다형성 

#### 다형성의 실세계 비유
>  역할과 구현으로 세상을 구분 (역할은 인터페이스, 구현은 인터페이스로 구현한 객체)

> 운전자와 자동차를 생각하면, 

> 운전자 역할이 있고, 자동자 역할이 있습니다 

> 자동차 역할을 통해 레이, 모하비, 팰리세이드 등 자동차를 구현하였습니다.

> 운전자는 레이를 타고 운전을 하다가 모하비로 자동차를 바꿔어도 운전을 할 수 있습니다. 

> 운전자(클라이언트)는 자동차의 내부 동작이나 구현방법 등 몰라도 자동차를 운전할 수 있고, 자동차가 바뀌어도 운전을 할 수 있습니다.
이는 자동차를 무한히 추가하고 변경해도 자동차의 역할을 수행할 수 있다면 문제가 되지 않습니다. 

#### 역할과 구분으로 분리 
> 역할과 구현으로 구분하면 세상이 단순해지고, 유연해지며 변경도 편리해진다.
> - 자바 언어의 다형성을 활용
> - 역할 = 인터페이스
> - 구현 = 인터페이스를 구현한 클래스, 구현 객체
> - 객체를 설계할 때 역할과 구현을 명확히 분리
> - 객체 설계시 역할(인터페이스)을 먼저 부여하고, 그 역할을 수행하는 구현 객체 만들기

#### 장점
> - 클라이언트는 대상의 역할(인터페이스)만 알면된다.
> - 클라이언트는 대상의 내부 구조를 몰라도 된다.
> - 클라이언트는 구현 대상의 내부 구조가 변경되어도 영향을 받지 않는다.
> - 클라이언트는 구현 대상 자체를 변경해도 영향을 받지 않는다.


#### 객체의 협력이라는 관계부터 생각
> - 혼자 있는 객체는 없다.
> - 클라이언트 : 요청, 서버 : 응답
> - 수 많은 객체 클라이언트와 객체 서버는 서로 협력 관계를 가진다.

#### 자바 언어의 다형성
> - 오버라이딩을 떠올려보자
> - 오버라이딩 된 메서드가 실행
> - 다형성으로 인터페이스를 구현한 객체를 실행 시점에 유연하게 변경할 수 있다. 
> - 물론 클래스 상속 관계도 다형성, 오버라이딩 적용가능 


### 다형성의 본질 
> - 인터페이스를 구현한 객체 인스턴스를 실행 시점에 유연하게 변경할 수 있다.
> - 다형성의 본질을 이용하려면 협력이라는 객체사이의 관계에서 시작해야한다.
> - 클라이언트를 변경하지 않고, 서버의 구현 기능을 유연하게 변경할 수 있다.


#### 역할과 구분으로 분리 정리
> - 실세계의 역할과 구현이라는 편리한 컨셉을 다형성을 통해 객체 세상으로 가져 올 수 있음
> - 유연하고, 변경이 용이
> - 확장 가능한 설계
> - 클라이언트에 영향을 주지 않는 변경이 가능 
> - 인터페이스를 안정적으로 잘 설계하는 것이 중요

#### 역할과 구분으로 분리 한계
> - 역할(인터페이스) 자체가 변하면, 클라이언트, 서버 모두 큰 변경이 발생한다.
> - 자동차를 비행기로 변경해야 한다면 ?
> - 대본 자체가 변경된다면 ? 
> - USB 인터페이스가 변경 된다면
> - 인터페이스를 안정적으로 잘 설계하는 것이 중요


### 스프링과 객체 지향
> - 다형성이 가장 중요하다
> - 스프링은 다형성을 극대화해서 이용할 수 있게 도와준다.
> - 스프링에서 이야기 하는 제어의 역전(IoC), 의존관계 주입(DI)은 다형성을 활용해서 역할과 구현을 편리하게 다룰수 있도록 지원한다.
> - 스프링을 사용하면 마치 레고 블럭을 조립하듯이! 공연 무대의 배우를 선택 하듯이! 구현을 편리하게 변경할 수 있다.


### 좋은 객체 지향 설계의 5가지 원칙(SOLID) 


두문자| 약어 | 개념
--------|--------|--------
S	|SRP| 단일 책임 원칙 (Single responsibility principle) 한 클래스는 하나의 책임만 가져야 한다.
O	|OCP|개방-폐쇄 원칙 (Open/closed principle) “소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.”
L	|LSP|리스코프 치환 원칙 (Liskov substitution principle) “프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.” 계약에 의한 설계를 참고하라.
I	|ISP| 터페이스 분리 원칙 (Interface segregation principle) “특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다.”
D	|DIP| 의존관계 역전 원칙 (Dependency inversion principle) 프로그래머는 “추상화에 의존해야지, 구체화에 의존하면 안된다.” 의존성 주입은 이 원칙을 따르는 방법 중 하나다.

#### SOLID의 SRP(Single Responsibility Principle) 단일 책임 원칙
> 단일 책임 원칙의 정의는 "클래스는 하나의 책임만 가져야 한다." 라는 규칙입니다. 클래스가 여러 책임을 갖게 되면 그 클래스의 각 책임마다 변경되는 이유가 발생하기 때문에 한 개의 책임만 가져야합니다. 

> - 하나의 책임이라는 것은 모호하다.
	> - 클 수 있고, 작을 수 있다.
	> - 문맥과 상황에 따라 다르다.
> - 중요한 기준은 변경이다. 변경이 있을 때 파급 효과가 적으면 단일 책임 원칙을 잘 따른 것
> - 예) UI와 SQL 등 분리, 객체의 생성과 사용을 분리


##### 단일 책임 원칙의 예제
> 예를 들어 2개의 값을 더하는 메소드와 입력받은 숫자를 출력해주는 메소드가 있다면, add()는 두수를 입력받아 1개의 숫자로 더해 반환을 해주고, printNumber()는 하나의 값을 받아 그 수를 출력하는 각각의 respansibility(책임)을 가지고 있을때

```
    public static int add(int a, int b){
        return a + b;
    }

    public static void printNumber(int a){
        System.out.println(a);
    }
```
	
> 굳이 코드를 줄이기 위해 2가지 책임을 가지는 메소드는 필요없다는 것입니다. 

```
    public static void addPrint(int a, int b){
        System.out.println(a + b);
    }
```

> 위 설명은 간단하니 좀더 디테일한 설명을 위해 Dog이라는 클래스를 생성해 보겠습니다. 

```
import java.util.logging.Level;
import java.util.logging.Logger;

public class Dog {
    private String name;
    private int age;
    private String status;

    Dog(){
        this.status = "앉은 상태";
    }

    Dog(String name, int age, String status){
        this.name = name;
        this.age = age;
        this.status = status;
    }

    public void eat(String food){
        System.out.println(food+"를 먹습니다.");
    }

    public void walk(){
        this.status = "걷는 상태";
    }

    public void speak(String Message){
        System.out.println(Message);
    }
	
	// 강아지의 정보를 출력
    public void printDog(){
        System.out.println("name= "+this.name+" ,age= "+this.age+" ,status= "+this.status);
    }
	
	//강아지의 정보를 로깅
    public void loggingDog(){
        Logger logger = Logger.getGlobal();
        logger.log(Level.INFO,"name= "+this.name+" ,age= "+this.age+" ,status= "+this.status);
    }
}

```

> 위의 코드에서 강아지의 이름과 나이 그리고 상태를 가지고 있고, 먹는 기능, 걷는 기능, 짖는 기능이 있습니다. <br>
하지만 강아지 정보를 출력하거나 강아지 정보를 로깅하는 것은 강아지에 대한 책임만 있는것이 아니라 강아지의 정보 출력과 강아지 정보 로깅의 책임을 가지고 있어 좋은 코드라 보기 어렵습니다.

```
    public String getInfo(){
        return "name= "+this.name+" ,age= "+this.age+" ,status= "+this.status;
    }
```

> 강아지의 정보를 얻어 낼 수 있는 기능을 추가하여, 

```
import java.util.logging.Level;
import java.util.logging.Logger;

public class srpMain {
    static Logger logger = Logger.getGlobal();
    public static void main(String[] args) {
        Dog happy = new Dog("해피",1,"앉은 상태");
       /* happy.printDog();
        happy.loggingDog();*/

        System.out.println(happy.getInfo());
        logger.log(Level.INFO,happy.getInfo());
    }
}

~~~ console ~~~

name= 해피 ,age= 1 ,status= 앉은 상태
12월 25, 2021 4:04:27 오후 srpMain main
정보: name= 해피 ,age= 1 ,status= 앉은 상태

```

> 호출하는 부분에서 필요한 강아지의 정보 출력이나, 로깅을 처리하면 Dog 클래스에서는 강아지에 대한 책임만 남게 됩니다.


#### SOLID의 OCP 개방-폐쇄의 원칙 (open-closeed principle)
> - 소프트웨어 요소는 <mark>확장에는 열려</mark>있으나 <mark>변경에는 닫혀</mark> 있어야 한다. 
> - 다형성을 활용
> - 인터페이스를 구현한 새로운 클래스를 하나 만들어서 새로운 기능을 구현

> 지금까지 배운 역할과 구현을 분리하여 생각해보자.

```
public void MemberService(){
	private MemberRepository memberRepository = MemoryMemberRepository(); //메모리에 맴버를 저장하는 레퍼지토리
}
```

```
public void MemberService(){
	//private MemberRepository memberRepository = MemoryMemberRepository(); //메모리에 맴버를 저장하는 레퍼지토리
	private MemberRepository memberRepository = JdbcMemberRepository(); //DB에 맴버를 저장하는 레퍼지토리
}
```

> 만약 MemoryMemberRepository에서 JdbcMemberRepository로 memberRepository를 수정할 경우 MemberService가 수정되기 때문에 OCP에 위배 되게 됩니다.

#### OCP 개방-폐쇄 원칙 - 문제점
> - MemberService 클라이언트가 구현 클래스를 직접 선택
	> - MemberRepository m = new MemoryMemberRepository()// 기존 소스  
	> - MemberRepository m = new JdbcMemberRepository()// 변경 소스
> - 구현 객체를 변경하려면 클라이언트 코드를 변경해야한다.
> - 분면 다형성을 사용했지만, OCP 원칙을 지킬 수 없다.
> - 이 문제를 어떻게 해결해야 하나?
> - 객체를 생성하고, 연관관계를 맺어주는 별도의 조립, 설정자가 필요하다.

> COP원칙을 지키기 위하여 Spring이 DI와 IoC를 지원하여 도움을 줍니다.

##### 개방-폐쇄 원칙의 예제
> Animal 클래스를 생성하고, 동물의 타입에 따라 동물이 우는(말하는) 기능을 speak() 메소드로 만들어 두었습니다.


```

// OCP 위배 1
package OCP;

class Animal {
    private String type;

    public Animal(String type) {
        this.type = type;
    }

    public void speak() {
        if (this.type.equals("CAT")) {
            System.out.println("야옹");
        }else if (this.type.equals("DOG")) {
            System.out.println("멍멍");
        }else {
            System.out.println("잘못된 타입입니다.");
        }
    }
}

public class OcpMain {
    public static void main(String[] args) {
        Animal kitty = new Animal("CAT");
        Animal happy = new Animal("DOG");

        hey(kitty);
        hey(happy);
    }

    public static void hey(Animal animal){
        animal.speak();
    }
}



~~~ console ~~~
야옹
멍멍

```

> 누군가 소와 양을 추가해 달라는 요구사항이 생겨서 

```
// OCP 위배 2
package OCP;

class Animal {
    private String type;

    public Animal(String type) {
        this.type = type;
    }

    public void speak() {
        if (this.type.equals("CAT")) {
            System.out.println("야옹");
        }else if (this.type.equals("DOG")) {
            System.out.println("멍멍");
        }else {
            System.out.println("잘못된 타입입니다.");
        }
    }
}

public class OcpMain {
    public static void main(String[] args) {
        Animal kitty = new Animal("CAT");
        Animal happy = new Animal("DOG");
        Animal cow = new Animal("COW");
        Animal sheep = new Animal("SHEEP");

        hey(kitty);
        hey(happy);
        hey(cow);
        hey(sheep);
    }

    public static void hey(Animal animal){
        animal.speak();
    }
}



~~~ console ~~~
야옹
멍멍
잘못된 타입입니다.
잘못된 타입입니다.

```

> 소와 양을 추가했지만, speak()에서 지원하는 동물의 범주에 소와 양이 없기 때문에 잘못된 타입이라는 오류를 출력하게 됩니다. 
> 현재는 확장(extension)을 하기 위해서는 수정이 필요하기 때문에 개방-폐쇄 원칙(open-closed principle)을 위배합니다.

>  개방-폐쇄 원칙을 지킬수 있는 소스로 수정하게 되면

```
package OCP;

abstract class  Animal {
    abstract public void speak();
}

class Cat extends Animal {

    @Override
    public void speak() {
        System.out.println("야옹");
    }
}

class Dog extends Animal {

    @Override
    public void speak() {
        System.out.println("멍멍");
    }
}

class Cow extends Animal {

    @Override
    public void speak() {
        System.out.println("음머어");
    }
}

class Sheep extends Animal {

    @Override
    public void speak() {
        System.out.println("메에에");
    }
}

public class OcpMain {
    public static void main(String[] args) {
        Animal kitty = new Cat();
        Animal happy = new Dog();
        Animal cow = new Cow();
        Animal sheep = new Sheep();

        hey(kitty);
        hey(happy);
        hey(cow);
        hey(sheep);

    }

    public static void hey(Animal animal){
        animal.speak();
    }
}

~~~ console ~~~

야옹
멍멍
음머어
메에에

```

> Animal을 추상화하여 각각 동물들으로 상속받아서 speak()를 구현한다면, 수정없이 Hey()를 이용해 추가된 동물들 까지 부를 수 있습니다. 

#### SOLID의 Liskov Substution
> 오브젝트 T는 그의 서브타입 s1, s2, s3 로 바꾸어도 우리가 생각했던대로 동작해야 한다. 라는 말입니다.

![contact](/images/develop/framework/spring/img-002.png)

> 예를 들어 강아지 오브젝트는, 강아지의 서브 타입인 리트리버, 푸들로 대체 하여도 우리가 원하는대로 동작하여야 한다는 것입니다.

![contact](/images/develop/framework/spring/img-003.png)

> 이를 코드로 나타내 볼 수 있습니다. 

> 강아지 클래스는 speak()를 가지고 있고 리트리버 클래스가 강아지 클래스를 상속하였습니다. 강아지 오브젝트를 리트리버 클래스로 생성하여, speak()를 사용하여도 생각한 것과 같이 speak()를 수행합니다. 

```
package solid.liskovSubstitutionPrinciple;

public class Test {
    public static void main(String[] args) throws Exception {
        Dog dog = new Dog();
        dog.speak();

        Dog dog2 = new Retriever();
        dog2.speak();

        Dog fish = new Flatfish();
        fish.speak();
    }
}

class Dog{
    public void speak() throws Exception {
        System.out.println("멍멍");
    }
}

class Retriever extends Dog{
    @Override
    public void speak() {
        System.out.println("리트리버 : 멍멍");
    }
}


```

> 하지만, 말을 하지 못하는 광어를 추가해 달라는 요청이 있어 소스를 추가하게 되었습니다. 

```
class Flatfish extends Dog{
    @Override
    public void speak() throws Exception {
        throw new Exception("fish Can not speak");
    }
}
```

> 강아지를 상속받아 만들어졌지만, 물고기는 말을 할 수 없기 때문에 speak()시 예외를 발생하게 개발하였습니다. <br>
 
![contact](/images/develop/framework/spring/img-004.png)

![contact](/images/develop/framework/spring/img-005.png)

> 이를 통해 강아지는 광어로 치환하여 사용할 수 없고 이는 Liskov Substitution Principle 을 위해한 클래스 구조 설계입니다. <br>
> 이것을 해결하기 위해서는 처음부터 전체적인 클래스 구조를 강아지와 물고기를 생각하고 설계를 하거나, speak() 같은 문제가 생기지 않도록 다른 방법을 사용해야 합니다. 물론 코드는 복잡해 질것입니다. 


#### SOLID의 Interface Segregation 
> 인터페이스 분리원칙. 인터페이스 분리원칙이란 클라이언트는 사용하지 않을 메소드들에 의존하게 만들어서는 안된다. <br> 
큰 인터페이스들은 더 작은 단위의 인터페이스로 분리시키는 것이 좋다.

> 인터페이스란 자바에서 클래스들이 구현해야 하는 동작을 지정하는 용도로 사용되는 추상 자료형이다. <br>
class 대신 interface 키워드를 사용하여 선언 할 수 있으며, 메소드와 상수 선언만을 포함할 수 있다. <br> 
(자바 8이후 부터 interface에서 default method 정의가 가능해졌다)

> 예를 들어 자동차를 인터페이스 Car로 만들고, 앞으로 가는 drive(), turnLeft(), turnRight() 3개의 메소드를 정의하였습니다. <br>
> Morning 과 Ray는 Car로 구현하였습니다. 

```
interface Car {
    public void drive();
    public void turnLeft();
    public void turnRight();
}

class Morning implements Car{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}
}

class Ray implements Car{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}
}
```

> 만약 보트의 기능까지 있는 수륙양용 자동차를 인터페이스로 만들어서, 자동차와 보트를 구현해 보겠습니다.


```
interface AmphibiousCar {
    public void drive();
    public void turnLeft();
    public void turnRight();

    public void steer();
    public void steerLeft();
    public void steeright();
}

class Morning implements AmphibiousCar{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}

    @Override
    public void steer() {} // 사용안함
    @Override
    public void steerLeft() {} // 사용안함
    @Override
    public void steeright() {} // 사용안함
}

class Boat implements AmphibiousCar{
    @Override
    public void drive() {} // 사용안함
    @Override
    public void turnLeft() {} // 사용안함
    @Override
    public void turnRight() {} // 사용안함

    @Override
    public void steer() {}
    @Override
    public void steerLeft() {}
    @Override
    public void steeright() {}
}
```

> 만약 수륙양용 자동차로 모닝과 보트를 구현한다면, 모닝은 항해에 필요한 메소드들을 사용 하지 않을 것이고, <br>
보트에서는 운전에 필요한 메소드들을 사용하지 않을 것입니다. 

> 만약 수륙양용 자동차의 구현이 필요하다면, Car와 Ship 인터페이스를 모두 상속 받는 AmphibiousCar를 인터페이스로 생성하고 구현하면 될 것입니다.

```
interface Car {
    public void drive();
    public void turnLeft();
    public void turnRight();
}

interface Ship {
    public void steer();
    public void steerLeft();
    public void steerRight();
}

class Morning implements Car{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}
}

class Boat implements Ship{

    @Override
    public void steer() {}
    @Override
    public void steerLeft() {}
    @Override
    public void steerRight() {}
}


class Ray implements Car{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}
}

class AmphibiousCar implements Car, Ship{
    @Override
    public void drive() {}
    @Override
    public void turnLeft() {}
    @Override
    public void turnRight() {}
    @Override
    public void steer() {}
    @Override
    public void steerLeft() {}
    @Override
    public void steerRight() {}
}
```

#### Dependency Inversion
> 우리가 전통적인 방식으로 클래스를 구성한다 하면 예를들어, 동물원에 고양이와 강아지를 넣습니다.

![contact](/images/develop/framework/spring/img-006.png)

> 이것을 코드로 구현해 보면 

```

class Dog{
    public void speak() {
        System.out.println("멍멍");
    }
}

class Cat{
    public void speak() {
        System.out.println("야옹");
    }
}

class Zoo{
   Cat cat = new Cat();
   Dog dog = new Dog();
}
```

> 코드로 보면 동물원은 강아지와 고양이의 Depency가 존재 하고 있습니다. 상위 모듈이 하위 모듈들을 가지고 있는 것이 직관적이고 
자연스러운 코드로 보입니다. 

> 이 동물원에 몇마리의 새로운 동물들이 추가 됩니다.

```
class Dog{
    public void speak() {
        System.out.println("멍멍");
    }
}

class Cat{
    public void speak() {
        System.out.println("야옹");
    }
}

class Sheep{
    public void speak() {
        System.out.println("메에");
    }
}

class Cow{
    public void speak() {
        System.out.println("음모");
    }
}

class Zoo{
   Cat cat = new Cat();
   Dog dog = new Dog();
   Sheep sheep = new Sheep();
   Cow cow = new Cow();
}
```

![contact](/images/develop/framework/spring/img-007.png)

> 이렇게 상위 모듈인 동물원에 서브모듈의 Depency가 계속 추가 되면 나중에 코드의 수정과 관리가 어렵게 됩니다. <br>
 이를 해결하기 위해서 Depency Inversion을 사용합니다.
 
> Depenct Inversion을 그림으로 나타내면

![contact](/images/develop/framework/spring/img-008.png)

> 동물원은 추상 클래스인 animal을 가지게 하고 각각의 서브모듈에 Dependent하게 만들어 줍니다. 이를 코드로 보면,

````

package solid.depencyInversion;

import java.util.ArrayList;
import java.util.List;

public class Test {
    public static void main(String[] args) {
        Zoo zoo = new Zoo();
        zoo.addAnimal(new Cat());
        zoo.addAnimal(new Dog());
        zoo.addAnimal(new Sheep());
        zoo.addAnimal(new Cow());

        zoo.spaekAll();
    }
}

class Dog extends Animal{
    @Override
    public void speak() {
        System.out.println("멍멍");
    }
}

class Cat extends Animal{
    @Override
    public void speak() {
        System.out.println("야옹");
    }
}

class Sheep extends Animal{
    @Override
    public void speak() {
        System.out.println("메에");
    }
}

class Cow extends Animal{
    @Override
    public void speak() {
        System.out.println("음모");
    }
}

abstract class Animal{
    public void speak(){}
}

class Zoo{
  List<Animal> animals = new ArrayList<>();


  public void addAnimal(Animal animal){
      animals.add(animal);
  }

  public void spaekAll(){
      for(Animal animal : animals){
          animal.speak();
      }
  }
}
````

> 말하는 기능을 가지고 있는 Animal을 생성하고, 하위 모듈들은 고양이, 강아지, 양, 소들은 Animal을 상속받습니다. <br>
그리고 동물원은 Animal을 추가하고, 추가된 동물들의 모든 울음소리를 출력하는 기능을 만들어 두었습니다. <br>
클라이언트에서는 동물원을 생성하고 addAnimal()를 통해 강아지, 고양이 등 동물들을 추가하고, spaekAll()를 통해 동물들의 울음소리를 출력합니다.

> 상위 모듈이 낮은 레벨의 Depency를 가지는 것이 아니라, 추상화된 모듈을 가지고 상위 모듈도 하위 모듈도 추상화 클래스에 의존하게 만드는 겁니다. 

![contact](/images/develop/framework/spring/img-009.png)

> 이러한 변경을 하는 사이에 낮은 레벨의 모듈의 화살표가 반대로 뒤집히는 것을 볼 수 있기 때문에 Depency Inversion 이라고 합니다.

  
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



### View 환경설정

#### Thymeleaf
> 스프링에서 밀고 있는 view template

##### Netural templates 
> 마크업을 해치지 않아 웹 브라우저에서 바로 열 수 있다.

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
Integrations galore
```


 









## 느슨한 결합력과 인터페이스 


https://velog.io/@outstandingboy/Spring-%EC%99%9C-%EC%8A%A4%ED%94%84%EB%A7%81-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0%EA%B9%8C-Spring-vs-EJB-JavaEE#-%EC%8B%9C%EB%A6%AC%EC%A6%88---%EC%8A%A4%ED%94%84%EB%A7%81-50

https://ybdeveloper.tistory.com/29


## 참조 

<a href="https://steady-coding.tistory.com/370">제이온님의 블로그</a>

