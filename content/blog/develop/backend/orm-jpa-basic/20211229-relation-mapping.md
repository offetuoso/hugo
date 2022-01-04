---
title: "JPA 연관관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-29
slug: "relation-mapping"
description: "연관관계 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 연관관계 매핑
-------------

> 테이블에 맞춰서 외래키를 가져오면서 설계하는 방식이 아닌 order.getMember()이런식으로 연관관계를 맺어서 좀더 객체지향 식으로 설계할 수 있는지 알아보겠습니다. 여태 까지는 어려움이 없었겠지만, 관계형 DB와 객체지향 사이에서 오는 간극이 크고 각각의 패러다임이 다르기 때문에 어려움이 있습니다. 


## 목표
-------------
> - <mark>객체와 테이블 연관관계 차이를 이해</mark>
> - <mark>객체의 참조와 테이블의 외래 키를 매핑</mark>
> - 용어 이해
> 	-  <mark>방향</mark>(Direction) : 단방향, 양방향
> 	-  <mark>다중성</mark>(Multiplicity) : 다대일(N:1), 일대다(1:N), 일대일(1:1), 다대다(N:M)의 이해
> 	-  <mark>연관관계의 주인</mark>(Owner) : 객체의 양방향 관계는 괸리 주인이 필요


## 목차
-------------
> - 연관관계가 필요한 이유
> - 단방향 연관관계
> - 양방향 연관관계와 연관관계의 주인
> - 실전예제 - 2. 연관관계 매핑 시작


### 연관관계가 필요한 이유
-------------

#### 예제 시나리오

> - 회원과 팀이 있다.
> - 회원은 하나의 팀에만 소속 될 수 있다.
> - 회원과 팀은 다대일 관계다.
> - 회원(n:1)팀

#### 객체를 테이블에 맞추어 모델링
> (연관관계가 없는 객체)

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-001.png)

> Member.java

```
package relativemapping;

import javax.persistence.*;


@Entity
public class Member {
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

    @Column(name = "TEAM_ID")
    private Long teamId;

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

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}


```

> Team.java

````
package relativemapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class Team {
    public Team(){
    }

    public Team(Long id, String username){
        this.id = id;
        this.name = name;
    }

    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;

    @Column(name = "NAME")
    private String name;

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
}

````

> JpaMain.java

```
package relativemapping;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {
    //psvm 단축키로 생성 가능
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("relavicemapping");
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

```

> persistence.xml

````
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="relativemapping">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
            <!--
                <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL5Dialect"/>
                <property name="hibernate.dialect" value="org.hibernate.dialect.Oracle8iDialect"/>
                <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>


            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>  <!-- 실행 sql 로깅 -->
            <property name="hibernate.format_sql" value="true"/>  <!-- 실행 sql 포메팅 -->

            <!-- /* insert relativemapping.Member */ JPA가 Inser 를 해서 이 쿼리가 나왔다는 것을 주석으로 설명 -->
            <property name="hibernate.use_sql_comments" value="true"/>

            <!-- 한번에 같은 데이터 베이스에 데이터를 집어넣을때 모아서 한번에 인서트 하는 jdbc batch의 수를 지정-->
            <property name="hibernate.jdbc.batch_size" value="10"/>

            <property name="hibernate.hbm2ddl.auto" value="create" /> <!-- create, create-drop, update, validate, none -->
        </properties>
    </persistence-unit>
</persistence>
````


> console

````
Hibernate: 
    
    drop table Member if exists
Hibernate: 
    
    drop table Team if exists
Hibernate: 
    
    drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        TEAM_ID bigint,
        USERNAME varchar(255),
        primary key (MEMBER_ID)
    )
Hibernate: 
    
    create table Team (
       TEAM_ID bigint not null,
        NAME varchar(255),
        primary key (TEAM_ID)
    )
````

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-002.png)

> 테이블 구조를 따라 객체를 만들면 외래키를 포함하게 되는 것을 볼 수있습니다. 문제점이 무엇이냐면,


> JpaMain.java

```
	...
   Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            member.setTeamId(team.getId());

            em.persist(member);

            tx.commit();
   ...
```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-003.png)

> member.setTeamId()가 member.setTeam()으로 객체 자체를 참조하여 가져올 수 있다면 좀더 객체지향적인 방법이 될꺼같습니다.

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-004.png) 

