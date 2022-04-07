---
title: "JPQL 기본 함수(BASIC FUNCTION)"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-15
slug: "jpql-basic-function"
description: "JPQL 기본 함수(BASIC FUNCTION)"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPQL 기본 함수(BASIC FUNCTION)
-------------------------------------

## JPQL 기본 함수
----------------------------------------------
> JPQL에서 제공하는 표준함수로 DB에 상관없이 사용가능 

> - CONCAT
> - SUBSTRING
> - TRIM
> - LOWER, UPPER
> - LENGTH
> - LOCATE
> - ABS, SQRT, MOD
> - SIZE, INDEX(JPA 용도)




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



### CONCAT
----------------------------------------------
> 입력받은 2개의 문자열을 합치는 함수 <br>
 JPA는 '문자열' || '문자열' 도 사용 가능합니다.

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


            String sQuery = "SELECT concat(m.username , '(', m.age, '세)')  FROM Member m";

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
        concat(m.username ,
        ' (',
        m.age,
        '세)') 
    FROM
        Member m */ select
            (member0_.username||' ('||member0_.age||'세)') as col_0_0_ 
        from
            Member member0_

관리자 (30세)
```

> || 으로 문자열 합치기

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


            String sQuery = "SELECT ('A'||'B') FROM Member m";

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
        'A' || 'B' 
    FROM
        Member m */ select
            ('A'||'B') as col_0_0_ 
        from
            Member member0_
            
AB
```


> || 으로 문자열을 합칠때 인텔리제이에서 오류라고 나오지만

![contact](/images/develop/backend/orm-jpa-basic/basic-function/img-001.png)

> 언어 또는 참조 삽입 취소 옵션을 선택하면 해당 오류라고 체크 되는 것을 해제 할 수있습니다.



### SUBSTRING
----------------------------------------------
> 문자열을 필요한 필요한 만큼 잘러 문자열로 반환하는 함수

> SUBSTRING('원본', 시작 위치, 길이) 

```
	SELECT SUBSTRING(m.username, 2, 3) FROM Member m
```

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


            String sQuery = "SELECT SUBSTRING(m.username, 2, 3) FROM Member m";

            List<String> resultList = em.createQuery(sQuery, String.class)
                    .getResultList();

            for(String s : resultList){
                System.out.println(s);
            }

            tx.commit();
```

> console

````
Hibernate: 
    /* SELECT
        SUBSTRING(m.username,
        2,
        3) 
    FROM
        Member m */ select
            substring(member0_.username,
            2,
            3) as col_0_0_ 
        from
            Member member0_
            
리자
````

### TRIM
----------------------------------------------
> 문자열의 공백을 제거하는 함수
> TRIM, LTRIM, RTRIM이 있습니다.

```
SELECT TRIM(' 이름 ') FROM Member m // 결과 "이름"
SELECT RTRIM(' 이름 ') FROM Member m  // 결과 " 이름"
SELECT LTRIM(' 이름 ') FROM Member m  // 결과 "이름 "
```

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


            String sQuery = "SELECT TRIM(' 이름 ') FROM Member m";

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
        LTRIM(' 이름 ') 
    FROM
        Member m */ select
            ltrim(' 이름 ') as col_0_0_ 
        from
            Member member0_

이름 // "이름" 공백 양쪽 제거됨
```

### LOWER, UPPER
----------------------------------------------
> 문자열 전체 대문자 치환, 소문자 치환

```
SELECT LOWER(m.username) FROM Member m  // member1
SELECT UPPER(m.username) FROM Member m  // MEMBER1
```

> JpqlMain.java

```
            Team team = new Team();
            team.setName("team1");
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("Member1"); // ** 대소문자 섞인 문자열
            member1.setAge(30);
            member1.changeTeam(team);
            member1.setType(MemberType.USER);

            em.persist(member1);

            em.flush();
            em.clear();


            String sQuery = "SELECT UPPER(m.username) FROM Member m";

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
        UPPER(m.username) 
    FROM
        Member m */ select
            upper(member0_.username) as col_0_0_ 
        from
            Member member0_
MEMBER1
```
### LENGTH
----------------------------------------------
> 문자열의 길이

```
SELECT LENGTH('Member1') FROM Member m  // 7
```

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


            String sQuery = "SELECT LENGTH(m.username) FROM Member m";

            List<Integer> resultList = em.createQuery(sQuery, Integer.class)
                    .getResultList();

            for(Integer s : resultList){
                System.out.println(s);
            }

            tx.commit();

```

> console

```
Hibernate: 
    /* SELECT
        UPPER(m.username) 
    FROM
        Member m */ select
            upper(member0_.username) as col_0_0_ 
        from
            Member member0_
MEMBER1
```

### LOCATE
---------------------------------------------
> 문자열에서 검색할 문자의 위치를 숫자로 반환해 주는 함수

```
SELECT LOCATE('mb', 'Member1')  FROM Member m // 3
```

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


            String sQuery = "SELECT LOCATE('mb', m.username)  FROM Member m";

            List<Integer> resultList = em.createQuery(sQuery, Integer.class)
                    .getResultList();

            for(Integer s : resultList){
                System.out.println(s);
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        LOCATE('mb',
        m.username)  
    FROM
        Member m */ select
            locate('mb',
            member0_.username) as col_0_0_ 
        from
            Member member0_
            
3
```

