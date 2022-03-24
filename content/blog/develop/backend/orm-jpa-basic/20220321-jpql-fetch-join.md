---
title: "JPQL 페치 조인(Fetch Join)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-21
slug: "jpql-fetch-join"
description: "JPQL 페치 조인(Fetch Join)"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# JPQL 페치 조인(Fetch Join)
-------------------------------------
> 실무에서 정말 정말 중요함 <br>
> 쿼리가 여러번 나갈거 같은 쿼리를 한방 쿼리로 변환

## 페치 조인
----------------------------------------------
> - SQL 조인 종류가 아니다.
> - JPQL에서 <mark>성능 최적화</mark>를 위해 제공하는 기능
> - 연관된 엔티티나 컬렉션을 <mark>SQL 한 번에 함께 조회</mark>하는 기능
> - join fetch 명령어 사용
> - [LEFT [OUTER] | INNER] JOIN FETCH 조인경로

## 엔티티 페치 조인
----------------------------------------------
> - 회원을 조회하면서 연관된 팀도 함께 조회(SQL 한 번에)
> - SQL을 보면 회원 뿐만 아니라 <mark>팀(T.*)</mark>도 함께 <mark>SELECT</mark>

>  [JPQL]

```
SELECT m FROM Member m JOIN FETCH m.team
```
<br>


> LEFT OUTER JOIN에 FETCH 만 붙였을 뿐

> [SQL]
```
SELECT M.*, T.* FROM MEMBER M INNER JOIN TEAM T ON M.TEAM_ID = T.ID
```

> M.*, T.*은 모든 컬럼을 축약 <br>
SELECT m 만 했는데, 프로젝션에 Member와 Team의 모든 컬럼 추가

> 과거 나왔던 즉시 로딩과 흡사한거 같지만, 개발자가 원하는 대로 객체 그래프를 한번에 조회할 것을 명시적으로 동적인 타이밍에 사용 할 수 있습니다.

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-001.png)

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-002.png)

> JPA에서 컬렉션을 조회하면, 위 그림과 같다면 회원1,2,3 그리고 팀A,팀B 레퍼런스로 JPA가 5개의 엔티티로 만들어 영속성 컨텍스트의 1차 캐시에 보관하고 그림과 같은 형태로 반환합니다.


### 페치 조인 미사용 
---------------------
> JPQL "SELECT m FROM Member m"로 호출 후 Member와 Team의 @ManyToOne FetchType.LAZY 설정을 통한 지연로딩 사용

> JpqlMain.java

```
            Team team1 = new Team();		//팀A 생성
            team1.setName("팀A");			
            em.persist(team1);		

            Team team2 = new Team();		//팀B 생성
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team();		//팀C 생성
            team3.setName("팀C");
            em.persist(team3);

            Member member1 = new Member();		//회원1 생성
            member1.setUsername("회원1");
            member1.setAge(31);
            member1.changeTeam(team1);
            member1.setType(MemberType.USER);
            em.persist(member1);

            Member member2 = new Member();		//회원2 생성
            member2.setUsername("회원2");
            member2.setAge(32);
            member2.changeTeam(team1);
            member2.setType(MemberType.USER);
            em.persist(member2);

            Member member3 = new Member();		//회원3 생성
            member3.setUsername("회원3");
            member3.setAge(33);
            member3.changeTeam(team2);
            member3.setType(MemberType.USER);
            em.persist(member3);

            Member member4 = new Member();		//회원4 생성
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();


            String sQuery = "SELECT m FROM Member m";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .getResultList();

            int i = 0;
            for(Member member : resultList){
                if(member.getTeam() != null){
                    System.out.println("Member = " + member.getUsername()+", team = "+member.getTeam().getName());
                } else{
                    System.out.println("Member = " + member.getUsername()+", team = null");
                }
            }

            tx.commit();
```

> console

```
Hibernate: 				// MEMBER 조회 회원 4명 가져옴
    /* SELECT
        m 
    FROM
        Member m */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id5_0_,
            member0_.type as type3_0_,
            member0_.username as username4_0_ 
        from
            Member member0_
            
Hibernate: 				// 회원1의 Team 지연로딩 발생 팀A 조회
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
        
Member = 회원1, team = 팀A	// i=0, 
Member = 회원2, team = 팀A	// i=1,  회원2의 Team 1차 캐시 조회

Hibernate:  				// 회원3의 Team 지연로딩 발생 팀B 조회
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
        
Member = 회원3, team = 팀B	// i=2
Member = 회원4, team = null	// i=3
```

> 현재 4명의 회원을 조회 하였고, 지연로딩을 통해 팀A와 팀B가 조회 되었습니다. 자세하게 수행된 것을 보면

> 1. Member를 조회
> 2. Roof 시작 (회원1, 회원2, 회원3, 회원4)
> 3. 회원1 출력, 회원1의 Team 조회 후 팀A 1차 캐시
> 4. 회원2 출력, 1차 캐시의 팀A 조회
> 5. 회원3 출력, 회원3의 Team 조회 후 팀B 1차 캐시
> 6. 회원4 출력

> 문제는 최악의 경우 회원 조회 쿼리 + 팀의 수 N만큼 조회쿼리가 발행할 수 있습니다. O(N+1)

> 이것은 즉시로딩이거나 지연로딩 모두 같은 문제가 발생합니다. 이것을 해결하기 위해서 Fetch Join을 사용합니다.


### 페치 조인 사용 
---------------------
> - JPQL "SELECT m FROM Member m JOIN fetch m.team t"로 호출
> - JPQL "SELECT m FROM Member m LEFT JOIN fetch m.team t"로 OUTER JOIN으로도 가능

