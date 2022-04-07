---
title: "JPQL 타입 표현(Type Expression)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-14
slug: "jpql-type-expression"
description: "JPQL 타입 표현(Type Expression)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 타입 표현(Type Expression)
-------------------------------------

## JPQL 타입 표현
----------------------------------------------
> - 문자 : 'HELLO', 'She''s' 
>	- 따옴표(single quotation) 표현시 single quotation 2개 ''
> - 숫자 : 10L(Long), 10D(Double), 10F(Float)
> - Boolean : TRUE, FALSE
> - ENUM : jpabook.MemberType.Admin (전체 패키지명 포함)
> - 엔티티 타입 : TYPE(m) = Member (상속 관계에서 사용)

#### 이전 소스
---------------------

> src/main/java/jpql/domain/Member.java

<details title="펼치기/숨기기">
 	<summary> Member.java </summary>

	package jpql.domain;
	
	import javax.persistence.*;
	
	
	@Entity
	public class Member {
	
	    public Member(){
	    }
	
	    @Id @GeneratedValue
	    private Long id;
	
	    private String username;
	
	    private int age;
	
	    @ManyToOne
	    @JoinColumn(name = "TEAM_ID")
	    private Team team = new Team();
	
	    public Long getId() {
	        return id;
	    }
	
	    public void setId(Long id) {
	        this.id = id;
	    }
	
	    public String getUsername() {
	        return username;
	    }
	
	    public void setUsername(String username) {
	        this.username = username;
	    }
	
	    public int getAge() {
	        return age;
	    }
	
	    public void setAge(int age) {
	        this.age = age;
	    }
	
	    public jpql.domain.Team getTeam() {
	        return team;
	    }
	
	    public void setTeam(jpql.domain.Team team) {
	        this.team = team;
	    }
	    
	    @Override
	    public String toString() {
	        return "Member{" +
	                "id=" + id +
	                ", username='" + username + '\'' +
	                ", age=" + age +
	                '}';
	    }
	}
	
</details>


> src/main/java/jpql/domain/Team.java


<details title="펼치기/숨기기">
 	<summary> Team.java </summary>
 
	package jpql.domain;
	
	import javax.persistence.*;
	import java.util.ArrayList;
	import java.util.List;
	
	
	@Entity
	public class Team {
	
	    public Team() {
	    }
	
	    @Id @GeneratedValue
	    private Long id;
	
	    private String name;
	
	    @OneToMany(mappedBy = "team")
	    private List<Member> members = new ArrayList<>();
	
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
	
	    public List<Member> getMembers() {
	        return members;
	    }
	
	    public void setMembers(List<Member> members) {
	        this.members = members;
	    }
	}
 	
</details> 	


> src/main/java/jpql/domain/Order.java

<details title="펼치기/숨기기">
 	<summary> Order.java </summary>
 	
	package jpql.domain;
	
	import javax.persistence.*;
	
	@Entity
	@Table(name = "ORDERS") //ORDER 가 예약어라 ORDERS로 테이블 명칭 지정
	public class Order {
	    public Order() {
	    }
	
	    @Id @GeneratedValue
	    private Long id;
	
	    private int orderAmount;
	
	    @Embedded
	    private Address orderAddress;
	
	    @ManyToOne
	    @JoinColumn(name = "PRODUCT_ID")
	    private Product product;
	
	    public Long getId() {
	        return id;
	    }
	
	    public void setId(Long id) {
	        this.id = id;
	    }
	
	    public int getOrderAmount() {
	        return orderAmount;
	    }
	
	    public void setOrderAmount(int orderAmount) {
	        this.orderAmount = orderAmount;
	    }
	
	    public Address getOrderAddress() {
	        return orderAddress;
	    }
	
	    public void setOrderAddress(Address orderAddress) {
	        this.orderAddress = orderAddress;
	    }
	
	    public Product getProduct() {
	        return product;
	    }
	
	    public void setProduct(Product product) {
	        this.product = product;
	    }
	}
 	
</details> 


