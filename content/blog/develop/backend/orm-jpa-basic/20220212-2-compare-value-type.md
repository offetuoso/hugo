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
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
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
Hash를 사용하는 Hashmap이라던가 자바 컬렉션에서 효율적으로 사용할 수 있습니다. 

--- ??? hashCode() 도 같이 구현해줘야 하는이유 찾아보기 



5:36 



#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>



