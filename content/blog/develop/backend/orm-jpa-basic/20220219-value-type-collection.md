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
draft: false
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

            findMember.getFavoriteFoods();

            List<Address> addressHistory = findMember.getAddressHistory();

            for (Address address : addressHistory){
                System.out.println("address_city = "+address.getCity());
            }

            Set<String> favoritFoods = findMember.getFavoriteFoods();

            for (String favoritFood : favoritFoods){
                System.out.println("favoritFood = "+favoritFood);
            }


            tx.commit();
```

> console

```
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
Hibernate: 
    select
        addresshis0_.MEMBER_ID as member_i1_0_0_,
        addresshis0_.city as city2_0_0_,
        addresshis0_.street as street3_0_0_,
        addresshis0_.zipcode as zipcode4_0_0_ 
    from
        ADDRESS addresshis0_ 
    where
        addresshis0_.MEMBER_ID=?
address_city = old1
address_city = old2
Hibernate: 
    select
        favoritefo0_.MEMBER_ID as member_i1_4_0_,
        favoritefo0_.FOOD_NAME as food_nam2_4_0_ 
    from
        FAVORITE_FOOD favoritefo0_ 
    where
        favoritefo0_.MEMBER_ID=?
favoritFood = 치킨
favoritFood = 햄버거
favoritFood = 피자

```

#### 값 타입 수정

> JpaMain.java - homeAddress 수정

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

            // home1 -> new1
            //findMember.getHomeAddress().setCity("new1"); // 값 타입의 set은 사이드이펙트가 발생할 문제가 있어 set X
            Address oldAddress = findMember.getHomeAddress();
            findMember.setHomeAddress(new Address("new1", oldAddress.getStreet(), oldAddress.getZipcode()));
            
```

> 이전 시간에서 Address의 set을 private로 변경하여 외부에서 사용 못하게 처리하였습니다. set을 통해 수정하면, 참조하고 있는 모든 곳에서 Update문이 발생할 수 있기 때문입니다.

> 그렇기 때문에 new 를 통해 새로운 객체를 생성해 갈아껴 주는 작업을 합니다.

> console

```
Hibernate: 
    /* update
        relativemapping.Member */ update
            Member 
        set
            city=?,
            street=?,
            zipcode=?,
            USERNAME=? 
        where
            id=?
```

> 다음은 Set을 사용하는 값 타입 컬렉션 favoriteFoods의 "치킨"의 값을 "한식"으로 변경해 보겠습니다. 

> JpaMain.java - favoriteFoods의 Elements 수정

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

            // home1 -> new1
            //findMember.getHomeAddress().setCity("new1"); // 값 타입의 set은 사이드이펙트가 발생할 문제가 있어 set X
            Address oldAddress = findMember.getHomeAddress();
            findMember.setHomeAddress(new Address("new1", oldAddress.getStreet(), oldAddress.getZipcode()));
            
            
            // 치킨 -> 한식
            findMember.getFavoriteFoods().remove("치킨");
            findMember.getFavoriteFoods().add("한식");
```

> console

```
Hibernate: 
    /* delete collection row relativemapping.Member.favoriteFoods */ delete 
        from
            FAVORITE_FOOD 
        where
            MEMBER_ID=? 
            and FOOD_NAME=?
Hibernate: 
    /* insert collection
        row relativemapping.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)

```

> 값 타입 컬렉션의 값만 수정하여도 어떤 것이 변경되었는지 JPA가 분석하여 수정해 줍니다.

> 마치 영속성 전이가 이루어지는 것처럼 동작합니다.

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

            // home1 -> new1
            //findMember.getHomeAddress().setCity("new1"); // 값 타입의 set은 사이드이펙트가 발생할 문제가 있어 set X
            /*Address oldAddress = findMember.getHomeAddress();
            findMember.setHomeAddress(new Address("new1", oldAddress.getStreet(), oldAddress.getZipcode()));*/
            
            
            // 치킨 -> 한식
            /*findMember.getFavoriteFoods().remove("치킨");
            findMember.getFavoriteFoods().add("한식");*/


            findMember.getAddressHistory().remove(new Address("old1", "street1", "10000"));
            findMember.getAddressHistory().add(new Address("new2", "street1", "10000"));
            /*
                remove 내부에서 equals()를 통하여 값이 완전 똑같은 객체를 지우게 되는데, equals와 hashcode를
                == 비교에서, 값 전체를 비교해 같은 값을 가지는 지로 변경하지 않으면 값이 삭제 되지 않고
                계속 추가가 되는 버그를 발생시킬 수 있습니다.
            */
