---
title: "자바의 기본개념"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-03-15
slug: "basic-java"
description: "자바의 기본 개념정리."
keywords: ["java", "basic", "tutorial"]
draft: true
categories: ["Java"]
tags: ["java"]
math: false
toc: true
---

# 자바

## 자바가상머신 (JVM)

## 자바의 장점

## 자바의 단점

## 자바의 기초 문법

## 객체지향과 자바

## 객체지향 프로그램 언어

## 객체

## 상속


## 오버라이딩 (Overriding)

> 오버라이딩이란?

>사전적 의미로는 
 `more important than any other considerations`
  번역해 보면 `다른 고려 사항보다 더 중요하다`이다.

> 부모 클래스로 부터 상속받은 메소드를 자식 클래스에서 재정의 하여, <br>
 `덮어 쓰는 것`이다. 상속받은 메소드를 그대로 사용할 수도 있지만, 자식 클래스에서 상황에 맞게 변경해야 하는 경우 오버라이딩을 사용한다.

> 오버라이딩을 사용하기 위한 조건에는 부모 클래스의 메소드를 재정의하는 것이므로 <br>
<mark>이름, 매개변수 리턴 값이 모두 같아야 한다</mark>.

> 오버라이딩의 조건
> 1. 부모 클래스와 자식 클래스 사이에서만 성립한다. 
> 2. static 메소드는 오버라이딩 할 수 없다. `static 메소드 끼리의 오버라이딩은 hiding이라 한다.`
> 3. private는 정의된 메소드는 상속 자체가 안된다.
> 4. interface 메소드를 오버라이딩 할 경우엔 public으로 해야한다.
> 5. 메소드의 파라미터가 완전히 일치해야 하며, 리턴타입도 같아야 한다. 파라미터의 이름은 상관없다.
> 6. 부모 클래스의 접근제어자보다 좁아질 수 없다. 확장 될 수는 있다.
> 7. 부모 클래스보다 더 많은 예외를 던질 수 있다.
> 8. final 예약어로 정의된 메소드는 오버라이딩 할 수 없다. 
 

> 아래 소스코드를 보면, 
> 1. main 클래스를 가지고 있는 Example 클래스 
> 2. Talk라는 기능을 가진 `부모 클래스`, Person 클래스.
> 3. Person을 부모로 가지고 있는 `자식 클래스`, Korean, American, Japanese로 구성되어있다.
> 4. 모두 Talk 메소드를 가지고 있지만 각각 다른 기능을 수행한다.



### Example.java 
```
package ex.java.overriding;

public class Example {

	public static void main(String[] args) {
		
		Person person = new Person();
		person.Talk();
		
		Korean korean = new Korean();
		korean.Talk();
		
		American american = new American();
		american.Talk();
		
		Japanese japanese = new Japanese();
		japanese.Talk();
		
	}
}

class Person {
	void Talk() {
		String message = "Aaaa";
		System.out.println(message);
	}
}

class Korean extends Person{
	
	@Override
	void Talk() {
		String message = "안녕하세요!";
		System.out.println(message);
	}
}

class American extends Person{
	
	@Override
	public void Talk() {
		String message = "Hello!";
		System.out.println(message);
	}
}

class Japanese extends Person{
	
	 @Override
	 protected void Talk() {
		String message = "Konnichiwa!";
		System.out.println(message);
	}
}

```

### result
```
Aaaa
안녕하세요!
Hello!
Konnichiwa!
```

> 소스를 보다보면 자식 클래스의 메소드 바로 위에 *@override*라는 것이 보일 것이다. 
이것은 Annotation 이라는 주석 기능이다. 하지만 우리가 알고 있는 주석과는 다르며
컴퓨터는 그것을 `이 메소드는 부모 클래스로 부터 오버라이드 받은 메소드이다.` 명시해 주는것이다.
만일 메소드가 아래의 경우 오류로 알려준다.

```
1. 메소드 명칭이 잘못된경우
The method talks() of type Korean must override or implement a supertype method

2. 리턴타입이 잘못된경우 
The return type is incompatible with Person.Talk()

3. 파라미터가 잘못된경우
The method Talk(String) of type Korean must override or implement a supertype  method

```

## 오버로딩 (Overloading)

> 오버로딩이란?


