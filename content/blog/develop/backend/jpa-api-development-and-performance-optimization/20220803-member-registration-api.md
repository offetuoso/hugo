---
title: "[스프링부트 JPA API개발 성능최적화] 회원 등록 API"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-08-03
slug: "member-registration-api"
description: "[스프링부트 JPA API개발 성능최적화] 회원 등록 API"
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
> 회원 등록 API, 회원 수정 API, 회원 조회 API를 만들어 보겠습니다. 

> 요즘에는 화면을 템플릿 엔진을 통해 만드는 것보다 싱글페이지 어플리케이션 React, VueJs, NativeApp 등을 사용하기 때문에 
서버 개발자는 서버에서 쿼리를 조회하고 페이지를 랜더링 하여 내리는 방식을 많이 사용 하지 않습니다.

> 서버 개발자는 데이터를 넘겨 주고 프론트엔드 개발자가 화면을 랜더링합니다.

> 또한 추세가 MSA로 바뀌어 가며 서버간 통신도 필수가 되어가고 있습니다.

> 그렇기 때문에 API를 설계하고 구성하는게 중요합니다. 

> 과거 SQL을 날려 API로 끌어오는 방식과 JPA를 사용하면 엔티티라는 개념이 있기 때문에 개발 방식이 전혀 다릅니다. 


### 회원 등록 API
------------------------------------------
> 이전 강의에서 아래와 같은 구조의 어플리케이션을 만들었는데 controller와 api의 controller를 나누려 합니다. 

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-001.png)

> 공통으로 처리할 내용을 패키지 단위로 나누게 되면 좀더 바람직하게 관리할 수 있습니다. <br>
예를 들어 탬플릿엔진에서 사용하는 controller는 로그인 및 세션 체크를 하거나 <br>
api에서는 토큰 체크 및 호출을 실패 했을때 json으로 spec을 반환하는 등 나누어 관리하는게 좋습니다.


#### MemberApiController.java

> java/jpabook/jpashop/api/MemberApiController.java

```
package jpabook.jpashop.api;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.service.MemberService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

//@Controller @RequestBody // 두개 합친 것이 @RestController
@RestController
@RequiredArgsConstructor
public class MemberApiController {

    private final MemberService memberService;

    /*
    *  첫번째 버전의 회원등록
    * */
    @PostMapping("/api/v1/members")
    public CreateMemberResopnse saveMemberV1(@RequestBody @Valid Member member){
        Long id = memberService.join(member);
        return new CreateMemberResopnse(id);
    }

    @Data
    static class CreateMemberResopnse {
        private long id;

        public CreateMemberResopnse(long id) {
            this.id = id;
        }
    }
}

```


![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-002.png)

> postman(api 호출 어플리케이션)에서 작성했던대로, post 방식으로 <br>
> localhost:8080/api/v1/members <br>

> request
```
"body" : {
	{
	    "name" : "hello"
	}
}
```

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-003.png)

> response
```
{
    "id": 97
}
```


> 파라미터를 아무것도 넣지 않는다면 


![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-004.png)

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-005.png)

> null로 모두 들어가게 됩니다. 

> 이것을 엔티티에 제약조건을 추가하여 @Valid를 사용해 처리해 보겠습니다.

```
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Member {

    public Member() {
    }

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    @NotEmpty
    private String name;

    @Embedded
    private Address address;


    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();

}

```

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-004.png)


![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-006.png)


> console - 스프링에서 자동으로 설정해둔 오류 스타일

```
{
    "timestamp": "2022-08-04T13:50:41.681+00:00",
    "status": 400,
    "error": "Bad Request",
    "trace": "org.springframework.web.bind.MethodArgumentNotValidException: Validation failed for argument [0] in public jpabook.jpashop.api.MemberApiController$CreateMemberResopnse jpabook.jpashop.api.MemberApiController.saveMemberV1(jpabook.jpashop.domain.Member): [Field error in object 'member' on field 'name': rejected value [null]; codes [NotEmpty.member.name,NotEmpty.name,NotEmpty.java.lang.String,NotEmpty]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [member.name,name]; arguments []; default message [name]]; default message [비어 있을 수 없습니다]] \r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.resolveArgument(RequestResponseBodyMethodProcessor.java:141)\r\n\tat org.springframework.web.method.support.HandlerMethodArgumentResolverComposite.resolveArgument(HandlerMethodArgumentResolverComposite.java:122)\r\n\tat org.springframework.web.method.support.InvocableHandlerMethod.getMethodArgumentValues(InvocableHandlerMethod.java:179)\r\n\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:146)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)\r\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1067)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:963)\r\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)\r\n\tat org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:909)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:681)\r\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)\r\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)\r\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)\r\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)\r\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)\r\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)\r\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)\r\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)\r\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)\r\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:889)\r\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)\r\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)\r\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\r\n\tat java.base/java.lang.Thread.run(Thread.java:834)\r\n",
    "message": "Validation failed for object='member'. Error count: 1",
    "errors": [
        {
            "codes": [
                "NotEmpty.member.name",
                "NotEmpty.name",
                "NotEmpty.java.lang.String",
                "NotEmpty"
            ],
            "arguments": [
                {
                    "codes": [
                        "member.name",
                        "name"
                    ],
                    "arguments": null,
                    "defaultMessage": "name",
                    "code": "name"
                }
            ],
            "defaultMessage": "비어 있을 수 없습니다",
            "objectName": "member",
            "field": "name",
            "rejectedValue": null,
            "bindingFailure": false,
            "code": "NotEmpty"
        }
    ],
    "path": "/api/v1/members"
}
```

