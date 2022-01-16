---
title: "JPA 상속관계 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-01-13
slug: "inheritance-mapping"
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

## 상속관계 매핑
-------------
> - 객체는 상속관계가 있지만, 관계형 데이터베이스에는 상속 관계 없음
> - 슈퍼타입 서브타입 관계라는 모델링 기법이 객체 상속과 유사
> - 상속관계 매핑 : 객체의 상속과 구조와 DB의 슈퍼타입 관계를 매핑

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-001.png)

> 음반, 영화, 책의 공통 속성은 물품에 두고, 각각의 속성들을 밑의 서브 타입에 지정하여 논리 모델을 구성합니다.

> 객체는 Item이라는 추상 클래스를 만들고 Item을 상속받는 Album, Movie, Book 객체를 구성할 수 있습니다.

### 슈퍼타입 서브타입 논리 모델을 실제 물리 모델로 구현하는 방법

> 1. 각각 테이블로 변환 -> 조인전략
> 2. 통합 테이블로 변환 -> 단일 테이블 전략
> 3. 서브타입 테이블로 변환 -> 구현 클래스마다 테이블 전략


### 1. 조인전략 

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-002.png)

> ITEM, ALBUM, MOVIE, BOOK 테이블을 만들고, JOIN으로 이를 구성. <BR>
ALBUM의 데이터를 추가하면, ITEM에 이름, 가격을 넣고 ALBUM에는 아티스트 같은 데이터는 ALBUM에 넣습니다. <BR>
ITEM과 ALBUM 두번의 인서트와 조회는 ITEM_ID로 조인을 해서 가져옴 <BR>
어떤 타입의 서브타입 테이블을 사용하는지(어떤 데이터 인지) 구분하기 위해서 구분 컬럼을(DTYPE) 추가



### 2. 단일(통합) 테이블 전략
> JPA Default
![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-003.png)


### 3. 구현 클래스 마다 테이블 전략

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-004.png)

> ITEM의 속성들을 각각 가진 ALBUM, MOVIE, BOOK 생성

> 하나의 테이블 ITEM에 속성들을 모두 모아놓고 PK와 DTYPE로 구분하여 하용하는 방식

> <mark>객체 입장에서는 상속 관계를 지원하기 때문에 어떤것을 사용해도 똑같으며, JPA에서는 모두 매핑 가능합니다.</mark>

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-005.png)

### 주요 어노테이션
-------------------------------
> - @Inhritance(strategy=InheritanceType.XXX)
>	1. SINGLE_TABLE : 단일 테이블 전략
>	2. JOINED : 조인전략
>	3. TABLE_PER_CLASS : 구현 클래스 마다 테이블 전략
> - @DiscriminatorColumn(name="DTYPE")
> - @DiscriminaterValue("XXX")


#### 상속관계 구현

> Item.java


```
package relativemapping;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Item {

    @Id @GeneratedValue
    private Long id;

    private String name;

    private int price;

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
}

```


> Album.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Album extends Item{

    private String artist;

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }
}


```


> Movie.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;

@Entity
public class Movie extends Item{
    private String director;
    private String actor;

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }
}

```


> Book.java - extends Item

```
package relativemapping;

import javax.persistence.Entity;

@Entity
public class Book extends Item{
    private String author;
    private String isbn;

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
}

```

> JpaMain.java 애플리케이션 재시작

```
Hibernate: 
    
    drop table if exists Item CASCADE 
Hibernate: 
    
    drop table if exists Locker CASCADE 
Hibernate: 
    
    drop table if exists Member CASCADE 
Hibernate: 
    
    drop table if exists ORDERS CASCADE 
Hibernate: 
    
    drop table if exists Product CASCADE 
Hibernate: 
    
    drop table if exists Team CASCADE 
Hibernate: 
    
    drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        author varchar(255),
        isbn varchar(255),
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Locker (
       LOCKER_ID bigint not null,
        name varchar(255),
        primary key (LOCKER_ID)
    )
Hibernate: 
    
    create table Member (
       MEMBER_ID bigint not null,
        USERNAME varchar(255),
        LOCKER_ID bigint,
        TEAM_ID bigint,
        primary key (MEMBER_ID)
    )
Hibernate: 
    
    create table ORDERS (
       id bigint not null,
        ORDERAMOUNT integer,
        ORDERCOUNT integer,
        ORDERDATE date,
        MEMBER_ID bigint,
        PRODUCT_ID bigint,
        primary key (id)
    )
Hibernate: 
    
    create table Product (
       id bigint not null,
        name varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Team (
       TEAM_ID bigint not null,
        NAME varchar(255),
        primary key (TEAM_ID)
    )
Hibernate: 
    
    alter table Member 
       add constraint FK332130jlg9s5hyeuk7gfgi052 
       foreign key (LOCKER_ID) 
       references Locker

Hibernate: 
    
    alter table Member 
       add constraint FKl7wsny760hjy6x19kqnduasbm 
       foreign key (TEAM_ID) 
       references Team
Hibernate: 
    
    alter table ORDERS 
       add constraint FKh0db7kqr88ed8hqtcqw3jkcia 
       foreign key (MEMBER_ID) 
       references Member
Hibernate: 
    
    alter table ORDERS 
       add constraint FKtlx3qxs8vwir2b80i3oumx2qm 
       foreign key (PRODUCT_ID) 
       references Product

Process finished with exit code 0

```

