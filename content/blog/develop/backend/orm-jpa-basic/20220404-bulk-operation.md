---
title: "[자바 ORM 표준 JPA] JPQL 벌크 연산(Bulk Operation)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-04
slug: "bulk-operation"
description: "JPQL 벌크 연산(Bulk Operation)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 벌크 연산(Bulk Operation)
-------------------------------------
> 여러 건(대량의 데이터)을 한 번에 수정하거나 삭제하는 방법

## 벌크 연산
-------------------------------------
> - 재고가 10개 미만인 모든 상품의 가격을 10% 상승하려면?
> - JPA 변경 감지(Duty Checking) 기능으로 실행하려면 너무 많은 SQL 실행
>	1. 재고가 10개 미만인 상품을 리스트로 조회한다.
>	2. 상품 엔티티의 가격을 10% 증가한다.
>	3. 트랜잭션 커밋 시점에 변경감지가 동작한다.
> - 변경된 데이터가 100건이라면 100번의 UPDATE SQL실행


### 벌크 연산 예제
-------------------------------------
> - 쿼리 한 번으로 여러 테이블 로우 변경(엔티티)
> - <mark>excuteUpdate()의 결과는 영향받은 엔티티 수 반환</mark>
> - <mark>UPDATE, DELETE 지원</mark>
> - <mark>INSERT(insert into .. select, 하이버네이트 지원)</mark>
>	JPA 표준 스펙에는 없는데 하이버네이트는 지원

```
String qlString = "UPDATE Product p " +
				"SET p.price = p.price * 1.1 " +
				"WHERE p.stockAmount < :stockAmount";
				
int resultCount = em.createQuery(qlString)
				.setParameter("stockAmount", 10)
				.executeUpdate();			

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

            int resultCnt = em.createQuery("UPDATE Member m SET m.age =  m.age+1")
                    .executeUpdate();

            System.out.println(resultCnt);

            tx.commit();
```

> console

```
Hibernate: 
    /* UPDATE
        Member m 
    SET
        m.age =  m.age+1 */ update
            Member 
        set
            age=age+1
            
4 // 결과 4명

```

![contact](/images/develop/backend/orm-jpa-basic/bulk-operation/img-001.png)

> 모든 사용자 나이 +1 업데이트된 결과를 볼 수 있습니다.

### 벌크 연산 주의
---------------------
> <mark>벌크 연산은 영속성 컨텍스트를 무시하고 데이터베이스에 직접 쿼리</mark> <br>

> 이를 간단히 해결하기 위해서는
>	1. 벌크 연산을 먼저 실행
>	2. <mark>벌크 연한 수행 후 영속성 컨텍스트 초기화</mark>
>	3. em.refresh() 사용

> 예를 들어 회원의 연봉이 5천만원 이였는데<br>
 회원의 연봉을 엔티티로 조회했더니 5천만원이였고 벌크 연산이 실행되어 6천만원으로 업데이트가 됨<br>
 > DB에는 6천만원으로 되어있고, 엔티티에는 5천만원으로 남아있는 상태가 됩니다.
 > 이러한 경우에는 벌크 연산 후 엔티티를 초기화 한다면 아무 문제가 없습니다.
  
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
			
		   // FLUSH 자동 호출 (커밋, query실행, 강제 Flush)
            int resultCnt = em.createQuery("UPDATE Member m SET m.age =  m.age+1")
                    .executeUpdate();
            System.out.println(resultCnt);

            tx.commit();
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

            int resultCnt = em.createQuery("UPDATE Member m SET m.age =  m.age+1")
                    .executeUpdate();

            System.out.println(resultCnt);

            System.out.println("member1.getAge() = "+member1.getAge());	//*** 출력 추가
            System.out.println("member2.getAge() = "+member2.getAge());
            System.out.println("member3.getAge() = "+member3.getAge());
            System.out.println("member4.getAge() = "+member4.getAge());

            tx.commit();
```

> console

```
Hibernate: 
    /* UPDATE
        Member m 
    SET
        m.age =  m.age+1 */ update
            Member 
        set
            age=age+1
4
member1.getAge() = 31
member2.getAge() = 32
member3.getAge() = 33
member4.getAge() = 34

종료 코드 0(으)로 완료된 프로세스