```

> remove 내부에서 equals()를 통하여 값이 완전 똑같은 객체를 지우게 되는데, equals와 hashcode를 == 비교에서, 값 전체를 비교해 같은 값을 가지는 지로 변경하지 않으면 값이 삭제 되지 않고 계속 추가가 되는 버그를 발생시킬 수 있습니다.

> console

```
Hibernate: 
    /* delete collection relativemapping.Member.addressHistory */ delete 
        from
            ADDRESS 
        where
            MEMBER_ID=?
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
```

> 실행 후 결과를 보면 수정하려는 값만, 지우고 새로 추가한 값만 인서트 하는 것을 예상했겠지만 다르게 수행하는 것을 확인 할 수 있습니다. 

```
        from
            ADDRESS 
        where
            MEMBER_ID=?
```
> Member의 id에 해당하는 모든 주소를 지우고 

```
insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
```

> 삭제된 new Address("old1", "street1", "10000") 의 해당하는 값 이외의 Address를 다시 인서트 하고

```
insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
```

> 추가된 new Address("new2", "street1", "10000") 의 Address가 다시 인스트 됩니다.


![contact](/images/develop/backend/orm-jpa-basic/value-type-collection/img-003.png)

> 수정 후 결과를 보면, 잘 수정되어있는 결과를 볼 수 있습니다.

#### 참고 
> 값 타입 컬렉션은 영속성 전이(Cascade)+ 고아 객체 제거 기능을 필수로 가진다고 볼 수 있다.

### 값 타입 컬렉션의 제약사항
-------------------------------------------
> - 값 타입은 엔티티와 다르게 식별자 개념이 없다.
> - 값은 변경하면 추적이 어렵다.
> - 값 타입 컬렉션에 변경 사항이 발생하면, 주인 엔티티와 연관된 모든 데이터를 삭제하고, 값 타입 컬렉션에 있는 현재 값을 모두 다시 저장한다.
> - 값 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본키를 구성해야함 (null 입력 x, 중복저장x)

> Jpa가 생성한 ADDRESS 를 보면 기본 키를 사용할 컬럼이 존재 하지 않기 때문에 모든 키를 복합키로 사용해야 하는데, 그렇게 되면 null 입력이 되지 않기 때문에 문제가 발생.

> console - ADDRESS DDL

````
Hibernate: 
    
    create table ADDRESS (
       MEMBER_ID bigint not null,
        city varchar(255),
        street varchar(255),
        zipcode varchar(255)
    )
````

#### List + @OrderColumn
> @OrderColumn을 추가하면 테이블에 Order 번호가  컬럼이 생성되며 JPA 값 타입 컬렉션에서도 순서가 있는 컬렉션으로 FK + OrderColumn 으로 키를 매핑하게 됩니다. 

```
@OrderColumn(name = "address_history_order")
    @ElementCollection
    @CollectionTable(name = "ADDRESS" , joinColumns =
            @JoinColumn(name = "MEMBER_ID")
    )
    private List<Address> addressHistory = new ArrayList<>();
```

> 위에서 말했던 특정할 만한 컬럼이 없어, 외래키와 모든 컬럼을 PK로 잡던 문제점을 해결할 수 있지만.

> 실제로 @OrderColumn은 실무에서 사용하기에는 단점이 너무 많습니다. 원하는 대로 동작하지 않는게 많고 순서대로 0, 1,2,3 인데 중간에 2 하나를 빼먹은 경우 2가 null 로 들어오는 등 문제가 있어 사용하지 않는것이 바람직합니다.

> 이렇게 값 타입 컬렉션을 복잡하게 사용할 경우 다른 방식으로 풀어서 개발해야 합니다.

### 값 타입 컬렉션의 대안사항
------------------------------------
> - 실무에서는 상황에 따라 <mark>값 타입 컬렉션 대신에 일대다 관계를 고려</mark>
> - 일대다 관계를 위한 엔티티를 만들고, 여기에서 값 타입을 사용
> - 영속성 전이(Cascade) + 고아 객체 제거를 사용해서 값 타입 컬렉션 처럼 사용
> - AddressEntity로 만들어 내부에 값 타입을 임베디드 하여 엔티티로 승급시킴

> AddressEntity.java

```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.security.PrivateKey;

@Entity
@Table(name = "ADDRESS")
public class AddressEntity {

    public AddressEntity() {
    }
    public AddressEntity(String city, String street, String zipcode) {
        this.address = new Address(city,street,zipcode);
    }

    @Id @GeneratedValue
    private Long id;

    private Address address;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}

```

> Member.java

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

    @ElementCollection
    @CollectionTable(name = "FAVORITE_FOOD", joinColumns =
            @JoinColumn(name = "MEMBER_ID") // JoinColumn을 세팅하면 해당 키를 외래키로 사용합니다.
    )

    @Column(name = "FOOD_NAME ")
    private Set<String> favoriteFoods = new HashSet<>();

    public Long getId() {
        return id;
    }

    /*
    @OrderColumn(name = "address_history_order")
    @ElementCollection
    @CollectionTable(name = "ADDRESS" , joinColumns =
            @JoinColumn(name = "MEMBER_ID")
    )
    private List<Address> addressHistory = new ArrayList<>();
    */

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "MEMBER_ID")
    private List<AddressEntity> addressHistory = new ArrayList<>();


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
}

```

