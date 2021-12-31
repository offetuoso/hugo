---
title: "[자바 ORM 표준 JPA] 연관관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-29
slug: "relation-mapping"
description: "연관관계 매핑"	
keywords: ["ORM"]
draft: true
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

#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
