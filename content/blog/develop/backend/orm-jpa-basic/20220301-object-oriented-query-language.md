---
title: "[자바 ORM 표준 JPA] JPA 객체지향 쿼리 언어 소개"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-01
slug: "object-oriented-query-language"
description: "객체지향 쿼리 언어 소개"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# 객체지향 쿼리 언어 (JPQL)
-------------------------------------

## 목차
-------------------------------------
> - 객체지향 커리 언어 소개
> - JPQL
> - 기본 문법과 기능
> - 패치 조인
> - 경로 표현식
> - 다형성 쿼리
> - 엔티티 직접 사용
> - Named 쿼리
> - 벌크 연산

## 객체지향 쿼리 언어 소개
-------------------------------------

### JPA에서 제공되는 다양한 쿼리 방법
--------------------------------------
> JPA에서는 실무에서 사용하기 위한 다양한 검색 조건과 Join을 사용하여 조회 등 복잡한 쿼리를 구현할 수 있도록 기능 다양한 쿼리 방법을 제공합니다.

> - <mark>JPQL</mark>
>	엔티티 객체를 조회하는 객체지향 쿼리다.

> - JPA Criteria 
> - <mark>QueryDSL</mark>
>	Java로 코드를 작성하여 JPQL로 제너레이션 하여 빌드하게 도와주는 클래스의 모음입니다.

> - 네이티브 SQL
> JPQL 외에 특정 데이터베이스에 종속적인 쿼리를 작성하고 사용해야할때 사용(MySql, Oracle.. 쿼리)

> - JDBC API 직접사용, Mybatis, SpringJdbcTemplate 함께 사용

### JPQL 
--------------------------------------

#### JPQL 소개

> - 가장 단순한 조회 방법
>	- EntityManager.find()
>	- 객체 그래프 탐색 (a.getB().getC())
> - <mark>나이가 18살 이상인 회원을 모두 검색 하고 싶다면 ?</mark>

#### JPQL -1

> - JPA를 사용하면 엔티티 객체를 중심으로 개발
> - 문제는 검색 쿼리
> - 검색을 할 때도 <mark>테이블이 아닌 엔티티 객체를 대상으로 검색</mark>
> - 모든 DB 데이터를 객체로 변환해서 검색하는 것은 불가능
> - 에플리케이션이 필요한 데이터만 DB에서 불러오면 결국 검색 조건이 포함된 SQL이 필요

#### JPQL -2

> - JPA는 SQL을 추상화한 JPQL이라는 객체 지향 쿼리 언어 제공
> - SQL과 문법 유사, SELECT, FROM, WHERE, GROUP BY, HAVING, JOIN 지원
> - JPQL은 엔티티 객체를 대상으로 쿼리
> - SQL은 데이터베이스 테이블을 대상으로 쿼리

#### JPQL - 예제

```
	String jpql = "select m from Member m where m.name like '김%'";
	List<Member> result = em.createQuery(jpql, Member.class).getResultList();
```

#### 이전 소스

<details title="펼치기/숨기기">
 	<summary> Address.java </summary>
 	
 	
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
   	
</details>

<details title="펼치기/숨기기">
 	<summary> AddressEntity.java </summary>
 	
 	
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
   
</details>

<details title="펼치기/숨기기">
 	<summary> Album.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	import javax.persistence.GeneratedValue;
	import javax.persistence.Id;
	
	@Entity
	@DiscriminatorValue("A")
	public class Album extends Item{
	
	    private String artist;
	
	    public String getArtist() {
	        return artist;
	    }
	
	    public void setArtist(String artist) {
	        this.artist = artist;
	    }
	}
	
  
</details>

