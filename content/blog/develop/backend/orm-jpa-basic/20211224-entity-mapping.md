---
title: "[자바 ORM 표준 JPA] 객체와 매핑"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-24
slug: "entity-mapping"
description: "객체와 매핑"	
keywords: ["ORM"]
draft: flase
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 객체와 매핑

## 객체와 테이블 매핑

### 목차
> - 객체와 테이블 매핑
> - 필드와 컬럼 매핑
> - 기본 키 매핑
> - 실전 예제 - 1. 요구사항 분석과 기본 매핑


### 엔티티 매핑 소개
> - 객체와 테이블 매핑 : @Entity, @Table
> - 필드와 컬럼 매핑 : @Column
> - 기본키 매핑 : @Id
> - 연관관계 매핑 : @ManyToOne, @JoinColumn

### 객체와 테이블 매핑

#### @Entity
> - @Entity가 붙은 클래스는 JPA가 관리, 엔티티라 부른다.
> - JPA를 사용해서 테이블과 매핑할 클래스는 <mart>@Entity</mark> 필수
> - 주의
	> - 기본 생성자 필수 (파라미터가 없는 public 또는 proteted 생성자)
	> - final 클래스, enum, interface, inner 클래스 사용 X
	> - 저장할 필드에 final 사용 X

#### @Entity 속성 정리
> - 속성 : name
	> - JPA에서 사용할 엔티티 이름을 지정한다.
	> - 기본값 : 클래스 이름을 그대로 사용 
	> - 같은 클래스 이름이 없으면 가급적 기본값을 사용한다.
	

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity //JPA가 관리하는 객체 Entity
//@Entity(name="Member") //기본 값이 아닌 다른 이름으로 Entity 명을 지정할때 사용
public class Member {

    @Id
    private Long id;
    private String name;

    public Member() {
    }

    public Member(Long id, String name){
        this.id = id;
        this.name = name;
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

#### @Table

> - @Table은 엔티티와 매핑할 테이블 지정


속성      | 기능          | 기본값
---------|--------------|--------------
name     | 매핑할 이름 	| 엔티티 이름을 사용
catalog     | 데이터베이스 catalog 매핑 	| 
schema     | 데이터베이스 schema 매핑 	| 
uniqueConstraints(DDL)     |  DDL 생성시에 유니크 제약조건 생성 	| 


```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity 
@Table(name="MBR") //데이터베이스의 MBR 테이블로 매핑하여, SQL이 MBR로 생성
public class Member {

    @Id
    private Long id;
    private String name;

    public Member() {
    }

    public Member(Long id, String name){
        this.id = id;
        this.name = name;
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

### 데이터베이스 스키마 자동 생성
> - DDL을 애플리케이션 실행 시점에 자동 생성
> - 테이블 중심 -> 객체 중심
> - 데이터베이스 방언을 활용해서 데이터베이스에 맞는 적절한 DDL 생성
> - 이렇게 <mark>생성된 DDL은 개발장비에서만 사용</mark>
> - 생성된 DDL은 운영서버에서는 사용하지 않거나, 적절히 다듬은 후 사용


#### 데이터베이스 스키마 자동 생성 - 속성
> - persistence.xml 옵션
```
<property name="hibernate.hbm2ddl.auto" value="create" />
```

옵션	 | 설명
-----|----------
create  | 기존테이블 삭제 후 다시 생성 (Drop + Create)
create-drop  | create와 같으나 종료시점에 테이블 Drop
update  | 변경분만 반영(운영 DB에는 사용하면 안됨)
validation | 엔티티와 테이블이 정상 매핑되어있는지만 확인
none | 사용하지 않음

##### Create 
> persistence.xml 

```
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="hello">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>

            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>  <!-- 실행 sql 로깅 -->
            <property name="hibernate.format_sql" value="true"/>  <!-- 실행 sql 포메팅 -->

            <!-- /* insert hellojpa.Member */ JPA가 Inser 를 해서 이 쿼리가 나왔다는 것을 주석으로 설명 -->
            <property name="hibernate.use_sql_comments" value="true"/>

            <!-- 한번에 같은 데이터 베이스에 데이터를 집어넣을때 모아서 한번에 인서트 하는 jdbc batch의 수를 지정-->
            <property name="hibernate.jdbc.batch_size" value="10"/>

            <property name="hibernate.hbm2ddl.auto" value="create" />
        </properties>
    </persistence-unit>
</persistence>
```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-001.png)

> Member 테이블을 먼저 drop하고 create 문을 실행

##### Create - 컬럼 추가 후 애플리케이션 재실행 
> Member.Java

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {

    @Id
    private Long id;
    private String name;
    private int age; // 추가된 컬럼

    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }

    public Member(Long id, String name, int age){
        this.id = id;
        this.name = name;
        this.age = age;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

```

> 이후 다시 애플리케이션을 다시 실행시켜보면, 


![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-002.png)


> 추가된 컬럼을 포함하여 Member 테이블이 다시 생성된다.


##### create-drop
> create와 같지만 종료시점에 생성한 테이블 모두 drop, 예를들어 테스트 케이스 수행후 삭제할때 사용가능

> persistence.xml

```
...
            <property name="hibernate.hbm2ddl.auto" value="create-drop" />
...
```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-003.png)

> 종료시에 drop을 하는것을 볼 수 있다.

##### update
> 추가 했던 age를 잠깐 다시 돌려두고, create 후 update를 실행해 보겠습니다.

> persistence.xml

```
<property name="hibernate.hbm2ddl.auto" value="create" />
```

> Member.java

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {

    @Id
    private Long id;
    private String name;

    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }

