---
title: "JPA 임베디드 타입"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-08
slug: "embedded-type"
description: "JPA 임베디드 타입"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# 임베디드 타입
--------------------------------

## 임베디드(복합 값) 타입
--------------------------------
> - 새로운 값 타입을 정의할 수 있음
> - JPA는 임베디드 타입(embedded type)이라 함
> - 주로 기본 값 타임을 모아 만들어서 복합 값 타입이라고도 함
> - int, String과 같은 값 타입 (엔티티 아님)

### 임베디드 타입
-----------------------------------
> 회원 엔티티는 이름, 근무 시작일, 근무 종료일, 주소 도시, 주소 번지, 주소 우편번호를 가진다.

![contact](/images/develop/backend/orm-jpa-basic/embedded-type/img-001.png)

> 회원 엔티티는 이름, 근무 기간, 집 주소를 가진다.

![contact](/images/develop/backend/orm-jpa-basic/embedded-type/img-002.png)

> - Period는 startDate와 endDate를 가지게 클래스로 만들어 값 타입을 만듭니다.
> - Address는 city, street, zipCode를 묶어서 클래스로 만들어 값 타입을 만듭니다.

![contact](/images/develop/backend/orm-jpa-basic/embedded-type/img-003.png)

### 임베디드 타입 사용법
-------------------------------------
> - @Embeddable : 값을 타입을 정의하는 곳에서 표시
> - @Embedded : 값 타입을 사용하는 곳에 표시
> - 기본 생성자 필수

### 임베디드 타입 장점
-------------------------------------
> - 재사용
> - 높은 응집도
> - Period.isWork() 처럼 해당 값 타입만 사용하는 의미 있는 메소드를 만들 수 있음
> - 임베디드 타입을 포함한 모든 값 타입은, 값 타입을 소유한 엔티티에 생명주기를 의존함

### 임베디드 타입과 테이블 매핑
-------------------------------------
> 임베디드 타입을 사용하던 안하던 회원테이블은 변화가 없습니다. <br>
> 테이블은 데이터를 잘 관리하기 위한 것이고, 객체는 행위까지 고려해야 하기때문에 임베디드 타입으로 묶었을때 얻을 수 있는 이득이 많습니다.

![contact](/images/develop/backend/orm-jpa-basic/embedded-type/img-004.png)

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
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // 주소
    private String city;
    private String street;
    private String zipcode;

}

```

> JpaMain.java - 애플리케이션 재시작

> console

```
    create table Member (
       id bigint not null,
        city varchar(255),
        endDate timestamp,
        name varchar(255),
        startDate timestamp,
        street varchar(255),
        zipcode varchar(255),
        primary key (id)
    )
```

> MEMBER 테이블이 생성된 것을 확인 할 수 있습니다. Member 엔티티에 속성들을 workPeriod와 homeAddress 임베디드 타입으로 변경해 보도록 하겠습니다.

> Period.java

```
package relativemapping;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class Period {
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}

```

> Address.java

```
package relativemapping;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
    private String city;
    private String street;
    private String zipcode;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}

```

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

>  @Embeddable과 @Embedded는 한쪽만 설정해 두어도 되지만, 양쪽다 추가하길 권장합니다.


> JpaMain.java - 애플리케이션 재시작

> console

```
    create table Member (
       id bigint not null,
        city varchar(255),
        street varchar(255),
        zipcode varchar(255),
        name varchar(255),
        endDate timestamp,
        startDate timestamp,
        primary key (id)
    )
```

> Create SQL은 이전과 똑같습니다. 테이블 구조는 변함 없지만, Member 엔티티는 좀더 객체지향 적으로 사용할 수 있습니다.

> 예를 들면 현재시간이 workPeriod에 시작과 끝에 포함된다면, isIncumbent()를 통해 재직중인지 확인하는 메소드를 만들어 사용할 수 도 있습니다.

```
package relativemapping;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class Period {
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public Period() {
    }

    public Period(LocalDateTime startDate, LocalDateTime endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Boolean isIncumbent(){

        LocalDateTime today = LocalDateTime.now();
        /*
            System.out.println(this.startDate);
            System.out.println(today);
            System.out.println(this.startDate.isEqual(today)); // 주어진 시간과 같은지
            System.out.println(this.startDate.isBefore(today)); // 주어진 시간보다 이전인지
            System.out.println(this.startDate.isAfter(today)); // 주어진 시간보다 이후인지

            System.out.println(this.endDate);
            System.out.println(today);
            System.out.println(this.endDate.isEqual(today)); // 주어진 시간과 같은지
            System.out.println(this.endDate.isBefore(today)); // 주어진 시간보다 이전인지
            System.out.println(this.endDate.isAfter(today)); // 주어진 시간보다 이후인지
        */

        if( ! this.startDate.isAfter(today) && this.endDate.isAfter(today)){
            return true;
        }else{
            return false;
        }
    }


    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}

```

> JpaMain - Member 추가

```
package relativemapping;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

public class JpaMain {
    //psvm 단축키로 생성 가능
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("relativemapping");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        tx.begin(); // [트랜잭션] 시작

        try{

            Member member1 = new Member();

            member1.setName("member1");

            member1.setHomeAddress(new Address("서울","영등포","00000"));
            member1.setWorkPeriod(new Period(LocalDateTime.of(2021,01,01,1,12,0),LocalDateTime.of(2023,01,01,1,12,0)));

            em.persist(member1);

            System.out.println("isIncumbent "+member1.getWorkPeriod().isIncumbent());
            tx.commit();

        }catch (Exception e){
            e.printStackTrace();
            tx.rollback();
        }finally {
            em.close();
        }
        emf.close();
    }
}

```

> console

```
isIncumbent true

Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, name, endDate, startDate, id) 
        values
            (?, ?, ?, ?, ?, ?, ?)
```

![contact](/images/develop/backend/orm-jpa-basic/embedded-type/img-005.png)

### 임베티드 타입의 장점
> - 임베디드 타입은 엔티티의 값일 뿐이다.
> - <mark>임베디드 타입을 사용하기 전과 후에 매핑하는 테이블은 같다.</mark>
> - 객체와 테이블은 아주 세밀하게(find-grained) 매핑하는 것이 가능
> - 잘 설계한 ORM 애플리케이션은 매핑한 테이블의 수보다 클래스의 수가 더 많음
> - 용어도 공통화 되고, 코드도 공통화 된다.
> - 도메인의 언어로 맞출수 있는 언어들도 많이 나올 수 있음.

14:31



#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
