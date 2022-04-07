---
title: "JPA 값 타입 비교"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-12
slug: "compare-value-type"
description: "JPA 값 타입 비교"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# 값 타입의 비교
-------------------------------------------

## 값 타입의 비교
-------------------------------------------
> 값 타입 : 인스턴스가 달라도 그 안에 값이 같으면 같은 것으로 봐야함.

```
int a = 10;
int b = 10;

// a == b : true
System.out.println("a == b : "+ (a == b));


```

```
Address address1 = new Address("city", "street", "10000");
Address address2 = new Address("city", "street", "10000");

// address1 == address2 : false
System.out.println("address1 == address2 : "+ (address1 == address2));

```

> 값 타입은 참조 값을 비교 하기 때문에 값이 같다고 하여도 인스턴스가 다르기 때문에 false가 나오게 됨

### 값 타입의 비교 - 동일성 비교와 동등성 비교
-----------------------------------------
> - <mark>동일성(identity) 비교</mark> : 인스턴스의 참조 값을 비교, == 사용
> - <mark>동등성(equivalence) 비교</mark> : 인스턴스의 값을 비교, .equals() 사용
> - 값 타입은 a.equals(b)를 사용하여 동등성 비교를 해야함
> - 값 타입의 equals() 메소드를 적절하게 재정의(주로 모든 필드 사용)

> ValueMain.java

```
        Integer a = new Integer(10);
        Integer b = a;
        
        a = new Integer(20);

        System.out.println("a == b : "+ (a == b));

        Address address1 = new Address("city", "street", "10000");
        Address address2 = new Address("city", "street", "10000");

        System.out.println("address1 == address2 : "+ (address1 == address2));
        System.out.println("address1.equals(address2) : "+ (address1.equals(address2)));
```

> console

```
a == b : false
address1 == address2 : false
address1.equals(address2) : false // ** 아직은 false로 나오는게 맞음
```

> 아직까지는 address1.equals(address2)라고 하여도 false로 나옴

> Object.java

```
	...
    public boolean equals(Object obj) {
        return (this == obj); // 오브젝트의 기본 equals의 비교 또한 == 비교로 되어있습니다.
    }
    ...
```

> 

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-001.png)

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-001-2.png)

```
while generally incompliant to Object.equals() specification accepting subclasses might be necessary for generated method to work correctly with frameworks, which generate Proxy subclasses like Hibernate. 

일반적으로 하위 클래스를 허용하는 Object.equals() 사양을 준수하지 않는 동안 생성된 메서드가 Hibernate와 같은 Proxy 하위 클래스를 생성하는 프레임워크와 올바르게 작동하려면 필요할 수 있습니다.
```

> 

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-002.png)

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-003.png)

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-004.png)

![contact](/images/develop/backend/orm-jpa-basic/compare-value-type/img-005.png)

> 상황에 따라 옵션을 줘도 되지만, 일반적으로 옵션을 선택하지 않아도 된다.



> Address.java - intelij code generator(alt + insert) 를 이용한 eqals() and hashCode()

```

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return Objects.equals(city, address.city) && Objects.equals(street, address.street) && Objects.equals(zipcode, address.zipcode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(city, street, zipcode);
    }
```

> ValueMain.java - 애플리케이션 재시작

> console 

```
a == b : false
address1 == address2 : false
address1.equals(address2) : true // *** equals() 오버라이딩 이후 false-> true
```

> 항상 값 타입의 비교는 

```
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return Objects.equals(city, address.city) && Objects.equals(street, address.street) && Objects.equals(zipcode, address.zipcode);
    }
```

> equals()로 (오버라이딩 하여 인스턴스의 모든 값들을 && 비교하여) 사용하셔야 합니다.

> 참고로 equals()를 구현하면, 거기에 맞게 hashCode()도 구현해 주어야 합니다.<br>

> Hash를 사용하는 Hashmap이라던가 자바 컬렉션에서 효율적으로 사용할 수 있습니다. 

#### equals()를 오버라이딩 할때, HashCode를 추가로 구현해야 하는 이유

> InteliJ IDEA 에서는 equals를 Source Generate 하려고 하면, 자동으로 equal() and hashCode()가 나오며 함께 오버라이딩을 하도록 유도합니다. 

> 문제점은 equals()만 구현했을때, HashSet()을 사용할 때에 equals에서 같은 값으로 인식하여도, set에서는 다른 객체로 보기 때문에 같은 값 타입을 넣어도 각각 들어가는 참사가 벌어질 수 있습니다.

> 원인 HashSet에 add 할 때는 HashCode가 일치하지 않으면 동일한 객체로 보지 않습니다.

> 만약 HashCode 만 오버라이딩한 경우엔 어떻게 될까

> HashMap의 containsKey는 getNode 메소드의 호출하여 키가 있는지 없는지 체크 하는데, 

> getNode 메소드의 내부에서 equals()를 사용합니다. 만일 HashCode와 equals()에서 같은 객체라고 인식하는 것이 다르다면, Set이나 Map에서 원하는 객체를 영영 찾지 못하는 문제가 발생합니다.

> equals와 hashcode는 하나의 쌍의로 구현해야합니다.


### 정리 
-------------------------------------
> Jpa를 사용할 때 값을 비교한다면, Primitive Type의 객체는 '=='을 이용하여 동일성 비교를 사용해야 합니다.

> 그 외에 나머지들 특히 직접 정의한 Embedded Type 객체는 꼭 equals와 hashcode를 오버라이딩해 만들어 동등성 비교로 사용해야 합니다.

#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>



