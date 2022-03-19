---
title: "JPQL 경로 표현식(PATH EXPRESSION)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-19
slug: "jpql-path-expression"
description: "JPQL 경로 표현식(PATH EXPRESSION)"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# JPQL 경로 표현식(PATH EXPRESSION)
-------------------------------------

## 경로 표현식
----------------------------------------------
> .(점|dot)을 찍어 객체를 탐색 하는 것

```
SELECT m.username 	-> 상태 필드
  FROM m
  JOIN m.team t	-> 단일 값 연관 필드
  JOIN m.order o 	-> 컬렉션 값 연관 필드
 WHERE t.name = 'team1' 
```

> .을 통해 상태 필드, 단일 값 연관 필드, 컬렉션 값 연관 필드를 탐색하느냐에 따라서 상태 필드 표현식, 단일 값 연관 필드 표현식, 콜렉션 값 연관 필드 표현식 3가지 표현식이 있으며 내부적으로 각각 다른 동작을 하게 됩니다. 그렇기 때문에 꼭 구분해서 이해해야 합니다.

> - 식별 변수(별칭 alias) : JPA 표준 명세는 별칭을 식별 변수(Indeitification variale)로 정의

> - 상태 필드(state field) : 엔티티의 필드(속성)이며, 다른 엔티티와 연관되지 않은 상태 필드

> - 연관 필드(association field) : 연관 관계를 위한 필드

>	- 단일 값 연관 필드 : 엔티티에 다른 엔티티와 연관 관계가 설정된 필드 <br>
>	@ManyToOne, @OneToOne의 대상 엔티티 예) m.temm, m.team 

>	- 컬렉션 값 연관 필드 : 엔티티에 다른 엔티티와 연관 관계가 설정된 필드 <br>
>	@OneToMany, @ManyToMany의 대상 엔티티 예) m.orders, t.members
	


### 경로 표현식 특징
----------------------------------------------

#### 상태 필드 표현식(state_field_path_expression)
> 경로 탐색의 끝, 이후 탐색 불가<br>
<Strong>{식별 변수 | 단일 값 연관 필드 표현식}.상태 필드(state_field)</Strong> <br>
	엔티티의 상태 필드를 .을 통해 <mark>상태 필드를 탐색</mark> <br> 
	예) m(Member).id, m(Member).username, t(Team).name, m(Member).team.name


> JpqlMain.java

```
            Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("Member1");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


            String sQuery = "SELECT m.username FROM Member m";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .getResultList();

            for(Member s : resultList){
                System.out.println(s);
            }

            tx.commit();

```

> 상태 필드 표현식은 이후 .을 통해 탐색을 더 할 수 없습니다. 다른 엔티티와 연결된 필드가 아니기 때문입니다. 

![contact](/images/develop/backend/orm-jpa-basic/path-expression/img-001.png)


#### 단일 값 연관 경로 표현식(single_valued_association_path_expression) 
> <mark>묵시적 내부 조인(INNER JOIN) 발생</mark>, 탐색 가능<br> 
 <Strong>식별_변수.{.단일_값_연관_필드}.단일_값_연관_필드</Strong> <br>
 식별 변수 또는 단일 값 연관 필드에서 .을 통해  <mark>단일 값 연관 필드를 탐색</mark> <br>
 예) m(Member).team(Team), o(Orders).member(Member).team(Team)
 
> 단일 값 연관 경로 표현식은 .을 통해 연관 필드의 상태 필드 또는 연관 필드를 탐색할 수 있습니다. 

![contact](/images/develop/backend/orm-jpa-basic/path-expression/img-002.png)

> JpqlMain.java

```
            Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("Member1");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);


            em.flush();
            em.clear();


            String sQuery = "SELECT m.team FROM Member m";
            //String sQuery = "SELECT m.team.username FROM Member m"; // 단일 값 연관 경로 표현식에서 연관 상태 필드 탐색 가능

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();


            for(Team s : resultList){
                System.out.println("result = "+s);
            }

            tx.commit();

```

> console

```
Hibernate: 
    /* SELECT
        m.team 
    FROM
        Member m */ select
            team1_.id as id1_3_,
            team1_.name as name2_3_ 
        from
            Member member0_ 
        inner join // 내부 조인 발생
            Team team1_ 
                on member0_.TEAM_ID=team1_.id
                
result = Team{id=1, name='team1'}
```


#### 콜렉션 값 연관 필드 경로 표현식(collection_valued_path_expression) 
> 묵시적 내부 조인(INNER JOIN) 발생, 이후 탐색 불가 
>	- FROM 절에서 명시적 조인을 통해 별칭을 얻으면 별칭을 통해 탐색 가능<br> 
<Strong>식별_변수.{단일 값 연관 필드.}.콜렉션 값 연관 필드(collection_valued_association_field)</Strong><br>
엔티티에 다른 엔티티가 1:N의 연관 관계가 설정된 (컬렉션)필드<br>
예) m(Member).orders(List<Orders>), t(Team).members(List<Member>)






### 이전 소스
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
	    
        @Override
	    public String toString() {
	        return "Team{" +
	                "id=" + id +
	                ", name='" + name + '\'' +
	                '}';
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





#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
> - <a href="https://docs.oracle.com/middleware/1212/wls/KDJJR/ejb3_langref.html#ejb3_langref_path">Oracle - JPQL Language Reference</a>