    public Member(Long id, String name){
        this.id = id;
        this.name = name;
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

> 다시 update로 수정후 애플리케이션 재시작

> persistence.xml

```
<property name="hibernate.hbm2ddl.auto" value="update" />
```

> Member.java

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {

    @Id
    private Long id;
    private String name;
    private int age;

    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }

    public Member(Long id, String name, int age){
        this.id = id;
        this.name = name;
        this.age = age;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-004.png)

> 추가된 컬럼만 alter table을 통하여 스키마 수정됩니다. 

> 만약, 컬럼을 삭제한 뒤의 update 상태에서 애플리케이션 재시작할 경우에는 

> Memeber.java

```
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {

    @Id
    private Long id;
    private String name;

    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }

    public Member(Long id, String name){
        this.id = id;
        this.name = name;
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

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-005.png)

> 삭제된 컬럼은 update 옵션에 의해 alter table로 수정되지 않습니다. H2 데이터베이스에서 확인하면

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-006.png)

> 변경이 안된 테이블을 확인 할 수 있습니다. 

> 실수라도 테이블 컬럼을 삭제하여, 데이터가 날아갈 수 있기 때문에 <mark>컬럼 삭제는 update 옵션에서 변경을 지원하지 않습니다</mark>.

##### validate 
> 테이블과 entity가 정상 매핑되어있는지 확인해 줍니다.

> 새로운 컬럼을 추가하고 

> Memeber.java

```
    private String address;
```

> persistence.xml

```
<property name="hibernate.hbm2ddl.auto" value="validate" />
```

> 애플리케이션 재시작

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-007.png)

>  Schema-validation: missing column [address] in table [Member] <br>
> MEMBER 테이블에 address가 없다고 오류가 발생하게 됩니다.

##### none
> 스키마 자동 생성 사용안함으로 설정<br>
주석으로 해두는 것과 비슷하며, create, create-drop, update, validate가 아닌 어떤 문자열이 들어가 있어도 none과 같음

##### 데이터베이스 방언 별로 달라지는것 확인 (varchar)

> persistence.xml

```
<property name="hibernate.hbm2ddl.auto" value="create" />
```

> create로 스키마 자동생성 옵션을 설정해 두고 재실행

> persistence.xml - H2 방언 설정  

```
<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
```
 
 
![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-008.png) 


> persistence.xml - Oracle 방언 설정  

```
<property name="hibernate.dialect" value="org.hibernate.dialect.Oracle8iDialect"/>
```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-009.png) 

> 방언에 따라서 적절하게 데이터베이스에 맞게 해석을 해서 실행을 해주는 것을 확인 할 수 있습니다.
> 다시 H2로 되돌려둠

> persistence.xml - H2 방언 설정  

````
<property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
````

##### 데이터베이스 스키마 자동 생성 - 주의

> - <mark>운영 장비에는 절대 create, create-drop, update 사용하면 안된다.</mark>
> - 개발 초기 단계는 create 또는 update
> - 테스트 서버는 update 또는 validate
> - 스테이징과 운영 서버는 validate 또는 none

#### DDL 생성 기능
> DDL 생성 기능은 DDL을 자동 생성할 때만 사용되고 JPA의 실행 로직에는 영향을 주지 않는다.<br>

> 제약조건 추가 : 회원 이름은 필수, 10자 초과 X<br>
> - @Column(nullable = false, length = 10) <br>

> 유니크 제약조건 추가 <br>
> - @Table(uniqueConstraints = {@UniqueConstraint( name = "NAME_AGE_UNIQUE",
	 columnNames = {"NAME", "AGE"} )})

##### 제약조건 추가

> Member.java

```
    @Column(unique = true, length = 10)
    private String name;

```



![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-010.png) 

> Member entity의 name 사이즈가 varchar(10)으로 생성되고, alter table을 통해 제약조건을 추가한 것을 확인 할 수 있습니다.


### 필드와 컬럼 매핑

#### 요청사항 추가 
> 1. 회원은 일반 회원과 관리자로 구분해야 한다.
> 2. 회원 가입일과 수정일이 있어야 한다.
> 3. 회원을 설명할 수 있는 필드가 있어야 한다. 이 필드는 길이 제한이 없다.

> Member.java

```
package hellojpa;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Member {

    @Id
    private Long id;

    @Column(name="name", length = 10) // 엔티티 명은 userName으로, DB 컬럼명을 name으로 매핑하여 사용 지정
    private String userName;

    private Integer age;  // Integer 타입으로 생성하면 DB에서도 가장 Integer랑 가장 적절한 컬럼으로 숫자 타입 생성

    @Enumerated(EnumType.STRING) // 객체에서 ENUM 타입을 쓰고싶을때, DB에는 이넘 타입이 없음(비슷한 것이 있는 DB도 있음)
    private RoleType roleType;

    @Temporal(TemporalType.TIMESTAMP) // 날짜타입생성 Date, Time, Timestamp 3가지 타입이 있음
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;

    @Lob // DB에 varchar를 넘어서는 문자를 넣고 싶을때, 예를 들면 게시판 contents, 파일 바이너리 등
    private String description;


    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }
}

```

> RoleType.java 

````
package hellojpa;

public enum RoleType {
    USER, ADMIN
}

````

> JpaMain.java 의 tx.transaction 내부 소스를 지우고 실행한다.


![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-011.png) 


#### 매핑 어노테이션 정리

어노테이션 | 설명
----------|----------
@Column | 컬럼 매핑
@Temporal | 날짜 타입 매핑
@Enumerated | enum 타입 매핑
@Lob | BLOB, CLOB 매핑
@Transient | 특정 필드를 컬럼에 매핑하지 않음(매핑 무시)


#### @Column 옵션 정리


속성				|	설명 			|기본값				
----------------|---------------|-----------------------
name |	필드와 매핑할 테이블의 컬럼 이름	| 객체의 필드 이름 
inertable | 등록 가능여부 | Ture 
updatable | 변경 가능여부 | Ture 
nullable(DDL) | null 값의 허용 여부 설정. false로 설정하면 DDL 생성 시에 not null 제약조건이 붙는다. |
unique(DDL) | @Table의 uniqueConstraints와 같지만 한 컬럼에 간단히 유니크 제약조건을 걸 때 사용 한다. |
columnDefinition(DDL) | 데이터베이스 컬럼 정보를 직접 줄 수 있다. <br> ex) varchar(100) default 'EMPTY' | 필드의 자바 타입과 방언 정보를 사용
length(DDL) | 문자 길이 제약조건, String 타입에만 사용 | 255
percision,<br>scale(DDL) | BigDecimal 타입에서 사용한다(BigInteger도 사용할 수 있다).<br>precision은 소수점을 포함한 전체 자릿수를, scale은 소수의 자리수다. 참고로 double, float 타입에는 적용되지 않는다. 정밀한 소수를 다루어야 할 때만 사용한다.

> insertable과 updateable은 기본적으로 True로 되어있으며, updateable = false 라면, JPA를 통하여 inesert를 하지만, 변경에 대해서 update를 하지 않는다. <br>

> nullable은 기본적으로 true이며, false로 설정하면, <code>name varchar(255) not null</code> DDL에 not null 제약조건이 걸린다.

> unique는 잘 사용하지 않는다. 제약조건 생성시 <code>alter table Member add constraint UK_ektea8vp6e3low620iewuxhlq unique (name)</code> 이런식으로 임의의 유니크 키가 생성되어 오류가 났을때 바로 알아보기가 힘들기 때문. <br>
그래서 @Table를 사용해 제약조건을 지정하여 사용합니다.

```
> - @Table(uniqueConstraints = {@UniqueConstraint( name = "NAME_AGE_UNIQUE",
	 columnNames = {"NAME", "AGE"} )})
```


#### @Enumerated
> 자바 enum 타입을 매피할 때 사용

> <mark>주의 ! ORDINAL 사용 X</mark>

속성		| 설명			| 기본값
--------|--------------|---------
value | EnumType.ORDINAL : enum 순서를 데이터 베이스에 저장 | EnumType.ORDINAL 
value | EnumType.STRING : enum 이름를 데이터 베이스에 저장 | EnumType.ORDINAL

##### EnumType.ORDINAL 와 EnumType.STRING 비교

###### EnumType.ORDINAL 일때 

> Member.java - EnumType.ORDINAL으로 설정 (Setter Getter 추가)

```
package hellojpa;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Member {

    @Id
    private Long id;

    @Column(name="name", length = 10) // 엔티티 명은 userName으로, DB 컬럼명을 name으로 매핑하여 사용 지정
    private String userName;

    private Integer age;  // Integer 타입으로 생성하면 DB에서도 가장 Integer랑 가장 적절한 컬럼으로 숫자 타입 생성

    @Enumerated(EnumType.ORDINAL) // Enum의 인덱스가 들어감
    //@Enumerated(EnumType.STRING) // 객체에서 ENUM 타입을 쓰고싶을때, DB에는 이넘 타입이 없음(비슷한 것이 있는 DB도 있음)
    private RoleType roleType;

    @Temporal(TemporalType.TIMESTAMP) // 날짜타입생성 Date, Time, Timestamp 3가지 타입이 있음
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;

    @Lob // DB에 varchar를 넘어서는 문자를 넣고 싶을때, 예를 들면 게시판 contents, 파일 바이너리 등
    private String description;


    // JPA 기본적으로 동적으로 객체를 생성하는 기능이 있어, 기본 생성자도 추가해줘야 된다.
    public Member() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

```

> JpaMain.java 

```

            Member member = new Member();
            member.setId(21L);
            member.setAge(27);
            member.setUserName("테스트 A");
            member.setRoleType(RoleType.ADMIN);
            em.persist(member);
            tx.commit();
```


![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-012.png) 

> roleType가 Integer로 생성된 것이 확인 됩니다. DB에 어떻게 저장되었는지 확인 해보겠습니다.

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-013.png)

> EnumType.ORDINAL 로 설정시 DB에는 roleType enum의 인덱스가 들어갑니다. <br> 
EnumType.ORDINAL을 사용하면 안되는 점이 요구사항으로 Guest가 추가되었다고 생각하게 되면 일반적으로 권한의 중요도에 따라 <br>
Guest, User, Admin 순으로 수정을 하였다고 생각하면, DB에 저장되어있는 roleType은 User가 0, Admin이 1인 상태라 데이터의 매핑이 잘못된 데이터가 생기게 됩니다.

> RoleType.java

```
package hellojpa;

public enum RoleType {
    GUEST, USER, ADMIN
}

```

> persistence.xml 

````
<property name="hibernate.hbm2ddl.auto" value="update" /> <!-- create, create-drop, update, validate, none -->
````

> JpaMain.java

```
            Member member3 = new Member();
            member3.setId(23L);
            member3.setAge(29);
            member3.setUserName("테스트 C");
            member3.setRoleType(RoleType.GUEST);
            em.persist(member3);

            tx.commit();
```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-014.png)

> enum의 0번째 인덱스에 GUEST가 추가되면서 DB의 RoleType이 3번째 사용자 빼고 전부 잘못된 것을 확인할 수 있습니다. 

###### EnumType.STRING 일때 
 
> persistence.xml - 다시 create로 바꿔 설정

````
<property name="hibernate.hbm2ddl.auto" value="create" /> <!-- create, create-drop, update, validate, none -->
````

>Memeber.java - EnumType.STRING 으로 설정

```
    // 객체에서 ENUM 타입을 쓰고싶을때, DB에는 이넘 타입이 없음(비슷한 것이 있는 DB도 있음)
    //@Enumerated(EnumType.ORDINAL) // Enum의 인덱스가 들어감
    @Enumerated(EnumType.STRING)
    private RoleType roleType;
```

> 재실행 


![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-015.png)

> roleType 가 varchar(255)로 생성된 것을 확인

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-016.png)

> roleType의 데이터가 GUEST로 들어간 것을 확인할 수 있습니다. 몇자 아끼려다 큰 장애를 경험할 수 있기 때문에 ORDINAL이 아니라 STRING으로 사용하길 권장드립니다. 



#### @Temporal
> 날짜 타입(java.util.Date, java.util.Canendar)를 매핑할 때 사용 <br>

> 참고 : LocalDate, LocalDateTime을 사용할 때는 생략 가능(최신 하이버네이트 지원)

> Member.java

```
    private LocalDate createdAt;
    private LocalDate modifiedAt;
    private LocalDateTime createdTime;
    private LocalDateTime modifiedTime;
```

![contact](/images/develop/backend/orm-jpa-basic/entity-mapping/img-017.png)

> createdAt, modifiedAt 은 DATE 타입으로 생성되었고, createdTime, modifiedTime은 TIMESTAMP로 생성된 것을 확인 할 수 있습니다.


#### @Lob
> 데이터베이스 BLOB, CLOB 타입과 매핑
> - @Lob에는 지정할 수 있는 속성이 없다.
> - 매핑하는 필드 타입이 문자면 CLOB 매핑, 나머지는 BLOB 매핑
>	- CLOB : String, char[], java.sql.CLOB
>	- BLOB : byte[], java.sql.BLOB


#### @Transient
> - 필드 매핑 사용 X
> - 데이터베이스에 저장X, 조회X
> - 주로 메모리상에서만 임시로 어떤 값을 보관하고 싶을 때 사용

```
	@Transient
	private Integer temp;
```


## 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
