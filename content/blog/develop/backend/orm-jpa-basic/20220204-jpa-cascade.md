---
title: "JPA 영속성 전이 CASCADE"
image: "bg-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-02-04
slug: "jpa-cascade"
description: "JPA 영속성 전이 CASCADE"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---


# 영속성 전이 CASCADE
-------------
> 앞에서 나온 즉시 로딩, 지연 로딩, 연관관계 세팅 이 세가지와 완전 별개의 개념

> - 특정 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속 상태로 만들고 싶을때
> - 예 : 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장.

## 영속성 전이: 저장
-------------

```
@OneToMany(mappedBy="parent", cascade=CasecadeType.PERSIST)
```

![contact](/images/develop/backend/orm-jpa-basic/jpa-cascade/img-001.png)


> Parent.java

```
package relativemapping;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Parent {

    public Parent() {
    }


    @Id
    @GeneratedValue
    @Column(name = "parent_id")
    private Long id;

    private String name;

    @OneToMany(mappedBy = "parent")
    private List<Child> childList = new ArrayList<>();

    public void addChild(Child child){
        childList.add(child);
        child.setParent(this);
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
}

```


> Child.java

```

package relativemapping;

import javax.persistence.*;

@Entity
public class Child {

    public Child() {
    }


    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

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

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }
}
```

> - JpaMain.java - 자식 2개와 부모 객체 1개 생성

```

package relativemapping;

import org.hibernate.Hibernate;

import javax.persistence.*;
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

            Child child1 = new Child();
            Child child2 = new Child();

            Parent parent = new Parent();

            parent.addChild(child1);
            parent.addChild(child2);

            em.persist(parent);
            em.persist(child1);
            em.persist(child2);

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
    /* insert relativemapping.Parent
        */ insert 
        into
            Parent
            (name, parent_id) 
        values
            (?, ?)
Hibernate: 
    /* insert relativemapping.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert relativemapping.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)


```

> 간략하게 부모 엔티티 1개와 자식 엔티티 2개를 한번에 저장하기 위한 예제를 작성했고 저장을 위해서 em.persist()가 각각 3번 사용된 것을 확인할 수 있다. <br>
현재 개발은 Parent 중심으로 개발하고 싶은데, 부모를 저장할때 자식까지 같이 관리해 주었으면 좋겠다. 라고 할때 만약 부모 이외에  em.persist() 를 지우면 


> - JpaMain.java - 자식 2개와 부모 객체 1개 생성

```

package relativemapping;

import org.hibernate.Hibernate;

import javax.persistence.*;
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

            Child child1 = new Child();
            Child child2 = new Child();

            Parent parent = new Parent();

            parent.addChild(child1);
            parent.addChild(child2);

            em.persist(parent);
            //em.persist(child1); // ** 제거
            //em.persist(child2); // ** 제거

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
    call next value for hibernate_sequence
Hibernate: 
    /* insert relativemapping.Parent
        */ insert 
        into
            Parent
            (name, parent_id) 
        values
            (?, ?)

```

> 부모의 엔티티만 저장한 것을 확인할 수 있습니다.

6:49




#### 참고- <a href="https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA - 김영한</a>
