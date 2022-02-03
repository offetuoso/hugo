---
title: "JPA 즉시 로딩과 지연로딩"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-27
slug: "eager-loading-and-lazy-loading"
description: "즉시 로딩과 지연로딩"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 프록시와 연관관계 관리
-------------

## 즉시 로딩과 지연로딩
---------------

### 지연 로딩
---------------

#### Member를 조회할때 Team도 함께 조회해야 할까?
> 단순히 Member 정보만 사용하는 비지니스 로직 <br>
println(member.getName()); 연관관계가 등록되어 있어도 지금처럼 member만 사용하면 손해일 수 있습니다.

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/im g-001.png)


#### 지연 로딩 LAZY을 사용해서 프록시로 조회

```
	@Entity
	public class Member {

		@Id @generatedValue
		private Long id;
		
		@Column(name = "USERNAME")
		private String name;
		
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "TEAM_ID")
		private Team team;
	}
```

> Member.java

```
@Entity
public class Member extends BaseEntity{

    public Member(){
    }

    public Member(Long id, String username){
        this.id = id;
        this.username = username;
    }

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME")
    private String username;

    @ManyToOne(fetch = FetchType.LAZY) //Team 객체를 프록시 객체로 조회
    @JoinColumn
    private Team team;

	...
}

```

> JpaMain.java - 애플리케이션 재시작

````
package relativemapping;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

public class JpaMain {
    //psvm 단축키로 생성 가능
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("relativemapping");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        tx.begin(); // [트랜잭션] 시작

        try{

            Team team = new Team();
            team.setName("TeamA");
            team.setCreateBy("kim");
            team.setCreateDate(LocalDateTime.now());
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("MemberA");
            member1.setCreateBy("kim");
            member1.setCreateDate(LocalDateTime.now());
            member1.setTeam(team);
            em.persist(member1);
            Member member2 = new Member();
            member2.setUsername("MemberA");

            member2.setCreateBy("kim");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(team);
            em.persist(member2);


            em.flush();
            em.clear();

            Member m1 = em.find(Member.class, member1.getId());

            System.out.println("m1 = " + m1.getClass());

            tx.commit();

        }catch (Exception e){
            e.printStackTrace();
            tx.rollback();
        }finally {
            em.close();
        }
        emf.close();
    }


    private static void printMember(Member member){
        System.out.println("username = "+member.getUsername());
    }

    private static void printMemberAndTeam(Member member){
        String username = member.getUsername();
        System.out.println("username = "+username);

        Team team = member.getTeam();
        System.out.println("team = "+team.getName());
    }
}

````

> console

```
Hibernate: 
    /* insert relativemapping.Team
        */ insert 
        into
            Team
            (MOD_ID, MOD_DT, REG_ID, REG_DT, NAME, TEAM_ID) 
        values
            (?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_3_0_,
        member0_.MOD_ID as mod_id2_3_0_,
        member0_.MOD_DT as mod_dt3_3_0_,
        member0_.REG_ID as reg_id4_3_0_,
        member0_.REG_DT as reg_dt5_3_0_,
        member0_.TEAM_ID as team_id7_3_0_,
        member0_.USERNAME as username6_3_0_ 
    from
        Member member0_ 
    where
        member0_.MEMBER_ID=?
        
m1 = class relativemapping.Member

```

> Member 엔티티 조회시 Member만 조회 된 것을 확인 

> JpaMain.java - m1.getTeam().getClass()로 team을 조회 후 Lazy로 가져온 객체 클래스 테스트

```
            Team team = new Team();
            team.setName("TeamA");
            team.setCreateBy("kim");
            team.setCreateDate(LocalDateTime.now());
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("MemberA");
            member1.setCreateBy("kim");
            member1.setCreateDate(LocalDateTime.now());
            member1.setTeam(team);
            em.persist(member1);


            em.flush();
            em.clear();

            Member m1 = em.find(Member.class, member1.getId());

            System.out.println("m1 = " + m1.getClass());

            System.out.println("m1.getTeam().getClass() = " + m1.getTeam().getClass());
```

> console

