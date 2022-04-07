---
title: "JPA 값 타입과 불변 객체"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-12
slug: "immutable-object"
description: "JPA 값 타입과 불변 객체"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# 값 타입과 불변 객체
-------------------------------------------

## 값 타입
-------------------------------------------
> 값 타입은 복잡한 객체 세상을 조금이라도 단순화하려고 만든 개념이다. 따라서 값 타입은 단순하고 안전하게 다룰 수 있어야 한다.

> ### 값 타입 공유 참조
-------------------------------------------
> - 임베디드 타입 같은 값 타입을 여러 엔티티에서 공유하면 위험함
> - 부작용(side effect) 발생

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-001.png)

> 회원 1과 회원 2가 같은 값 타입인 주소를 바라보고 있는데 NewCity로 값을 바꾸면, 회원1과 회원2의 주소가 모두 NewCity로 변경됩니다.


> Member.java

```
package relativemapping;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
public class Member {

    public Member(){
    }

    @Id @GeneratedValue
    private Long id;

    private String name;

    // 기간
    //private LocalDateTime startDate;
    //private LocalDateTime endDate;
    @Embedded
    private Period workPeriod;

    // 주소
    //private String city;
    //private String street;
    //private String zipcode;
    @Embedded
    private Address homeAddress;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "city", column = @Column(name = "work_city")),
            @AttributeOverride(name = "street", column = @Column(name = "work_street")),
            @AttributeOverride(name = "zipcode", column = @Column(name = "work_zipcode"))
    })
    private Address workAddress;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Period getWorkPeriod() {
        return workPeriod;
    }

    public void setWorkPeriod(Period workPeriod) {
        this.workPeriod = workPeriod;
    }

    public Address getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(Address homeAddress) {
        this.homeAddress = homeAddress;
    }
}

```

> JpaMain.java - 둘다 같은 Address의 값 타입을 사용해서 값을 저장

```

            Address address = new Address("OldCity", "street", "10000");

            Member member1 = new Member();
            Member member2 = new Member();

            member1.setName("member1");
            member1.setHomeAddress(address);
            em.persist(member1);

            member2.setName("member2");
            member2.setHomeAddress(address);
            em.persist(member2);

            tx.commit();
```


```
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            
            

```

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-002.png)

> 테이블을 조회해 보면 member1과 member2가 같은 주소로 저장되어 있는것을 확인 할 수 있습니다. 

> JpaMain.java - member1, member2 저장 이후 member1의 HomeAddress를 조회하여, city를 NewCity로 변경


```
            Address address = new Address("OldCity", "street", "10000");

            Member member1 = new Member();
            Member member2 = new Member();

            member1.setName("member1");
            member1.setHomeAddress(address);
            em.persist(member1);

            member2.setName("member2");
            member2.setHomeAddress(address);
            em.persist(member2);

            member1.getHomeAddress().setCity("NewCity");

```

> console

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    /* update
        relativemapping.Member */ update
            Member 
        set
            city=?,
            street=?,
            zipcode=?,
            name=?,
            work_city=?,
            work_street=?,
            work_zipcode=?,
            endDate=?,
            startDate=? 
        where
            id=?
Hibernate: 
    /* update
        relativemapping.Member */ update
            Member 
        set
            city=?,
            street=?,
            zipcode=?,
            name=?,
            work_city=?,
            work_street=?,
            work_zipcode=?,
            endDate=?,
            startDate=? 
        where
            id=?
```

> 업데이트 쿼리가 2번 실행되는것을 확인할 수 있습니다. 

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-003.png)

> member1의 주소만 변경하기 위해 member1의 HomeAddress를 조회하여 city를 수정했지만, 원치 않는 결과가 나오게 됩니다.

> 이러한 사이트 이펙트로 생겨난 오류는 찾기가 매우 어렵습니다.

> 만일 하나의 값을 공유하여 사용하고자 할때는 값 타입이 아니라 엔티티를 사용하여 개발해야합니다.


### 값 타입 복사
-----------------------------------------

> - 값 타입의 실제 인스턴스(생성된 address)를 공유하는 것은 위험
> - 대신 값(인스턴스의 값, new Address(address.getCity(), address.getStreet(), address.getZipcode()); )를 복사해서 사용

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-004.png)

> JpaMain.java - member2는 Address의 값들 (city, street, zipcode의 값)을 복사해 새로운 newAddress로 세팅합니

````
		   Address address = new Address("OldCity", "street", "10000");

            Member member1 = new Member();
            Member member2 = new Member();

            member1.setName("member1");
            member1.setHomeAddress(address);
            em.persist(member1);


            Address newAddress = new Address(address.getCity(), address.getStreet(), address.getZipcode());

            member2.setName("member2");
            member2.setHomeAddress(newAddress);
            em.persist(member2);

            member1.getHomeAddress().setCity("NewCity");

            tx.commit();
````

> console

```
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, work_city, work_street, work_zipcode, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    /* update
        relativemapping.Member */ update
            Member 
        set
            city=?,
            street=?,
            zipcode=?,
            name=?,
            work_city=?,
            work_street=?,
            work_zipcode=?,
            endDate=?,
            startDate=? 
        where
            id=?