#### 페치 조인 사용 코드

```
String jpql = "select m from Member m join fetch m.team t";
List<Member> members = em.createQuery(jpql, Member.class)
                         .getResultList();
for(Member member : members){
	System.out.println("userName"+member.getUsername()+","+
					"teamName"+member.getTeam().getName());
}
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
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();


            String sQuery = "SELECT m FROM Member m JOIN fetch m.team t ";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .getResultList();

            int i = 0;
            for(Member member : resultList){
                System.out.println("Member = " + member.getUsername()+", team = "+member.getTeam().getName());
            }

            tx.commit();
```

> console - INNER JOIN FETCH

```
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m 
    JOIN
        fetch m.team t  */ select
            member0_.id as id1_0_0_,
            team1_.id as id1_3_1_,
            member0_.age as age2_0_0_,
            member0_.TEAM_ID as team_id5_0_0_,
            member0_.type as type3_0_0_,
            member0_.username as username4_0_0_,
            team1_.name as name2_3_1_ /* 팀의 정보 조인을 통해 미리 들어감*/
        from
            Member member0_ 
        inner join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id
                
Member = 회원1, team = 팀A
Member = 회원2, team = 팀A
Member = 회원3, team = 팀B

```

> SELECT 문을 1번만 수행한 것을 확인할 수 있습니다. 조회 시점에 Team의 데이터 또한 프록시가 아니라, 실제 데이터로 채워져 있습니다.

> Member와 Team의 INNER 조인이기 때문에 회원4의 정보가 없는 것 또한 확인 할 수 있습니다.

> JpqlMain.java - LEFT OUTER JOIN FETCH

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
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT m FROM Member m LEFT JOIN fetch m.team t ";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .getResultList();

            for(Member member : resultList){
                if(member.getTeam() != null){
                    System.out.println("Member = " + member.getUsername()+", team = "+member.getTeam().getName());
                }else{
                    System.out.println("Member = " + member.getUsername()+", team = null");
                }
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
    LEFT JOIN
        fetch m.team t  */ select
            member0_.id as id1_0_0_,
            team1_.id as id1_3_1_,
            member0_.age as age2_0_0_,
            member0_.TEAM_ID as team_id5_0_0_,
            member0_.type as type3_0_0_,
            member0_.username as username4_0_0_,
            team1_.name as name2_3_1_ 
        from
            Member member0_ 
        left outer join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id

Member = 회원1, team = 팀A
Member = 회원2, team = 팀A
Member = 회원3, team = 팀B
Member = 회원4, team = null

```

> 회원4까지 조회 된것을 확인할 수 있습니다.

> 결국 지연로딩을 세팅한다고 하여도, Fetch 조인이 우선입니다.

## 컬렉션 페치 조인
---------------------------------------------
> 1:N 관계, 컬렉션 페치 조인 <br>
> Team의 입장에서 Member를 조회

>  [JPQL]

```
SELECT t
  FROM Team t JOIN FETCH t.members
 WHERE t.name = '팀A'
```
<br>

> [SQL]
```
SELECT T.*, M.*
  FROM TEAM T 
 INNER JOIN MEMBER M ON T.ID = M.TEAM_ID
```

### 컬렉션 페치 조인
-----------------------------

> JpqlMain.java - INNER JOIN FETCH

````
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
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT t FROM Team t LEFT JOIN fetch t.members m ";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            for(Team team : resultList){
                    System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }

            tx.commit();
````

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t 
    LEFT JOIN
        fetch t.members m  */ select
            team0_.id as id1_3_0_,
            members1_.id as id1_0_1_,
            team0_.name as name2_3_0_,
            members1_.age as age2_0_1_,
            members1_.TEAM_ID as team_id5_0_1_,
            members1_.type as type3_0_1_,
            members1_.username as username4_0_1_,
            members1_.TEAM_ID as team_id5_0_0__,
            members1_.id as id1_0_0__ 
        from
            Team team0_ 
        left outer join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID
                
Team = 팀A, members[Member{id=4, username='회원1', age=31}, Member{id=5, username='회원2', age=32}]
Team = 팀A, members[Member{id=4, username='회원1', age=31}, Member{id=5, username='회원2', age=32}]
Team = 팀B, members[Member{id=6, username='회원3', age=33}]
Team = 팀C, members[]
```

> 각 팀과 팀의 팀원들을 출력하였습니다. 하지만 여기서 이상한 점은 

> 팀A는 2번 나왔습니다. 왜냐하면, 팀A의 회원은 2명이기 때문입니다. <br> 여기서 조심해야 할것은 바로 이것입니다. 

> Team의 Member 컬렉션을 가져온다고 하여도, Member의 수 만큼 조인을 통하여 데이터가 늘어나기 때문에 잊지 말고 신경을 써야합니다.

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-003.png)

> Join을 통해 팀A * [회원1, 회원2]의 Team List가 2개가 됩니다. Roof를 통해, 팀A가 2번 돌며, 팀A와 getMembers 컬렉션을 2번 찍게 됩니다.

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-004.png)

> 위 쿼리를 조회하고 ID가 1인 Team을 영속성 컨텍스트(1차 캐시)에 담고, 2번째에는 영속성 컨텍스트에 이미 있기 때문에 스킵

> 같은 주소를 사용하는 결과가 2줄이 나오게 됩니다. 페치조인을 했기 때문에 팀A는 회원1, 2를 가지게 됩니다.

17:55

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