<details title="펼치기/숨기기">
 	<summary> BaseEntity.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.Column;
	import javax.persistence.MappedSuperclass;
	import java.time.LocalDateTime;
	
	@MappedSuperclass
	public abstract class BaseEntity {
	    @Column(name = "REG_ID")
	    private String createBy;
	
	    @Column(name = "REG_DT")
	    private LocalDateTime createDate;
	
	    @Column(name = "MOD_ID")
	    private String LastModifiedBy;
	
	    @Column(name = "MOD_DT")
	    private LocalDateTime LastModifiedDate;
	
	    public String getCreateBy() {
	        return createBy;
	    }
	
	    public void setCreateBy(String createBy) {
	        this.createBy = createBy;
	    }
	
	    public LocalDateTime getCreateDate() {
	        return createDate;
	    }
	
	    public void setCreateDate(LocalDateTime createDate) {
	        this.createDate = createDate;
	    }
	
	    public String getLastModifiedBy() {
	        return LastModifiedBy;
	    }
	
	    public void setLastModifiedBy(String lastModifiedBy) {
	        LastModifiedBy = lastModifiedBy;
	    }
	
	    public LocalDateTime getLastModifiedDate() {
	        return LastModifiedDate;
	    }
	
	    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
	        LastModifiedDate = lastModifiedDate;
	    }
	}
	
  
</details>

<details title="펼치기/숨기기">
 	<summary> Book.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("B")
	public class Book extends Item{
	    private String author;
	    private String isbn;
	
	    public String getAuthor() {
	        return author;
	    }
	
	    public void setAuthor(String author) {
	        this.author = author;
	    }
	
	    public String getIsbn() {
	        return isbn;
	    }
	
	    public void setIsbn(String isbn) {
	        this.isbn = isbn;
	    }
	}

	
  
</details>

<details title="펼치기/숨기기">
 	<summary> Child.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.*;
	
	@Entity
	public class Child {
	
	    public Child() {
	    }
	
	
	    @Id
	    @GeneratedValue
	    private Long id;
	
	    private String name;
	
	    @ManyToOne
	    @JoinColumn(name = "parent_id")
	    private Parent parent;
	
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
	
	    public Parent getParent() {
	        return parent;
	    }
	
	    public void setParent(Parent parent) {
	        this.parent = parent;
	    }
	}
  
</details>

<details title="펼치기/숨기기">
 	<summary> Item.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.*;
	
	@Entity
	@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
	public abstract class Item {
	
	    @Id @GeneratedValue
	    private Long id;
	
	    private String name;
	
	    private int price;
	
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
	
	    public int getPrice() {
	        return price;
	    }
	
	    public void setPrice(int price) {
	        this.price = price;
	    }
	}

  
</details>

<details title="펼치기/숨기기">
 	<summary> Member.java </summary>
 	
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
	
	    public List<AddressEntity> getAddressHistory() {
	        return addressHistory;
	    }
	
	    public void setAddressHistory(List<AddressEntity> addressHistory) {
	        this.addressHistory = addressHistory;
	    }
	}


</details>

<details title="펼치기/숨기기">
 	<summary> MemberProduct.java </summary>
 	
	package relativemapping;
	
	import javax.persistence.*;
	import java.time.LocalDate;
	import java.time.LocalDateTime;
	
	@Entity
	@Table(name = "ORDERS")
	public class MemberProduct {
	    @Id @GeneratedValue
	    private Long id;
	
	    @ManyToOne
	    @JoinColumn(name = "MEMBER_ID")
	    private Member member;
	
	    @ManyToOne
	    @JoinColumn(name = "PRODUCT_ID")
	    private Product product;
	
	    @Column(name = "ORDERAMOUNT")
	    private int orderAmount;
	
	    @Column(name = "ORDERCOUNT")
	    private int orderCount;
	
	    public Member getMember() {
	        return member;
	    }
	
	    @Column(name = "ORDERDATE")
	    private LocalDate orderDate;
	
	    public void setMember(Member member) {
	        this.member = member;
	    }
	
	    public Product getProduct() {
	        return product;
	    }
	
	    public void setProduct(Product product) {
	        this.product = product;
	    }
	
	    public void setId(Long id) {
	        this.id = id;
	    }
	
	    public Long getId() {
	        return id;
	    }
	}

</details>

