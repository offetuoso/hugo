---
title: "JPA 값 타입 컬렉션"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-19
slug: "value-type-collection"
description: "JPA 값 타입 비교"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# 값 타입 컬렉션 (Value Type Collection)
-------------------------------------

## 값 타입 컬렉션
-------------------------------------

> 값 타입 컬렉션이란 값타입을 컬렉션에 담아서 사용하는 것을 의미 합니다.

> Member가 faviriteFoods와 addressHistory 라는 두가지 컬렉션을 가지고 있습니다.

> DB 테이블로 구현할때 문제가 됩니다. 값 타입이 하나 일때는 필드 속성으로 해서 Member 테이블에 넣으면 되었는데 

> 관계형 DB에는 컬렉션을 담을 수 있는 구조가 없습니다. 요즘에서야 JSON 타입을 지원하는 데이터베이스도 있긴합니다.

> 관계형 DB에서 이런 구조를 사용하기 위해 1:N 관계의 각 테이블을 생성하여야 합니다. 

![contact](/images/develop/backend/orm-jpa-basic/value-type-collection/img-001.png)

> 아래 FAVORITE_FOOD 와 ADDRESS에 식별자 없이 MEMBER_ID와 각 테이블의 PK와 결합하여 복합키로 사용합니다. 여기에 시퀀스를 추가하게 되면, 값 타입이 아닌 엔티티가 되어버리기 때문에 시퀀스를 사용 할 수 없습니다.

> Member.java - favoriteFoods와 addressHistory를 추가

```
package relativemapping;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
public class Member {

    public Member(){
    }

    @Id @GeneratedValue
    private Long id;

    @Column(name = "USERNAME")
    private String name;

    @Embedded
    private Address homeAddress;
    
    //*****************************************************************

    @ElementCollection // 컬렉션 객체임을 알려주는 어노테이션
    @CollectionTable(name = "FAVORITE_FOOD", joinColumns = 
            @JoinColumn(name = "MEMBER_ID") // JoinColumn을 세팅하면 해당 키를 외래키로 사용합니다.
    )
    @Column(name = "FOOD_NAME ")
    private Set<String> favoriteFoods = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "ADDRESS" , joinColumns =
            @JoinColumn(name = "MEMBER_ID")
    )
    private List<Address> addressHistory = new ArrayList<>();
    
    //*****************************************************************

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

    public Address getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(Address homeAddress) {
        this.homeAddress = homeAddress;
    }
    
     public Set<String> getFavoriteFoods() {
        return favoriteFoods;
    }

    public void setFavoriteFoods(Set<String> favoriteFoods) {
        this.favoriteFoods = favoriteFoods;
    }

    public List<Address> getAddressHistory() {
        return addressHistory;
    }

    public void setAddressHistory(List<Address> addressHistory) {
        this.addressHistory = addressHistory;
    }
}

```

> Address.java

```
package relativemapping;

import javax.persistence.Embeddable;
import java.util.Objects;

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

    private void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    private void setStreet(String street) {
        this.street = street;
    }

    public String getZipcode() {
        return zipcode;
    }

    private void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

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
}

```

> JpaMain.java - 애플리케이션 재시작

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
Hibernate: 
    
    create table ADDRESS (
       MEMBER_ID bigint not null, // *** Member의 키가 외래키로 세팅
        city varchar(255),
        street varchar(255),
        zipcode varchar(255)
    )
Hibernate: 
    
    create table FAVORITE_FOOD (
       MEMBER_ID bigint not null,
        FOOD_NAME varchar(255)
    )
Hibernate: 
    
    create table Member (
       id bigint not null,
        city varchar(255),
        street varchar(255),
        zipcode varchar(255),
        USERNAME varchar(255),
        TEAM_ID bigint,
        primary key (id)
    )    
```

### 값 타입 컬렉션의 설명
---------------------------------------
> - 값 타입을 하나 이상 저장할 때 사용
> - @ElementCollection, @CollectionTable 사용
> - 데이터베이스는 컬렉션을 같은 테이블에 저장할 수 없다.
>	그렇기 때문에 1:N의 테이블로 별도로 생성해 줘야 하며, 조인을 위한 외래키(연결할 테이블의 PK키)를 추가해 줘야한다.
> - 컬렉션을 저장하기 위한 별도의 테이블이 필요함

### 값 타입 컬렉션의 사용
------------------------------------------

#### 값 타입 저장

> JpaMain.java

````
	...

            Member member = new Member();
            member.setName("member1");
            member.setHomeAddress(new Address("home1", "street1", "10000"));

            member.getFavoriteFoods().add("치킨");
            member.getFavoriteFoods().add("피자");
            member.getFavoriteFoods().add("햄버거");

            member.getAddressHistory().add(new Address("old1", "street1", "10000"));
            member.getAddressHistory().add(new Address("old2", "street1", "10000"));

            em.persist(member);
            
            tx.commit();
	...
````

> console

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, USERNAME, id) 
        values
            (?, ?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row relativemapping.Member.addressHistory */ insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row relativemapping.Member.addressHistory */ insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row relativemapping.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
Hibernate: 
    /* insert collection
        row relativemapping.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
Hibernate: 
    /* insert collection
        row relativemapping.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
```

![contact](/images/develop/backend/orm-jpa-basic/value-type-collection/img-002.png)

> 흥미로운 점은 Member만 Persist()를 통해 저장했을 뿐인데, 값 타입 컬렉션인 favoriteFoods와 addressHistory도 저장된 것을 확인 할 수 있습니다.

> Embedded 타입인 homeAddress는 그렇다 쳐도 다른 테이블인 값 타입 컬렉션들 모두 저장이 되었습니다.

> 크게 보면, Member의 name, homeAddress, favoriteFoods, addressHistory 모두 값 타입으로 볼 수 있기 때문에 Member의 라이프사이클에 따라 값 타입들도 관리되는 것도 당연한 것입니다.

#### 값 타입 조회

> JpaMain.java

```
    Member member = new Member();
            member.setName("member1");
            member.setHomeAddress(new Address("home1", "street1", "10000"));

            member.getFavoriteFoods().add("치킨");
            member.getFavoriteFoods().add("피자");
            member.getFavoriteFoods().add("햄버거");

            member.getAddressHistory().add(new Address("old1", "street1", "10000"));
            member.getAddressHistory().add(new Address("old2", "street1", "10000"));

            em.persist(member);

            em.flush();
            em.clear();

            System.out.println("===================================");

            Member findMember = em.find(Member.class, member.getId());


            tx.commit();
```

> console

```
===================================
Hibernate: 
    select
        member0_.id as id1_6_0_,
        member0_.city as city2_6_0_,
        member0_.street as street3_6_0_,
        member0_.zipcode as zipcode4_6_0_,
        member0_.USERNAME as username5_6_0_ 
    from
        Member member0_ 
    where
        member0_.id=?
```

> Member만 조회된 것을 확인 할 수 있습니다. <br> Member에 포함된 city, street, zipcode 는 함께 불러옵니다.





#### 값 타입 컬렉션에서도 지연 로딩 전략 사용

#### 값 타입 수정

#### 참고 
> 값 타입 컬렉션은 영속성 전이(Cascade)+ 고아 객체 제거 기능을 필수로 가진다고 볼 수 있다.





#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>