> 지금 상황은 외래키 식별자를 직접 다루게 되는데 조회할때도 이슈가 있습니다.


> JpaMAin.Java


```
	...
            Member findMember = em.find(Member.class, member.getId());
            Long findTeamId = findMember.getTeamId();
            Team findTeam = em.find(Team.class, findTeamId);
    ...
```

> 맴버를 조회하고 그 맴버가 속한 팀을 가져오고 싶을때 찾은 맴버에서 TeamId를 이용해 Team을 찾아야 하는 번잡스러움이 있습니다.


#### 객체를 테이블에 맞추어 데이터 중심으로 모델링하면, 협력관계를 만들 수 없다.
> - <mark>테이블은 외래키 키로 조인 </mark>을 사용해서 연관된 테이블을 찾는다.
> - <mark>객체는 참조</mark>를 사용해서 연관된 객체를 찾는다.
> - 테이블과 객체 사이에는 이런 큰 간격이 있다.


### 단방향 연관관계
---------------


#### 객체 지향 모델링 
> (객체 연관관계 사용)


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-005.png) 


> Member.java

```
package relativemapping;

import javax.persistence.*;


@Entity
public class Member {
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

    //@Column(name = "TEAM_ID")
    //private Long teamId;

    @ManyToOne //Member 입장에서 Member가 N 팀이 1, 1팀에 여러 맴버가 있을 수 있다.
    @JoinColumn(name = "TEAM_ID") // 조인할 컬럼 명
    private Team team;

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
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

}

```


> 관계가 먼지 <code> @ManyToOne </code>//Member 입장에서 Member가 N 팀이 1, 1팀에 여러 맴버가 있을 수 있다.  <br>
 조인하려는 컬럼은 <code> @JoinColumn(name = "TEAM_ID")</code> // 조인할 컬럼 명 



#### 객체 지향 모델링
> (ORM 매핑)


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-006.png) 


#### 객체 지향 모델링
> (연관관계 저장)

> JpaMain.java

````
 // 저장
            // 팀 저장
            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            // 회원 저장
            Member member = new Member();
            member.setUsername("Member1");
            	//member.setTeamId(team.getId());
            member.setTeam(team); // 단방향 연관관계 설정, 참조 저장
            						 // 저장한 팀을 setTeam을 하게 되면 조회할때 Team의 TEAM_ID를 외래키로 사용하게 됩니다.
            
            em.persist(member);
            
            

 // 조회            
            Member findMember = em.find(Member.class, member.getId());
	            //Long findTeamId = findMember.getTeamId();
	            //Team findTeam = em.find(Team.class, findTeamId);
            Team findTeam = findMember.getTeam();

            System.out.println("findTeam = "+findTeam.getName());


            tx.commit();


````


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-007.png) 

> findMember.getTeam(); 을 이용하여 Team을 객체 지향 답게 레퍼런스 들을 가져 올수 있는것을 확인 할 수 있었습니다.



> 영속성 컨텍스트 1차 캐시에 추가되어있기 때문에 select 하는 쿼리가 보이지 않지만, select 하는 쿼리도 보고싶다면

```
 // 저장
            // 팀 저장
            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            // 회원 저장
            Member member = new Member();
            member.setUsername("Member1");
            	//member.setTeamId(team.getId());
            member.setTeam(team); // 단방향 연관관계 설정, 참조 저장
            						 // 저장한 팀을 setTeam을 하게 되면 조회할때 Team의 TEAM_ID를 외래키로 사용하게 됩니다.
            
            em.persist(member);
            
            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화
            

 // 조회            
            Member findMember = em.find(Member.class, member.getId());
	            //Long findTeamId = findMember.getTeamId();
	            //Team findTeam = em.find(Team.class, findTeamId);
            Team findTeam = findMember.getTeam();

            System.out.println("findTeam = "+findTeam.getName());


            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-008.png) 

> Jpa가 Member와 Team을 조인하여 한번에 가져온것을 알 수 있습니다.


> Member.java

```
	...
    @ManyToOne(fetch = FetchType.LAZY) //default : fetch = FetchType.EAGER
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
    ...
