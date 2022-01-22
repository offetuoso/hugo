---
title: "JPA 프록시와 연관관계"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-19
slug: "proxy-and-relation"
description: "프록시와 연관간계"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 프록시와 상속관계
-------------

## 목차
-------------
> - 프록시
> - 즉시 로딩과 지연 로딩
> - 지연 로딩 활용
> - 영속성 전이 : CASCADE
> - 고아 객체
> - 영속성 전이 + 고아객체, 생명주기



### 프록시
-------------

#### Member를 조회할때 Team도 함께 조회해야 할까?

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-001.png)

> JpaMain.java

```
    private static void printMember(Member member){
        System.out.println("username = "+member.getUsername());
    }

    private static void printMemberAndTeam(Member member){
        String username = member.getUsername();
        System.out.println("username = "+username);

        Team team = member.getTeam();
        System.out.println("team = "+team.getName());
    }
```

> Member객체를 출력하는 메서드와 Member객체와 Member가 가지는 Team 객체를 출력하는 메서드가 있을때, Member만 조회하는 쿼리를 수행할때 Team까지 Join을 통하여 조회 쿼리를 수행한다면 자원낭비이다.<br>
> JPA는 지연로딩과 Proxy를 이용하여 이것을 해결합니다.


#### 프록시 기초

> - em.find() vs <mark>em.getRefernce()</mark>
> - em.find() : 데이터베이스를 통해서 실제 엔티티 객체 조회
> - em.getRefernce() : <mark>데이터베이스 조회를 미루는 가짜(프록시) 엔티티 객체 조회</mark>

> Member.java -  Team 이외의 다른 연관관계 제거

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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false)
    private Team team;


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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

}

```


> JpaMain.java

```
package relativemapping;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
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

            Member member = new Member();
            member.setUsername("MemberA");
            member.setCreateBy("kim");
            member.setCreateDate(LocalDateTime.now());
            member.setTeam(team);
            em.persist(member);
            em.flush();
            em.clear();

            Member findMember = em.find(Member.class, member.getId());

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


```

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
    select
        member0_.MEMBER_ID as member_i1_3_0_,
        member0_.MOD_ID as mod_id2_3_0_,
        member0_.MOD_DT as mod_dt3_3_0_,
        member0_.REG_ID as reg_id4_3_0_,
        member0_.REG_DT as reg_dt5_3_0_,
        member0_.TEAM_ID as team_id7_3_0_,
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
            on member0_.TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
        
findMember.id = 2
findMember.userName = MemberA

```

> Member와 Team이 Join된 쿼리로 Select 되어 나오는 것을 확인 할 수 있다.

> JpaMain.java - em.find() -> em.getReference(),<br>
//System.out.println("findMember.id = "+findMember.getId()); // 주석처리 <br>
//System.out.println("findMember.userName = "+findMember.getUsername()); // 주석처리 

```
			 Team team = new Team();
            team.setName("TeamA");
            team.setCreateBy("kim");
            team.setCreateDate(LocalDateTime.now());
            em.persist(team);

            Member member = new Member();
            member.setUsername("MemberA");
            member.setCreateBy("kim");
            member.setCreateDate(LocalDateTime.now());
            member.setTeam(team);
            em.persist(member);
            em.flush();
            em.clear();

            //Member findMember = em.find(Member.class, member.getId());
            Member findMember = em.getReference(Member.class, member.getId());

            //System.out.println("findMember.id = "+findMember.getId());
            //System.out.println("findMember.userName = "+findMember.getUsername());

            //printMemberAndTeam(findMember);

            tx.commit();
```

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

```

> Select Sql이 실행되지 않는것을 확인 할 수 있습니다. 



> JpaMain.java - em.find() -> em.getReference(),<br>
System.out.println("findMember.id = "+findMember.getId()); // 주석해제 <br>
System.out.println("findMember.userName = "+findMember.getUsername()); // 주석해제

```
			 Team team = new Team();
            team.setName("TeamA");
            team.setCreateBy("kim");
            team.setCreateDate(LocalDateTime.now());
            em.persist(team);

            Member member = new Member();
            member.setUsername("MemberA");
            member.setCreateBy("kim");
            member.setCreateDate(LocalDateTime.now());
            member.setTeam(team);
            em.persist(member);
            em.flush();
            em.clear();

            //Member findMember = em.find(Member.class, member.getId());
            Member findMember = em.getReference(Member.class, member.getId());
				
			 System.out.println("findMember.class = "+findMember.getClass()); // 클래스 확인
            System.out.println("findMember.id = "+findMember.getId()); // 주석해제 
            System.out.println("findMember.userName = "+findMember.getUsername()); // 주석해제 

            //printMemberAndTeam(findMember);

            tx.commit();
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
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
            
findMember.class = class relativemapping.Member$HibernateProxy$kQ2LbNHi

findMember.id = 2

Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_3_0_,
        member0_.MOD_ID as mod_id2_3_0_,
        member0_.MOD_DT as mod_dt3_3_0_,
        member0_.REG_ID as reg_id4_3_0_,
        member0_.REG_DT as reg_dt5_3_0_,
        member0_.TEAM_ID as team_id7_3_0_,
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
            on member0_.TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
findMember.userName = MemberA
1월 21, 2022 11:07:11 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0


````

> getReferance()를 수행하는 시점에는 Select 쿼리를 날리지 않음. 이 값이 실제 사용되는 시점에 Select 쿼리를 수행해 DB메서 데이터를 가져옴. <br>
> findMember.class = class relativemapping.Member$HibernateProxy$kQ2LbNHi Member.java가 아니라 HibernateProxy 인것으로 확인됨




#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
