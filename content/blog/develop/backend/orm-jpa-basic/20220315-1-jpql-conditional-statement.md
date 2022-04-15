---
title: "[자바 ORM 표준 JPA] JPQL 조건문(CONDITIONAL STATEMENT)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-15
slug: "jpql-conditional-statement"
description: "JPQL 조건문(CONDITIONAL STATEMENT)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 조건문(CONDITIONAL STATEMENT)
-------------------------------------

## 조건문
----------------------------------------------
> - 기본 CASE 문

```
SELECT 
	CASE WHEN m.age <= 10 THEN '학생요금'
          WHEN m.age >= 60 THEN '경로요금'
          ELSE '일반요금'
     END
FROM Member m     
```

> - 단순 CASE 문

```
SELECT 
	CASE t.name
		WHEN '팀A' THEN '인센티브110%'
		WHEN '팀B' THEN '인센티브120%'
		ELSE '인센티브105%'
	END
FROM Team t		
```

> - COALESCE : 하나씩 조회해서 NULL이 아니면 반환
>	사용자 이름이 없으면 '이름 없는 회원'을 반환
```
SELECT COALESCE(m.username,'이름 없는 회원') FROM Member m
```

> - NULLIF : 두 값이 같으면  NULL 반환, 다르면 첫번째 값 반환
>	사용자 이름이 '관리자'면 NULL을 반환하고 나머지는 본인의 이름을 반환 
```
SELECT NULLIF(m.username,'관리자') FROM Member m
```

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

### 기본 CASE 문
--------------------------------

> JpqlMain.java

```
Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("member");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


           String sQuery = "SELECT " +
                            "CASE WHEN m.age <= 10 THEN '학생요금' "+
                                 "WHEN m.age >= 60 THEN '경로요금' "+
                            "ELSE '일반요금' END " +
                            "FROM Member m ";
            List<String> resultList = em.createQuery(sQuery, String.class)
                    .getResultList();

            for(String s : resultList){
                System.out.println(s);
            }
```

> console

```
Hibernate: 
    /* SELECT
        CASE 
            WHEN m.age <= 10 THEN '학생요금' 
            WHEN m.age >= 60 THEN '경로요금' 
            ELSE '일반요금' 
        END 
    FROM
        Member m  */ select
            case 
                when member0_.age<=10 then '학생요금' 
                when member0_.age>=60 then '경로요금' 
                else '일반요금' 
            end as col_0_0_ 
        from
            Member member0_

일반요금

```

> 쿼리가 문자열이기 때문에 띄어쓰기를 잘해야합니다. 라인의 마지막이 " " 공백이여야 다음 줄의 첫 문자와 연결되지 않습니다.



### 단순 CASE 문
--------------------------------

> JpqlMain.java

```

            Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("member");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


           String sQuery = "SELECT " +
                            "CASE t.name " +
                                 "WHEN 'team1' THEN '인센티브110' "+
                                 "WHEN 'team2' THEN '인센티브120' "+
                            "ELSE '인센티브105%' END " +
                            "FROM Team t ";
            List<String> resultList = em.createQuery(sQuery, String.class)
                    .getResultList();

            for(String s : resultList){
                System.out.println(s);
            }

            tx.commit();
```

```
Hibernate: 
    /* SELECT
        CASE t.name 
            WHEN 'team1' THEN '인센티브110' 
            WHEN 'team2' THEN '인센티브120' 
            ELSE '인센티브105%' 
        END 
    FROM
        Team t  */ select
            case team0_.name 
                when 'team1' then '인센티브110' 
                when 'team2' then '인센티브120' 
                else '인센티브105%' 
            end as col_0_0_ 
        from
            Team team0_
            
인센티브110
```

### COALESCE
--------------------------------

> JpqlMain.java

```
		  Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername(null); // *** 이름을 NULL로 세팅
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


            String sQuery = "SELECT COALESCE(m.username, '이름 없는 회원') FROM Member m";

            List<String> resultList = em.createQuery(sQuery, String.class)
                    .getResultList();

            for(String s : resultList){
                System.out.println(s);
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* insert jpql.domain.Member
        */ insert 
        into
            Member
            (age, TEAM_ID, type, username, id) 
        values
            (?, ?, ?, ?, ?)
Hibernate: 
    /* SELECT
        COALESCE(m.username,
        '이름 없는 회원') 
    FROM
        Member m */ select
            coalesce(member0_.username,
            '이름 없는 회원') as col_0_0_ 
        from
            Member member0_

이름 없는 회원

```

### NULLIF
--------------------------------

> JpqlMain.java

```
Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("관리자");
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


            String sQuery = "SELECT NULLIF(m.username, '관리자') FROM Member m";

            List<String> resultList = em.createQuery(sQuery, String.class)
                    .getResultList();

            for(String s : resultList){
                System.out.println(s);
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        NULLIF(m.username,
        '관리자') 
    FROM
        Member m */ select
            nullif(member0_.username,
            '관리자') as col_0_0_ 
        from
            Member member0_

null

```

#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>