```

> ManyToOne의 fetch default 옵션은 FetchType.EAGER 이지만, fetch = FetchType.LAZY 로 변경하면

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-009.png) 

> select 문을 분리하여, 각각 조회해 오는 것을 알 수 있습니다.

> 만약 Team을 변경한다면 

> JpaMain.java

```
// 저장
            // 팀 저장
            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Team teamB = new Team();
            teamB.setName("TeamB");
            em.persist(teamB);

            // 회원 저장
            Member member = new Member();
            member.setUsername("Member1");
            //member.setTeamId(team.getId());
            member.setTeam(team); // 저장한 팀을 setTeam을 하게 되면 조회할때 Team의 TEAM_ID를 외래키로 사용하게 됩니다.
            em.persist(member);


            member.setTeam(teamB);
            em.persist(member);


            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화

// 조회
            Member findMember = em.find(Member.class, member.getId());
            //Long findTeamId = findMember.getTeamId();
            //Team findTeam = em.find(Team.class, findTeamId);
            Team findTeam = findMember.getTeam();

            System.out.println("findTeam = "+findTeam.getName());


            tx.commit();

```


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-010.png) 

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-011.png) 

> Update 문을 통해 Member의 TEAM_ID 즉 외래키가 업데이트 되는 것을 확인할 수 있습니다.


### 양방향 연관관계 
  
---------------

#### 양방향 연관관계와 연관관계의 주인 1 - 기본

##### 양방향 매핑

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-012.png) 

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-013.png) 

> Member에서 Team을 불러올수 있지만 Team에서 Member를 가져올 수는 없습니다. 현재 Team의 속성에도 추가 되어있지 않고, 연관관계도 없기 때문에 데이터 또한 없습니다. <br>
> 양방향 매핑 이미지를 보면 Member에서 Team으로 Team에서 Member로 레퍼런스만 넣어둔 다면 가능한데 이런것을 양방향 연관관계 라고 합니다.

> 양방향 객체 연관관계는 변화가 있었지만 테이블 연관관계는 변함이 없습니니다. 

> MEMBER입장에서 TEAM을 가져올때는 MEMBER의 TEAM_ID로 TEAM을 조인해서 가져오면 되고  <br>
> TEAM입장에서 MEMBER을 가져올때는 MEMBER의 TEAM_ID 중 나의 TEAM_ID를 가지고 있는 회원들만 조인하여 가져오면 됩니다.

> 테이블의 연관관계는 TEAM_ID 라는 외래키 하나로 양방향 연관관계가 됩니다. 테이블에선 양방향이라는 개념이 없고 외래키를 사용하여 양쪽의 연관을 다 알수 있는 것입니다.

> 문제는 객체입니다. Member는 Team을 가지고 있고 Team에서 Member로 갈 수 있는 방법이 없었습니다. 

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-014.png) 

> Team에 List 타입의 members를 넣어줘야 양쪽으로 참조하여 갈 수 있습니다.

> 테이블은 외래키 하나로 양쪽을 참조할 수 있지만, 객체는 Team team과 List members를 추가해 줘야 양쪽을 참조할 수 있는것이 테이블과 객체의 가장큰 차이점 입니다.


> Team.java - members 추가

```
package relativemapping;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Team {
    public Team(){
    }

    public Team(Long id, String username){
        this.id = id;
        this.name = name;
    }

    @Id @GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;
    @Column(name = "NAME")
    private String name;

    @OneToMany(mappedBy = "team") // 1:N 관계에서 상대편(Member)에 team으로 매핑이 되어있는 것 이라고 지정
    private List<Member> members = new ArrayList<>();

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

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


}

```


> JpaMain.java - Team에 2명의 유저를 넣고, Team을 조회해서 Team의 모든 유저들을 조회

```
            // 저장
            // 팀 저장
            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);


            // 회원 저장
            Member member = new Member();
            member.setUsername("Member1");
            //member.setTeamId(team.getId());
            member.setTeam(team); // 저장한 팀을 setTeam을 하게 되면 조회할때 Team의 TEAM_ID를 외래키로 사용하게 됩니다.
            em.persist(member);

            Member member1 = new Member();
            member1.setUsername("Member2");
            //member.setTeamId(team.getId());
            member1.setTeam(team); // 저장한 팀을 setTeam을 하게 되면 조회할때 Team의 TEAM_ID를 외래키로 사용하게 됩니다.
            em.persist(member1);

            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화
              			  // 해당 소스가 없으면, 영속 컨텍스트의 1차 캐시에서 바로 가져오기 때문에 select 쿼리가 나오지 안습니다.
            
            
            Member findMember = em.find(Member.class, member.getId());
            //Long findTeamId = findMember.getTeamId();
            //Team findTeam = em.find(Team.class, findTeamId);
            Team findTeam = findMember.getTeam();

            List<Member> members  = findTeam.getMembers();

            for (Member m : members){

                System.out.println("findUser = "+m.getUsername());
            }

            System.out.println("findTeam = "+findTeam.getName());


            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-015.png) 