> 따로 설정을 하지 않으니 단일(통합) 테이블 전략을 사용하여, ITEM 하나의 테이블에 모든 속성들이 생성되는것을 확인할 수 있습니다.

#### 1. 조인전략 - 예제
> 부모 클래스(Item.java)에서 <br>
> @Inheritance(strategy = InheritanceType.JOINED) 추가

```
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Item {
```

> JpaMain.java 애플리케이션 재시작


> console

````
Hibernate: 
    
    create table Album (
       artist varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    create table Book (
       author varchar(255),
        isbn varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    create table Movie (
       actor varchar(255),
        director varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    create table Item (
       id bigint not null,
        name varchar(255),
        price integer not null,
        primary key (id)
    )
````

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-006.png)


##### 조인전략 - Insert

> JpaMain.java - Movie 객체 생성

```
    Movie movie = new Movie();
            movie.setDirector("감독A");
            movie.setActor("베우A");
            movie.setName("영화A");
            movie.setPrice(50000);

            em.persist(movie);

            tx.commit();
```

> console

````
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Item
            (name, price, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Movie
            (actor, director, id) 
        values
            (?, ?, ?)
````

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-007.png)

##### 조인전략 - Select

> JpaMain.java - Movie 객체 생성 후 flush()와 clear() 후 조회 추가 

```
			 Movie movie = new Movie();
            movie.setDirector("감독A");
            movie.setActor("베우A");
            movie.setName("영화A");
            movie.setPrice(50000);

            em.persist(movie);

            em.flush();
            em.clear();

            Movie findMovie =  em.find(Movie.class, movie.getId());

            System.out.println(findMovie);

            tx.commit();
```

> console

```
Hibernate: 
    select
        movie0_.id as id1_2_0_,
        movie0_1_.name as name2_2_0_,
        movie0_1_.price as price3_2_0_,
        movie0_.actor as actor1_5_0_,
        movie0_.director as director2_5_0_ 
    from
        Movie movie0_ 
    inner join
        Item movie0_1_ 
            on movie0_.id=movie0_1_.id 
    where
        movie0_.id=?
```

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-008.png)


#### 부모 클래스에서 하위 클래스를 구분
> 실제로 부모 테이블만 조회 하였을때, 어떤 자식의 테이블과 조인을 해야 하는지 알 수 없는 경우 <br>자식 테이블들을 각각 조회해 봐야 하는 불편함이 있습니다. 이러한 문제에 도움을 주고자 <br>JPA에서는 Discriminator 라는 어노테이션들을 지원하여 어떤 하위 테이블의 데이터인지 구분해 줍니다.

> dtype을 추가하고자 한다면 부모 클래스(Item.java)에서 <br> 
@DiscriminatorColumn를 추가

```
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
public class Item {
```

> JpaMain.java 애플리케이션 재시작

> console 

```
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Item
            (name, price, DTYPE, id) 
        values
            (?, ?, 'Movie', ?)
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Movie
            (actor, director, id) 
        values
            (?, ?, ?)
```

> DTYPE 가 추가된 것을 확인할 수 있습니다.

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-009.png)

> DTYPE가 Movie로 저장된것이 보이는데, Default는 자식 클래스의 Entity명입니다. 

> 하지만, 회사의 Rule이나 DBA 의견에 따라 숫자, 문자 또는 코드로 관리하게 된다면

#### DTYPE 구분값 지정
> 자식 클래스에서 각각 @DiscriminatorValue("anything")

