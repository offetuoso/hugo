---
title: "JPA @MappedSuperclass"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-16
slug: "mapped-superclass"
description: "상속관계 매핑"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 상속관계 매핑
-------------

## 목차
-------------
> - 상속관계 매핑
> - @MappedSuperclass

## MappedSuperclass
-------------

### @MappedSuperclass

> 예를 들어 이전의 상속관계 매핑을 사용하지 않고 단순하게 객체의 입장에서 id와 name이 계속 나오게 되는데 매번 만들기 귀찮아서 부모 클래스에 두고 속성만 상속받아서 사용하고 싶을때 사용. <br>

> DB에서는 각각 테이블에 id, name을 포함하며 DB와 구조가 다르지만, 매번 추가 해야하는 속성을 엔티티마다 추가해야 하는 불편함을 줄여보자 해서 나오게 된 기능입니다. 

![contact](/images/develop/backend/orm-jpa-basic/mapped-superclass/img-001.png)

#### @MappedSuperclass 예제
> DBA의 요청으로 엔티티 마다 생성한 사람의 ID, 생성한 시간, 마지막 수정한 사람 ID, 마지막 수정한 시간을 각각 추가하려 합니다. 

```
    private String createBy;
    private LocalDateTime createDate;
    private String LastModifiedBy;
    private LocalDateTime LastModifiedDate;
```

> 개발된 모든 Entity에 위의 소스를 모두 복사/붙여넣기를 하게 되는 개발자 입장에서는 중복소스 같기도 하고 반복작업을 하게되어 마음이 불편하게 느껴질 겁니다. 이런 경우에 @MapeedSuperclass 를 사용할 수 있습니다. 

> BaseEntity.java 추가

```
package relativemapping;

import java.time.LocalDateTime;

@MappedSuperclass
public class BaseEntity {
    private String createBy;
    private LocalDateTime createDate;
    private String LastModifiedBy;
    private LocalDateTime LastModifiedDate;

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public String getLastModifiedBy() {
        return LastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        LastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastModifiedDate() {
        return LastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        LastModifiedDate = lastModifiedDate;
    }
}

```

> Member.java - extends BaseEntity 추가

```
@Entity
public class Member extends BaseEntity{
    
    public Member(){
    }
```

> Team.java - extends BaseEntity 추가

```
@Entity
public class Team extends BaseEntity{
    
    public Team(){
    }
```

> JpaMain.java

```
            Member member = new Member();
            member.setUsername("MemberA");
            member.setCreateBy("kim");
            member.setCreateDate(LocalDateTime.now());
            em.persist(member);
            em.flush();
            em.clear();

            tx.commit();
```

> console

```
    Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        LastModifiedBy varchar(255),
        LastModifiedDate timestamp,
        createBy varchar(255),
        createDate timestamp,
        USERNAME varchar(255),
        LOCKER_ID bigint,
        TEAM_ID bigint,
        primary key (MEMBER_ID)
    )
    
    Hibernate: 
    
    create table Team (
       TEAM_ID bigint not null,
        LastModifiedBy varchar(255),
        LastModifiedDate timestamp,
        createBy varchar(255),
        createDate timestamp,
        NAME varchar(255),
        primary key (TEAM_ID)
    )
    
```

##### @Column(name="변경 컬럼명")을 사용하여 일괄 컬럼명 수정

> BaseEntity.java - Column(name="변경 컬럼명") 추가

```
@MappedSuperclass
public class BaseEntity {
    @Column(name = "REG_ID")
    private String createBy;

    @Column(name = "REG_DT")
    private LocalDateTime createDate;

    @Column(name = "MOD_ID")
    private String LastModifiedBy;

    @Column(name = "MOD_DT")
    private LocalDateTime LastModifiedDate;
```

> JpaMain.java - 애플리케이션 재시작


```
	Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        MOD_ID varchar(255),
        MOD_DT timestamp,
        REG_ID varchar(255),
        REG_DT timestamp,
        USERNAME varchar(255),
        LOCKER_ID bigint,
        TEAM_ID bigint,
        primary key (MEMBER_ID)
    )
    
    Hibernate: 
    
    create table Team (
       TEAM_ID bigint not null,
        MOD_ID varchar(255),
        MOD_DT timestamp,
        REG_ID varchar(255),
        REG_DT timestamp,
        NAME varchar(255),
        primary key (TEAM_ID)
    )
```

> 이후에 Hibernate 뿐만 아니라 Jpa와 SpringData를 같이 사용하면 BaseEntity의 속성들을 어노테이션을 통해 간편하게 자동으로 현재 세션 ID와 현재 시간을 넣어줄 수 있습니다.

#### @MappedSuperclass 
> - 상속관계 매핑X
> - 엔티티X, 테이블과 매핑X
> - 부모 클래스를 상속 받는 <mark>자식 클래스에 매핑 정보만 제공</mark> 
> - 조회, 검색 불가(<mark>em.find(BaseEntity) 불가</mark>)
> - 직접 생성해서 사용할 일이 없으므로 <mark>추상 클래스 권장</mark>

> BaseEntity.java

>

```
@MappedSuperclass
public abstract class BaseEntity {

```

> - 테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑정보를 모으는 역할

> - 주로 등록일, 수정일, 등록자, 수정자 등과 같은 전체 엔티티에서 공통으로 적용하는 정보를 모을 때 사용

> - 참고 : @Entity 클래스는 엔티티나 @MappedSuperclass로 지정한 클래스만 상속 가능



#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
