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
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
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
                ", name='" + name + '\'' +
                ", members=" + members +
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

> Team 저장할때, TEAM_ID와 NANE은 저장하면 되지만, 외래 키는 TEAM이 아닌 MEMBER에 있기 때문에, 저장할 방법이 없기 때문에 MEMEBER 테이블을 업데이트 하는 수 밖에 없습니다. 업데이트 문을 한번더 실행하기에 성능상에 이슈는 아니여도 조금의 불이익은 있습니다. 

> 실무에서 이 모델을 사용하게되면 실제 Member 테이블에 저장만 했을 뿐인데 내가 수정하지 않은 테이블에 Update Sql이 찍히게 되고 혼돈에 빠지게 됩니다.

> 만약 지금처럼 Team에서 Member로 접근이 필요한 경우 다대일의 양방향 연관관계 매핑 사용을 추천드립니다.

#### 일대다 단방향 정리 
> - 일대다 단방향은 일대다(1:N)에서 <mark>일(1)이 연관관계의 주인</mark>
> - 테이블 일대다 관계는 항상 다(N) 쪽에 외래 키가 있음
> - 객체와 테이블의 차이 때문에 반대편 테이블의 외래 키를 관리하는 특이한 구조
> - @JoinColumn을 꼭 하용해야 함. 그렇지 않으면 조인 테이블 방식을 사용함(중간에 테이블을 하나 추가함)

11:07

#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