> Album.java - @DiscriminatorValue 추가

```
@Entity
@DiscriminatorValue("A")
public class Album extends Item{
```

> Movie.java - @DiscriminatorValue 추가

```
@Entity
@DiscriminatorValue("M")
public class Movie extends Item{
```

> Book.java - @DiscriminatorValue 추가

```
@Entity
@DiscriminatorValue("B")
public class Book extends Item{
```


> JpaMain.java 애플리케이션 재시작

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-010.png)



#### 2. 단일 테이블 전략 - 예제
> 단일 테이블 전략은 테이블을 나누지 않고 하나의 테이블로 통합하여 사용하는 전략입니다. <br>
> 상속전략을 변경만 해도 빠르게 적용됩니다.

> JpaMain.java - @Inheritance(strategy = InheritanceType.SINGLE_TABLE)

```
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn
public class Item {
```

> console - create table

```
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        author varchar(255),
        isbn varchar(255),
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )
```

> console - insert

```
    /* insert relativemapping.Movie
        */ insert 
        into
            Item
            (name, price, actor, director, DTYPE, id) 
        values
            (?, ?, ?, ?, 'M', ?)
```

> console - select

```
Hibernate: 
    select
        movie0_.id as id2_0_0_,
        movie0_.name as name3_0_0_,
        movie0_.price as price4_0_0_,
        movie0_.actor as actor8_0_0_,
        movie0_.director as director9_0_0_ 
    from
        Item movie0_ 
    where
        movie0_.id=? 
        and movie0_.DTYPE='M'
```

> 단일 테이블 전략은 @DiscriminatorColumn를 넣지 않는다 하여도 DTYPE가 포함되어 생성

> Item.java - @DiscriminatorColumn 제거후 테스트

```
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Item {
```

> JpaMain.java 애플리케이션 재시작

```
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        author varchar(255),
        isbn varchar(255),
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Item
            (name, price, actor, director, DTYPE, id) 
        values
            (?, ?, ?, ?, 'M', ?)
Hibernate: 
    select
        movie0_.id as id2_0_0_,
        movie0_.name as name3_0_0_,
        movie0_.price as price4_0_0_,
        movie0_.actor as actor8_0_0_,
        movie0_.director as director9_0_0_ 
    from
        Item movie0_ 
    where
        movie0_.id=? 
        and movie0_.DTYPE='M'    
```

> 하나의 테이블에 들어가기 때문에 어떤 자식 테이블의 데이터 인지 구분하기 위해 DTYPE가 필수로 생성됩니다. 

> JPA에서 Joined 전략도 필수지만, Hibernate에서는 생략되어있습니다.

> Joined 전략에서 SINGLE_TABLE으로 변경하며 테이블 구조를 변경해 보았는데, 전략만 설정만 했을 뿐인데 잘 변경되는 것을 확인할 수 있습니다.

> Jpa를 사용하지 않는다면 많은 소스코드들과 쿼리 들을 수정했어야 했을 것입니다.

#### 3. 구현 클래스마다 테이블 전략 - 예제

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-004.png)

> Joined 속성과 똑같지만, ITEM 테이블을 없애고(추상클래스로 변경) ITEM의 속성을 밑의 자식 테이블에 위치 시키는 전략입니다.

> Item.java -- abstract 키워드를 추가하고, strategy = InheritanceType.TABLE_PER_CLASS

```
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Item {
```

> console - create table

```
Hibernate: 
    
    create table Album (
       id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Book (
       id bigint not null,
        name varchar(255),
        price integer not null,
        author varchar(255),
        isbn varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Movie (
       id bigint not null,
        name varchar(255),
        price integer not null,
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )

```

> ITEM TABLE이 생성 안된 것을 볼 수 있습니다.

> console - Insert

```
Hibernate: 
    /* insert relativemapping.Movie
        */ insert 
        into
            Movie
            (name, price, actor, director, id) 
        values
            (?, ?, ?, ?, ?)
```

> console - Select

```
Hibernate: 
       select
        movie0_.id as id1_2_0_,
        movie0_.name as name2_2_0_,
        movie0_.price as price3_2_0_,
        movie0_.actor as actor1_5_0_,
        movie0_.director as director2_5_0_ 
    from
        Movie movie0_ 
    where
        movie0_.id=?
```

![contact](/images/develop/backend/orm-jpa-basic/inheritance-mapping/img-012.png)