> src/main/java/jpql/domain/Address.java

<details title="펼치기/숨기기">
 	<summary> Address.java </summary>

	package jpql.domain;
	
	import javax.persistence.Embeddable;
	import java.util.Objects;
	
	@Embeddable
	public class Address {
	    private String city;
	    private String street;
	    private String zipcode;
	
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
	        if (!(o instanceof Address)) return false;
	        Address address = (Address) o;
	        return Objects.equals(getCity(), address.getCity()) && Objects.equals(getStreet(), address.getStreet()) && Objects.equals(getZipcode(), address.getZipcode());
	    }
	
	    @Override
	    public int hashCode() {
	        return Objects.hash(getCity(), getStreet(), getZipcode());
	    }
	
	}
</details> 

> src/main/java/jpql/domain/Product.java


<details title="펼치기/숨기기">
 	<summary> Product.java </summary>
 	
	package jpql.domain;
	
	import javax.persistence.Column;
	import javax.persistence.Entity;
	import javax.persistence.GeneratedValue;
	import javax.persistence.Id;
	
	@Entity
	public class Product {
	    public Product() {
	    }
	
	    @Id @GeneratedValue
	    private Long id;
	
	    private String name;
	
	    private int price;
	
	    private int stockAmount;
	
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
	
	    public int getStockAmount() {
	        return stockAmount;
	    }
	
	    public void setStockAmount(int stockAmount) {
	        this.stockAmount = stockAmount;
	    }
	} 	
</details> 
 	

> src/main/java/jpql/JpqlMain.java