````
Hibernate: 
    /* insert relativemapping.Team
        */ insert 
        into
            Team
            (MOD_ID, MOD_DT, REG_ID, REG_DT, NAME, TEAM_ID) 
        values
            (?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, team_TEAM_ID, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_3_0_,
        member0_.MOD_ID as mod_id2_3_0_,
        member0_.MOD_DT as mod_dt3_3_0_,
        member0_.REG_ID as reg_id4_3_0_,
        member0_.REG_DT as reg_dt5_3_0_,
        member0_.team_TEAM_ID as team_tea7_3_0_,
        member0_.USERNAME as username6_3_0_ 
    from
        Member member0_ 
    where
        member0_.MEMBER_ID=?
m1 = class relativemapping.Member
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.MOD_ID as mod_id2_7_0_,
        team0_.MOD_DT as mod_dt3_7_0_,
        team0_.REG_ID as reg_id4_7_0_,
        team0_.REG_DT as reg_dt5_7_0_,
        team0_.NAME as name6_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?


m1.getTeam().getClass() = class relativemapping.Team$HibernateProxy$2xzHCXZv

Process finished with exit code 0

````


#### 지연 로딩

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-002.png)



#### 지연 로딩 LAZY를 사용해서 프록시로 조회

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-003.png)


#### Member와 Team을 자주 함께 사용한다면 ? 

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-004.png)

> Member와 Team을 자주 함께 사용하는 경우 Lazy 로딩을 하게되면 Member한번 Team 한번 쿼리를 각각 계속 호출하기 때문에 비효율적일 수 있습니다. <br>
상황에 맞게 적절히 적용하는게 중요합니다.

#### 즉시 로딩 EAGER를 사용해서 함께조회

> Member.java

```
package relativemapping;

import javax.persistence.*;


@Entity
public class Member extends BaseEntity{

    public Member(){
    }

    public Member(Long id, String username){
        this.id = id;
        this.username = username;
    }

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME")
    private String username;

    @ManyToOne(fetch = FetchType.EAGER) //**
    @JoinColumn
    private Team team;

	...

```

> JpaMain.java - 애플리케이션 재시작

> console

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert relativemapping.Team
        */ insert 
        into
            Team
            (MOD_ID, MOD_DT, REG_ID, REG_DT, NAME, TEAM_ID) 
        values
            (?, ?, ?, ?, ?, ?)
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, team_TEAM_ID, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_3_0_,
        member0_.MOD_ID as mod_id2_3_0_,
        member0_.MOD_DT as mod_dt3_3_0_,
        member0_.REG_ID as reg_id4_3_0_,
        member0_.REG_DT as reg_dt5_3_0_,
        member0_.team_TEAM_ID as team_tea7_3_0_,
        member0_.USERNAME as username6_3_0_,
        team1_.TEAM_ID as team_id1_7_1_,
        team1_.MOD_ID as mod_id2_7_1_,
        team1_.MOD_DT as mod_dt3_7_1_,
        team1_.REG_ID as reg_id4_7_1_,
        team1_.REG_DT as reg_dt5_7_1_,
        team1_.NAME as name6_7_1_ 
    from
        Member member0_ 
    left outer join
        Team team1_ 
            on member0_.team_TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
        
m1 = class relativemapping.Member

m1.getTeam().getClass() = class relativemapping.Team
```

> Team과 Member가 조인해서 한방 쿼리로 가져오기 때문에 프록시로 가져올 필요가 없기 때문에 일반 엔티티 객체로 가져오게 됩니다.


#### 즉시 로딩

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-005.png)



#### 즉시 로딩(EAGER), Member조회시 항상  Team도 조회

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-006.png)

> JPA 구현체는 가능하면 조인을 사용해서 SQL 한번에 함께 조회


### 프록시와 즉시로딩 주의 
------------------------

> - <mark>가급적 지연 로딩만 사용(특히 실무에서)</mark>
> - 즉시 로딩을 적용하면 예상치 못한 SQL이 발생
> - <mark>즉시 로딩은 JPQL에서 N+1 문제를 일으킨다.</mark>
> - @ManyToOne은 기본이 즉시 로딩
>	-> LAZY로 설정
> - @OneToMany, @ManyToMany는 기본이 지연 로딩


#### 즉시 로딩을 적용하면 예상치 못한 SQL이 발생

> Member.java

```
	@Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME")
    private String username;

    @ManyToOne(fetch = FetchType.EAGER) //**
    @JoinColumn
    private Team team;