#### 양방향 매핑 
> (반대 방향으로 객체 그래프 탐색)

```
	// 조회
	Team findTeam = em.find(Team.class, team.getId());
	int memberSize = findTeam.getMembers().size() //역방향 조회

```

> 작성했던 코드를 보며 궁금증이 생기는데 

> Member.java

```
    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;

```

> Team.java

```
 	@OneToMany(mappedBy = "team") 
    private List<Member> members = new ArrayList<>();
```

> 둘의 차이는 멀까 어떠한 것은 JoinCoulmn이고 어떠한것은 mappedBy를 쓰는걸까 

#### 연관관계의 주인과 mappedBy

> - mappedBy = JPA의 첫번째 시련(C의 포인터 같은..)
> - mappedBy는 처음에는 이해하기 어렵다.
> - 객체와 테이블간에 연관관계를 맺는 차이를 이해해야한다.


#### 객체와 테이블의 관계를 맺는 차이
> - 객체 연관관계 = 2개 
>	- 회원 -> 팀 연관관계 1개 (단방향)
>	- 팀 -> 회원 연관관계 1개 (단방향)

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-016.png) 

> 1. Member 에서 Team team(참조)을 이용해 Team으로 가는 연관관계 1개 
> 2. Team 에서 List<Member> Members(참조)를 이용해 Member로 가는 연관관계 1개 


> - 테이블 연관관계 = 1개
>	- 회원 <-> 팀의 연관관계 1개 (양방향)

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-017.png) 

> TEAM_ID를 이용해 조인을 하면 MEMBER에서 TEAM을 알 수 있고, TEAM에서도 팀에 포함된 MEMBER들을 알 수 있습니다.


#### 객체의 양방향 관계
> - 객체의 <mark>양방향 관계는 사실 양방향 관계가 아니라 서로 다른 단방향 관계 2개이다.</mark>
> - 객체를 양방향으로 참조하려면 <mark>단방향 연관관계를 2개</mark> 반들어야 한다.

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-018.png) 


#### 테이블의 양방향 연관관계
> - 테이블은 외래 키 하나로 두 테이블의 연관관계를 관리
> - MEMBER.TEAM_ID 외래 키 하나로 양방향 연관관계 가짐 <br> (양쪽으로 조인할 수 있다.)

```
-- MEMBER 관점
SELECT * 
FROM MEMBER M
JOIN TEAM T ON M.MEMBER_ID = T.MEMBER_ID;


-- TEAM 관점
SELECT * 
FROM TEAM T
JOIN MEMBER M ON T.MEMBER_ID = M.MEMBER_ID;
```


#### 둘 중 하나로 외래 키를 관리해야 한다.

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-019.png) 

> 테이블의 MEMBER의 TEAM_ID를 변경하기 위해서 Member 객체의 team 을 수정해야 할지, Team객체의 members를 수정해야할지 애매한 점이 생깁니다. 테이블 입장에서는 어떠한 객체에서 TEAM_ID 외래키를 Update를 해도 다르지 않으니까요. 이러한 아이러니한 점을 해결하기 위해 연관관계의 주인이라는 개념이 사용됩니다.

#### 연관관계의 주인 
> <mark>양방향 매핑 규칙</mark>
> - 객체의 두 관계중 하나를 연관관계의 주인으로 지정
> - <mark>연관관계의 주인만이 외래 키를 관리 (등록, 수정)</mark>
> - <mark>주인이 아닌 쪽은 읽기만 가능</mark>
> - 주인은 mappedBy(수동적) 속성 사용하지 않는다. 
> - 주인이 아니면 <mark>mappedBy 속성으로 상대 객체를 주인으로 지정</mark>



#### 누구를 주인으로 해야할까 ?
> - 외래 키가 있는 곳을 주인으로 정해라
> - 여기서는 Member.team이 연관관계의 주인
> - ManyToOne 에서 Many 쪽이 연관관계의 주인 (OneToOne에서도 와래 키 있는곳이 주인)


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-020.png) 

