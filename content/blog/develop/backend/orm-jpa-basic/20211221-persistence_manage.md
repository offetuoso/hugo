---
title: "[자바 ORM 표준 JPA] 영속성 관리"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-12-21
slug: "persistence-manage"
description: "JPA 내부 동작 방식"	
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# JPA 영속성 관리 - 내부 동작 방식

## 영속성 컨텍스트

### JPA에서 가장 중요한 2가지 
> - 객체와 관계형 데이터베이트 매핑하기 (Object Relational Mapping)
> - <mark>영속성 컨텍스트</mark>

### 엔티티 매니저 팩토리와 앤티티 매니저
> 요청이 오면 앤티티 매니저 팩토리를 통해 엔티티 매니저를 생성하고, 앤티티 매니저는 커넥션풀을 이용해 DB에 접근 합니다.

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-001.png)


### 영속성 컨텍스트
> - JPA를 이해하는데 가장 중요한 용어
> - "엔티티를 영구 저장하는 환경"이라는 뜻
> - EntitiyManager.persist(entity); 
// persist 메소드는 DB에 저장하는게 아니라 entity를 영속성 컨텍스트에 저장한다는 것

### 엔티티 매니저? 영속성 컨텍스트?
> - 영속성 컨텍스트는 논리적인 개념
> - 눈에 보이지 않는다.
> - 엔티티 매니저를 통해서 영속성 컨텍스트에 접근

#### J2SE 환경
> 엔티티 매니저와 영속성 컨텍스트가 1:1
![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-002.png)

#### J2EE, 스프링 프레임워크 같은 컨테이너 환경
> 엔티티 매니저와 영속성 컨텍스트가 N:1
![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-003.png)


### 엔티티의 생명주기
> - 비영속 (new/transient)
> 영속성 컨텍스트와 전혀 관계가 없는 <mark>새로운</mark> 상태

> - 영속 (managed)
> 영속성 컨텍스트에 <mark>관리</mark>되는 상태


> - 준영속 (datached)
> 영속성 컨텍스트에 저장되었다가 <mark>분리</mark>된상태


> - 삭제 (removed)
> <mark>삭제</mark>된 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-004.png)

#### 비영속 (new/transient)
> 객체만 생성하고 세팅한 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-005.png)

```
// 객체를 생성한 상태(비영속)
Member member = new Mamber();
member.setId(2L);
member.setName("회원2")
```

#### 영속 (managed)
> 객체만 생성하고 세팅한 상태

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-006.png)

```
// 객체를 생성한 상태(비영속)
Member member = new Mamber();
member.setId(2L);
member.setName("회원2")

EntitiyManager em = emf.createEntityManager();
em.getTransaction().begin();

// 객체를 저장한 상태(영속)
em.persist(member);

// 객체를 비영속 상태로 변경
//em.detach(member) 

// 객체를 DB에서 삭제
//em.remove(member) 


tx.commit(); // 실제 쿼리가 실행되는 지점

```

### 영속성 컨텍스트의 이점
> 영속성 컨텍스트는 객체와 DB 사이에 하나의 계층이 있는것 

> - 1차 캐시
> - 동일성(identity) 보장
> - 트랜잭션을 지원하는 쓰기 지연(transactional write-behind)
> - 변경 감지(dirty checking)
> - 지연 로딩(lazy loading)

#### 엔티티 조회, 1차 캐시
> 영속성 컨텍스트는 내부에 1차 캐시를 가지고 있습니다. @Id가 키가 되고 값은 member객체 자체인 Map이라 생각하면 됩니다.

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-007.png)

```
// 엔티티를 생성한 상태(비영속)
Member member = new Member();
member.setId(3L);
member.setName("회원3");

// 엔티티를 영속
em.persist(member);

```

#### 1차 캐시에서 조회

```
// 엔티티를 생성한 상태(비영속)
Member member = new Member();
member.setId(3L);
member.setName("회원3");

// 1차 캐시에 저장됨
em.persist(member);

Member findMemeber = em.find(Member.class, "3L");

```

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-008.png)

