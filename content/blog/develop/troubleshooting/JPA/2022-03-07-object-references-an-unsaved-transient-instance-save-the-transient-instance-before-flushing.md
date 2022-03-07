---
title: "object references an unsaved transient instance - save the transient instance before flushing 에러"
image: "bg-troubleshooting.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-03-07
slug: "object-references-an-unsaved-transient-instance-save-the-transient-instance-before-flushing"
description: "object references an unsaved transient instance - save the transient instance before flushing 에러"
keywords: ["Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
draft: false
categories: ["Troubleshooting"]
subcategories: ["JPA"]
tags: ["Troubleshooting","Java","JPA","ORM", "인프런", "김영한", "자바 ORM 표준 JPA"]
math: false
toc: true
---

# object references an unsaved transient instance - save the transient instance before flushing 에러

## 오류 

```
org.hibernate.TransientPropertyValueException: object references an unsaved transient instance - save the transient instance before flushing
```

## 원인 

> @ManyToOne 또는 @OneToMany 매핑을 사용 할때 부모 엔티티에 포함된 FK가 아직 영속되지 않아 생긴 영속성 전이(CASCADE)에 대한 오류 발생

#### 문제가된 소스 설명

> - Member 엔티티는 id, username, team 을 가지고 있다.
> - Team은 id 와 name 을 가지고 있다. 
> - Member에 Team은 ManyToOne으로 연관되어있다. 
> - Team에 Member는 OneToMany로 연관되어있다. 

```

            Member member1 = new Member();
            member1.setUsername("member1");
            member1.setAge(35);
            em.persist(member1);

            em.flush();
            em.clear();

            List<Member> result = em.createQuery("SELECT m FROM Member m", Member.class)
                    .getResultList();

            Member findMember = result.get(0);
            findMember.setAge(28);

            tx.commit();
```

> 이러한 경우 Member를 영속화 할때, 연관된 Team의 PK가 아직 영속화 되지 않아 오류를 발생하게 됩니다. 

## 해결책

### 1. CascadeType 지정 

> Member 엔티티에 @ManyToOne(cascade = CascadeType. ) 옵션 추가

> - CascadeType.ALL : 모두 적용
> - CascadeType.PERSIST : 영속
> - CascadeType.MERGE : 병합
> - CascadeType.REMOVE : 삭제
> - CascadeType.REFRESH : REFRESH
> - CascadeType.DETACH : DETACH

```
@Entity
public class Member {

    public Member(){
    }

    @Id @GeneratedValue
    private Long id;

    private String username;

    private int age;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TEAM_ID")
    private Team team = new Team();
```

### 2. FK를 가지는 엔티티를 먼저 영속화 후 엔티티 영속화  
> Member 엔티티에 CascadeType를 지정 하지 않아도, FK 즉 Team 엔티티를 영속화 후 member.setTeam(team)으로 영속화된 Team을 추가하면 오류가 발생 되지 않습니다.

```
            Team team = new Team();  
            team.setName("team1");
            em.persist(team); 		// ** Team 엔티티를 생성 후 영속화

            Member member1 = new Member();
            member1.setUsername("member1");
            member1.setAge(35);
            member1.setTeam(team);   // ** member1에 team 추가

            em.persist(member1);

            em.flush();
            em.clear();

            List<Member> result = em.createQuery("SELECT m FROM Member m", Member.class)
                    .getResultList();

            Member findMember = result.get(0);
            findMember.setAge(28);

            tx.commit();
```


### 참조

<a href="https://stackoverflow.com/questions/46848188/object-references-an-unsaved-transient-instance-save-the-transient-instance-be">object references an unsaved transient instance - save the transient instance before flushing : Spring Data JPA
</a>



