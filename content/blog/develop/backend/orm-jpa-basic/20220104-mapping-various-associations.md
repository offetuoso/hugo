---
title: "JPA 다양한 연관관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-03
slug: "mapping-various-associations"
description: "다양한 연관관계 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---


# 다양한 연관관계 매핑
-------------

## 목차
-------------
> - 연관관계 매핑시 고려사항 3가지
> - 다대일 [N:1]
> - 일대다 [1:N]
> - 일대일 [1:1]
> - 다대다 [N:M]


## 연관관계 매핑시 고려사항 3가지
-------------
> - 다중성
> - 단방향, 양방향
> - 연관관계의 주인

### 다중성
-------------
> - 다대일 : @ManyToOne
> - 일대다 : @OneToMany
> - 일대일 : @OneToOne
> - 다대다 : @ManyToMany (실무에서 사용X)

> 애매한 경우 반대의 경우를 생각해 보면 된다. 다대일의 반대는 일대다, 일대일의 반대는 일대일, 다대다의 반대는 다대다. <br>


### 단방향, 양방향
-------------
> - 테이블 
>	- 외래 키 하나로 양쪽 조인 가능
>	- 사실 방향이라는 개념이 없음
> - 객체
>	- 참조용 필드가 있는 쪽으로 참조 가능
>	- 한쪽만 참조하면 단방향
>	- 양쪽이 서로 참조하면 양방향

#### 연관관계의 주인 
> - 테이블은 외래 키 하나로 두 테이블이 연관관계를 맺음
> - 객체 양방향 관계는 A->B, B->A 처럼 <mark>참조가 2군데</mark>
> - 객체 양방향 관계는 참조가 2군데 있음. 둘중 테이블의 외래 키를 관리할 곳을 지정해야함
> - 연관관계의 주인 : 외래 키를 관리하는 참조
> - 주인의 반대편 : 외래 키에 영향을 주지않음, 단순 조회만

## 다대일 [N:1]
-------------

### 다대일 단방향
--------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-001.png)

> Member랑 Team이 있다면 1:N중 N인 Member에 외래 키가 있어야합니다.

#### 다대일 단방향 정리
> - 가장 많이 사용하는 연관관계
> - <mark>다대일</mark>의 반대는 <mark>일대다</mark> 

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

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public void changeTeam(Team team) {
        this.team = team;
        team.getMembers().add(this);
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

> Team.java

````
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

### 다대일 양방향
--------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-002.png)

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

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public void changeTeam(Team team) {
        this.team = team;
        team.getMembers().add(this);
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

> Team.java

````
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

    public void addMember(Member member){
        member.setTeam(this);
        members.add(member);
    }

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

````

#### 다대일 양방향 정리
> - 외래 키가 있는 쪽이 연관관계의 주인
> - 양쪽을 서로 참조하도록 개발



## 일대다 [1:N]
-------------

### 일대다 단방향
-------------
> 밑밥을 깔자면 강의를 하시는 김영한님은 이 모델을 추천하지 않는다고 하며, 표준에서 제공하기 때문에 강의에 포함시켰다 하였습니다. 

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-003.png)

> 팀과 맴버가 있는데 팀을 중심으로 연관관계를 작성하겠다 하는 것입니다. 이전에 N에 연관관계의 주인을 둔다고 하였지만 반대가 되는 상황입니다. 

> 팀은 맴버를 알고 싶은테, 맴버는 팀을 알고 싶지 않을때. 개발하다 보면 언젠가는 만나 볼 수 있는 모델입니다.

> 테이블 설계를 보면 N에 무조건 외래 키를 가지게 됩니다. 생각해 보면 팀에 외래 키가 있는 순간 1:N이 아니게 됩니다.

> Team의 members가 연관관계의 주인이 된다면, Team을 수정하게되면 Member 또한 수정하게 됩니다. 

