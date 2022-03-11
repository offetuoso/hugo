---
title: "JPA Projection(SELECT)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-07
slug: "projection"
description: "Projection(SELECT)"	
keywords: ["ORM"]
draft: false
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
> - 엔티티 프로젝션 -> SELECT m FROM Member m
> - 엔티티 프로젝션 (조인) -> SELECT m.team FROM Member m
> - 임베디드 타입 프로젝션 -> SELECT m.address FROM Member m
> - 스칼라 타입 프로젝션  -> SELECT m.username, m.age FROM Member m
> - DISTINCT로 중복 제거


### 엔티티 프로젝션

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

...
```

> 강의를 따라 실습하던 도중 예기치 않은 오류를 만나게 되었습니다. 

````
org.hibernate.TransientPropertyValueException: object references an unsaved transient instance - save the transient instance before flushing
````

<details title="펼치기/숨기기">
 	<summary> 더보기 </summary>
 	

<a href="/blog/develop/troubleshooting/jpa/object-references-an-unsaved-transient-instance-save-the-transient-instance-before-flushing/">object references an unsaved transient instance - save the transient instance before flushing 에러
</a>

> 간략하게 말씀드리면 flush 할때, Member와 N:1 연관관계에 있는 Team 의 FK를 먼저 영속화 하지 않고 Member를 영속화 하는 것이 문제라고 오류를 발생시킵니다. 

> 이에 대한 해결은 

> 1. CascadeType 지정
> 2. FK를 가지는 엔티티를 먼저 영속화 후 엔티티 영속화

> 하지만, 저장 시 강사님의 결과와 달라 문의를 남겨 두었습니다. 

<a href="https://www.inflearn.com/questions/469025">인프런 QnA : org.hibernate.TransientPropertyValueException 질문드립니다.</a>
 
> 답변이 달리는 대로 정리하여 수정하겠습니다. 

</details>

> 테스트 결과 놀라운 사실을 알게 되었습니다. 영속화 이후 flush와 clear 이후  조회해온 값을 수정한다면 과연 

> console

```
Hibernate: 
    /* insert jpql.domain.Team
        */ insert 
        into
            Team
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert jpql.domain.Member
        */ insert 
        into
            Member
            (age, TEAM_ID, username, id) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id4_0_,
            member0_.username as username3_0_ 
        from
            Member member0_
Hibernate: 
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
Hibernate: 
    /* update
        jpql.domain.Member */ update
            Member 
        set
            age=?,
            TEAM_ID=?,
            username=? 
        where
            id=?
```

![contact](/images/develop/backend/orm-jpa-basic/projection/img-001.png)

> 최초 나이를 35로 생성했다가, 28로 수정한 것을 확인 할 수 있습니다. 


### 엔티티 프로젝션 (조인)
> 또한 조회한 Member에서 Team 객체를 얻어와 Team을 수정한 다면 과연 어떻게 될까 테스트 해 보았습니다. 

> JpqlMain.java

```
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

            Team findTeam = findMember.getTeam();
            findTeam.setName("team2");

            tx.commit();
```

> console

```
Hibernate: 
    /* insert jpql.domain.Team
        */ insert 
        into
            Team
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert jpql.domain.Member
        */ insert 
        into
            Member
            (age, TEAM_ID, username, id) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* SELECT
        m 
    FROM
        Member m */ select
            member0_.id as id1_0_,
            member0_.age as age2_0_,
            member0_.TEAM_ID as team_id4_0_,
            member0_.username as username3_0_ 
        from
            Member member0_
Hibernate: 
    select
        team0_.id as id1_3_0_,
        team0_.name as name2_3_0_ 
    from
        Team team0_ 
    where
        team0_.id=?
Hibernate: 
    /* update
        jpql.domain.Member */ update
            Member 
        set
            age=?,
            TEAM_ID=?,
            username=? 
        where
            id=?
Hibernate: 
    /* update
        jpql.domain.Team */ update
            Team 
        set
            name=? 
        where
            id=?