> 사전적 의미로는 
 `loading of a vehicle with too heavy a weight.`
  번역해 보면 `너무 무거운 중량의 차량 적재.`이다. 쉽게 말하면 `과적해서 싣는 것`이다.

> 보통 하나의 이름을 가진 메소드는 1개만 존재 하지만, `파라미터가 다르다면` 컴퓨터는 오버로드된 메소드로 
인식하여 다른 메소르도 인식함.

> 오버로딩이 되는 조건은 
> 1. 메소드 이름이 같아야 한다.
> 2. 메소드의 파라미터의 형이 다르거나 갯수가 다르거나 순서가 다름.
> 3. 반환타입은 영향을 미치지 않는다.  

> 아래 소스코드를 보면, 
> 1. main 클래스를 가지고 있는 Example 클래스 
> 2. Mountain이라는 클래스가 있고 echo라는 입력하면 답변을 해주는 메소드가 있다.
> 3. 같은 이름의 다른 파라미터를 갖는 3개의 echo가 있다.



### Example.java
```
package ex.java.overloading;

public class Example {

	public static void main(String[] args) {
		
		Mountain mountain = new Mountain();
		
		mountain.echo("Hello"); 	//문자열 입력
		
		mountain.echo(100);		//숫자 입력
		
		mountain.echo(true);		//참,거짓 입력
		
	}

}

class Mountain {
	void echo(String say) {
		System.out.println("you say "+say);
	}
	
	void echo(int money) {
		System.out.println("you have "+money+" doller");
	}
	
	void echo(Boolean bool) {
		if(bool) {
			System.out.println("this is True");
		}else {
			System.out.println("this is False");
		}
	}
	
}

```

### result
```
you say Hello
you have 100 doller
this is True

```

> 결과를 보면 어렵진 않다. 컴퓨터는 입력된 파라미터에 따라 어떤 함수를 호출할지 보여준다. 
예를들면 우리가 많이 사용하는 System.out.println(); 출력 함수가 있다.

![contact](/images/overload_example.png)

> 주의할점 
파라메터의 순서를 다르게 오버라이드 하였지만, int와 long 모두 소숫점이 없는 정수를 입력 가능하기 때문에
컴퓨터의 입장에서는 어느 메소드를 사용할지 애매한경우가 생긴다.
 
`The method sum(int, long) is ambiguous for the type Calculator`
Calculator의 메소드 sum (int, long)은 형식에 대해 모호합니다.

```
	
	public class Example {

	public static void main(String[] args) {
		
		Calculator cal = new Calculator();
		
		cal.sum(1, 5);
	}

}

class Calculator {
	void sum(int a, long b) {
		System.out.println("sum is "+ (a+b));
	}
	
	void sum(long a, int b) {
		System.out.println("sum is "+ (a+b));
	}
	
}


```



## 다형성 


### 오버라이딩을 이용한 다형성 


> 위에서 오버라이딩을 설명했던 소스와 다른점 한가지가 있다.
그것은 main 클래스에서 자식 클래스를 선언하는 부분이다. 		


### Example.java 
```
package ex.java.overriding;

public class Example {

	public static void main(String[] args) {
		
		Person person = new Person();
		person.Talk();
		
		person = new Korean(); 	// Korea클래스의 인스턴스를 Person타입인 person으로 참조하여 사용.
		person.Talk();
		
		person = new American(); 	// American클래스의 인스턴스를 Person타입인 person으로 참조하여 사용.
		person.Talk();
		
		person = new Japanese();	// Japanese클래스의 인스턴스를 Person타입인 person으로 참조하여 사용.
		person.Talk();
		
	}
}

class Person {
	void Talk() {
		String message = "Aaaa";
		System.out.println(message);
	}
}

class Korean extends Person{
	
	@Override
	void Talk() {
		String message = "안녕하세요!";
		System.out.println(message);
	}
}

class American extends Person{
	
	@Override
	public void Talk() {
		String message = "Hello!";
		System.out.println(message);
	}
}

class Japanese extends Person{
	
	 @Override
	 protected void Talk() {
		String message = "Konnichiwa!";
		System.out.println(message);
	}
}


```

### result
```
Aaaa
안녕하세요!
Hello!
Konnichiwa!
```

### 참조변수의 다형성

> 참조변수가 사용할 수 있는 멤버의 개수가 실제 인스턴스의 멤버 개수보다 같거나 적어야 참조할 수 있다. 클래스는 상속을 통해 확장될 수는 있어도 축소될 수는 없기 때문에, 자식클래스에서 사용할 수 있는 멤버의 개수는 언제나 부모 클래스와 같거나 많게 된다.