> Team.java - 연관관계의 주인을 여기에 둠

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

    @OneToMany
    @JoinColumn(name = "TEAM_ID")
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

    @Override
    public String toString() {
        return "Team{" +
                "id=" + id +
                ", name='" + name + 
                '}';
    }
}

```

> Member.java - id, name 이외 소스 정리

````
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

````

> JpaMain.java

```
      		 Member member = new Member();
            member.setUsername("member1");

            em.persist(member);

            Team team = new Team();
            team.setName("teamA");
            team.getMembers().add(member); //팀의 members에 member를 추가

            em.persist(team);

            tx.commit();
```


![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-004.png)

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-005.png)

> Team 저장할때, TEAM_ID와 NANE은 저장하면 되지만, 외래 키는 TEAM이 아닌 MEMBER에 있기 때문에, 저장할 방법이 없기 때문에 MEMEBER 테이블을 업데이트 하는 수 밖에 없습니다. 업데이트 문을 한번더 실행하기에 성능상에 이슈는 아니여도 조금의 불이익은 있습니다. 

> 실무에서 이 모델을 사용하게되면 실제 Member 테이블에 저장만 했을 뿐인데 내가 수정하지 않은 테이블에 Update Sql이 찍히게 되고 혼돈에 빠지게 됩니다.

> 만약 지금처럼 Team에서 Member로 접근이 필요한 경우 다대일의 양방향 연관관계 매핑 사용을 추천드립니다.

#### 일대다 단방향 정리 
> - 일대다 단방향은 일대다(1:N)에서 <mark>일(1)이 연관관계의 주인</mark>
> - 테이블 일대다 관계는 항상 다(N) 쪽에 외래 키가 있음
> - 객체와 테이블의 차이 때문에 반대편 테이블의 외래 키를 관리하는 특이한 구조
> - @JoinColumn을 꼭 하용해야 함. 그렇지 않으면 조인 테이블 방식을 사용함(중간에 테이블을 하나 추가함)
> - 일대다 단방향 매핑의 단점
>	- 엔티티가 관리하는 외래 키가 다른 테이블에 있음
>	- 연관관계 관리를 위해 추가로 Update sql 실행
> - 일대다 단방향 매핑보다는 <mark>다대일 양방향 매핑을 사용</mark>하자

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-006.png)


### 일대다 양방향
-------------
> - 이런 매핑은 공식적으로 없다.
> - @JoinColumn(<mark>insertable=false</mark>, <mark>updateable=false</mark>)
> - <mark>읽기 전용 필드</mark>를 사용해서 양방향 처럼 사용하는 방법
> - <mark>다대일 양방향을 사용하자</mark>

> Team.java

````
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

    @OneToMany
    @JoinColumn(name = "TEAM_ID")	// 연관관계의 주인
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

````

> Member.java

```
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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false) // 연관관계의 주인과 같지만, 인서트, 업데이트 사용안함으로 읽기전용으로 사용
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
}

```

## 일대일 [1:1]
-------------

### 일대일 관계
-------------
> - <mark>일대일</mark> 관계는 그 반대도 <mark>일대일</mark>
> - 주 테이블이나 대상 테이블 중에 외래 키 선택 가능
>	- 주 테이블에 외래 키
>	- 대상 테이블에 외래 키
> - 외래 키에 데이터베이스 유니크 제약조건 추가



### 일대일 : 주 테이블에 외래 키 단방향
-------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-007.png)

>회원은 사물함 하나를 가질 수 있고 그리고 사물함도 하나의 맴버를 가질 수 있습니다. 이런 룰을 가지고 있을 때,  Member 테이블을 주 테이블로 생각하고 연관관계의 주인을 Member로 지정.

#### 일대일 : 주 테이블에 외래 키 단방향 정리
> - 다대일(@ManyToOne) 단방향 매핑과 유사

> Member.java

```
package relativemapping;

import javax.persistence.*;
import java.util.concurrent.locks.Lock;


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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false)
    private Team team;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;

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

> Locker.java