```

![contact](/images/develop/backend/orm-jpa-basic/projection/img-002.png)

> 놀랍게도 조회한 Member 뿐만 아니라 Team까지 영속성 컨텍스트에서 관리가 되어, 수정을 하여도 업데이트 문이 발생되었고 원하는 결과 수정한 Team의 이름이 team2로 수정된 것을 확인 할 수 있었습니다.

> 또한 Team 엔티티를 조회하는 다른 방법이 있습니다. 

```
	TypedQuery<Team> query =  em.createQuery("SELECT m.team FROM Member m", Team.class)
```

> Member의 team을 조회하여 Team 객체로 반환하는 것입니다. 이럴 경우 JPA에서 자동적으로 조인 쿼리로 실행해 줍니다.

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
        inner join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id
```
> JPQL에서는 SELECT m.team FROM Member로 간단히 나오지만 SQL은 INNER JOIN이 적용되어 나간 것을 확인 할 수 있습니다. <br>
이후 경로 표현식에서 다루겠지만 JPQL와 SQL 최대한 비슷하게 생성되고 동작하는 것이 좋습니다. <br> 성능의 문제가 될때 쿼리 튜닝을 진행하면 JPQL과 SQL이 같아야 가독성과 유지보수성이 높아집니다. 

> 그래서 위의 코드를 JPQL로 다시 작성하면

```
	TypedQuery<Team> query =  em.createQuery("SELECT t FROM Member m JOIN m.team t", Team.class)
```

> 위와 동일한 결과지만 JPQL과 SQL이 같아 소스를 이해하는데 큰 도움이 됩니다.

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Member m 
    JOIN
        m.team t */ select
            team1_.id as id1_3_,
            team1_.name as name2_3_ 
        from
            Member member0_ 
        inner join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id
```

### 임베디드 프로젝션
> 또한 Order 안에 있는 값타입 orderAddress를 조회할 때도 아래와 같은 방법으로 값을 조회하면 됩니다. orderAddress는 Order안에 포함되어있기 때문에 SELECT 문으로 Address 의 속성들을 조회할 수 있습니다.

> 이를 임베디드 프로젝션이라고 합니다.

```
        em.createQuery("SELECT O.orderAddress from Order O", Address.class).getResultList();
```

> console

```
Hibernate: 
    /* SELECT
        O.orderAddress 
    from
        
    Order O */ select
        order0_.city as col_0_0_,
        order0_.street as col_0_1_,
        order0_.zipcode as col_0_2_ from
            ORDERS order0_
```

> 값 타입이 가지고 있는 한계는 

~~em.createQuery("SELECT a from Address a", Address.class).getResultList();~~

> 값 타입은 다른 엔티티에 소속되어있기 때문에 위와 같이 Address를 주체로 사용 할 수 없습니다. 


### 스칼라 타입 프로젝션
> 스칼라 타입 프로젝션은 SQL 작성하듯 원하는 컬럼들을 막가져 오는 것입니다. 


```
 em.createQuery("SELECT m.username, m.username FROM Member m")
                    .getResultList();

```

> console

```
Hibernate: 
    /* SELECT
        m.username,
        m.username 
    FROM
        Member m */ select
            distinct member0_.username as col_0_0_,
            member0_.username as col_1_0_ 
        from
            Member member0_
```

> 스칼라 프로젝션은 일반 SQL 문과 거의 똑같다고 보시면 됩니다. 

> 이러한 경우 궁금증이 발생하는데, String username과 int age 타입이 다른데 어떻게 가져와야 할까요 

#### 프로젝션 - 여러 값 조회 
> - SELECT m.username, m.age FROM Meber m 
>	1. Query 타입으로 조회
>	2. Object[] 타입으로 조회
>	3. new 명령어로 조회 
		- 단순 값을 DTO로 바로 조회
			SELECT new jpql.MemberDto(m.username, m.age) FROM Memver m 
		- 패키지 명을 포함한 전체 클래스 명 입력
		- 순서와 타입이 일치하는 생성자 필요
		
		
##### 쿼리 타입으로 조회

> 이전에 정리하였던 반환 타입이 명확하지 않을때 사용하는 Query 타입 (Query query ...)

```
	Query query = em.createQuery("SELECT  m.username, m.username FROM Member m");