> 조회를 실행시 우선적으로 1차 캐시에 값으로 객체가 있는지 확인 후 있으면 캐시에서 바로 가져오고, 없는 경우 DB에서 조회를 하여 1차 캐시에 저장하고 객체를 가져오게 됩니다.


#### DB에서 조회
```
Member findMemeber = em.find(Member.class, "10L");
```

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-009.png)

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-010.png)
> commit()이후에 Insert를 하지만, Select문이 나오지 않는다. 이미 1차 캐시에서 조회하여 커밋 이전에 출력한다.

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-011.png)
> 같은 객체를 여러번 조회를 하면, 1번만 Select 문을 날리고 이후 1차 캐시에서 조회


### 영속 엔티티의 동일성 보장

```
  	Member findMember1 = em.find(Member.class, 10L);
	Member findMember2 = em.find(Member.class, 10L);
	
	System.out.println(findMember1 == findMember2);

```

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-012.png)

> 같은 트랜잭션 안에서는 조회한 같은 객체는 동일한 객체로 인식 보장

### 엔티티 등록 - 트랜잭션을 지원하는 쓰기 지연

```
 EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        tx.begin(); // [트랜잭션] 시작

        try{

            Member meber1 = new Member();
            Member meber2 = new Member();
            meber1.setId(11L);
            meber1.setName("회원11");

            meber2.setId(12L);
            meber2.setName("회원12");

            // 영속
            System.out.println("=== BEFORE ===");
            em.persist(meber1);
            em.persist(meber2);
            System.out.println("=== AFTER ===");
            // 여기까지 DB에 Insert 하지 않는다.

            tx.commit(); // [트랜잭션] 카밋
```

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-013.png)

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-013-1.png)

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-014.png)

> em.persist()로 memberA와 memberB를 저장할때, 영속 컨텍스트안의 쓰기지연 SQL 저장소에 memberA를 Insert SQL을 저장하고<br>
> 그리고 이후에 memberB에 대한 Insert SQL을 쓰기지연 SQL 저장소에 저장합니다. 여기 까지 DB에 저장하지 않고 commit과 함께 DB에 저장합니다.


#### transaction.commit();
> 트랜잭션이 커밋될때 좀더 자세히 그림으로 설명하면 아래와 같습니다.

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-015.png)

> 커밋을 하게되면 쓰기지연 저장소에 있는 SQL들을 flush하며, DB에 SQL문들을 DB에 커밋하게 됩니다.

##### Member.java

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

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-016.png)

> 굳이 하나씩 보내도 되는데 왜 커밋과 함께 DB에 Insert 하느냐 하면 성능을 위해 설정하여 튜닝할 수 있는 여지를 주기 위함이라 합니다. <br>

> JPA의 옵션중

#### persistence.xml - hibernate.jdbc.batch_size

```
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="hello">
        <properties>
	       ...

            <!-- 한번에 같은 데이터 베이스에 데이터를 집어넣을때 모아서 한번에 인서트 하는 jdbc batch의 수를 지정-->
            <property name="hibernate.jdbc.batch_size" value="10"/>

		   ...
        </properties>
    </persistence-unit>
</persistence>
```

> 옵션 하나로 JPA의 성능에 대한 이점을 챙길 수 있습니다.


### 엔티티 수정 - 변경 감지(dirty checking)
> JPA에서는 컬렉션에서 값을 수정하는 것처럼 따로 저장하지 않아도 변경 감지를 통해 commit시 Update 문을 자동으로 수행

```
EntityMananger em = emf.createEntityManager();
EntityTransaction tx = em.getTransaction();
tx.begin(); // [트랜잭션] 시작

// 영속 엔티티 조회
Member MemberA = em.find(Member.class, 10L);

// 영속 엔티티 데이터 수정
MemberA.setName("사용자10");

// 이런 코드가 필요하지 않을까?
//em.update(member);

tx.commit(); // [트랜잭션] 커밋

```

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-017.png)

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-018.png)
> DB에서 값을 Select 하고 값을 수정만 하고 저장을 따로 하지 않았지만, Update 쿼리까지 실행됩니다.