````
package relativemapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Locker {
    @Id @GeneratedValue
    @Column(name = "LOCKER_ID")
    private Long id;
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

> JpaMain.java 은 지우고 애플리케이션을 실행한다.

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-008.png)

### 일대일 : 주 테이블에 외래 키 양방향
-------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-009.png)


> Member.java

```
package relativemapping;

import javax.persistence.*;
import java.util.concurrent.locks.Lock;


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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false)
    private Team team;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;

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

> Locker.java

````
package relativemapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Locker {
    @Id @GeneratedValue
    @Column(name = "LOCKER_ID")
    private Long id;
    private String name;

    @OneToOne(mappedBy="locker")
    private Member member;

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

#### 일대일 : 주 테이블에 외래 키 양방향 정리
> - 다대일 양방향 매핑 처럼 외래 키가 있는 곳이 연관관계의 주인
> - 반대편은 mappedBy 적용


### 일대일 : 대상 테이블에 외래 키 단방향
------------------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-010.png)

> Member 객체를 연관관계의 주인으로 두고 Locker객체를 가지고 LOCKER 테이블에 MEMBER_ID를 관리 하는 방법은 없고 지원도 안해줍니다.

#### 일대일 : 대상 테이블에 외래 키 단방향 정리
> - 단방향 관계는 JPA에서 지원안함
> - 양방향 관계는 지원

### 일대일 : 대상 테이블에 외래 키 양방향
------------------------

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-011.png)

> 주 테이블을 Member로 생각하지만, 외래 키는 대상 테이블에 있는경우. 외래 키가 있는 대상 테이블을 주 테이블로 매핑

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-009.png)

> 이것을 반대로 뒤집은 것과 같음. 1:1 관계를 정리하면 내것은 내가 관리<br>

#### 일대일 : 외래키는 어떤 객체가 가져야 할까
> 매우 민감한 주제이며 DBA와 싸울수도있음. 일대일 관계는 MEMBER에 외래 키가 있든 LOCKER에 있든 
어떠한 방법을 써도 연관관계가 유효 합니다. <br> 

> DBA이라면, DB 설계를 쉽게 바꿀 수 없기 때문에 미래를 대비해서 Locker에 외래 키를 두어 나중에 유니크 제약조건만 제거하면, 한명의 회원이 여러 개의 Locker를 가질 수 있도록 설계를 생각할 것입니다.

> 만약 반대로 MEMBER에 외래 키가 있는 경우 한명의 MEMBER가 여러 Locker를 가질 수 있도록 설계를 변경 한다면 LOCKER에 컬럼을 추가하고 코드 수정이 필요합니다 또한 MEMBER의 외래 키는 의미가 없으니 지워지게 됩니다. 

> 또 비즈니스 로직 상에 Locker에 여러명의 Member가 있을 수 있다면, Member에 외래키가 있는 상태가 맞게 됩니다.

> 여기 까지가 DBA가 비즈니스 로직에 변경 또는 미래의 변화에 대비하기 위해 이렇게 생각할 수 있다면
<br> ORM을 사용하는 개발자 입장에서는 Member에 Locker가 있는것이 성능에서나 여러가지 측면에서 장점이 있습니다. 어떠한 장점이 있냐면, 

> Member가 Locker를 가지고 있지 않으면 Null 아니면 Locker가 있는것이고 <br> 
Member를 더 많이 조회하기 때문에 Locker가 Member를 가지는 것보다 좋습니다.

> Member를 조회할때 Locker에 의해 분기 되는 로직이 있을때, 대부분 Member를 조회하여야 되기 때문에 이미 Locker를 가지고 있기 때문에 DB쿼리 하나로 Member를 가져왔을때 이미 Locker까지 조회가 됩니다.

> 이런 모든 것을 고려하여 설계를 해야합니다. 

#### 일대일 정리 
> - 주 테이블에 외래 키
>	- 주 객체가 대상 객체의 참조를 가지는 것처럼 주 테이블에 외래 키를 두고 대상 테이블을 찾음
>	- 객체지향 개발자 선호
>	- JPA 매칭 편리
> 	- 장점 : 주 테이블만 조회해도 대상 테이블에 데이터가 있는지 확인 가능
> 	- 단점 : 값이 없으면 외래 키에 null 허용

> - 대상 테이블에 외래 키
>	- 대상 테이블에 외래 키가 존재
>	- 전통적인 DBA 선호
>	- 장점 : 주 테이블과 대상 테아블을 일대일에서 다대다 관계로 변경할 때 테이블 구조 유지
> 	- 단점 : 프록시 기능의 한계로 지연 로딩으로 설정해도 항상 즉시 로딩됨 (추후 설명)

> ORM 개발자 입장에서는 주 테이블에 외래 키가 있는 것이 바람직하지만, DBA와 협의가 잘되어야 한다.

## 다대다 [N:M]
--------------------------------
> 실무에서는 쓰면 안된다고 보면 됩니다. JPA가 매핑을 지원하기 때문에 정리

### 다대다
---------------------------------
> - 괸계형 데이터베이스는 정규화된 테이블 2개로 다대다 관계룰 표현할 수 없음
> - 연결 테이블을 추가해서 일대다, 다대일 관계로 풀어내야함
> - @ManyToMany 사용
> - @JoinTable로 연결 테이블 지정
> 다대다 매핑 : 단방향, 양방향 가능

> 다대다 테이블 관계

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-012.png)

> 객체인 Member는 ProductList를 가질 수 있고 Product는 MemberList를 가질 수 있음 그렇기 때문에 딜레마가 생김.


> 객체는 컬렉션을 사용해서 객체 2개로 다대다 관계 가능

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-013.png)

> 중간에 조인 테이블을 사용하여 사용


> Product.java

```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Product {
    @Id @GeneratedValue
    private Long id;

    private  String name;

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

> Member.java

````
package relativemapping;

import javax.persistence.*;
import java.util.List;
import java.util.concurrent.locks.Lock;


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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false)
    private Team team;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;

    @ManyToMany
    @JoinTable(name="MEMBER_PRODUCT")
    private List<Product> products;

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