```

		
##### Object[]로 조회

> 하나의 로우를 오브젝트 리스트로 변환하여 받을 수 있습니다.

```
            List resultList = em.createQuery("SELECT  m.username, m.age FROM Member m").getResultList();

            Object obj = resultList.get(0);

            Object[] result = (Object[]) obj;
```

> console

```
Hibernate: 
    /* SELECT
        m.username,
        m.age 
    FROM
        Member m */ select
            member0_.username as col_0_0_,
            member0_.age as col_1_0_ 
        from
            Member member0_

member1
35
```

> 이러한 불편함이 있기 때문에 TypeQuery를 이용하여 Object를 명시하여 받아 오는 방식도 있습니다

```
            List<Object[]> resultList = em.createQuery("SELECT  m.username, m.age FROM Member m").getResultList();

            Object[] result = resultList.get(0);

           for (Object o : result){
               System.out.println(o);
           }
```

> 이렇게 하면 리스트 타입을 Obejct로 캐스팅 하는 1스탭을 줄일 수 있지만 불편한것은 비슷합니다.

#### new 명령어로 조회

> - 단순 값을 DTO로 바로 조회
> - 패키지 명을 포함하는 전체 클래스 명 입력
> - 순서와 타입이 일치하는  생성자 필요


> src/main/java/jpql/dto/MemberDTO.java

<details title="펼치기/숨기기">
 	<summary> MemberDTO </summary>
 	
	package jpql.dto;
	
	public class MemberDTO {
	    public MemberDTO(String ussername, int age) {
	        this.ussername = ussername;
	        this.age = age;
	    }
	    private String ussername;
	    private int age;
	
	    public String getUssername() {
	        return ussername;
	    }
	
	    public void setUssername(String ussername) {
	        this.ussername = ussername;
	    }
	
	    public int getAge() {
	        return age;
	    }
	
	    public void setAge(int age) {
	        this.age = age;
	    }
	}
</details>



```
em.createQuery("SELECT  m FROM Member m", Member.class).getResultList();
```

> 위와 같이 m 처럼 엔티티 자체를 조회할 때가 아니라면

> new 오퍼레이션을 사용해야 합니다. 생성자를 호하듯이 경로를 다 적어 사용합니다. 

```
            List<MemberDTO> resultList = em.createQuery("SELECT  new jpql.dto.MemberDTO(m.username, m.age) FROM Member m", MemberDTO.class).getResultList();

            for(MemberDTO m : resultList){
                System.out.println(m.getUssername());
                System.out.println(m.getAge());
            }
```

console

```
Hibernate: 
    /* SELECT
        new jpql.dto.MemberDTO(m.username,
        m.age) 
    FROM
        Member m */ select
            member0_.username as col_0_0_,
            member0_.age as col_1_0_ 
        from
            Member member0_

member1
35
```

> 훨씬 깔끔해 지지만 JPQL 자체가 문자열이다 보니 패키지 명이 길어지면 다 적어줘야 하는 단점이 있습니다.

> 그렇다면 패키지명을 문자열 변수로 받아서 매핑해 주는 방법은 과연 

```
            String memberDtoPath = "jpql.dto.MemberDTO";

            List<MemberDTO> resultList = em.createQuery("SELECT  new "+memberDtoPath+" (m.username, m.age) FROM Member m", MemberDTO.class).getResultList();

```

> console

```

Hibernate: 
    /* SELECT
        new jpql.dto.MemberDTO (m.username,
        m.age) 
    FROM
        Member m */ select
            member0_.username as col_0_0_,
            member0_.age as col_1_0_ 
        from
            Member member0_

member1
35
```

> 이후에는 QueryDSL에서는 패키지명을 임포트 해서 사용할 수 있기 때문에 
굳이 JPQL에서 패키지 경로를 문자열 변수로 더해주는 작업은 불필요 할꺼같네요.



#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>