> JpaMain.java

```
package relativemapping;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class JpaMain {
    //psvm 단축키로 생성 가능
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("relativemapping");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        tx.begin(); // [트랜잭션] 시작

        try{


            Member member = new Member();
            member.setName("member1");
            member.setHomeAddress(new Address("home1", "street1", "10000"));

            member.getFavoriteFoods().add("치킨");
            member.getFavoriteFoods().add("피자");
            member.getFavoriteFoods().add("햄버거");

           /* member.getAddressHistory().add(new Address("old1", "street1", "10000"));
            member.getAddressHistory().add(new Address("old2", "street1", "10000"));*/

// *** Entity로 변경
            member.getAddressHistory().add(new AddressEntity("old1", "street1", "10000"));
            member.getAddressHistory().add(new AddressEntity("old2", "street1", "10000"));

            em.persist(member);

            em.flush();
            em.clear();

            System.out.println("===================================");

            Member findMember = em.find(Member.class, member.getId());

            // home1 -> new1
            //findMember.getHomeAddress().setCity("new1"); // 값 타입의 set은 사이드이펙트가 발생할 문제가 있어 set X
            /*Address oldAddress = findMember.getHomeAddress();
            findMember.setHomeAddress(new Address("new1", oldAddress.getStreet(), oldAddress.getZipcode()));*/
            
            
            // 치킨 -> 한식
            /*findMember.getFavoriteFoods().remove("치킨");
            findMember.getFavoriteFoods().add("한식");*/


            /*findMember.getAddressHistory().remove(new Address("old1", "street1", "10000"));
            findMember.getAddressHistory().add(new Address("new2", "street1", "10000"));*/

            /*
                remove 내부에서 equals()를 통하여 값이 완전 똑같은 객체를 지우게 되는데, equals와 hashcode를
                == 비교에서, 값 전체를 비교해 같은 값을 가지는 지로 변경하지 않으면 값이 삭제 되지 않고
                계속 추가가 되는 버그를 발생시킬 수 있습니다.
            */

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
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (city, street, zipcode, USERNAME, id) 
        values
            (?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.AddressEntity
        */ insert 
        into
            ADDRESS
            (city, street, zipcode, id) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.AddressEntity
        */ insert 
        into
            ADDRESS
            (city, street, zipcode, id) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* create one-to-many row relativemapping.Member.addressHistory */ update
        ADDRESS 
    set
        MEMBER_ID=? 
    where
        id=?
Hibernate: 
    /* create one-to-many row relativemapping.Member.addressHistory */ update
        ADDRESS 
    set
        MEMBER_ID=? 
    where
        id=?
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

![contact](/images/develop/backend/orm-jpa-basic/value-type-collection/img-004.png)

> ADDRESS 테이블에 Update로 MEMBER_ID를 업데이트 하게 되는것은 1:N 관계에서 양방향 관계가 아닐 시 외래키가 다른 테이블에 있기 때문에 업데이트함.

> 연관관계 강의 1:N를 보면 알 수 있습니다.

<a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/mapping-various-associations/#%EC%9D%BC%EB%8C%80%EB%8B%A4-%EB%8B%A8%EB%B0%A9%ED%96%A5">JPA 다양한 연관관계 매핑</a>

> 독자적인 PK를 가지는 순간 값 타입이 아니라 엔티티가 됩니다. 

> <mark>엔티티로 변경 하였기 때문에 수정을 하여도 문제가 없습니다 !!</mark>

> 값 타입을 엔티티로 래핑 하여, 엔티티로 사용하는 것을 값 타입을 승급한다 라고 합니다.

> 실무에서 이런 방식을 사용하여, 값 타입을 많이 사용한다고 합니다.

#### 값 타입 컬렉션을 언제 쓰는가 ? 
> 진짜 간단한 콤보박스의 옵션 값 정도의 기능 개발할때 사용. 

> 값을 추적할 일이 없고 변경되어도 문제가 없을때 사용.

### 정리 
> - 엔티티의 타입의 특징
>	- 식별자O
>	- 생명 주기 관리
>	- 공유

> - 값 타입의 특징
>	- 식별자X
>	- 생명 주기를 엔티티에 의존
>	- 공유 하지 않는 것이 안전(복사해서 사용)
>	- 불변 객체로 만드는 것이 안전

> 값 타입은 정말 값 타입이라 판단될 때만 사용
> 엔티티와 값 타입을 혼동해서 엔티티를 값 타입으로 만들면 안됨
> 식별자가 필요하고, 지속해서 값을 추적, 변경해야 한다면 그것은 값 타입이 아닌 엔티티


#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>