```


![contact](/images/develop/backend/orm-jpa-basic/bulk-operation/img-002.png)

> 출력된 결과는 31, 32, 33 살이지만 데이터베이스에서 조회한 결과는 32, 33, 34 로 1살 추가된 것을 확인 할 수 있습니다.

> 벌크 연산은 영속성 컨텍스트와 상관없이 DB에 직접 수정하기 때문에 영속성 컨텍스트에는 DB에 벌크 연산으로 수정되기 전 데이터가 남아있습니다.

> 잘못 사용하다가 데이터 접합성 문제가 생길 수 있어 조심해야 합니다.


#### 벌크 연한 수행 후 영속성 컨텍스트 초기화


> JqplMain.java

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
            member4.changeTeam(team3);
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            int resultCnt = em.createQuery("UPDATE Member m SET m.age =  m.age+1")
                    .executeUpdate();

            System.out.println(resultCnt);

            em.clear(); // 영속성 컨텍스트를 초기화 한후 다시 조회

            Member findMember1 = em.find(Member.class, member1.getId());
            Member findMember2 = em.find(Member.class, member2.getId());
            Member findMember3 = em.find(Member.class, member3.getId());
            Member findMember4 = em.find(Member.class, member4.getId());

            System.out.println("findMember1.getAge() = "+findMember1.getAge());
            System.out.println("findMember2.getAge() = "+findMember2.getAge());
            System.out.println("findMember3.getAge() = "+findMember3.getAge());
            System.out.println("findMember4.getAge() = "+findMember4.getAge());
````

> console

```
Hibernate: 
    select
        member0_.id as id1_0_0_,
        member0_.age as age2_0_0_,
        member0_.TEAM_ID as team_id5_0_0_,
        member0_.type as type3_0_0_,
        member0_.username as username4_0_0_ 
    from
        Member member0_ 
    where
        member0_.id=?
        
4

findMember1.getAge() = 32
findMember2.getAge() = 33
findMember3.getAge() = 34
findMember4.getAge() = 35

```

> 벌크 연산을 사용하고 바로 직후에 엔티티를 사용하면, 컨텍스트에 1차 캐시된 데이터를 사용하기 때문에 em.clear를 이용해 <br>
영속성 컨텍스트를 초기화 후 사용

#### em.refresh()

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
            
            // em.flush(); // em.refresh는 영속성 컨텍스트에서 관리되는 항목만 적용가능
            // em.clear(); 
            

            int resultCnt = em.createQuery("UPDATE Member m SET m.age =  m.age+1")
                    .executeUpdate();

            System.out.println(resultCnt);

            em.refresh(member1);
            em.refresh(member2);
            em.refresh(member3);
            em.refresh(member4);

            System.out.println("member1.getAge() = "+member1.getAge());
            System.out.println("member2.getAge() = "+member2.getAge());
            System.out.println("member3.getAge() = "+member3.getAge());
            System.out.println("member4.getAge() = "+member4.getAge());
```

> console

````
Hibernate: 
    /* load jpql.domain.Member */ select
        member0_.id as id1_0_0_,
        member0_.age as age2_0_0_,
        member0_.TEAM_ID as team_id5_0_0_,
        member0_.type as type3_0_0_,
        member0_.username as username4_0_0_ 
    from
        Member member0_ 
    where
        member0_.id=?
member1.getAge() = 32
member2.getAge() = 33
member3.getAge() = 34
member4.getAge() = 35
````

#### Spring Data JPA - Modifying Queries

> Sprimg Data JPA에서는 @Modifying 애노테이션을 이용해 벌크 연산 쿼리를 사용할 수 있으며, 마찬가지로 벌크 연산과  같이 영속성 컨텍스트를 무시하고 데이터베이스에 직접 수정하기 때문에 주의 해야합니다. Spring Data JPA의 기능을 사용하기 이전에 원리를 미리 배워둬야 장애를 예방하고 왜 그런 문제가 생기는지 알 수 있습니다. 

```
@Modifying
@Query("UPDATE User u SET u.firstname = ?1 WHERE u.lastname = ?2")
int setFixedFirstnameFor(String fristname, String lastname);
```

### 정리
--------------------
> 벌크 연산을 사용할 때는 벌크 연한 수행 후 무지성으로 영속성 컨텍스트 초기화 하고, 
단건의 수정 삭제에 대해서는 일반적인 JPA가 제공하는 Update와 Delete를 사용하는게 안전합니다.

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