> Member.java

```
    @ManyToOne
    @JoinColumn(name = "TEAM_ID") //연관관계를 여기서 관리하겠다.
    private Team team;

```


> Team.java

```
    @OneToMany(mappedBy = "team") // 1:N 관계에서 상대편(Member)에 team으로 매핑이 되어있는 것 이라고 지정
    private List<Member> members = new ArrayList<>();

```

##### 만일 외래 키가 없는 테이블을 주인으로 지정할 때의 문제점 
> 만일 외래 키가 없는 객체를 주인으로 설정할 경우 값을 변경한다면<br>
 외래 키가 있는 테이블을 수정하기 때문에 내가 수정한 객체는 Team 이지만, Member의 객체 Update Sql이 나가는 황당한 경우가 있을 수 있습니다.
 
> 1:N에서 1이 연관관계의 주인일때 1을 수정하면 N의 수정이 일어나기 때문에 성능 이슈가 발생할 수 있습니다.


#### 양방향 매핑시 가장 많이 하는 실수
> (연관관계의 주인에 값을 입력하지 않음)

```
	Team team = new Team();
	team.setName("TeamA");
	em.persist(team);
	
	Member member = new Member()
	member.setName("member1");

	//역방향 (주인이 아닌 방향)만 값 세팅
	team.getMembers().add(member);	
	em.persist(member)

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-021.png) 


> JpaMain.java

```
  		     Member member = new Member();
            member.setUsername("Member1");
            em.persist(member);


            Team team = new Team();
            team.setName("TeamA");
            team.getMembers().add(member);
            em.persist(team);

            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화
            

            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-022.png) 

> Insert SQL은 2건이 나갔고, DB에서 확인해보면

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-023.png) 

> Member와 Team이 저장되었지만, MEMBER의 MEMBER_ID는 null 인것을 확인 할 수 있습니다.<br>
Team의   

```
@OneToMany(mappedBy = "team") 
private List<Member> members = new ArrayList<>();
```

> 은 가짜 매핑이기 때문에 저장, 수정은 안되고 조회만 가능 !



> JpaMain.java

````
			 Team team = new Team();
            team.setName("TeamA");
            //team.getMembers().add(member);
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            member.setTeam(team);
            em.persist(member);
            

            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화
            

            tx.commit();
````

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-024.png) 

> 연관관계의 주인인 Member에 Team 값을 넣고 저장을 하게 되면 TEAM_ID의 값에 1로 저장되는 것을 확인할 수 있습니다.

#### 그러면 연관관계의 주인에만 데이터를 넣으면 될까 ? 
> JPA 입장에서는 연관관계의 주인에만 데이터를 입력하면 되지만..


> JpaMain.java

```

            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            member.setTeam(team);
            em.persist(member);
            
            //team.getMembers().add(member); // 안넣어도 된다.

            em.flush(); // 영속성 컨텍스트 플러시
            em.clear(); // 영속성 컨텍스트 초기화

            Team findTeam = em.find(Team.class, team.getId());
            List<Member> members = findTeam.getMembers();
            for (Member m : members){
                System.out.println("m = "+ m.getUsername());
            }


            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-025.png) 

> 당연히 getMembers로 가져온 Member들에도 추가한 member가 있습니다. JPA 지연로딩의 기능인데 Team을 조회하고 Member를 한번더 조회하는것을 볼 수 있습니다.

> 실제 members를 사용하는 시점에 조회 SQL을 수행하게 됩니다.


> //team.getMembers().add(member); // 안넣어도 된다. team의 getMembers()에 새로운 member를 추가 하지 않아도 문제가 없었지만 <br>
> em.flush();과 em.clear();를 제거 한다면 

> JpaMain.java

```
   			 Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            member.setTeam(team);
            em.persist(member);
			
			 System.out.println("=========================");
            
            //team.getMembers().add(member);

            //em.flush(); // 영속성 컨텍스트 플러시
            //em.clear(); // 영속성 컨텍스트 초기화

            Team findTeam = em.find(Team.class, team.getId()); // DB 저장전 1차 캐시
            List<Member> members = findTeam.getMembers();
            for (Member m : members){
                System.out.println("m = "+ m.getUsername());
            }
			 System.out.println("=========================");


            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-026.png)