```

> JpaMain - Jpql 예제, console
	
```
		   Team team = new Team();
            team.setName("TeamA");
            team.setCreateBy("kim");
            team.setCreateDate(LocalDateTime.now());
            em.persist(team);

            Member member1 = new Member();
            member1.setUsername("MemberA");
            member1.setCreateBy("kim");
            member1.setCreateDate(LocalDateTime.now());
            member1.setTeam(team);
            em.persist(member1);


            em.flush();
            em.clear();

            List<Member> result = em.createQuery( "select m from Member m", Member.class)   //JPQL이란 SQL 그대로 번역하여 Member만 조회, EAGER로 되어있어 Team도 따로 가져와 영속성 컨텍스트 1차 캐시 로딩
                            .getResultList();
                            
            // SQL : select * from Member
            
            // Member.java 의 Team Fetch 타입이 EAGER이기 때문에 Member 객체는 모든 값이 있어야함.
            
            > SQL : select * from Team where TEAM_ID = m.id
                            
                         


            tx.commit();
            
            ------------------
            
            
	Hibernate: 
    /* select
        m 
    from
        Member m */ select
            member0_.MEMBER_ID as member_i1_3_,
            member0_.MOD_ID as mod_id2_3_,
            member0_.MOD_DT as mod_dt3_3_,
            member0_.REG_ID as reg_id4_3_,
            member0_.REG_DT as reg_dt5_3_,
            member0_.team_TEAM_ID as team_tea7_3_,
            member0_.USERNAME as username6_3_ 
        from
            Member member0_
	
	Hibernate: 
    
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.MOD_ID as mod_id2_7_0_,
        team0_.MOD_DT as mod_dt3_7_0_,
        team0_.REG_ID as reg_id4_7_0_,
        team0_.REG_DT as reg_dt5_7_0_,
        team0_.NAME as name6_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?
        
            
```
	

#### 즉시 로딩은 JPQL에서 N+1 문제를 일으킨다.

> Member.java - FetchType EAGER

```
	...
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private Team team;
	...
```

> JpaMain.java - 2개의 팀과 각각 팀의 Member 생성

```
            Team teamA = new Team();
            teamA.setName("TeamA");
            teamA.setCreateBy("kim");
            teamA.setCreateDate(LocalDateTime.now());
            em.persist(teamA);

            Team teamB = new Team();
            teamB.setName("TeamB");
            teamB.setCreateBy("Park");
            teamB.setCreateDate(LocalDateTime.now());
            em.persist(teamB);

            Member member1 = new Member();
            member1.setUsername("MemberA");
            member1.setCreateBy("kim");
            member1.setCreateDate(LocalDateTime.now());
            member1.setTeam(teamA);
            em.persist(member1);

            Member member2 = new Member();
            member2.setUsername("MemberB");
            member2.setCreateBy("Park");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(teamB);
            em.persist(member2);

```

> console

```
Hibernate: 
    /* select
        m 
    from
        Member m */ select
            member0_.MEMBER_ID as member_i1_3_,
            member0_.MOD_ID as mod_id2_3_,
            member0_.MOD_DT as mod_dt3_3_,
            member0_.REG_ID as reg_id4_3_,
            member0_.REG_DT as reg_dt5_3_,
            member0_.team_TEAM_ID as team_tea7_3_,
            member0_.USERNAME as username6_3_ 
        from
            Member member0_
            
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.MOD_ID as mod_id2_7_0_,
        team0_.MOD_DT as mod_dt3_7_0_,
        team0_.REG_ID as reg_id4_7_0_,
        team0_.REG_DT as reg_dt5_7_0_,
        team0_.NAME as name6_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?
        
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.MOD_ID as mod_id2_7_0_,
        team0_.MOD_DT as mod_dt3_7_0_,
        team0_.REG_ID as reg_id4_7_0_,
        team0_.REG_DT as reg_dt5_7_0_,
        team0_.NAME as name6_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?


```

> N+1 문제란 Member 1과 Team이 10 개면 10개의 쿼리가 발생, 100개의 Team이면 100개의 쿼리가 각각 실행 <br>
> 실행한 1개의 쿼리 때문에 N개의 쿼리가 나가게 된다고 하여 N+1 문제라고 합니다.


> Member.java - FetchType LAZY

```
	...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Team team;
	...