### ABS, SQRT, MOD
---------------------------------------------
> 기본적으로 데이터베이스들에서 제공하는 수학관련 함수들

> - ABS(x) : x의 절대값을 구하는 함수입니다.
> - SQRT(x) : 양수 x 에 대한 제곱근을 반환합니다.
> - MOD(n, m) :  n을 m으로 나눈 나머지를 반환합니다.

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


            String sQuery = "SELECT " +
                    "ABS(-120) AS x1" +
                    ", SQRT(4) AS x2" +
                    ", MOD(6,2) AS x3" +
                    " FROM Member m";

            List<Object[]> resultList = em.createQuery(sQuery)
                    .getResultList();

            Object[] result = resultList.get(0);

            for(Object o : result){
                System.out.println(o);
            }

            tx.commit();

```

> console

```
    /* SELECT
        ABS(-120) AS x1,
        SQRT(4) AS x2,
        MOD(6,
        2) AS x3 
    FROM
        Member m */ select
            abs(-120) as col_0_0_,
            sqrt(4) as col_1_0_,
            mod(6,
            2) as col_2_0_ 
        from
            Member member0_
            
120 // x1
2.0 // x2
0   // x3

```

### SIZE, INDEX(JPA 용도)
---------------------------------------------
> - SIZE : 1:N의 양방향 관계에서 컬렉션(엔티티 리스트)의 사이즈를 반환해 줍니다.

```
SELECT size(t.members) FROM Team t
SELECT t.members.size FROM Team t
```

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


            String sQuery = "SELECT t.members.size FROM Team t";

            List<Integer> resultList = em.createQuery(sQuery, Integer.class)
                    .getResultList();

            for(Integer s : resultList){
                System.out.println(s.intValue());
            }

            tx.commit();
```


> - INDEX : @OrderColumn에서만 지원되는 정렬된 목록 엘리먼츠(요소, 항목)의 위치 값

```
SELECT toDo FROM Employee e JOIN e.toDoList toDo WHERE INDEX(toDo) = 1
```

> @OrderColumn 자체에도 문제가 있기 때문에 사용 비추천
>	- 중간에 리스트에서 데이터가 빠지거나 그러면 데이터가 Null로 들어오는 문제 등


## 사용자 정의 함수 호출
----------------------------------------------
> - 하이버네이트는 사용전 방언에 추가해야 한다.
>	- 사용하는 DB 방언을 상속받고, 사용자 정의 함수를 등록한다.

```
SELECT FUNCTION('group_concat', i.name) FROM Item i

SELECT  group_concat(m.username) FROM Member m // InteliJ에서 문법 오류가 나지만 하이버네이트에서 지원함

```

> jpql.dialect.MyH2Dialect.java - H2Dialect를 상속 받는 새로운 H2Dialect 생성

```
package jpql.dialect;

import org.hibernate.dialect.H2Dialect;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;


public class MyH2Dialect extends H2Dialect{
    public MyH2Dialect(){
        registerFunction("group_concat", new StandardSQLFunction("group_concat", StandardBasicTypes.STRING)); //H2Dialect가 미리 생성해둔 group_concat이라는 H2 함수 (MySql도 있는 함수)
        
    }
}

```

> persistence.xml - 

```
<!-- <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/> -->

<property name="hibernate.dialect" value="jpql.dialect.MyH2Dialect"/> <!-- 새로 만든 H2Dialect 사용 -->

```

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
            member2.setType(MemberType.USER);

            em.persist(member2);

            em.flush();
            em.clear();


            String sQuery = "SELECT function('group_concat', m.username ) FROM Member m";

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
        function('group_concat',
        m.username ) 
    FROM
        Member m */ select
            group_concat(member0_.username) as col_0_0_ 
        from
            Member member0_
            
Member1,Member2

```


> 다행히 하이버네이트 구현체를 사용하게 되면, 예를 들어 MySQL dialect에는 MySQL에 종속적이긴 하지만 표준 함수에 포함되지 않는 함수들을 미리 만들어 두었습니다.

> DB 종속적이다 보니 DB를 변경하면 지원이 안된다는 단점을 가지고 있습니다. 


### InteliJ에서 Jpql 문법 오류날때

> 예> "SELECT m.id||'번' AS no FROM Member m"

> 1. Un-inject Language/Refference (언어 또는 참조 삽입 취소)

![contact](/images/develop/backend/orm-jpa-basic/basic-function/img-001.png)

> 2. Inject language or refferenct (언어 삽입 설정)

![contact](/images/develop/backend/orm-jpa-basic/basic-function/img-002.png)

![contact](/images/develop/backend/orm-jpa-basic/basic-function/img-003.png)

> ID(I): Hibernate query 선택

![contact](/images/develop/backend/orm-jpa-basic/basic-function/img-004.png)

> 문법오류 안나는 것을 확인 할 수 있습니다.




#### 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>