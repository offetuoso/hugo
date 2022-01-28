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
draft: false
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
    @JoinColumn
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

Process finished with exit code 0


````

> getReferance()를 수행하는 시점에는 Select 쿼리를 날리지 않음. 이 값이 실제 사용되는 시점에 Select 쿼리를 수행해 DB메서 데이터를 가져옴. <br>
> findMember.class = class relativemapping.Member$HibernateProxy$kQ2LbNHi Member.java가 아니라 HibernateProxy 인것으로 확인됨 <br>
> JPA에서 만든 가상의 프록시 Class


#### 프록시 기초

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-002.png)

> em.getRefence() 를 수행하면 하이버네이트는 프록시라는 가짜 엔티티 객체를 넘겨줍니다. <br>
> 껍데기는 똑같은데 텅텅 빈 객체로 넘겨줍니다. 그리고 target이라는 속성이 있는데 이게 진짜 레퍼런스 입니다.

#### 프록시 특징

> - 실제 클래스를 상속받아서 만들어짐
> - 실제 클레스와 겉 모양이 같다.
> - 사용하는 입장에서는 진짜 객체인지 프록시 객체인지 구분 하지 않고 사용하면 됨(이론상)

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-003.png)

> - 프록시 객체는 실제 객체의 참조(target)를 보관
> - 프록시 객체를 호출하면 프록시 객체는 실제 객체의 메소드 호출

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-004.png)

#### 프록시 객체의 초기화 

```
Member member = em.getReference(Member.class, 1L);
member.getName();
```

![contact](/images/develop/backend/orm-jpa-basic/proxy-and-relation/img-005.png)

> JpaMain.java - 

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

            System.out.println("findMember.class = "+findMember.getClass()); 
            System.out.println("findMember.id = "+findMember.getId()); 
            System.out.println("findMember.userName = "+findMember.getUsername());  // getUsername() 호출

            System.out.println("findMember.userName = "+findMember.getUsername());  // getUsername() 호출 2

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

findMember.userName = MemberA

Process finished with exit code 0


````

> 프록시 생성후 findMember.userName()를 위해 select SQL을 호출하지만, 2번째 findMember.userName() 호출할땐 target에 값이 있고 이미 초기화가 되어 있는 프록시 이기 때문에 조회없이 값을 출력하게 됩니다.


#### 프록시의 특징 

> - 프록시 객체는 처음 사용할 때 한 번만 초기화
> - 프록시 객체를 초기화 할 때, <mark>프록시 객체가 실제 엔티티로 바뀌는 것은 아님</mark>, 초기화되면 프록시 객체를 통해서 실제 엔티티에 접근 가능

##### 프록시 객체가 실제 엔티티로 바뀌는 것은 아님

> JpaMain.java - findMember.getUsername() 전후로 findMember.getClass() 객체 타입 확인

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

            System.out.println("findMember.class before = "+findMember.getClass());

            System.out.println("findMember.userName = "+findMember.getUsername());

            System.out.println("findMember.class after = "+findMember.getClass());

            //printMemberAndTeam(findMember);

            tx.commit();
```

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
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
findMember.class before = class relativemapping.Member$HibernateProxy$uziW0Tt8
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
findMember.class after = class relativemapping.Member$HibernateProxy$uziW0Tt8

Process finished with exit code 0

```

> - 프록시 객체는 원본 엔티티를 상속받음, 따라서 타입 체크시 주의해야함 (==비교 실패, 대신 instance of 사용)


> - 영속성 컨텍스트에 찾는 엔티티가 이미 있으면 em.getReference()를 호출해도 실제 엔티티 반환 (반대로 em.getReference()로 조회 후 엔티티를 조회하면 프록시 객체로 반환)
> - 영속성 컨텍스트의 도움을 받을 수 없는 준영속 상태일 때, 프록시를 초기화 하면 문제 발생 <br>
(하이버네이트는 org.hivernate.LazyInitializationException 예외룰 터트림)


##### 엔티티 객체 == 비교

> JpaMain.java - em.find(), em.find() 타입비교

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
            Member member2 = new Member();
            member2.setUsername("MemberA");

            member2.setCreateBy("kim");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(team);
            em.persist(member2);


            em.flush();
            em.clear();

            Member m1 = em.find(Member.class, member1.getId());
            Member m2 = em.find(Member.class, member2.getId());

			
            System.out.println("m1 == m2 " + (m1.getClass() == m2.getClass())); // m1 == m2true