```

> console - Member만 조회하는 쿼리 1개 나옴

```
Hibernate: 
    /* select
        m 
    from
        Member m */ select
            member0_.MEMBER_ID as member_i1_3_,
            member0_.MOD_ID as mod_id2_3_,
            member0_.MOD_DT as mod_dt3_3_,
            member0_.REG_ID as reg_id4_3_,
            member0_.REG_DT as reg_dt5_3_,
            member0_.team_TEAM_ID as team_tea7_3_,
            member0_.USERNAME as username6_3_ 
        from
            Member member0_
2월 03, 2022 11:22:39 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0


```

> Team을 사용하지 않기 때문에 Proxy로 Member만 조회합니다. 물론 Team을 루프로 돌리게 되면 각 각 Team을 모두 조회하게 됩니다. <br>

> N+1의 대안은 첫번째는 모두 LAZY로 세팅, 뒤에 JPQL에서 배우게 될 Fetch 조인이라는게 있습니다.

> Member만 사용할때는 지금과 같이 사용하다가 Team과 같이 사용할땐 Fetch 조인을 하여 한방쿼리로 가져와서 사용합니다.


> JpaMain.java - fetch 조인

```
	...
            List<Member> result = em.createQuery( "select m from Member m join fetch m.team", Member.class)
                            .getResultList();
     ...                    
```

> console

```
Hibernate: 
    /* select
        m 
    from
        Member m 
    join
        fetch m.team */ select
            member0_.MEMBER_ID as member_i1_3_0_,
            team1_.TEAM_ID as team_id1_7_1_,
            member0_.MOD_ID as mod_id2_3_0_,
            member0_.MOD_DT as mod_dt3_3_0_,
            member0_.REG_ID as reg_id4_3_0_,
            member0_.REG_DT as reg_dt5_3_0_,
            member0_.team_TEAM_ID as team_tea7_3_0_,
            member0_.USERNAME as username6_3_0_,
            team1_.MOD_ID as mod_id2_7_1_,
            team1_.MOD_DT as mod_dt3_7_1_,
            team1_.REG_ID as reg_id4_7_1_,
            team1_.REG_DT as reg_dt5_7_1_,
            team1_.NAME as name6_7_1_ 
        from
            Member member0_ 
        inner join
            Team team1_ 
                on member0_.team_TEAM_ID=team1_.TEAM_ID


```

> 또다른 방법은 EntityGraph 라는 어노테이션을 사용하는 방법과  Batch size 방식이 있습니다.


#### @ManyToOne 은 기본이 즉시 로딩 EAGER

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-007.png)

> 기본이 즉시 로딩이기 때문에 모두 @ManyToOne<mark>(fetch = FetchType.LAZY)</mark> 를 추가해줘야한다 !!!



### 지연 로딩 활용
-----------------------------------------

> 이론적으로는 

> - <mark>Member</mark>와 <mark>Team</mark>은 자주 함께 사용 -> <mark>즉시 로딩</mark>
> - <mark>Member</mark>와 <mark>Order</mark>은 가끔 사용 -> <mark>지연 로딩</mark>
> - <mark>Order</mark>와 <mark>Product</mark>는 자주 함께 사용 -> <mark>즉시 로딩</mark>

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-008.png) 

> 실무에서는 지연로딩으로 무조건 다 세팅해두어야 합니다...


![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-009.png) 

> em.find(Member.class, member1.getId()); 를 통해 조회시 team과는 Join한 한방 쿼리로 조회됩니다.

> orders는 지연 로딩을 이용해서 프록시로 들어오게 됩니다.

> orders를 사용하여 프록시를 초기화 하게되면

![contact](/images/develop/backend/orm-jpa-basic/eager-loading-and-lazy-loading/img-010.png) 

### 지연 로딩 - 실무
-----------------------------------------

> - <mark>모든 연관관계에 지연 로딩을 사용해라!</mark>
> - <mark>실무에서 즉시 로딩을 사용하지 마라</mark>
> - JPQL fetch 조인이나, 엔티티 그래프 기능을 사용해라!
> - 즉시 로딩은 상상하지도 못한 쿼리가 나간다.


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