#### 변경 감지(dirty checking)
> 커밋하는 시점에 변경 감지를 통해 벌어지는 일을 그림으로 그리면 아래와 같습니다.<br>
> 커밋을 하게 되면 내부적으로 flush()를 실행하게 되고, 엔티티와 스냅샷을 비교하게됩니다. 스냅샷은 객체를 읽어올 당시의 값을 스냅샷으로 저장합니다. 트랜잭션에서 커밋하는 시점에 플러시가 호출되며 엔티티와 스냅샷을 비교하여, 변경사항을 쓰기 지연 SQL 저장소에 Update SQL을 저장합니다. 그리고 DB에 Update SQL을 반영하고 commit()을 수행합니다.


![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-019.png)

### 엔티티 삭제

```
// 삭제할 대상 엔티티 조회
Member memberA = em.find(Member.class, 11L);
em.remove(memberA); // 엔티티 삭제
```

## 플러시
> 영속성 컨텍스트의 변경내용을 데이터베이스에 반영

### 플러시 발생
> 트랜잭션이 커밋되면 자동적으로 플로시가 발생되며, 1차 캐시의 변동없음(다른 flush의 비우는 기능과 다름.)

> - 변경감지(dirty checking)
> - 수정된 엔티티 쓰기 지연 SQL 저장소에 등록
> - 쓰기 지연 SQL 저장소의 쿼리를 데이터 베이스에 전송(등록, 수정, 삭제 쿼리)

### 영속성 컨텍스트를 플러시 하는 방법
> - em.flush() - 직접 호출 (잘 사용은 안되지만, 테스트 시 알아두면 유용)
> - 트랜잭션 커밋 - 플러시 자동 호출
> - JPQL 쿼리 실행 - 플러시 자동 호출

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-020.png)
> 다른 예제들과 다르게 라인 "===========" 보다 이전에 flush()를 실행항 당시 변경 사항의 SQL이 로그에 찍히게됨.

### JPQL 쿼리 실행시 플러시가 자동으로 호출되는 이유

```
em.persist(memberA);
em.persist(memberB);
em.persist(memberC);

//중간에 JPQL 실행 
query = em.createQuery("select m from Member m", Member.class);
List<Member> members = query.getResultList();
```
> 만일 memberA, memberB, memberC를 영속화 하고, Member 테이블의 전체 리스트를 조회하면 아무 결과가 안나올 것입니다. 아직 commit()을 통한 flush()가 실행 되기 이전이기 떄문입니다. 이러한 문제점을 해결하기 위해 JPA에서는 JPQL을 실행할 때 우선 flush()를 실행합니다.


### 플러시 모드 옵션
```
em.setFlushMode(FlushModeType.COMMIT);
```
> - FlushModeType.AUTO - 트랜잭션 커밋이나 쿼리(JPQL)를 실행할 때 플러시(기본값)
> - FlushModeType.COMMIT - 커밋할 때만 플러시

### 플러시는 !
> - 영속성 컨텍스트를 비우지 않음
> - 영속성 컨텍스트의 변경내용을 데이터베이스에 동기화
> - 트랜잭션이라는 작업 단위가 중요 -> 커밋 직전에만 동기화하면 됨


## 준영속 상태
> - 영속  -> 준영속 
> 1차 캐시에 있고 JPA가 관리하는 상태

> - 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)
> - 영속성 컨텍스트가 제공하는 기능을 사용 못함

![contact](/images/develop/backend/orm-jpa-basic/persistence-manage/img-021.png)


### 준영속 상태로 만드는 방법

> - em.detach(entity) - 특정 엔티티만 준영속 상태로 전환
> - em.claer() - 영속성 컨텍스트를 완전히 초기화
> - em.close() - 영속성 컨텍스트를 종료



## 참고
> - <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
