---
title: "JPQL 엔티티 직접 사용(Direct Use Of Entity)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-27
slug: "jpql-direct-use-of-entity"
description: "JPQL 엔티티 직접 사용(Direct Use Of Entity)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 엔티티 직접 사용(Direct Use Of Entity)
-------------------------------------

## 엔티티 직접 사용
-------------------------------------

### 기본 키 값 
-------------------------
> JPQL에서 엔티티를 직접 사용하면 SQL로 어떠한 쿼리가 실행되는 지에 대한 정리 입니다.

> COUNT(m) 같은 SQL 함수에서 엔티티를 직접 사용했을때, SQL에서 해당 엔티티의 식별자인 기본 키 값을 사용하게됩니다.

>  [JPQL]

```
SELECT COUNT(m.id) FROM Member M // 엔티티의 아이디를 사용

SELECT COUNT(m) FROM Member M // 엔티티를 직접 사용

```
<br>


> [SQL] (둘다 같은 다음 SQL 실행)

```
SELECT COUNT(m.id) as CNT FROM Member m
```


> 엔티티를 파라미터로 전달

````
String jpql = "SELECT m FROM Member m WHERE m WHERE m = :member";
List resultList = em.createQuery(jqpl)
                    .setParameter("member", member)
                    .getResultList();
````

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);

            Member member1 = new Member();
            member1.setUsername("회원1");
            member1.setAge(31);
            member1.changeTeam(team1);
            member1.setType(MemberType.USER);
            em.persist(member1);

            Member member2 = new Member();
            member2.setUsername("회원2");
            member2.setAge(32);
            member2.changeTeam(team1);
            member2.setType(MemberType.USER);
            em.persist(member2);

            Member member3 = new Member();
            member3.setUsername("회원3");
            member3.setAge(33);
            member3.changeTeam(team2);
            member3.setType(MemberType.USER);
            em.persist(member3);

            Member member4 = new Member();
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.changeTeam(team3);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT m FROM Member m WHERE m = :mmbr";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .setParameter("mmbr",member1)
                    .getResultList();


            for(Member member : resultList){
                System.out.println("name = " + member.getUsername()+ ", age = " + member.getAge());
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
    WHERE
        m = :mmbr */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id5_0_,
            member0_.type as type3_0_,
            member0_.username as username4_0_ 
        from
            Member member0_ 
        where
            member0_.id=?
            
        
name = 회원1, age = 31


```


> 식별자를 직접 전달

```
String jpql = "SELECT m FROM Member m WHERE m.id = :memberId";
List resultList = em.createQuery(jqpl)
                    .setParameter("memberId", memberId)
                    .getResultList();
```

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);

            Member member1 = new Member();
            member1.setUsername("회원1");
            member1.setAge(31);
            member1.changeTeam(team1);
            member1.setType(MemberType.USER);
            em.persist(member1);

            Member member2 = new Member();
            member2.setUsername("회원2");
            member2.setAge(32);
            member2.changeTeam(team1);
            member2.setType(MemberType.USER);
            em.persist(member2);

            Member member3 = new Member();
            member3.setUsername("회원3");
            member3.setAge(33);
            member3.changeTeam(team2);
            member3.setType(MemberType.USER);
            em.persist(member3);

            Member member4 = new Member();
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.changeTeam(team3);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();


            String sQuery = "SELECT m FROM Member m WHERE m.id = :mmbrId";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .setParameter("mmbrId",member1.getId())
                    .getResultList();


            for(Member member : resultList){
                System.out.println("name = " + member.getUsername()+ ", age = " + member.getAge());
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
    WHERE
        m.id = :mmbrId */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id5_0_,
            member0_.type as type3_0_,
            member0_.username as username4_0_ 
        from
            Member member0_ 
        where
            member0_.id=?
            
name = 회원1, age = 31

```

> 실행된 SQL

```
SELECT m.* FROM Member m WHERE m.id = ?
```


### 외래 키 값 
-------------------------
> 외래 키 값은 

> Member.java

```
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID")   // ** 연관관계로 매핑된 외래키
    private Team team;
```



> 엔티티를 파라미터로 전달

````
Team team = em.find(Team.class, 1L);

String jpql = "SELECT m FROM Member m WHERE m.team = :team";

List resultList = em.createQury(jpql)
                    .setParameter("team", team)
                    .getResultList();
````

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);

            Member member1 = new Member();
            member1.setUsername("회원1");
            member1.setAge(31);
            member1.changeTeam(team1);
            member1.setType(MemberType.USER);
            em.persist(member1);

            Member member2 = new Member();
            member2.setUsername("회원2");
            member2.setAge(32);
            member2.changeTeam(team1);
            member2.setType(MemberType.USER);
            em.persist(member2);

            Member member3 = new Member();
            member3.setUsername("회원3");
            member3.setAge(33);
            member3.changeTeam(team2);
            member3.setType(MemberType.USER);
            em.persist(member3);

            Member member4 = new Member();
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.changeTeam(team3);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT m FROM Member m WHERE m.team = :team";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .setParameter("team",team1)
                    .getResultList();


            for(Member member : resultList){
                System.out.println("name = " + member.getUsername()+ ", age = " + member.getAge());
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
    WHERE
        m.team = :team */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id5_0_,
            member0_.type as type3_0_,
            member0_.username as username4_0_ 
        from
            Member member0_ 
        where
            member0_.TEAM_ID=?
            
name = 회원1, age = 31
name = 회원2, age = 32
```

> 식별자를 직접 전달

````
Team team = em.find(Team.class, 1L);

String jpql = "SELECT m FROM Member m WHERE m.team.id = :teamId";

List resultList = em.createQury(jpql)
                    .setParameter("teamId", teamId)
                    .getResultList();
````

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);

            Member member1 = new Member();
            member1.setUsername("회원1");
            member1.setAge(31);
            member1.changeTeam(team1);
            member1.setType(MemberType.USER);
            em.persist(member1);

            Member member2 = new Member();
            member2.setUsername("회원2");
            member2.setAge(32);
            member2.changeTeam(team1);
            member2.setType(MemberType.USER);
            em.persist(member2);

            Member member3 = new Member();
            member3.setUsername("회원3");
            member3.setAge(33);
            member3.changeTeam(team2);
            member3.setType(MemberType.USER);
            em.persist(member3);

            Member member4 = new Member();
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.changeTeam(team3);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT m FROM Member m WHERE m.team.id = :teamId";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .setParameter("teamId",team1.getId())
                    .getResultList();


            for(Member member : resultList){
                System.out.println("name = " + member.getUsername()+ ", age = " + member.getAge());
            }

            tx.commit();
```

> console

````
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m 
    WHERE
        m.team.id = :teamId */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id5_0_,
            member0_.type as type3_0_,
            member0_.username as username4_0_ 
        from
            Member member0_ 
        where
            member0_.TEAM_ID=?
            
name = 회원1, age = 31
name = 회원2, age = 32
````



> 실행된 SQL

````
SELECT m.* FROM Member m WHERE m.team_id = ? 
````



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
