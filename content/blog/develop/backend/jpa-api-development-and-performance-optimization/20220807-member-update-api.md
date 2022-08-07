---
title: "[스프링부트 JPA API개발 성능최적화] 회원 수정 API"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-08-03
slug: "member-update-api"
description: "[스프링부트 JPA API개발 성능최적화] 회원 수정 API"
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

### 회원 수정 API
------------------------------------------

> 회원 수정 API는 저장 API와 크게 다를 것이 없습니다. <br>
> 이전 API에서 수정하여 수정 API를 작성해 보겠습니다. 

> id와 name을 입력받아, 해당 id로 조회한 member의 이름을 name으로 변경합니다. 

> MemberApiController.java

```
	@PutMapping("/api/v2/members/{id}")
    public UpdateMemberResopnse updateMemberV2(
            @PathVariable("id") Long id
            , @RequestBody @Valid UpdateMemberRequest request
    ){

        // 수정 커맨드
        memberService.update(id, request.getName());
        // 조회 쿼리
        Member findMember = memberService.findOne(id);
        
        // 커맨드와 쿼리를 분리

        return new UpdateMemberResopnse(findMember.getId(), findMember.getName());
    }


    @Data
    @AllArgsConstructor 
    static class UpdateMemberResopnse {
        private long id;
        private String name;
    }

    @Data
    static class UpdateMemberRequest {
        @NotEmpty
        private String name;
        private String city;
        private String street;
        private String zipcode;
    }
```

#### @AllArgsConstructor 
> AllArgsConstructor 어노테이션은 모든 필드 값을 파라미터로 받는 생성자를 만들어줍니다. 

> MemberService.java

```
   /**
     * 회원 수정
     */
    @Transactional // 변경 감지를 위한 트랜잭션 필수 !!!
    public void update(Long id, String name) {
        Member member = this.findOne(id); 
        member.setName(name);
    }
```

> 하나의 트랜잭션에서 조회한 엔티티는 변경감지 대상이기 때문에 조회 후 Set을 통해 name을 Update할 수 있습니다. <br>

> update 메소드의 리턴값으로 Member를 넘기지 않는 이유는 수정에 대한 커맨드와, 조회 쿼리를 분리함과 <br>
> Member를 리턴하게 되면 id를 통해 새로 변경된 member를 조회하여 <mark>영속상태가 끊어진 member를 전달</mark>하게 됩니다.


![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-update-api/img-001.png)

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-update-api/img-002.png)

#### RESTfulApi
> RESTfulApi의 get, post, put, patch, delete를 처음 듣는다면, 한번 REST API의 개념을 먼저 공부하시는게 도움이 되실것같습니다.

   Resource   | GET(read)     | POST(create)        | PUT/PACTH(update)     | DELETE(delete)
--------------|---------------|---------------------|-----------------|------
  /members      | 사용자 전체 조회  | -                   | -               | -          
  /members/{id} | {id}사용자 조회  | {id} 신규 사용자 추가   | {id} 사용자 수정   | {id} 사용자 삭제 
  
  

<a href="https://offetuoso.github.io/blog/develop/backend/restapi/restful-api/">레스트풀 API(Restful Api)</a>

> 엔티티와 프리젠테이션 계층간 로직을 분리를 할 수 있습니다. <br> 
엔티티와 API 스팩을 분리할 수 있어 엔티티를 변환해도 API 스팩에 변화가 없습니다.

### 이전 소스
---------------------
> - <a href="https://github.com/offetuoso/jpa-practice.git">https://github.com/offetuoso/jpa-practice.git<a>

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94">실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - 김영한</a>