> Insert문 이후에 아까와 달리 Select 문을 수행하지 않으며, members 루프를 수행하지 않는 것을 확인 할 수 있습니다. 

> Member의 값이 DB에 저장되기 전이며, 현재 Team이 가지고 있는 members에는 추가한 member의 값이 없기 때문에 출력해도 아무 것도 나오지 않는다. 

> 이러한 문제점이 있을 수 있고, 객체 지향적으로 생각을 해보면 Team 또한 team.getMembers().add(member); 를 이용해 값을 세팅해 주는것이 맞다.

> 그리고 테스트케이스 작성중 JPA 없이도 순수하게 자바 코드 상태로도 테스트케이스를 수행하게 되는데 member.getTeam()은 되는데 team.getMembers() 할경우 null로 이상하게 동작하게 됩니다.


> JpaMain.java -- Team.getMembers()에 member 추가

```
   			 Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            member.setTeam(team);
            em.persist(member);
			
			 System.out.println("=========================");
            
            team.getMembers().add(member);

            //em.flush(); // 영속성 컨텍스트 플러시
            //em.clear(); // 영속성 컨텍스트 초기화

            Team findTeam = em.find(Team.class, team.getId()); // DB 저장전 1차 캐시
            List<Member> members = findTeam.getMembers();
            for (Member m : members){
                System.out.println("m = "+ m.getUsername());
            }
			 System.out.println("=========================");


            tx.commit();

```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-027.png) 

> members에 추가한 member가 있는것을 확인할 수 있다.

> 결론은 양쪽 객체에 값을 세팅하는 것이 맞습니다.



#### 양방향 매핑시 연관관계의 주인에 값을 입력해야 한다.
> (순수한 객체 관계를 고려하면 항상 양쪽다 값을 입력해야한다.)


```
   			 Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            
            team.getMembers().add(member); // 값 설정 **
            member.setTeam(team); // 연관관계 주인에 값 설정 ***

            em.persist(member);
```

![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-028.png) 


#### 양방향 연관관계 주의 - 실습
> 1. <mark>순수 객체 상태를 고려해서 항상 양쪽에 값을 설정하자</mark> <br>
1차 캐시에는 값이 없는 상태이므로 최악의 경우 버그가 발생할 수있습니다.

> 2. 연관관계 편의 메소드를 생성하자

> Member.java -- setTeam에서 getMemebers().add(this)를 추가

```
	...
    public void changeTeam(Team team) {
        this.team = team;
        team.getMembers().add(this); // 자기 자신(Member)를 team의 members에 추가
    }
    ...

```

> JpaMain.java  -- team.getMembers().add(member); 는 삭제

```
Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            //member.setTeam(team); // ***
            member.changeTeam(team); // ***
              
            
            em.persist(member);

            System.out.println("=========================");

            //team.getMembers().add(member); // **

            Team findTeam = em.find(Team.class, team.getId()); // DB 저장전 1차 캐시
            List<Member> members = findTeam.getMembers();
            for (Member m : members){
                System.out.println("m = "+ m.getUsername());
            }
            System.out.println("=========================");

            tx.commit();

```

> 이 연관관계 편의 메소드를 이용하면 한쪽만 세팅해도, 양쪽으로 데이터가 들어가 관리가 편하게 됩니다.

> 또 setTeam이라는 setter의 관습적인 네이밍 말고, changeTeam으로 만들어 단순히 set 하는 메소드가 아닌 다른 비지니스로직이 포함된 메소드라는 것을 명시합니다.

> chageTeam을 실제로 개발하여 사용하면 딥하게 생각해서 team안에 추가하는 member가 있는지 체크하거나 team이 null인지도 체크 해야하고 신경써야 할 부분도 있고 <br>
Member를 수정한다면, 기존의 member를 제거하고 수정한 member로 세팅하는 그런 로직도 필요합니다.

> Team에서도 연관관계 편의 메소드를 이용해 Member를 세팅할 수가 있는데, 

> Team.java

```
    public void addMember(Member member){
        member.setTeam(this);
        members.add(member);
    }
```

> JpaMain.java

```

            Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            //member.changeTeam(team); // ***
            team.addMember(member); // ***

            em.persist(member);

            System.out.println("=========================");

            //team.getMembers().add(member); // **

            Team findTeam = em.find(Team.class, team.getId()); // DB 저장전 1차 캐시
            List<Member> members = findTeam.getMembers();
            for (Member m : members){
                System.out.println("m = "+ m.getUsername());
            }
            System.out.println("=========================");

            tx.commit();

```