````

> JpaMain - 내용지우고 애플리케이션 재시작


![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-014.png)

> PRODUCT 테이블과 MEMBER_PRODUCT 테이블이 생성되는걸 확인 할 수 있습니다.

> 단방향을 양방향으로 바꾸려면, Product에 members를 추가하면 됩니다.

> Product.java

```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
public class Product {
    @Id @GeneratedValue
    private Long id;

    @ManyToMany(mappedBy = "products")
    private List<Member> members;


    private  String name;

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

#### 다대다 매핑의 한계 
> - 편리해 보이지만 실무에서 사용X
> - 연결 테이블이 단순히 연결만 하고 끝나지 않음
> - 주문시간, 수량 같은 데이터가 들어 올 수 있음

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-015.png)

> 중간 테이블 사용시 조인 쿼리도 예상치 못하게 잘못된 쿼리도 나갈 수 있음 

#### 다대다 한계 극복 
> - 연결 테이블용 엔티티 추가(연결 테이블을 엔티티로 승격)
> 비즈니스로직상 복잡하기 때문에 연결용 테이블을 쓰기는 불편함과 어려움이 있어 엔티티로 만들어 사용하는 것이 그나마 좋은 방법입니다.

> - ManyToMany -> @OneToMany, @ManyToOne 

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-016.png)

> 중간에 엔티티를 하나더 생성. 예를 들면 MemberProduct.java를 만들어 보겠습니다.

> MemberProduct.java

```
package relativemapping;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ORDERS")
public class MemberProduct {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID")
    private Product product;

    @Column(name = "ORDERAMOUNT")
    private int orderAmount;

    @Column(name = "ORDERCOUNT")
    private int orderCount;

    public Member getMember() {
        return member;
    }

