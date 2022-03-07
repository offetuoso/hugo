---
title: "JPA Projection(SELECT)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-07
slug: "jpql"
description: "Projection(SELECT)"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# JPA Projection(SELECT)
-------------------------------------

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
	                ", team=" + team +
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
 	

> src/main/java/jpql/JplMain.java

<details title="펼치기/숨기기">
 	<summary> Product.java </summary>

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
	
	            Team team1 = new Team();
	            team1.setName("팀1");
	
	            Member member1 = new Member();
	            member1.setUsername("오과장");
	            member1.setAge(35);
	            member1.setTeam(team1);
	            
	
	            Member member2 = new Member();
	            member2.setUsername("육대리");
	            member2.setAge(28);
	            member2.setTeam(team1);
	
	            em.persist(team1);
	            em.persist(member1);
	            em.persist(member2);
	
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

## Projection(SELECT)
-------------------------------------
> - SELECT 절에 조회할 대상을 지정하는 것
> - 프로젝션 대상 : 엔티티, 임베디드 타입, 스칼라 타입(숫자, 문자등 기본 데이터 타입)
> - SELECT m FROM Member m -> 엔티티 프로젝션
> - SELECT m.team FROM Member m -> 엔티티 프로젝션
> - SELECT m.address FROM Member m -> 임베디드 타입 프로젝션
> - SELECT m.username, m.age FROM Member m -> 스칼라 타입 프로젝션 
> - DISTINCT로 중복 제거


> 엔티티 프로젝션에서 또 깊이 생각해 볼것은 조회한 엔티티가 과연 영속성 컨텍스트에서 관리가 되는지 입니다.

> 엔티티를 추가하고 플러시, 클리어 후 조회한 엔티티(findMember)를 수정하였을 때,  Update 문이 실행되는지 확인해 보겠습니다.

> JpqlMain.java

```
...
	       Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("member1");
            member1.setAge(35);
            member1.setTeam(team);

            em.persist(member1);

            em.flush();
            em.clear();

            List<Member> result = em.createQuery("SELECT m FROM Member m", Member.class)
                    .getResultList();

            Member findMember = result.get(0);
            findMember.setAge(28);

            tx.commit();
...
```


#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>