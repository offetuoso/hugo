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
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
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
  FROM Team t JOIN FETCH t.members m
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

> SQL과 같은 결과로 리턴해 주며 예를 들어 팀A와 회원1, 회원 2의 데이터를 2개의 로우로 주는 것을 어떤 사용자는 1줄만 원할 수 있고 2줄을 모두 원할 수 있기 때문에 이러한 결정은 사용자에게 넘기게 됩니다. 뒤에서 팀A가 2줄이 나오는 것을 한줄로 합쳐 결과를 설정을 통해 만들 수도 있습니다.

## 페치 조인과 DISTINCT
--------------------------
> - SQL의 DISTINCT는 중복된 결과를 제거하는 명령
> - JPQL의 DISTINCT 2가지 기능 제공
>	1. SQL에 DISTINCT를 추가
>	2. 애플리케이션에서 엔티티 중복제거


### Team 조회와 Team t JOIN t.members m 비교 
----------------------

> 더 보기 쉬운 테스트를 위해 팀C 추가는 주석해 두겠습니다. 

> 그리고 DISTINCT 테스트 이전에 "SELECT t FROM Team t"와 "SELECT t FROM Team t JOIN FETCH t.members m"의 차이를 보며 결과의 차이를 먼저 확인 해보겠습니다.

> JpqlMain.java - "SELECT t FROM Team t"

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT t FROM Team t JOIN FETCH t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            /*
            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }
            */

            tx.commit();

```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t */ select
            team0_.id as id1_3_,
            team0_.name as name2_3_ 
        from
            Team team0_
            
resultCnt = 2

/** H2 Console
ID  	| NAME
-----+------  
1	| 팀A
2	| 팀B
**/

```

> Team만 조회 했기 때문에 2건이 나옵니다.

> JpqlMain.java - "SELECT t FROM Team t"

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT t FROM Team t JOIN FETCH t.members m"; // ***  JOIN FETCH t.members m 추가

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            /*
            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }
            */

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t 
    JOIN
        FETCH t.members m */ select
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
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID

resultCnt = 3

/** H2 Console
ID	| NAME	| AGE	| TEAM_ID		| TYPE		| USERNAME
-----+--------+--------+-------------+-------------+----------
1	| 팀A		| 31		| 1			| USER		| 회원1
1	| 팀A		| 32		| 1			| USER		| 회원2
2	| 팀B		| 33		| 2			| USER		| 회원3
**/

```

> Team과 Member의 Inner Join 으로 인해 Team의 데이터가 Team * Member 된 것을 확인 할 수 있습니다.


### SQL의 DISTINCT 추가
---------------------------
```
SELECT DISTINCT t FROM 
  Team t JOIN t.members
```

> SQL에 DISTINCT를 추가 하지만 데이터가 다르므로 SQL 결과에서 중복제거 실패

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-005.png)

> JpqlMain.java - Sql DISTINCT

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT DISTINCT t FROM Team t JOIN FETCH t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            /*
            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }
            */

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        DISTINCT t 
    FROM
        Team t 
    JOIN
        FETCH t.members m */ select
            distinct team0_.id as id1_3_0_,
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
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID
                
/** H2 Console
ID	TEAM_ID  	NAME  	AGE	TYPE		USERNAME
1	3		팀A		31	USER		회원1
1	4		팀A		32	USER		회원2
2	5		팀B		33	USER		회원3
**/                
                
```

> 1, 2 번 로우는 Team의 데이터 ID와 Name은 같지만, Member의 데이터 ID, USERNAME까지 같지 않기 때문에 중복제거되지 않습니다.

> SQL에서는 완전히 데이터가 똑같아야 DISTINCT 됩니다.

### 애플리케이션에서 엔티티 중복제거
----------------------------------
> - DISTINCT가 추가로 애플리케이션에서 중복 제거시도
> - 같은 식별자를 가진 <mark>Team 엔티티 제거</mark>
>	(애플리케이션에서 컬렉션을 퍼올릴때)

![contact](/images/develop/backend/orm-jpa-basic/fetch-join/img-006.png)