> Movie 테이블에만 데이터가 들어간 것을 확인 할 수 있습니다.

> 구현 클래스마다 테이블 전략에서는 @DiscriminatorColumn를 추가해도 적용되지 않습니다. <br>
> 각각의 자식 테이블에서 관리하여 사용되기 때문입니다.

> 단순하게 이것까지만 보면 좋아보이는데 단점이 있습니다.

> JpaMain.java - 부모 객체 Item으로 조회

````
            Movie movie = new Movie();
            movie.setDirector("감독A");
            movie.setActor("베우A");
            movie.setName("영화A");
            movie.setPrice(50000);

            em.persist(movie);

            em.flush();
            em.clear();

            Item findMovie =  em.find(Item.class, movie.getId());

            System.out.println(findMovie);

            tx.commit();
````

> console

````

Hibernate: 
    select
        item0_.id as id1_2_0_,
        item0_.name as name2_2_0_,
        item0_.price as price3_2_0_,
        item0_.artist as artist1_0_0_,
        item0_.author as author1_1_0_,
        item0_.isbn as isbn2_1_0_,
        item0_.actor as actor1_5_0_,
        item0_.director as director2_5_0_,
        item0_.clazz_ as clazz_0_ 
    from
        ( select
            id,
            name,
            price,
            artist,
            null as author,
            null as isbn,
            null as actor,
            null as director,
            1 as clazz_ 
        from
            Album 
        union
        all select
            id,
            name,
            price,
            null as artist,
            author,
            isbn,
            null as actor,
            null as director,
            2 as clazz_ 
        from
            Book 
        union
        all select
            id,
            name,
            price,
            null as artist,
            null as author,
            null as isbn,
            actor,
            director,
            3 as clazz_ 
        from
            Movie 
    ) item0_ 
where
    item0_.id=?

````

> Item에서 조회할 경우 union all 을 통해 자식 테이블들을 모두 합쳐서 조회하게 됩니다. 
> 조회시 어떤 테이블에 값이 있을 지 모르기 때문에 전체 테이블을 조회합니다.

### 각각 전략들의 장단점
----------------

#### 조인 전략의 장/단점
> - 장점 
>	- 테이블 정규화
>	- 외래 키 참조 무결설 제약조건 활용가능
>	- 저장공간 효율화

> - 단점
>	- 조회시 조인을 많이 사용, 성능 저하
>	- 조회 쿼리가 복잡함
>	- 데이터 저장시 Insert SQL 2번 호출


#### 단일 테이블 전략 장/단점
> - 장점 
>	- 조인이 필요 없으므로 일반적으로 조회 성능이 빠름
>	- 조회 쿼리가 단순함

> - 단점
>	- <mark>자식 엔티티가 매핑한 컬럼은 모두 null 허용</mark>
>	- 단일 테이블에 모든 것을 저장하므로 테이블이 커질수 있고, 상황에 따라서 조회 성능이 오히려 느려질 수 있다.

#### 구현 클래스마다 테이블 전략 장/단점
> <mark>이 전략은 데이터베이스 설계자와 ORM 전문가 둘 다 추천하지 않음</mark>

> - 장점 
>	- 서브 타입을 명확하게 구분해서 처리할때 효과적
>	- not null 제약조건 사용가능

> - 단점
>	- 여러 자식 테이블을 함께 조회할 때 성능이 느림(UNION ALL)

>	- 자식 테이블을 통합해서 쿼리하기 어려움

> ALBUM, MOVIE, BOOK을 모두 정산을 할 경우, 각각 정산을 해서 통합하여야 하고, 자식 클래스가 추가될 경우 수정이 필요합니다. 

> 하지만 조인전략과 단일테이블 전략에서는 ITEM만 사용하기 때문에 구현 클래스마다 전략은 매우 큰 단점을 가지고 있는것을 알 수 있습니다.


#### 상속관계 매핑 정리 
> 기본적으로 조인전략을 가져가고 설계나 구조 상황에 따라 조인전략과 단일 테이블 전략에서 고민 <br> 
> 비즈니스 적으로 중요하지 않고 데이터가 그리 많지 않다면 단일테이블 전략을 선택해 시간과 일정을 절약  <br>
> 비즈니스 적으로 중요하고 정교한 테이블 구조가 필요하다면 조인전략으로 선택

> <mark>테이블마다 전략은 고려대상 아님</mark>


#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