<details title="펼치기/숨기기">
 	<summary> Movie.java </summary>
	 	
	package relativemapping;
	
	import javax.persistence.DiscriminatorValue;
	import javax.persistence.Entity;
	
	@Entity
	@DiscriminatorValue("M")
	public class Movie extends Item{
	    private String director;
	    private String actor;
	
	    public String getDirector() {
	        return director;
	    }
	
	    public void setDirector(String director) {
	        this.director = director;
	    }
	
	    public String getActor() {
	        return actor;
	    }
	
	    public void setActor(String actor) {
	        this.actor = actor;
	    }
	}


</details>

<details title="펼치기/숨기기">
 	<summary> Parent.java </summary>
		 	
	package relativemapping;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	@Entity
	public class Parent {
	
	    public Parent() {
	    }
	
	
	    @Id
	    @GeneratedValue
	    @Column(name = "parent_id")
	    private Long id;
	
	    private String name;
	
	    @OneToMany(mappedBy = "parent",  orphanRemoval = true)
	    private List<Child> childList = new ArrayList<>();
	
	    public void addChild(Child child){
	        childList.add(child);
	        child.setParent(this);
	    }
	
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
	
	    public List<Child> getChildList() {
	        return childList;
	    }
	
	    public void setChildList(List<Child> childList) {
	        this.childList = childList;
	    }
	}

</details>

<details title="펼치기/숨기기">
 	<summary> Period.java </summary>
		 	
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
	
	    private void setStartDate(LocalDateTime startDate) {
	        this.startDate = startDate;
	    }
	
	    public LocalDateTime getEndDate() {
	        return endDate;
	    }
	
	    private void setEndDate(LocalDateTime endDate) {
	        this.endDate = endDate;
	    }
	}


</details>

<details title="펼치기/숨기기">
 	<summary> Product.java </summary>
			 	
	package relativemapping;
	
	import javax.persistence.*;
	import java.util.List;
	
	@Entity
	public class Product {
	    @Id @GeneratedValue
	    private Long id;
	
	    @OneToMany(mappedBy = "product")
	    private List<MemberProduct> memberProducts;
	
	
	    private  String name;
	
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
	}

</details>

<details title="펼치기/숨기기">
 	<summary> Team.java </summary>
			 	
	package relativemapping;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	
	@Entity
	public class Team extends BaseEntity{
	
	    public Team(){
	    }
	
	    public Team(Long id, String username){
	        this.id = id;
	        this.name = name;
	    }
	
	    @Id @GeneratedValue
	    @Column(name = "TEAM_ID")
	    private Long id;
	    @Column(name = "NAME")
	    private String name;
	
	    @OneToMany
	    @JoinColumn(name = "TEAM_ID")
	    private List<Member> members = new ArrayList<>();
	
	    public List<Member> getMembers() {
	        return members;
	    }
	
	    public void setMembers(List<Member> members) {
	        this.members = members;
	    }
	
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
	}


</details>

<details title="펼치기/숨기기">
 	<summary> JpaMain.java </summary>
			 	
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


</details>

> JpaMain.java

```
	...

            Member member1 = new Member();
            member1.setName("member1");
            member1.setHomeAddress(new Address("home1", "street1", "10000"));

            member1.getFavoriteFoods().add("치킨");
            member1.getFavoriteFoods().add("피자");
            member1.getFavoriteFoods().add("햄버거");

            member1.getAddressHistory().add(new AddressEntity("old1", "street1", "10000"));
            member1.getAddressHistory().add(new AddressEntity("old2", "street1", "10000"));

            em.persist(member1);

            em.flush();
            em.clear();

            System.out.println("===================================");

            List<Member> members =  em.createQuery(
                    "select m from Member m where m.name like '%m%' "
                    , Member.class
            ).getResultList();

            for (Member member: members){
                System.out.println("member "+ member);
            }

            tx.commit();

	...
```

> 테이블을 대상으로 쿼리를 작성하는게 아니라 엔티티를 대상으로 쿼리를 작성하기 때문에, 컬럼의 username이 아니라 엔티티의 name 으로 조건을 작성, 결과는 테이블의 컬럼명 username 으로 만들어짐.