##### @Valid
> javax.validation의 기능으로 필수값 체크

```
	javax.validation @Target({ElementType.METHOD,ElementType.FIELD,ElementType.CONSTRUCTOR,ElementType.PARAMETER,ElementType.TYPE_USE}) 
@Retention(RetentionPolicy.RUNTIME) 
@Documented 
public interface Valid
extends annotation.Annotation
```


> 중복된 이름의 회원을 입력했을때

![contact](/images/develop/backend/jpa-api-development-and-performance-optimization/member-registration-api/img-007.png)

> 현 프로젝트에서는 간단하게 회원명을 식별자로 두어 회원명만 중복체크합니다.


### 엔티티에서의 벨리데이션 체크 문제 
> 프리젠테이션 계층을 위해 API의 엔티티에서 벨리데이션 체크를 하는 것은 바람직하지 않습니다. <br>
어떠한 API에서는 벨리데이션을 해야하고, 어떤 API에서는 하지 않아야 할 필요성이 있어 나누어야 할 필요도 있기 때문입니다.

> 또한 

```
    @NotEmpty
    //private String name;
    private String username;
```

> 위의 엔티티의 컬럼이 변경되었을때, API의 스팩이 변경되어 해당 스팩 변경을 인식하기 전까지 호출자 또는 타시스템 등 장애가 발생할 수 있는 요소가 됩니다.

> 정리하면 엔티티를 손대서 API 스팩 자체가 변하는게 문제입니다. 엔티티라는 것은 여러군데에서 사용하기 때문에 수정될 수 있는 확률이 높기때문에 

> <mark>API 스팩을 위한 별도의 DTO가 필요</mark>합니다.

> API를 만들때 엔티티를 파라미터로 받으면 안되고 엔티티를 외부로 노출 시키면 안됩니


#### 회원등록 API V2

> MemberApiController.java

```
	/*
     *  두번째 버전의 회원등록
     * */
    @PostMapping("/api/v2/members")
    public CreateMemberResopnse saveMemberV2(@RequestBody @Valid CreateMemberRequest request){

        Member member = new Member();
        member.setName(request.getName());
        member.setAddress(new Address(request.getCity(),request.getStreet(),request.getZipcode()));

        Long id = memberService.join(member);
        return new CreateMemberResopnse(id);
    }

    
     @Data
    static class CreateMemberRequest {
        @NotEmpty
        private String name;
        @NotEmpty
        private String city;
        @NotEmpty
        private String street;
        @NotEmpty
        private String zipcode;
    }
```

> DTO를 사용하면 좋은점중 하나는 개발자는 엔티티만 보고 API를 통해 어떤 파라미터가 넘어오는지 알수 없습니다. 하지만 API에 1:1로 매핑된 DTO를 보고 해당 API의 구조를 대강 이해할 수 있습니다.


##### @RequestBody
> Json으로 넘어온 파라미터를 변수(Member member)에 할당

```
	public CreateMemberResopnse saveMemberV1(@RequestBody @Valid Member member){
```

##### @RestController

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {

	/**
	 * The value may indicate a suggestion for a logical component name,
	 * to be turned into a Spring bean in case of an autodetected component.
	 * @return the suggested component name, if any (or empty String otherwise)
	 * @since 4.0.1
	 */
	@AliasFor(annotation = Controller.class)
	String value() default "";

}

```

#### @Data
> @Data 어노테이션은 @Getter, @Setter, @ToString, @EqualsAndHashCode와 @RequiredArgsConstructor를 합쳐놓은 종합 선물세트와 같다

> POJO와 관련된 모든 보일러플레이트를 생성한다.



### 정리

> 엔티티와 프리젠테이션 계층간 로직을 분리를 할 수 있습니다. <br> 
엔티티와 API 스팩을 분리할 수 있어 엔티티를 변환해도 API 스팩에 변화가 없습니다.

### 이전 소스
---------------------
> - <a href="https://github.com/offetuoso/jpa-practice.git">https://github.com/offetuoso/jpa-practice.git<a>

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94">실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - 김영한</a>
