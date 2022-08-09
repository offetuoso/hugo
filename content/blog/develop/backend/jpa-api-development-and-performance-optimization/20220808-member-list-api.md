---
title: "[스프링부트 JPA API개발 성능최적화] 회원 조회 API"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-08-03
slug: "member-update-api"
description: "[스프링부트 JPA API개발 성능최적화] 회원 조회 API"
keywords: ["ORM"]
draft: false
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA API개발 성능최적화","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 스프링부트 JPA API개발 성능최적화
-------------------------------

## 목차
----------------------------------
> 5. API 개발 기본
>	- 회원 등록 API
>	- 회원 수정 API
>	- 회원 조회 API
> 6. API 개발 고급
>	- 조회용 샘플 데이터 입력
>	- 지연 로딩과 조회 성능 최적화
>	- 페이징과 한계 돌파
>	- OSIV와 성능 최적화
> 7. 다음으로
>	- 스프링 데이터 JPA 소개
>	- QueryDSL 소개
>	- 마무리

## API 개발 기본
-----------------------------------------

### 회원 조회 API
------------------------------------------
> 조회는 단순 검색 및 반환이기 때문에 어렵지는 않습니다. 하지만 V1, V2 개선사항을 순서대로 작성해 보겠습니다. 

#### 회원 조회 V1
> 이전에 엔티티를 바로 반환하면 안된다 하였지만, V1은 엔티티를 이용해 바로 반환하여 간단하게 작성하였습니다. 

```
    @GetMapping("/api/v1/members")
    public List<Member> getMembersV1(@RequestBody @Valid CreateMemberRequest request){

        return memberService.findMembers();
    }
```

> 강의를 따라 하다 문제가 발생하였다. 


#### java.lang.IllegalStateException: Cannot call sendError() after the response has been committed
> 양방향 관계에서 엔티티를 바로 사용해 Json 직렬화를 할때 각각의 엔티티가 서로를 계속 데이터로 만드는 무한 루프 문제입니다.

```

java.lang.IllegalStateException: Cannot call sendError() after the response has been committed
	at org.apache.catalina.connector.ResponseFacade.sendError(ResponseFacade.java:472) ~[tomcat-embed-core-9.0.60.jar:9.0.60]
	at org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver.sendServerError(DefaultHandlerExceptionResolver.java:552) ~[spring-webmvc-5.3.18.jar:5.3.18]
	at org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver.handleHttpMessageNotWritable(DefaultHandlerExceptionResolver.java:442) ~[spring-webmvc-5.3.18.jar:5.3.18]
	at org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver.doResolveException(DefaultHandlerExceptionResolver.java:209) ~[spring-webmvc-5.3.18.jar:5.3.18]
	at
...
```

> <a href="https://offetuoso.github.io/blog/develop/troubleshooting/jpa/java.lang.illegalstateexception-cannot-call-senderror-after-the-response-has-been-committed/">
JPA 양방향 무한 루프 java.lang.IllegalStateException: ...</>

> 위의 정리한 내용을 보시면 더 자세한 내용이 있습니다.

> 1. DTO로 바꾸어 사용
> 2. @JsonIdentityInfo 어노테이션을 추가해서 중복 생성 막음
> 3. @JsonIgnore 어노테이션 사용 Json 직렬화 제외

```
package jpabook.jpashop.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
//@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "id")
public class Member {


    public Member() {
    }

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String name;

    @Embedded
    private Address address;

    @JsonIgnore
    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();

}

```



### 이전 소스
---------------------
> - <a href="https://github.com/offetuoso/jpa-practice.git">https://github.com/offetuoso/jpa-practice.git<a>

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94">실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - 김영한</a>