> 팀A가 같은 엔티티를 보면 중복이 제거된 결과 리스트를 반환해 줍니다.

> [DISTINCT 추가시 결과] <br>
> teamname = 팀A, Team@0x100
>	-> username = 회원1, member = Member@0x200
>	-> username = 회원2, member = Member@0x300

> JpqlMain.java - 결과 For 문으로 출력

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT DISTINCT t FROM Team t JOIN FETCH t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Team team : resultList){ // ** 주석 제거
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }

            tx.commit();
```

> console

```
Hibernate: 
    /* SELECT
        DISTINCT t 
    FROM
        Team t 
    JOIN
        FETCH t.members m */ select
            distinct team0_.id as id1_3_0_,
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
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID

resultCnt = 2

Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]
Team = 팀B, members [Member{id=5, username='회원3', age=33}]

```

> 실제 수행된 쿼리를 H2 console 에서 실행해 보면 3건이 나온다 하지만, 결과 리스트의 갯수는 2건이 나오며, 조회 결과를 출력시 처음 우리가 원했던 결과인 팀A가 Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}] 로 1건만 나온다.

```
            String sQuery = "SELECT DISTINCT t FROM Team t JOIN FETCH t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();
```

> Jpql에서 DISTINCT를 사용하면 결과를 컬렉션에 담을때 JPA에서 한번더 중복을 제거해 줍니다.

> 애플리케이션에서 올라올때, 이 컬렉션에 담기는 데이터가 중복이니까 JPA가 한번더 걸러준겁니다. 


## 페치 조인과 일반 조인의 차이
-------------------------------

### 일반 조인
--------------------------------

> - 일반 조인 실행시 <mark>연관된 엔티티를 함께 조회하지 않음</mark>

>  [JPQL]

```
SELECT t
  FROM Team t JOIN t.members m
 WHERE t.name = '팀A'
```
<br>

>  [SQL]

```
SELECT T.*
  FROM Team T 
  INNER JOIN F Member M ON T.ID = M.TEAM_ID
 WHERE T.name = '팀A'
```

> DISTINCT는 테스트를 해보았으니 제거 하고 일반 조인을 하였을때, 생성되는 쿼리를 자세히 살펴보겠습니다.

> JpqlMain.java

```
	...
	
            String sQuery = "SELECT  t FROM Team t JOIN t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }


	...
```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t 
    JOIN
        t.members m */ select
            team0_.id as id1_3_,
            team0_.name as name2_3_ 
        from
            Team team0_ 
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID
                
resultCnt = 3

Hibernate: 
    select
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.id as id1_0_0_,
        members0_.id as id1_0_1_,
        members0_.age as age2_0_1_,
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.type as type3_0_1_,
        members0_.username as username4_0_1_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?
        
Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]
Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]

Hibernate: 
    select
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.id as id1_0_0_,
        members0_.id as id1_0_1_,
        members0_.age as age2_0_1_,
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.type as type3_0_1_,
        members0_.username as username4_0_1_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?
        
Team = 팀B, members [Member{id=5, username='회원3', age=33}]
```

> inner join이 정상적으로 적용된것을 확인 할 수 있습니다. <br> 
> 프로젝션에 team0_.id as id1_3_, team0_.name as name2_3_ Team의 컬럼만 가져온 것을 확인 할 수 있습니다.

> <mark>일반 Join문</mark>은 SQL에서 Join만 실행 되는 것이지 데이터를 퍼올리는 것은 <mark>Team에 관한 것만</mark> 가져오게 됩니다.

> 그런데 문제는 Roof를 돌릴때 아직 Members가 초기화가 안되어있습니다. 

> 그렇기 때문에 Roof를 돌면서 team.getMembers()를 호출하게 되면, 지연로딩을 통해 조회된 Team의 엔티티 만큼 Member를 조회하는 쿼리가 발생하게 됩니다.

### 페치 조인
--------------------- 
> - 페치 조인은 연관된 엔티티를 함께 조회함

>  [JPQL]

```
SELECT t
  FROM Team t JOIN FETCH t.members m
 WHERE t.name = '팀A'
```
<br>

