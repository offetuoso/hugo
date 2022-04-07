---
title: "JPQL 네임드 쿼리(Named Query)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-28
slug: "jpql-named-query"
description: "JPQL 네임드 쿼리(Named Query)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 네임드 쿼리(Named Query)
-------------------------------------

## Named 쿼리
-------------------------------------

### @NamedQuery 
-------------------------
> 쿼리를 엔티티 같은 곳에 미리 선언을 해둘 수 있는 기능. 쿼리를 재활용 해서 사용할 수 있습니다.

```
@Entity
@NamedQuery(
	name = "member.findByUsername",
	query = "SELECT m FROM Member WHERE n.username :username"
)

public class Member {
	...
}

List<Member> resultList = 
	em.createQuery("Member.findByUsername", Member.class)
	  .setParameter("username", "회원1")
	  .getResultList();
```

### 정적 쿼리
---------------------
> - 미리 정의해서 이름을 부여해두고 사용하는 JPQL
> - 정적 쿼리
> - 어노테이션, XML에 정의
> - 애플리케이션 로딩 시점에 초기화 후 재사용
>	- 애플리케이션 로딩 시점에 정적인 쿼리를 JPA 또는 하이버네이트가 SQL로 파싱을 하고, 캐싱을 합니다. 
> - <mark>애플리케이션 로딩 시점에 쿼리를 검증</mark>

#### @NamedQuery 사용 테스트

> Member.java

````
package jpql.domain;

import javax.persistence.*;
import jpql.domain.*;


@Entity
@NamedQuery(name = "Member.findByUsername", // * 관례로 엔티티명.쿼리명 으로 많이 사용
            query = "SELECT m FROM Member m WHERE m.username = :username"
)
public class Member {

    public Member(){
    }

    @Id @GeneratedValue
    private Long id;

    private String username;

    private int age;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    public void changeTeam(Team team){
        this.team = team;
        team.getMembers().add(this);
    }

    @Enumerated(EnumType.STRING) // 기본이 숫자 EnumType.ORDINAL 이기 때문에 String으로 필수로 세팅
    private MemberType type;

    public MemberType getType() {
        return type;
    }

    public void setType(MemberType type) {
        this.type = type;
    }

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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    @Override
    public String toString() {
        return "Member{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", age=" + age +
                /*", team=" + team  //toString 양방향 적용시 무한루프될 가능성 toString 에서는 연관관계 제거  */
                '}';
    }
}

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


            List<Member> resultList = em.createNamedQuery("Member.findByUsername", Member.class)
                    .setParameter("username", "회원1")
                    .getResultList();


            for(Member member : resultList){
                System.out.println("name = " + member.getUsername()+ ", age = " + member.getAge());
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* Member.findByUsername */ select
        member0_.id as id1_0_,
        member0_.age as age2_0_,
        member0_.TEAM_ID as team_id5_0_,
        member0_.type as type3_0_,
        member0_.username as username4_0_ 
    from
        Member member0_ 
    where
        member0_.username=?
        
name = 회원1, age = 31

```

#### 애플리케이션 로딩 시점에 쿼리를 검증
> 만약 누군가가 쿼리를 작성할때 실수로 오타를 냈다고 하고 테스트를 해보겠습니다. 

```
@Entity
@NamedQuery(name = "Member.findByUsername", // * 관례로 엔티티명.쿼리명 으로 많이 사용
            query = "SELECT m FROM Membe m WHERE m.username = :username"
)
```

> JpqlMain.java - 애플리케이션 재시작

> console

```

Caused by: org.hibernate.HibernateException: Errors in named queries: 
Member.findByUsername failed because of: org.hibernate.hql.internal.ast.QuerySyntaxException: Membe is not mapped [SELECT m FROM Membe m WHERE m.username = :username]
	at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:341)
	at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:469)
	at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1259)
	... 4 more


```

> 어노테이션에 등록이 되어있기 때문에 Jpa가 미리 파싱을 하고 캐싱을 하려는 중

> 문법이 맞지 않는 상황이 벌어지면 오류를 발생시킵니다. 

```
Member.findByUsername failed because of: org.hibernate.hql.internal.ast.QuerySyntaxException: Membe is not mapped [SELECT m FROM Membe m WHERE m.username = :username]
```

> 개발하면서 가장 좋은 에러는 즉시 나는 에러가 좋습니다. 바로 찾을 수 있고 수정할 수 있기 때문입니다. 그러면 가장 안좋은 에러는 사용자가 사용중에 무언가 액션을 했을때 나는 오류입니다. 그리고 그 중간 정도의 오류는 컴파일 시점에 나는 오류입니다. 어떻게든지 로컬에서라도 실행은 시키고 배포를 하기 때문에 대부분의 오류를 다 잡아줄수 있습니다.


### Named 쿼리 - XML에 정의 

> [META-INF/persistence.xml]

```
<persistance-unit name="jpabook">
	<mapping-file>META-INF/ormMember.xml</mapping-file>
```

> [META-INF/ormMemer.xml]

```
<?xml version="1.0" encoding="UTF-8"?>
<entity-mappings xmlns="http://xmlns.jcp.org/xml/ns/persistence/orm" version="2.1">
	
	<named-query name="Member.findByUsername">
		<query><![CDATA[
			SELECT m
			FROM Member m
			WHERE m.username = :username
		]]></query>
	</named-query>
	
	<named-query name="Member.count">
		<query><![CDATA[
			SELECT COUNT(m) FROM Member m
		]]></query>
	</named-query>
	
</entity-mappings>
```

### Named 쿼리 환경에 따른 설정
> - XML이 항상 우선권을 가진다.
> - 애플리케이션 운영 환경에 따라 다른 XML을 배포할 수 있다.

> 스프링 데이터 JPA를 사용하게 되면 인터페이스 바로 위에 사용 가능합니다. 

> Spring Data JPA

```
public interface UserRepository extends JpaReposotory<User, Long>{
	@Query("SELECT u from User u WHERE u.emailAddress = ?1")
	User findByEmailAddress(String emailAddress);
}

```

> 스프링 JPA는 JPA를 편하게 사용하기 위해 추상화 하여, JPA의 껍데기 역활만 합니다. <br>
> @Query("SELECT u from User u WHERE u.emailAddress = ?1") 가 바로 Named 쿼리 입니다. <br>
> JPA가 해당 어노테이션과 쿼리를 Named 쿼리로 등록합니다. 그래서 애플리케이션 로딩 시점에 파싱하게 되고 문법 오류가 있으면 바로 잡아주게 됩니다.


## 결론 
-------------------------
```
@Entity
@NamedQuery(
	name = "member.findByUsername",
	query = "SELECT m FROM Member WHERE n.username :username"
)

public class Member {
	...
}

List<Member> resultList = 
	em.createQuery("Member.findByUsername", Member.class)
	  .setParameter("username", "회원1")
	  .getResultList();
```

> 위와 같이 엔티티에 Named Query를 추가하는 것은 코드가 매우 지저분 해지고, <br>
결국 실무에서는 Spring Data JPA를 섞어 쓰는게 좋기 때문에 

> Spring Data JPA

```
public interface UserRepository extends JpaReposotory<User, Long>{
	@Query("SELECT u from User u WHERE u.emailAddress = ?1")
	User findByEmailAddress(String emailAddress);
}

```

> 이와 같이 Spring Data JPA 방식으로 개발하는게 좋습니다.


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
