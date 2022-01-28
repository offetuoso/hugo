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
draft: true
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







#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