>  [SQL]

```
SELECT T.*, M.*
  FROM Team T 
  INNER JOIN F Member M ON T.ID = M.TEAM_ID
 WHERE T.name = '팀A'
```


> 위와 같은 문제가 발생할때 FETCH 만 추가해 보면

```
	...

            String sQuery = "SELECT  t FROM Team t JOIN FETCH t.members m"; //** FETCH 추가

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }
	...
```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t 
    JOIN
        FETCH t.members m */ select
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
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID
                
resultCnt = 3

Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]
Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]
Team = 팀B, members [Member{id=5, username='회원3', age=33}]
```

> 이게 일반 조인과 페치조인의 차이입니다. 

> 페치 조인을 이용해 1+N의 문제를 모두 해결한다고 보면 됩니다.

#### 일반 조인과 페치 조인 정리
> - JPQL은 결과를 반환할 때 연관관계 고려X
> - 단지 SELECT 절에 지정한 엔티티만 조회할 뿐
> - 여기서는 팀 엔티티만 조회하고, 회원 엔티티는 조회하지 안습니다.
> - 페치 조인을 사용할 때만 연관된 엔티티도 함께 <mark>조회(즉시 로딩)</mark>
> - <mark>페치 조인은 객체 그래프를 SQL 한번에 조회하는 개념</mark>

## 페치 조인의 특징과 한계 - 1
---------------------
> - <mark>페치 조인 대상에는 별칭을 줄 수 없다.(별칭 사용하지 않는게 관례)</mark>
>	- 하이버네이트는 가능, 가급적 사용X
> - <mark>둘 이상의 컬렉션은 페치 조인 할 수 없다.</mark>
> - <mark>컬렉션을 페치 조인하면 페이징 API(setFirstResult, setMaxResults)를 사용할 수 없다.</mark>
>	- 일대일, 다대일 같은 단일 값 연관 필드들은 페치 조인해도 페이징 가능
>	- 하이버네이트는 경고 로그를 남기고 메모리에서 페이징(매우 위험)


### 페치 조인 대상에는 별칭을 줄 수 없다.
---------------------------------------
> 별칭 사용하지 않는게 관례

> 페치 조인은 엔티티와 연관된 모든 엔티티를 조회하는 것이기 때문에 성능을 위해 별칭을 통해 (ex: tt.name = 'A') 조건을 걸거나 하면 안됩니다. 그렇게 사용하고 싶다면 페치 조인이 아닌 일반 조인과 프로젝션에서 조회할 컬럼을 지정해서 사용해야합니다.

> 만일 Members에서 특정한 member만 필터로 조회해 가져오고 싶다면  Team과 Member의 Fetch 조인이 아닌, Member에서 조회하는 방식으로 해결해야 합니다.

> JPA에서 객체 그래프 탐색의 컨셉은 연관된 엔티티의 모든 데이터 조회입니다. 그렇기 때문에 컬렉션을 필터링해 가져 오는 것은 잘못된 사용입니다.

> 만일 된다고 하여도, CASCADE와 같은 설정이 이것 저것 되어있다면 필터링 된 컬렉션의 데이터 조작시 필터에서 제외된 데이터들이 삭제가 된다던가 그런 문제를 낳을 수도 있을 것입니다.

> 또 같은 엔티티의 컬렉션을 한곳에서는 전체 조회하고, 한쪽에서는 필터를 통해 10개만 가져왔을때, 영속성 컨텍스트 입장에서는 같은 엔티티의 컬렉션의 데이터가 다르기에 애매한 입장이 될 것입니다.

> 예외로 사용하게 되는 때는 A 와 B의 Fetch 조인 B와 C의 fetch 조인 이런식으로 사용할 때도 있다고 하지만, 정합성 이슈 때문에 거의 사용하지 않는다고 합니다.

### 둘 이상의 컬렉션은 페치 조인 할 수 없다.
---------------------
> 만약에 Team에 Members 외에 OfficeSupplies(비품들)이라는 컬렉션이 1:N으로 가지고 있다면 1:N:M의 관계로 <br>
> Team * Members * OfficeSupplies 데이터가 늘어날 수도 있습니다. 이런경우 데이터 정확성에 이슈가 있다고 합니다.
 
### 컬렉션을 페치 조인하면 페이징 API 를 사용할 수 없다.
---------------------
> setFirstResult, setMaxResults

> 일대일, 다대일 같은 단일 값 연관 필드들은 페치 조인해도 페이징이 가능합니다. 왜냐하면 데이터 뻥튀기(조인으로 인한 1*N)가 발생하지 않기 때문입니다.



#### 일대다 관계에서 페치 조인 시 페이징 문제
---------------------
> 페이징이라는 기능은 DB입장에서 ROW를 줄이는 방법입니다. 

> Member와 Team의 조인을 통해 2건이 나왔을때 '팀A'의 데이터의 위치 로우가 10('회원1 데이터')과 11('회원2 데이터')이라고 가정해 보겠습니다. 

> 페이징을 통해 1페이지를 가져올 경우 결과로 '팀A'의 .getMembers() 를 했을경우 조회 결과의 데이터에서는 '회원1'의 데이터만 존재하기 때문에 '팀A'에 속한 회원이 1명만 조회되는 잘못된 결과가 발생하게 됩니다. 

> JPA가 객체 그래프를 생성하는 것은 조회된 데이터 기반이기 때문에 회원2가 page 2에 있는것을 모르기 때문에 컬렉션에 데이터가 잘못 나옵니다.


#### 하이버네이트는 경고 로그를 남기고 메모리에서 페이징(매우 위험)
---------------------
> 버전에 따라 다르겠지만 한번 테스트 해보겠습니다.

> JpqlMain.java

````
 String sQuery = "SELECT  t FROM Team t JOIN fetch t.members m";

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .setFirstResult(0)
                    .setMaxResults(1)
                    .getResultList();
````

> console

```
//** 경고 발생
WARN: HHH000104: firstResult/maxResults specified with collection fetch; applying in memory! 