> console

```
Hibernate: 
    /* select
        m 
    from
        Member m 
    where
        m.name like '%김%'  */ select
            member0_.id as id1_6_,
            member0_.city as city2_6_,
            member0_.street as street3_6_,
            member0_.zipcode as zipcode4_6_,
            member0_.USERNAME as username5_6_ 
        from
            Member member0_ 
        where
            member0_.USERNAME like '%m%'
```

![contact](/images/develop/backend/orm-jpa-basic/object-oriented-query-language/img-001.png)

> 문법이 sql과 거의 비슷, * 대신 객체의 Alias인 m 으로 전체 조회를 할 수 있습니다. <br>
> 또 m.name, m.id ... 등 각각 접근하여 사용할 수 있습니다.


#### JPQL과 실행된 SQL

```
	String jpql = "select m from Member m where m.age > 18";
	
	List<Member> result = em.createQuery(jpql, Member.class).getResultList();
```

```
실행된 SQL
	select 
		m.id as id,
		m.age as age,
		m.username as username,
		m.TEAM_ID as TEAM_ID
	from 
		Member m
	where 
		m.age > 18
```


### Criteria  
--------------------------------------

#### Criteria 소개 
> JPQL은 단순한 String 이기 때문에 동적 쿼리를 생성하기 힘이 듭니다. 

> 예를 들면

```
	String jpql = "select m from Member";
	
	String username; 
	
	if(username != null){
		String sWhere  = "where m.name like '%m%'";
		jpql += sWhere;
	}

	List<Member> result = em.createQuery(jpql, Member.class).getResultList();
```

> 간단한 조건 하나 추가하여도, 지저분해지는 것을 알 수 있습니다. <br>
> 실무에서 사용하기에 버그도 많이 발생하고 불편한 점이 있습니다.

> Ibatis나 MyBatis는 동적쿼리를 작성하는데 장점이 있습니다.

> 그래서 동적쿼리 뿐만 아니지만, 대안으로 자바 표준으로 Criteria가 나오게 되었습니다.

```
// Criteria 사용 준비
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Member> query = cb.createQuery(Member.class);

// 루트 클래스 조회 (조회를 시작할 클래스)
Root<Member> m = query.from(Member.class);

// 쿼리 생성 
CriteriaQuery<Member> cq = query.select(m).where(cb.equal(m.get("name"), "kim hun")); // 엔티티의 속성명 name
List<Member> resultList = em.createQuery(cq).getResultList();

```

> JpaMain.java - Criteria 사용

```
            // Criteria 사용 준비
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Member> query = cb.createQuery(Member.class);

            // 루트 클래스 조회 (조회를 시작할 클래스)
            Root<Member> m = query.from(Member.class);

            // 쿼리 생성
            CriteriaQuery<Member> cq = query.select(m).where(cb.equal(m.get("name"), "member1"));
            List<Member> resultList = em.createQuery(cq).getResultList();

            tx.commit();
```

> console

```
Hibernate: 
    /* select
        generatedAlias0 
    from
        Member as generatedAlias0 
    where
        generatedAlias0.name=:param0 */ select
            member0_.id as id1_6_,
            member0_.city as city2_6_,
            member0_.street as street3_6_,
            member0_.zipcode as zipcode4_6_,
            member0_.USERNAME as username5_6_ 
        from
            Member member0_ 
        where
            member0_.USERNAME=?
```

![contact](/images/develop/backend/orm-jpa-basic/object-oriented-query-language/img-002.png)

> 자바 소스로 쿼리를 작성하기 때문에 오타로 인한 오류는 IDE에서 알려주거나 오류로 알 수 있는 장점이 있고 또한 동적쿼리를 작성할때 편리함을 얻을 수 있습니다. 

> 하지만 Criteria 방식은 복잡해 지면 좀더 분석하기 어려워집니다. 