    @Column(name = "ORDERDATE")
    private LocalDate orderDate;

    public void setMember(Member member) {
        this.member = member;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}

```

> @ManyToOne으로 Member와 Product를 생성합니다.

> Member.java

```
package relativemapping;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;


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

    @ManyToOne
    @JoinColumn(name= "TEAM_ID", insertable = false, updatable = false)
    private Team team;

    @OneToOne
    @JoinColumn(name = "LOCKER_ID")
    private Locker locker;

    @OneToMany(mappedBy = "member")
    private List<MemberProduct> memberProducts = new ArrayList<>();

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

> Member에서는 @OneToMany로 mappedBy = "member" 옵션을 지정한 List<MemberProduct> memberProducts 를 추가 합니다.

> Product.java

```
package relativemapping;

import javax.persistence.*;
import java.util.List;

@Entity
public class Product {
    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "product")
    private List<MemberProduct> memberProducts;


    private  String name;

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

> Product에도 @OneToMany로 mappedBy = "member" 옵션을 지정한 List<MemberProduct> memberProducts 를 추가 합니다.

> JpaMember.java - 애플리케이션을 재시작 해봅니다.

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-017.png)

![contact](/images/develop/backend/orm-jpa-basic/mapping-various-associations/img-018.png)


#### N:M 관계는 1:N, N:1로
> - 테이블의 N:M 관계는 중간 테이블을 이용해서 1:N, N:1
> - 실전에서는 중간 테이블이 단순하지 않다.
> - @ManyToMany는 제약 : 필드 추가X, 엔티티 테이블 불일치
> - 실전에서는 @ManyToMany 사용X

#### @JoinColumn
> 외래 키를 매핑할 때 사용

속성		|			설명		|	기본값
-------+--------------------+------------
name	|	매핑할 외래 키 이름	|	필드명 + _ + 참조하는 테이블의 기본 키 컬럼명
referencedColumnName	|	외래 키가 참조하는 대상 테이블의 컬럼명	|	참조하는 테이블의 기본 키 컬럼명
foreignKey(DDL)	|	외래 키 제약조건을 직접 지정할 수 있다.<br> 이 속성은 테이블을 생성할 때만 사용한다.	|	
unique<br>nullable<br>insertable<br>updatable<br>columnDefinition<br>table	|	@Column의 속성과 같다	|	


#### @ManyToOne - 주요속성
> 다대일 관계 매핑  <br>
> (다대일은 연관관계의 주인 mappedBy 가 없다.) <br>
> (억지라도 연관관계의 주인이 아니게 사용하려면, insertable=false, updatable=false) 

속성		|			설명		|	기본값
-------+--------------------+------------
optional	|	false로 설정하면 연관된 엔티티가 항상 있어야 한다.	|	true
fetch	|	글로벌 페치 전략을 설정한다.	|	@ManyToOne=FetchType.EAGER <br> @ManyToOne=FetchType.EAGER <br> OneToMany=FetchType.LAZY
cascade | 영속성 전이 기능을 사용한다. | 
targetEntity | 연관된 엔티티의 타입 정보를 설정한다. <br> 이 기능은 거의 사용하지 않는다. <br> 컬렉션을 사용해도 제네릭으로 타입 정보를 알 수 있다. | 



#### @OneToMany - 주요속성
> 일대다 관계 매핑

속성		|			설명		|	기본값
-------+--------------------+------------
mappedBy	|	연관관계의 주인 필드를 선택한다.	|	
fetch	|	글로벌 페치 전략을 설정한다.	|	@ManyToOne=FetchType.EAGER <br> @ManyToOne=FetchType.EAGER <br> OneToMany=FetchType.LAZY
cascade | 영속성 전이 기능을 사용한다. | 
targetEntity | 연관된 엔티티의 타입 정보를 설정한다. <br> 이 기능은 거의 사용하지 않는다. <br> 컬렉션을 사용해도 제네릭으로 타입 정보를 알 수 있다. | 




#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