Hibernate: 
    /* SELECT
        t 
    FROM
        Team t 
    JOIN
        fetch t.members m */ select
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
        inner join
            Member members1_ 
                on team0_.id=members1_.TEAM_ID   
        
        // ** 페이징 관련 쿼리 없음 
                
resultCnt = 1

Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]
```

> WARN: HHH000104: firstResult/maxResults specified with collection fetch; applying in memory! 

> 위 경고의 의미는 데이터들을 메모리로 퍼올려서 메모리에서 paging 을 적용한다는 뜻으로 데이터가 100만건이라면 100만건 모두 메모리에서 paging을 처리하다가 시스템에 장애가 발생할 수 있습니다.

> JPA에서 객체 그래프의 개념은 연관된 모든 데이터를 보여주는 것이기 때문에 전체 데이터를 가져온 후에 경고를 남기고 메모리 상에서 페이징을 처리하게 됩니다. 매우 위험

### 1:N 페치 조인 페이징 사용 제한 해결책
-----------------

#### 1. 쿼리의 대상을 뒤집어 1:N 쿼리를 N:1 쿼리로 만들어 사용

> 다른 방식으로 해결을 할 수 있는데, 1:N의 관계에서 문제가 되지만 반대로 N:1로 반대로 쿼리를 사용하면 해결할 수 있습니다. 

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT  m FROM Member m JOIN fetch m.team t";

            List<Member> resultList = em.createQuery(sQuery, Member.class)
                    .setFirstResult(0)
                    .setMaxResults(1)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Member member : resultList){
                System.out.println("Team = " + member.getTeam().getName()+", members "+member.getTeam().getMembers());
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
    JOIN
        fetch m.team t */ select
            member0_.id as id1_0_0_,
            team1_.id as id1_3_1_,
            member0_.age as age2_0_0_,
            member0_.TEAM_ID as team_id5_0_0_,
            member0_.type as type3_0_0_,
            member0_.username as username4_0_0_,
            team1_.name as name2_3_1_ 
        from
            Member member0_ 
        inner join
            Team team1_ 
                on member0_.TEAM_ID=team1_.id limit ?
resultCnt = 1

Hibernate: 
    select
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.id as id1_0_0_,
        members0_.id as id1_0_1_,
        members0_.age as age2_0_1_,
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.type as type3_0_1_,
        members0_.username as username4_0_1_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?

Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]

```