```

Person person = new Person();  //정상

Korean korean = new Korean(); 	//정상

// 부모 클래스인 person은  Korean을 포함할 수 있다.
Person person = new Korean(); 	//정상

// 부모 클래스는 자식으로 참조 할수 없다. 
Korean korean = new Person();	//오류

```


### 참조변수의 형변환

> 자식클래스를 부모 클래스로 참조할때 자식 클래스로 형 변환 할 수 있다.

```

	Person person = new Person();
	person.Talk();
	
	Korean korean = new Korean();
	person = (Korean) korean; 			//(Korean) 타입으로 형변환
	korean.Talk();
	
	American american = new American();
	person = (American) american; 		//(American) 타입으로 형변환
	american.Talk();
	
	Japanese japanese = new Japanese(); //(Japanese) 타입으로 형변환
	person = (Japanese) japanese;
	japanese.Talk();
	
	
	person = (American) japanese; 		//오류 !
	japanese.Talk();
	

```
## Collection

> 컬렉션이란 객체의 모음, 그룹이라 할 수 있습니다. 

> Collection과 Map이 컬렉션 클래스의 루트 인터페이스입니다.

> Collection은 List와 Set 그리고 Queue로 구성되어있습니다. 

> Map은 Collection에 포함되지는 않지만 Collection으로 분류합니다.

### 컬렉션 사용이유 
> 1. 일관된 API 
> 2. 프로그래밍 노력감소 
> 3. 프로그램 속도 및 품질향상

### List 인터페이스 
> 리스트는 연속된 데이터를 순차적으로 처리 할 때 사용합니다.

> 1. ArrayList - 동적 배열을 제공합니다. 배열 보다 느리지만, 엘리먼츠를 추가, 삭제 시 크기가 자동 조절됩니다.
> 2. LinkedList - 연속된 저장 위치에 저장되지 않고, 데이터와 주소로 구성된 노드라는 요소로 각각의 주소를 연결하고 포인터를 이용해 데이터를 연결하고 삭제합니다.
> 3. Vector - 동적 배열을 제공하며, 느리지만 많은 움직임을 필요한 프로그램에서 유용합니다. Vector는 동기화 되고 ArrayList는 동기화 되지 않습니다. 동기화란 Thread Safe라고 할 수 있으며, 한번에 하나의 스레드만 백터에 접근할 수 있습니다.
> 4. Stack - 선입후출의 특성을 가지고 있는 자료구조입니다.

### Set 인터페이스 
> 중복을 허용하지 않는 정렬되지 않은 데이터 모음입니다. 
중복을 방지하고 고유한 데이터만 저장하는 경우 사용합니다. 

> 1. HashSet -  HashSet에 입력되는 데이터는 동일한 순서로 삽입되는 것을 보장하지 않습니다. 이 클래스는 NULL 요소 삽입을 허용합니다
> 2. LinkedHashSet - HashSet과 유사하지만 저장하는 순서를 유지합니다.

### Sorted Set 인터페이스 

> 1. TreeSet - 트리를 이용해 저장합니다. 데이터의 순서는 오름차순대로 유지됩니다.

### Map인터페이스 
> Map은 데이터의 키와 값으로 매핑을 지원하는 데이터 구조입니다. 키는 중복을 지원하지 않습니다. 속도는 느리지만 키를 기반하는 프로그래밍에 유리합니다.

> 1. HashMap - Hashing이라는 기술을 이용하여 항목이 저장 되어있는 테이블의 주소를 빠르게 접근하는 방식을 사용합니다.

### Queue 인터페이스
> 대기열 인터페이스 라는 이름에서 알 수 있듯이 선입선출의 특성을 가지고 있습니다. 

> 1. PriorityQueue (우선순위큐) - 우선 순위에 따라 객체를 처리해야할때 사용합니다.
> 2. Deque - 양방향 큐라고도 불리고 양쪽 끝에서 요소를 추가하고 제거할 수 있는 구조입니다.
> 3. ArrayDecue - 크기가 조정되는 배열이고, 양끝에서 요소를 추가하고 제거하는 구조입니다. 

### 추상화

### 인터페이스

### 스트림 API 

#### 스트림 