> 양쪽에서 편의 메소드를 이용해 값을 설정할 수 있지만 최악의 경우 무한루프에 걸릴 수도 있으니 한쪽을 정해서 한쪽에서만 사용하는게 좋습니다.


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-029.png) 

> 3. 양방향 매핑시에 무한 루프를 조심하자
> 	- 예) toString(), lombok, Json 생성 라이브러리

> Member.java -- toString() 추가  

```
    @Override
    public String toString() {
        return "Member{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", team=" + team +	// team.toString() 과 같음
                '}';
    }

```


> Team.java -- toString() 추가  

```
    @Override
    public String toString() {
        return "Team{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", members=" + members + // members의 앨리먼츠들 모두 출력함.
                '}';
    }

```

> JpaMain Team을 출력해봄 (.toString())

````
     Team team = new Team();
            team.setName("TeamA");
            em.persist(team);

            Member member = new Member();
            member.setUsername("Member1");
            //member.changeTeam(team); // ***
            team.addMember(member); // ***

            em.persist(member);

            System.out.println("=========================");

            //team.getMembers().add(member); // **

            Team findTeam = em.find(Team.class, team.getId()); // DB 저장전 1차 캐시

            //System.out.println("findTeam = "+ findTeam.toString()); //아래와 동일
            System.out.println("findTeam = "+ findTeam);

            System.out.println("=========================");

            tx.commit();
````


![contact](/images/develop/backend/orm-jpa-basic/relation-mapping/img-030.png) 

> 또한 lombok에서 자동으로 toString()을 생성하거나, Json 생성라이브러리에서 객체를 쭉 읽어오면서 무한루프에 갇히게 되면 어마 어마한 장애로 이어질 수 있습니다.
> 실제 Json 생성라이브러리는 컨트롤러에서 엔티티를 직접 리스폰스로 보내게 되면 양방향으로 연관관계가 설정되어있으면 그때 Json으로 생성시 Member를 보며 Team이 있네 하고 Team으로 가서 Member가 있네 하고 또 다시 Member로 계속 타고 들어가게 됩니다.

##### 무한루프를 최대한 피할 수 있는 방법
> - lombok에서 toString 만드는거 쓰지마라. 쓰려면 객체 레퍼런스 빼고 사용해야 한다.
> - API 컨트롤러에서는 엔티티를 바로 반환하지 마라. DTO로 변환해서 반환하여 사용해야 한다.
>	- 1. 이러한 무한루프에 빠질 수 있다.
>	- 2. 엔티티가 변경될 수 있는데 변경하게 되면 API SPEC이 변경된다. (사용하는 입장에서는 논의 없던 컬럼이 추가/삭제에 고통받을 수 있습니다.)


#### 양방향 매핑 정리 
> - <mark>단방향 매핑만으로도 이미 연관관계 매핑은 완료</mark>
> - 양방향 매핑은 반대 방향으로 조회(객체 그래프 탐색) 기능이 추가된 것 뿐
> - JPQL에서 역방향으로 탐색할 일이 많음
> - 단방향 매핑을 잘 하고 양방향은 필요할 때 추가해도 됨(테이블에 영향을 주지 않음)

> 최초 개발을 하게되면 단방향 매핑부터 설계를 끝내놓고 양방향에 대해서 작업을 해야합니다. Jpa에서 단방향 매핑만으로 객체와 테이블 매핑하는 것은 완료가 된것입니다. <br>
 객체 입장에서는 양방향 매핑을 추가하면 연관관계 편의 메소드나 생각해야 할 것이 많아집니다. 그러면 언제 양방향 매핑을 추가해야 하냐면 JPQL에서 역방향으로 탐색할 일이 많아질때 필요할 때 추가하면 됩니다. <br>

> 추후 추가를 하여도 자바 코드 추가되는 것도 많지 않으며, 제일 중요한 테이블에 변화가 없기 때문에 개발하다 진짜 필요할때 아니면 단방향으로 개발을 진행하여도 문제가 없습니다.

#### 연관관계의 주인을 정하는 기준

> - 비즈니스 로직을 기준으로 연관관계의 주인을 선택하면 안됨
> - <mark>연관관계의 주인은 외래 키의 위치를 기준으로 정해야함</mark>







#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