#### 2. Fetch를 제거하고, n+1을 @BatchSize로 해결
----------------------------------
> 아까도 테스트 해서 보았지만, "SELECT  t FROM Team t" Team만 조회한 후 Roof에서 Members를 호출하게 되면 지연로딩이 발생하며 N+1 문제가 발생합니다. 이러한 문제를 @BatchSize를 사용하여 해결 할 수 있습니다.

> 1. Fetch Join 제거, paging은 그대로 사용

> JpqlMain.java - Fetch Join 제거 

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            /*
            // DISTINCT 를 통해 테스트의 편의를 위해 주석
            Team team3 = new Team();
            team3.setName("팀C");
            em.persist(team3);
            */

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

            String sQuery = "SELECT  t FROM Team t"; // Fetch 조인 제거

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .setFirstResult(0)
                    .setMaxResults(2)
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }

            tx.commit();

```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t */ select
            team0_.id as id1_3_,
            team0_.name as name2_3_ 
        from
            Team team0_ limit ?
            
resultCnt = 2

Hibernate: 
    select
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.id as id1_0_0_,
        members0_.id as id1_0_1_,
        members0_.age as age2_0_1_,
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.type as type3_0_1_,
        members0_.username as username4_0_1_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?
        
Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]

Hibernate: 
    select
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.id as id1_0_0_,
        members0_.id as id1_0_1_,
        members0_.age as age2_0_1_,
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.type as type3_0_1_,
        members0_.username as username4_0_1_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?
        
Team = 팀B, members [Member{id=5, username='회원3', age=33}]

```

> 결과를 확인해 보면, Team을 조회한 Select 문 1개, 조회된 Team을 Roof를 통해 getMembers() 를 했기 때문에 지연 로딩이 발생하며, Roof로 도는 Team의 수만큼 Select 문이 발생합니다. 


> 2. @BatchSize 적용

> 하이버네이트가 제공하는 org.hibernate.annotations.BatchSize 어노테이션을 이용하면 연관된 엔티티를 조회할 때 지정된 size 만큼 SQL의 IN절을 사용해서 조회합니다.

> 만약 지정한 사이즈가 100이고, 150개의 데이터를 조회한다면 IN 절에 100개를 넣어 쿼리를 날리고, 나머지 IN절에 50개 를 넣은 쿼리를 실행하게 됩니다.

> Team.java - @BatchSize 적용

```
    ...
    @OneToMany(mappedBy = "team")
    @BatchSize(size = 100) // ** 1000 이하의 숫자에서 적절히 사용 
    private List<Member> members = new ArrayList<>();
    ...
```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t */ select
            team0_.id as id1_3_,
            team0_.name as name2_3_ 
        from
            Team team0_ limit ?

resultCnt = 2

Hibernate: 
    /* load one-to-many jpql.domain.Team.members */ select
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.id as id1_0_1_,
        members0_.id as id1_0_0_,
        members0_.age as age2_0_0_,
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.type as type3_0_0_,
        members0_.username as username4_0_0_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID in (
            ?, ?
        )

Team = 팀A, members [Member{id=3, username='회원1', age=31}, Member{id=4, username='회원2', age=32}]

Team = 팀B, members [Member{id=5, username='회원3', age=33}]