```
            CriteriaQuery<Member> cq = query.select(m);

            String username = "member1";

            if (!username.equals(null)){
                cq.where(cb.equal(m.get("name"), username));
            }
```

> 실무에서는 쿼리를 작성했던 사람도 보기 힘들 정도로 직관성이 떨어지고, 유지 보수가 힘들어지기 때문에 사용하지 않는다고 합니다.


#### Criteria 정리
> - 문자가 아닌 자바 코드로 JPQL을 작성할 수 있음
> - JPQL 빌더 역활
> - JPA 공식 기능
> - <mark>단점 : 너무 복잡하고 실용성이 없다.</mark>
> - Criteria 대신에 QueryDSL 사용 권장



### QueryDSL 
--------------------------------------

#### QueryDSL 소개 

```
// JPQL
// select m from Member m where m.age > 18
JPAFactoryQuery query = new JPAFactoryQuery(em);
QMember m = QMember.member;

List<Member> list =
	query.selectFrom(m)
		.where(m.age.gt(18))
		.orderBy(m.name.desc())
		.fetch();

```

> SQL과 비슷한 형태로 되어있는 것을 확인 할 수 있습니다. <br>

> - 문자가 아닌 나바코드로 JPQL을 작성할 수 있음
> - JPQL 빌더 역할
> - 컴파일 시점에 문법 오류를 찾을 수 있음
> - 동적쿼리 작성 편함
> - <mark>단순하고 쉬움</mark>
> - <mark>실무 사용 권장</mark>

> queryDSL은 설정이 힘든만큼 SQL과 비슷하여 작성이 쉽고 오류도 컴파일러에서 검출해주며, 동적쿼리에도 강력한 기능을 보여줍니다.<br>
> 이후 queryDSL 강의에서 좀더 깊이 배우고 정리하도록 하겠습니다.



### Native SQL 
--------------------------------------

#### Native SQL 소개 
> - JPA가 제공하는 SQL을 직접 사용하는 기능
> - JPQL로 해결할 수 없는 특정 데이터베이스에 의존적인 기능
> - 예) 오라클 CONNECT BY, 특정 DB만 사용하는 SQL 문법

````
String sql = 
	"SELECT ID, AGE, TEAM_ID, NAME FROM MEMBER WHERE NAME = 'Kim'";  // ** 엔티티를 대상으로 쿼리 작성이 아닌 테이블 대상으로 쿼리를 하기때문에 테이블 컬럼명을 사용합니다.
	
List<Member> resultList = 
	em.createNativeQuery(sql, Member.class)
		.getResultList();

````

> console

```
Hibernate: 
    /* dynamic native SQL query */ select
        * 
    from
        Member 
    where
        username like '%m%' 
relativemapping.Member@4cafa9aa
```

> 네이티브 쿼리를 사용한다면, 네이티브 쿼리를 사용하는 것보다 다음 SpringJdbcTemplate 를 사용하거나 마이바티스 사용 추천

### JDBC 직접사용, SpringJdbcTemplate 등
----------------------------------------

#### JDBC 직접사용, SpringJdbcTemplate 등 소개
> - JPA를 사용하면서 JDBC 커넥션을 직접 사용하거나, 스프링 JdbcTemplate, 마이바티스 등을 함께 사용가능
> - 단 영속성 컨텍스트를 적절한 시점에 강제로 플러시 필요
> - 예) JPA를 우회해서 SQL을 실행하기 직전에 영속성 컨텍스트 수동 플러시

> 주의해야 할 사항으로는 이런 JDBC나 Template, 마이바티스 같은 라이브러리들은 JPA와 관련이 없기 때문에 <br>
> 영속성 컨텍스트의 기능과 별개, 그렇기 때문에 commit 된 상태가 되어야 데이터를 조회할 수 있어서 영속성 컨텍스트를 플러시 해줘야 <br>
> 등록된 데이터가 사용가능하다.

> 커밋을 하거나, JPA의 기능을 이용한 쿼리(JPQL, Criteria, NativeQuery...) 등은 자동 플러시









#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>