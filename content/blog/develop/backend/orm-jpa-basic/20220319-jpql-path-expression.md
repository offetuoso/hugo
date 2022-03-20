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
draft: false
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

> Jpql 으로는 Member 엔티티를 조회하여 프로젝션에 m.team 

```
SELECT
        m.team 
    FROM
        Member m 
```

> 으로 호출 되었지만, 데이터베이스에서는 Team의 데이터를 가져오기 위하여 JOIN이 필요합니다.

```
select
            team1_.id as id1_3_,
            team1_.name as name2_3_ 
        from
            Member member0_ 
        inner join // 내부 조인 발생
            Team team1_ 
                on member0_.TEAM_ID=team1_.id
```

> TEAM 테이블의 데이터를 조회하기 위해 INNER JOIN이 발생하게 되는데 이것을 <mark>묵시적 조인</mark>이 발생 되었다고 합니다.

> 마냥 편해 보이지만, 실무에서 사용하기 위해서는 조심해서 사용해야합니다. <br>
> 쿼리 튜닝에 어려움이 있습니다. 

> 이후 설명을 추가로 하겠지만 이렇게 묵시적인 조인이 사용되게끔 코딩하면 안됩니다. 실무에서는 수백개의 쿼리가 호출되고, 100 라인이 넘어가는 쿼리도 종종 있습니다.  조인은 쿼리의 성능면에서 어마 어마한 영향을 미치기 때문에 테이블 하나 하나 고민을 해서 조인을 하게 됩니다. 그런데 막 조인이되어서 나가게 되면 성능에 문제가 됩니다.<br>

> 또한 실제 JPQL과 SQL이 다르게 나가게 되면 직관적으로 튜닝하기 매우 어렵습니다. 그렇기 때문에 유지보수성이 매우 떨어지게 되고 잘못하다가 망합니다..

> JPA를 잘아는 개발자라면 찾을 수 있겠지만, 잘 모르는 개발자가 유지보수를 한다면 DBA가 "여기 조인 쿼리 발생되는데, 이거 수정해 주세요" 라고 하면 Jpql과 Sql이 다르기 떄문에 미궁에 빠지게 됩니다.



#### 컬렉션 값 연관 경로 표현식(collection_valued_path_expression) 
> 묵시적 내부 조인(INNER JOIN) 발생, 이후 탐색 불가 
>	- FROM 절에서 <mark>명시적 조인</mark>을 통해 별칭을 얻으면 별칭을 통해 탐색 가능<br> 
<Strong>식별_변수.{단일 값 연관 필드.}.콜렉션 값 연관 필드(collection_valued_association_field)</Strong><br>
엔티티에 다른 엔티티가 1:N의 연관 관계가 설정된 (컬렉션)필드<br>
예) m(Member).orders(List<Orders>), t(Team).members(List<Member>)

![contact](/images/develop/backend/orm-jpa-basic/path-expression/img-003.png)

> Team 엔티티에서 t.members는 1:N으로 member를 담은 컬렉션입니다. memebers에서 .을 이용해 탐색을 시도해 보았지만 불가능하며 "제안이 없습니다. 라고" 탐색을 못한다는 것을 IDE에서 알려줍니다.

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

            Member member2 = new Member();
            member2.setUsername("Member2");
            member2.setAge(32);
            member2.changeTeam(team);
            member2.setType(MemberType.ADMIN);

            em.persist(member2);


            em.flush();
            em.clear();


            String sQuery = "SELECT t.members FROM Team t";

            List resultList = em.createQuery(sQuery, Collection.class) //** List가 아니라 Collection 받을 수 있다.
                    .getResultList();


            for(Object s : resultList){
                System.out.println("result = "+s);
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        t.members 
    FROM
        Team t */ select
            members1_.id as id1_0_,
            members1_.age as age2_0_,
            members1_.TEAM_ID as team_id5_0_,
            members1_.type as type3_0_,
            members1_.username as username4_0_ 
        from
            Team team0_ 
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID

result = Member{id=2, username='Member1', age=30}
result = Member{id=3, username='Member2', age=32}

```

> 처음에 JPA를 사용하면서 맨탈을 탈탈 털어버릴 수 있는 몇가지중에 

```

SELECT t.name FROM Team t // <- 탐색가능 

SELECT t.members. FROM Team t //members. <- 탐색 불가 

```

> members는 위에 예제에서 봤듯이 타입이 Collection입니다. 컬렉션에서 필드를 찍을 수 있는것도 아니고 컬렉션 자체이기 때문에 더 이상 탐색할 수 없습니다. 사용할 수 있는기능은 t.members.size 정도 입니다.



##### 명시적 조인을 이용한 탐색 
> 컬렉션 값 연관 경로 표현식을 이용하면 묵시적 조인이 발생하며 탐색이 불가능하지만, 명시적 조인을 통해서 탐색을 할 수 있다고 하였습니다. <br>
이번에는 명시적 조인을 통한 예제를 테스트해 보겠습니다.

> JqplMain.java

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

            Member member2 = new Member();
            member2.setUsername("Member2");
            member2.setAge(32);
            member2.changeTeam(team);
            member2.setType(MemberType.ADMIN);

            em.persist(member2);


            em.flush();
            em.clear();


            String sQuery = "SELECT m.username FROM Team t join t.members m"; // FROM 절에서 명시적 조인

            List resultList = em.createQuery(sQuery, Collection.class)
                    .getResultList();


            for(Object s : resultList){
                System.out.println("result = "+s);
            }

            tx.commit();
```

![contact](/images/develop/backend/orm-jpa-basic/path-expression/img-004.png)

> FROM 절에서 명시적 조인을 사용하면 t.members의 식별 변수(Alias) m에 .을 사용해 Member의 필드를 조회할 수 있습니다.

## 결론
> - <mark>가급적 묵시적 조인 대신에 명시적 조인 사용</mark>
> - 조인은 SQL 튜닝에 중요 포인트
> - 묵시적 조인은 조인이 일어나는 상황을 한눈에 파악하기 어려움
> - JPQL과 SQL이 같게 개발을 하여야 이후에 운영에서 유지보수가(쿼리 튜닝이) 어려워지는 문제를 막을 수 있다.


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