```

> N+1의 쿼리 실행에서 IN 절을 사용하여 1+1로 변경 된것을 확인 할 수 있습니다.

##### @BatchSize의 설정 사이즈 초과
---------------------

> JpqlMain.java

```
            Team team1 = new Team();
            team1.setName("팀A");
            em.persist(team1);

            Team team2 = new Team();
            team2.setName("팀B");
            em.persist(team2);

            Team team3 = new Team(); // ** 팀C 생성
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

            Member member4 = new Member();  // ** 회원4 생성
            member4.setUsername("회원4");
            member4.setAge(34);
            member4.changeTeam(team3);      // ** 회원4 팀C로 변경
            member4.setType(MemberType.USER);
            em.persist(member4);

            em.flush();
            em.clear();

            String sQuery = "SELECT  t FROM Team t"; // Fetch 조인 제거

            List<Team> resultList = em.createQuery(sQuery, Team.class)
                    .setFirstResult(0)
                    .setMaxResults(3)		// ** 페이징 MaxResults 3으로 하여 결과 3건 
                    .getResultList();

            System.out.println("resultCnt = " + resultList.size());

            for(Team team : resultList){
                System.out.println("Team = " + team.getName()+", members "+team.getMembers());
            }

            tx.commit();
```

> Team.java - @BatchSize(size = 2)

```
    @OneToMany(mappedBy = "team")
    @BatchSize(size = 2) // ** 배치사이즈 2로 수정
    private List<Member> members = new ArrayList<>();
```

> console

```
Hibernate: 
    /* SELECT
        t 
    FROM
        Team t */ select
            team0_.id as id1_3_,
            team0_.name as name2_3_ 
        from
            Team team0_ limit ?
            
resultCnt = 3

Hibernate: 
    /* load one-to-many jpql.domain.Team.members */ select
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.id as id1_0_1_,
        members0_.id as id1_0_0_,
        members0_.age as age2_0_0_,
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.type as type3_0_0_,
        members0_.username as username4_0_0_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID in (
            ?, ?
        )
        
Team = 팀A, members [Member{id=4, username='회원1', age=31}, Member{id=5, username='회원2', age=32}]
Team = 팀B, members [Member{id=6, username='회원3', age=33}]

Hibernate: 
    /* load one-to-many jpql.domain.Team.members */ select
        members0_.TEAM_ID as team_id5_0_1_,
        members0_.id as id1_0_1_,
        members0_.id as id1_0_0_,
        members0_.age as age2_0_0_,
        members0_.TEAM_ID as team_id5_0_0_,
        members0_.type as type3_0_0_,
        members0_.username as username4_0_0_ 
    from
        Member members0_ 
    where
        members0_.TEAM_ID=?
        
Team = 팀C, members [Member{id=7, username='회원4', age=34}]
```

> @BatchSize의 설정된 size가 2이기 때문에 Team을 조회한 Select 문 1개와 <br>
> 팀A의 TEAM_ID, 팀B의 TEAM_ID를 IN 절을 이용한 Member Select 쿼리 1개 <br>
> 팀C의 TEAM_ID을 이용한 Member Select 쿼리 1개, 총 3개의 쿼리가 실행된 것을 볼 수 있습니다. 


## 페치 조인의 특징과 한계 - 2
---------------------

> - 연관된 엔티티들을 SQL 한 번으로 조회 - 성능 최적화
> - 엔티티에직접 적용하는 글로벌 로딩 전략보다 우선함
>	- @OneToMany(fetch = FetchType.LAZY) // 글로벌 로딩 전략
> - 실무에서 글로벌 로딩 전략은 모두 지연 로딩
> - 최적화가 필요한 곳은 페치 조인 적용
>	- N+1이 발생하는 곳은 Fetch 조인
>	- N+1이 발생하며, 페이징이 필요하다 @BatchSize 설정

## 페치 조인 - 정리 
> - 모든 것을 페치 조인으로 해결할 수 는 없음
> - 페치 조인은 객체 그래프를 유지할 때 사용하면 효과적
> - 여러 테이블을 조인해서 엔티티가 가진 모양이 아닌 전혀 다른 결과를 내야하면, 페치 조인 보다는 일반 조인을 사용하고 필요한 데이터들만 조회해서 DTO로 반환하는 것이 효과적

#### 페치 조인 이후 데이터를 담아 반환하는 방법 3가지 

> 1. 엔티티를 페치조인 해서 엔티티를 그대로 사용
> 2. 페치 조인을 하여 조회 하고 애플리케이션에서 DTO로 변환해 사용
> 3. 처음부터 JPQL에서 New 생성자를 통해서 DTO를 지정해서 DTO로 반환해서 사용 



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