```

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-005.png)

### 객체 타입의 한계
--------------------------------------------------
> - 항상 값을 복사해서 사용하면 공유 참조로 인해 발생하는 부작용을 피할 수 있다.
> - 문제는 임베디드 타입처럼 <mark>직접 정의한 값 타입은 자바의 기본 타입이 아니라 객체 타입</mark>이다.
>	자바 기본타입(primitive type)은 대입하면 항상 복사되기 때문에 공유하여 사용할 수 없습니다.
> - 자바의 기본타입에 값을 대입하면 값을 복사한다.
> - <mark>객체 타입은 참조 값(reference)을 직접 대입하는 것을 막을 방법이 없다.</mark>
> - <mark>객체의 공유 참조는 피할 수 없다.</mark>

> - 기본 타입(primitive type)

```
	int a = 10;
	int b = a; //기본 타입은 값을 복사
	b = 4;
```


> - 객체 타입

```
	Address a = new Address("OldCity");
	Address b = a; //객체 타입은 참조를 전달
	b.setCity("NewCity")
```

> - 잘못된 사용 예제 1

```
		  Address newAddress = new Address(address.getCity(), address.getStreet(), address.getZipcode());

            member2.setName("member2");
            member2.setHomeAddress(member1.getHomeAddress()); // ** 이 처럼 개발을 하다 잘못해서 member2의 SetHomeAddress에 newAddress가 아닌 
            em.persist(member2);                              // member1.getHomeAddress()를 집어 넣을때 컴파일 레벨에서 막을 방법이 없다.
```

> - 잘못된 사용 예제 2

```
  		  Address address = new Address("OldCity", "street", "10000");

            Member member1 = new Member();
            Member member2 = new Member();

            member1.setName("member1");
            member1.setHomeAddress(address);
            em.persist(member1);


            Address newAddress = address;

            member2.setName("member2");
            member2.setHomeAddress(newAddress);
            em.persist(member2);

            member1.getHomeAddress().setCity("NewCity");

```

> 그래서 객체타입을 수정할 수 없게 만들면 부작용을 막을 수 있습니다.

## 불변 객체
-----------------------------------------
> - 객체 타입을 수정할 수 없게 만들면 <mark>부작용을 원천 차단</mark>
> - <mark>값 타입은 불변 객체(immutable object)로 설계해야함</mark>
> - <mark>불변 객체 : 생성 시점 이후 절대 값을 변경할 수 없는 객체</mark>
> - 불변 객체로 만드는 방법
>	1. 생성자로만 값을 설정하고 수정자(setter)를 만들지 않음
> 	2. setter를 private로 생성하여 외부에서 접근을 막음
>	3. 속성에 final 키워드 추가
>	4. 객체 필드 참조 초기화
>	5. unmodifiableList 사용

> - 참고 : Integer, String은 자바가 제공하는 대표적인 불변 객체

```
package relativemapping;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
    private String city;
    private String street;
    private String zipcode;

    public Address() {
    }

    public Address(String city, String street, String zipcode) {
        this.city = city;
        this.street = street;
        this.zipcode = zipcode;
    }

    public String getCity() {
        return city;
    }

    private void setCity(String city) { // *** 접근제어자를 private로 변경 또는 삭제
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    private void setStreet(String street) { // *** 접근제어자를 private로 변경 또는 삭제
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    private void setZipcode(String zipcode) { // *** 접근제어자를 private로 변경 또는 삭제
        this.zipcode = zipcode;
    }
}

```

> 만일 setter를 private로 변경했을 시 이런 컴파일러 레벨에서 오류를 내어 수정을 할 수 없게 만든다.

![contact](/images/develop/backend/orm-jpa-basic/immutable-object/img-006.png)

> 불변이라는 작은 제약으로 부작용(side effect)이라는 큰 재앙을 막을 수 있다.

#### 불변 객체지만 실제로 값을 바꾸고 싶은 경우

> - JpaMain.java - 새로 Address를 만들고 변경할 값을 넣고 복사할 값은 address.getZipcode() 등 getter 메소드로 가져와 사용

```
            Address address = new Address("OldCity", "street", "10000");

            Member member1 = new Member();
            Member member2 = new Member();

            member1.setName("member1");
            member1.setHomeAddress(address);


            em.persist(member1);

            //member1.getHomeAddress().setCity("NewCity");
            Address newAddress = new Address("NewCity", address.getStreet(), address.getZipcode());
            member1.setHomeAddress(newAddress);
```

> 새로 객체를 생성하여 갈아껴 교체를 하거나, Address 내부에 copy 메소드를 제공하여 편의를 제공해서 사용

## 정리 : 값 타입은 꼭 불변 객체로 만들어 사용해야 부작용을 겪지 않을 수 있습니다.

#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>