<details title="펼치기/숨기기">
 	<summary> JpqlMain.java </summary>

	package jpql;
	
	import jpql.domain.*;
	
	import javax.persistence.EntityManager;
	import javax.persistence.EntityManagerFactory;
	import javax.persistence.EntityTransaction;
	import javax.persistence.Persistence;
	
	public class JpqlMain {
	    //psvm 단축키로 생성 가능
	    public static void main(String[] args) {
	        EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpql");
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
</details> 


### 문자, 숫자, Boolean 실습
----------------------------------------------
> JpqlMain.java - 문자, 숫자, Boolean

```
 Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("member");
            member1.setAge(30);
            member1.changeTeam(team);

            em.persist(member1);

            em.flush();
            em.clear();

            String teamName = "team1";

            String sQuery = "SELECT m.username, 'HELLO SHE''s', TRUE, 10L  FROM Member m LEFT OUTER JOIN m.team t on t.name = m.username";
            List<Object[]> result = em.createQuery(sQuery)
                    .getResultList();

            for (Object[] objects : result){
                System.out.println("objects = "+ objects[0]);
                System.out.println("objects = "+ objects[1]);
                System.out.println("objects = "+ objects[2]);
                System.out.println("objects = "+ objects[3]);
            }
```

> console

```
Hibernate: 
    /* SELECT
        m.username,
        'HELLO SHE''s',
        TRUE,
        10L  
    FROM
        Member m 
    LEFT OUTER JOIN
        m.team t 
            on t.name = m.username */ select
                member0_.username as col_0_0_,
                'HELLO SHE''s' as col_1_0_,
                1 as col_2_0_,
                10 as col_3_0_ 
        from
            Member member0_ 
        left outer join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id 
                and (
                    team1_.name=member0_.username
                )
objects = member 		// 컬럼 - m.name
objects = HELLO SHE's 	// 문자열 - 'HELLO SHE''s'
objects = true 		// 불린 - TRUE
objects = 10   		// 숫자 - 10L

```

### Enum 실습
----------------------------------------------

> JpqlMain.java - Enum Jpql에서 사용


> Member.java - MemberType 추가

```
...
     @Enumerated(EnumType.STRING) // 기본이 숫자 EnumType.ORDINAL 이기 때문에 String으로 필수로 세팅
    private MemberType type;

    public MemberType getType() {
        return type;
    }

    public void setType(MemberType type) {
        this.type = type;
    }
...
```


> MemberType.java

```
package jpql.domain;

public enum MemberType {
    ADMIN, USER
}

```

```
Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("member");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER); // *** Member 타입 추가

            em.persist(member1);

            em.flush();
            em.clear();

            String teamName = "team1";

            String sQuery = "SELECT m.username, 'HELLO SHE''s', TRUE, 10L  FROM Member m LEFT OUTER JOIN m.team t on t.name = m.username"
                            + " WHERE m.type = jpql.domain.MemberType.USER "; // *** Member 타입 조회 조건 추가
            List<Object[]> result = em.createQuery(sQuery)
                    .getResultList();

            for (Object[] objects : result){
                System.out.println("objects = "+ objects[0]);
                System.out.println("objects = "+ objects[1]);
                System.out.println("objects = "+ objects[2]);
                System.out.println("objects = "+ objects[3]);
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        m.username,
        'HELLO SHE''s',
        TRUE,
        10L  
    FROM
        Member m 
    LEFT OUTER JOIN
        m.team t 
            on t.name = m.username 
    WHERE
        m.type = jpql.domain.MemberType.USER  */ select
            member0_.username as col_0_0_,
            'HELLO SHE''s' as col_1_0_,
            1 as col_2_0_,
            10 as col_3_0_ 
        from
            Member member0_ 
        left outer join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id 
                and (
                    team1_.name=member0_.username
                ) 
        where
             member0_.type='USER' // *** MemberType 조건 추가
            
objects = member
objects = HELLO SHE's
objects = true
objects = 10
```

> 패키지 명은 길기 때문에 파라미터 바인딩을 통해 코드를 줄일 수 있습니다.

> JpqlMain.java - MemberType 파라미터로 세팅 

```
String teamName = "team1";

            String sQuery = "SELECT m.username, 'HELLO SHE''s', TRUE, 10L  FROM Member m LEFT OUTER JOIN m.team t on t.name = m.username"
                            + " WHERE m.type = :userType ";
            List<Object[]> result = em.createQuery(sQuery)
                    .setParameter("userType", MemberType.USER)
                    .getResultList();
```

###  Entity 타입 실습
----------------------------------------------

> 예제를 진행하기 위해 실전 예제를 사용했던 프로젝트를 불러와 사용하겠습니다.

<a href="https://offetuoso.github.io/blog/develop/backend/orm-jpa-basic/practical-example-6/">실전 예제 6 - 값 타입 매핑</a>
 	
> Item 같은 경우에 상속관계로 Album, Book, Movie 가 있는데, Book 관련 된것만 조회하고 싶을때 

> JpaMain.java

```
            Book book = new Book();
            book.setName("JPA");
            book.setAuthor("김영한");
            em.persist(book);

            List<Item> result = em.createQuery("SELECT i FROM Item i WHERE TYPE(i) = Book ", Item.class).getResultList(); // *** TYPE(i) = Book

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        i 
    FROM
        Item i 
    WHERE
        TYPE(i) = Book  */ select
            item0_.ITEM_ID as item_id2_3_,
            item0_.MOD_ID as mod_id3_3_,
            item0_.MOD_DT as mod_dt4_3_,
            item0_.REG_ID as reg_id5_3_,
            item0_.REG_DT as reg_dt6_3_,
            item0_.name as name7_3_,
            item0_.price as price8_3_,
            item0_.stockQuantity as stockqua9_3_,
            item0_.author as author10_3_,
            item0_.isbn as isbn11_3_,
            item0_.artist as artist12_3_,
            item0_.etc as etc13_3_,
            item0_.actor as actor14_3_,
            item0_.director as directo15_3_,
            item0_.DTYPE as dtype1_3_ 
        from
            Item item0_ 
        where
            item0_.DTYPE='B' // *** TYPE(i) = Book

```


## JPQL 기타 표현
----------------------------------------------
> - SQL과 문법이 같음 
> - EXISTS, IN
> - AND, OR, NOT
> - =, >, >=, <, <=, <>
> - BETWEEN, LIKE, IS NULL 

#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>