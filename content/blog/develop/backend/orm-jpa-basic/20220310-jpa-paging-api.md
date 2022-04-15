---
title: "[자바 ORM 표준 JPA] JPA Paging API"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-10
slug: "paging-api"
description: "JPA Paging API"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPA Paging API
-------------------------------------

## 페이징 API
----------------------------------------------
> JPA는 페이징을 다음 두 API로 추상화

> - setFirstResult(int startPosition) : 조회 시작 위치
(0 부터 시작)
> - setMaxResults(int maxResult) : 조회할 데이터 수

> Oracle 또는 MySql에서 페이징을 구현하기 위해서는 rownum을 사용하고 정렬을 위해 order by를 적용하려면 또 한번 더 감싸서 페이징을 쿼리를 작성하게 되어 3뎁스 까지도 나오게 되어 지저분한 쿼리가 됩니다. 

> 그런데 JPA는 2가지 API만 사용하면됩니다. 페이징은 단지 몇번째 부터 몇개 가져와야 하는지 밖에 없습니다. 이를 JPA는 추상화하여 API로 제공합니다. 


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


### 페이징 API - MySQL 방언
------------------------------

```
select
            M.id as ID,
            M.age as AGE,
            M.TEAM_ID as TEAM_ID,
            M.username as USERNAME 
        from
            Member M 
        order by
            M.age desc limit ?, ? 
```

> MySql에서는 몇번째 부터 몇개 가져올것을 JPA가 setFirstResult()와 setMaxResults()로 알아서 계산해줍니다.

> JpqlMain.java

```
            Team team = new Team();
            team.setName("team1");
            em.persist(team);

            for(int i=0; i<100; i++){ // roof로 사용자 인서트
                Member member1 = new Member();
                member1.setUsername("member"+i);
                member1.setAge(i);
                member1.setTeam(team);

                em.persist(member1);
            }

            em.flush();
            em.clear();

            List<Member> result = em.createQuery("SELECT m FROM Member m ORDER BY m.age desc", Member.class)
                    .setFirstResult(0)
                    .setMaxResults(10)
                    .getResultList();

            System.out.println("result size = "+result.size());

            for (Member mmber : result){
                System.out.println("member = "+ mmber);
            }

            tx.commit();
```

> console 

```
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m 
    ORDER BY
        m.age desc */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id4_0_,
            member0_.username as username3_0_ 
        from
            Member member0_ 
        order by
            member0_.age desc limit ?
Hibernate: 
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
result size = 10
member = Member{id=101, username='member99', age=99}
member = Member{id=100, username='member98', age=98}
member = Member{id=99, username='member97', age=97}
member = Member{id=98, username='member96', age=96}
member = Member{id=97, username='member95', age=95}
member = Member{id=96, username='member94', age=94}
member = Member{id=95, username='member93', age=93}
member = Member{id=94, username='member92', age=92}
member = Member{id=93, username='member91', age=91}
member = Member{id=92, username='member90', age=90}

```

> 나이 많은 순으로 정렬 후 10명 가져오는 것을 확인 할 수 있습니다.

> limit ?, limit ? offset ?은 MySql 페이징 문법이며, persistence.xml에서 hibernate.dialect를 오라클로 변경하고 다시 실행해 보겠습니다. 


### 페이징 API - Oracle 방언
------------------------------

```
	SELECT * FROM
	    ( SELECT ROW_.*, ROWNUM ROWNUM_ 
	     FROM
	     	( SELECT
	                M.ID AS ID,
	                M.AGE AS AGE,
	                M.TEAM_ID AS TEAM_ID,
	                M.USERNAME AS USERNAME 
	            FROM
	                MEMBER M 
	            ORDER BY M.AGE DESC 
	          )ROW_ 
		WHERE ROWNUM <= ?
	    )
	WHERE ROWNUM_ <= ?
```


```
<!--<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>-->
<property name="hibernate.dialect" value="org.hibernate.dialect.Oracle8iDialect"/>

```

console

```
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m 
    ORDER BY
        m.age desc */ select
            * 
        from
            ( select
                member0_.id as id1_0_,
                member0_.age as age2_0_,
                member0_.TEAM_ID as team_id4_0_,
                member0_.username as username3_0_ 
            from
                Member member0_ 
            order by
                member0_.age desc ) 
        where
            rownum <= ?
Hibernate: 
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
result size = 10
member = Member{id=101, username='member99', age=99}
member = Member{id=100, username='member98', age=98}
member = Member{id=99, username='member97', age=97}
member = Member{id=98, username='member96', age=96}
member = Member{id=97, username='member95', age=95}
member = Member{id=96, username='member94', age=94}
member = Member{id=95, username='member93', age=93}
member = Member{id=94, username='member92', age=92}
member = Member{id=93, username='member91', age=91}
member = Member{id=92, username='member90', age=90}

```

> 오라클로 변경하여 실행하였더니, rownum을 이용한 3뎁스 sql로 쿼리가 생성되어 실행되는 것이 보입니다.

```
<!--
<property name="hibernate.dialect" value="org.hibernate.dialect.Oracle8iDialect"/>
-->
<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
```
> 스프링 데이터 JPA에서도 페이징 기능이 매우 편리하게 되어있는데, 
결과적으로 JPA에서 제공하는 표준 스펙 기능입니다. 



#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>