```


##### 엔티티 객체, 프록시 객체 == 비교

> JpaMain.java - em.find(), em.getReference() 타입비교

```
		    Member m1 = em.find(Member.class, member1.getId());
            Member m2 = em.getReference(Member.class, member2.getId());

            System.out.println("m1 == m2 " + (m1.getClass() == m2.getClass()));
// m1 == m2 false
```

> 비교한 em.find로 가져온 엔티티 객체와 getReference를 통해 만든 프록시 객체는 == 비교를 하면 false로 나옵니다. <br>
> 지금이야 같은 JpaMain에서 보면 쉽겠지만 아래와 같은 메소드를 사용한다면 함수 내부에서 어떤 객체가 넘어오는지 알기 힘듭니다.

> JpaMain.java - 메소드를 생성하고 내부에서 객체 == 비교

```
	...
	
	logic(m1,m2);
    ...
   
    private static void logic(Member m1, Member m2) {
        System.out.println("m1 == m2 " + (m1.getClass() == m2.getClass())); 
    }
	
```

##### 프록시 객체 instanceof 체크

> JpaMain.java - 메소드를 생성하고 내부에서 객체 instanceof로 체크

```
    ...
	
    logic(m1,m2);
    ...
    
   
   private static void logic(Member m1, Member m2) {
        System.out.println("m1 instanceof Member " + (m1 instanceof Member));
        System.out.println("m2 instanceof Member " + (m2 instanceof Member));
    }

```

##### 영속성 컨텍스트(1차 캐시)에 찾는 엔티티가 있으면 em.getReference()를 호출해도 실제 엔티티 반환

> JpaMain.java - 영속성 컨텍스트에 엔티티 추가 후 em.getReference()

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
            Member member2 = new Member();
            member2.setUsername("MemberA");

            member2.setCreateBy("kim");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(team);
            em.persist(member2);


            em.flush();
            em.clear();

            Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());

            Member r2 = em.getReference(Member.class,member1.getId());

            System.out.println("r2 = " + r2.getClass());
            
            System.out.println("r1 == r2 " + (r1 == r2));

            tx.commit();

```

> console

```
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
        
m1 = class relativemapping.Member

r1 = class relativemapping.Member

m1 == r1 true

```

> m1과 r1 모두 Member 엔티티 객체 클래스로 나오는 것을 확인할 수 있습니다. 두가지 이유가 있는데 하나는 <br>
영속성 컨텍스트에 이미 있는데 프록시로 가져 와봐야 이점이 없는데 프록시로 가져올 필요가 없습니다. 원본인 엔티티 객체를 반환하는게 더 성능 최적화에 도움이 됩니다.

> 또한 JPA에서는 영속성 컨텍스트 안에서 같은 Member를 엔티티에서 조회하거나, 레퍼런스로 조회해 와도 컬렉션에서 == 비교한 것처럼 같은 값으로 인식해 줍니다.

> JPA는 한 트랜젝션 안에서 같은 객체에 대한 보장을 해줍니다.


> r1 과 r2  둘다 레퍼런스면 두개의 프록시 객체는 동일하고, == 비교시 true 를 반환 합니다.

```
            Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());

            Member r2 = em.getReference(Member.class,member1.getId());

            System.out.println("r2 = " + r2.getClass());
            
            System.out.println("r1 == r2 " + (r1 == r2));

```

> console

```
	r1 = class relativemapping.Member$HibernateProxy$3dvhAszH
	r2 = class relativemapping.Member$HibernateProxy$3dvhAszH
	r1 == r2 true
```

> JpaMain.java - 레퍼런스로 조회 후 일반 엔티티 조회 시 

```
			Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());

            Member m1 = em.find(Member.class,member1.getId());

            System.out.println("m1 = " + m1.getClass());

            System.out.println("r1 == m1 " + (r1 == m1));
```

> console

````
r1 = class relativemapping.Member$HibernateProxy$vH2td1yz
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
        
m1 = class relativemapping.Member$HibernateProxy$vH2td1yz

r1 == m1 true

````

> em.getReference() 이후 em.find()또한 proxy로 조회된것을 확인할 수 있습니다. 이는 같은 컨텍스트 안에서 같은 객체로 반환해 주는 JPA의 특징입니다.



##### 영속성 컨텍스트의 도움을 받을 수 없는 준영속 상태일 때, 프록시를 초기화하면 문제 발생

