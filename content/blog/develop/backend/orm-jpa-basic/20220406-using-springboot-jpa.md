---
title: "스프링부트 JPA 활용 - 프로젝트 생성"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-04-06
slug: "using-springboot-jpa-new-project"
description: "스프링부트 JPA 활용 - 프로젝트 생성"	
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA 활용","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---


# 스프링부트 JPA 활용(Using SpringBoot JPA)
-----------------------------------

## 목차
-----------------------------------
> 1. 프로젝트 생성
> 2. 라이브러리 살펴보기
> 3. H2 데이터베이스 설치
> 4. JPA와 DB 설정, 동작확인


## 프로젝트 생성
-----------------------------------
> - 스프링 부트 스타터(<a href="https://start.spring.io/">https://start.spring.io/</a>)
> - 사용기능 : Web, Thymeleaf, JPA, H2, Lombok
>	- groupId : jpabook
>	- artifactId : jpashop

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-001.png)

> 프로젝트 타입은 Gradle Project 최근에는 Maven이 아니라 Gradle이 많이 사용된다고 합니다.

> 언어는 당연히 자바 !

> 스프링부트는 안정화 버전을 추천하며, 전 2.6.6

> GroupId는 jpabook 

> ArtifactId는 jpashop


![contact](/images/develop/backend/using-springboot-jpa/new-project/img-002.png)

> Dependencies는 
>	1. web (Spring Web)
>	2. Thymeleaf
>	3. JPA
>	4. H2
>	5. Lombok

####	1. web (Spring Web)
>	RESTful, MVC, tomcat 내장하고 있는 라이브러리로 웹을 개발할 때 꼭 필요합니다.

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-003.png)


####	2. Thymeleaf
>	jsp가 아닌 모던한 서버 사이드 자바 템플릿 - 최근에는 JSP를 잘 안쓴다고합니다.

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-004.png)

####	3. JPA
>	JPA는 따로 없고 Spring Data JPA를 사용, 스프링 데이터와 하이버네이트를 이용한 JPA 

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-005.png)

> 이번 강의는 Spring Data JPA의 설명은 없고 SpringBoot와 JPA를 가지고 웹 애플리케이션을 만드는데 초점을 두었습니다. <br>
> Spring Data JPA는 스프링과 JPA를 가지고 애플리케이션을 잘 만드는 방법을 안다면, Spring Data JPA를 쉽게 터득하고 많은 코드 중복 사용을 줄일수 있기 때문에 JPA를 깊이 터득하고 도움용으로 사용하기를 권장합니다.

####	4. H2
>	데이터베이스는 H2를 사용하겠습니다. H2 데이터베이스는 내장으로 쉽게 사용할 수 있는 장점이 있습니다. 테스트용으로 많이 사용합니다.

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-006.png)

####	5. Lombok
>	엔티티의 Getter Setter를 추가 하지 않아도 사용가능하게 만들어주는 어노테이션

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-007.png)

> 여기까지 Dependencies 설정을 하겠습니다.

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-008.png)


![contact](/images/develop/backend/using-springboot-jpa/new-project/img-009.png)

> 자바 버전은 8로 하고 GENERATE를 눌러 다운받습니다.

> 다운받은 프로젝트 압축파일은 적당한 위치에 위치시킵니다.


![contact](/images/develop/backend/using-springboot-jpa/new-project/img-010.png)

> 저는 개인적으로 공부한 프로젝트는 깃에 올리기 때문에 깃 폴더로 이동시켰습니다.


![contact](/images/develop/backend/using-springboot-jpa/new-project/img-011.png)

> IntelliJ IDEA에서 Import 또는 Open 으로 프로젝트를 불러옵니다.

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-012.png)

> Gradle 프로젝트를 신뢰하는지 물어보는데 당연히 신뢰를 눌러줍니다.

> 처음 프로젝트를 오픈하게 되면 2에서 최대 5분까지 라이브러리를 받아옵니다.



> 한참 Gradle로 라이브러리들을 다운받고 나면, build.gradle을 열어확인해 봅니다.

#### 라이브러리 설정 확인

> bulild.gradle

````
plugins {														/*	플러그인에 대한 설정	*/
	id 'org.springframework.boot' version '2.6.6'					/*	스프링부트를 사용하면 스프링부트가 필요한 플러그인들이 기본적으로 추가됩니다.   */
	id 'io.spring.dependency-management' version '1.0.11.RELEASE'	/*	스프링부트 버전에 따라 라이브러리에 대한 Dependency까지 관리   */
	id 'java'
}

group = 'jpabook'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.8'	

configurations {
	compileOnly {
		extendsFrom annotationProcessor	/* lombok에서 추가된 세팅 뒤에서 설명 */
	}
}

repositories {
	mavenCentral()	// mavenCentral에서 라이브러리를 받겠다는 설정
}

dependencies {	/* 의존관계 */
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	runtimeOnly 'com.h2database:h2'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
	useJUnitPlatform()
}

````

#### 프로젝트 실행

> java/jpabook/jpashop/JpashopApplication.java 

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-013.png)

> 스프링 부트 스타터에서 생성해준 main class를 열어서 

![contact](/images/develop/backend/using-springboot-jpa/new-project/img-014.png)

> 파일 우클릭 후 실행 'JpashopApplication(U)' 또는 Ctrl + Shift + F10

09:32



#### 참고
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-%ED%99%9C%EC%9A%A9-1">실전! 스프링 부트와 JPA 활용1 - 웹 애플리케이션 개발 - 김영한</a>