> JpaaAin.java - 영속성 컨텍스트에서 제거된 경우  <br>
> getReference() 후 getUsername()을 통해 초기화

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
            Member member2 = new Member();
            member2.setUsername("MemberA");

            member2.setCreateBy("kim");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(team);
            em.persist(member2);


            em.flush();
            em.clear();

            Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());


            em.detach(r1); // 영속성 컨텍스트에서 r1을 제거
            //  em.clear();

            r1.getUsername(); //컨텍스트에서 제거된 경우

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
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
r1 = class relativemapping.Member$HibernateProxy$Sq3ipbiV

org.hibernate.LazyInitializationException: could not initialize proxy [relativemapping.Member#2] - no Session //영속성 컨텍스트 없다는 이야기
	at org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:170)
	at org.hibernate.proxy.AbstractLazyInitializer.getImplementation(AbstractLazyInitializer.java:310)
	at org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor.intercept(ByteBuddyInterceptor.java:45)
	at org.hibernate.proxy.ProxyConfiguration$InterceptorDispatcher.intercept(ProxyConfiguration.java:95)
	at relativemapping.Member$HibernateProxy$Sq3ipbiV.getUsername(Unknown Source)
	at relativemapping.JpaMain.main(JpaMain.java:52)
```

> JpaaAin.java - 영속성 컨텍스트가 종료된경우
> getReference() 후 getUsername()을 통해 초기화

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
            Member member2 = new Member();
            member2.setUsername("MemberA");

            member2.setCreateBy("kim");
            member2.setCreateDate(LocalDateTime.now());
            member2.setTeam(team);
            em.persist(member2);


            em.flush();
            em.clear();

            Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());


            em.close(); // 컨텍스트 종료

            r1.getUsername(); //컨텍스트 종료된 이후 프록시 객체 초기화

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
Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
r1 = class relativemapping.Member$HibernateProxy$t0KzgTxZ
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
1월 26, 2022 10:57:16 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0

```

> 강의에 의하면 LazyInitializationException( "could not initialize proxy  - the owning Session was closed" ) exception이 나와야 하지만,  <br>

> 5.4.0.Final 버전까지는 예외가 발생하는데 5.4.1.Final 버전부터 예외가 발생하지 않습니다. <br>

>  트랜잭션을 종료하지 않은 상태에서 세션(엔티티메니져)을 닫았기 때문에 아직 트랜잭션이 살아있습니다. 



#### 프록시 확인

> - 프록시 인스턴스 초기화 여부 확인
>	PersistenceUnitUtil.isLoaded(Object entity)

> - 프록시 클래스 확인 방법
>	entity.getClass().getName() 출력 (...javasist...or HibernateProxy..)

> - 프록시 강제 초기화
>	org.hibernate.initialize(entity);

> 참고 :JPA 표준은 강제 초기화 없음
>	강제 호출 : member.getName()


##### 프록시 인스턴스 초기화 여부 확인

> JpaMain.java - emf.getPersistenceUnitUtil().isLoaded() 사용

````

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

            Member r1 = em.getReference(Member.class, member1.getId());
            System.out.println("r1 = " + r1.getClass());

            //엔티티 매니저 팩토리에서 PersistenceUnitUtil를 받아와 사용
            System.out.println("isLoaded = "+ emf.getPersistenceUnitUtil().isLoaded(r1) );

            r1.getUsername();

            System.out.println("isLoaded = "+ emf.getPersistenceUnitUtil().isLoaded(r1) );


            tx.commit();
            
````

> console

```

Hibernate: 
    /* insert relativemapping.Member
        */ insert 
        into
            Member
            (MOD_ID, MOD_DT, REG_ID, REG_DT, USERNAME, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?)
            
r1 = class relativemapping.Member$HibernateProxy$qay0PhKw //프록시 생성

isLoaded = false // 프록시 초기화전 false

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
        
isLoaded = true // 프록시 초기화전 true

```

##### 프록시 확인 방법

> JpaMain.java

```

		System.out.println("r1 = " + r1.getClass());

```

console

````

r1 = class relativemapping.Member$HibernateProxy$qay0PhKw

````


##### 프록시 강제 초기화

> JpaMain.java

```

		   r1.getUsername(); // 프록시 강제 초기화 (하이버네이트, 표준 JPA)
		   
		   //Hibernate.initialize(r1); //하이버네이트 only

            System.out.println("isLoaded = "+ emf.getPersistenceUnitUtil().isLoaded(r1) );

```

console

````

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
        
isLoaded = true

````



#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
