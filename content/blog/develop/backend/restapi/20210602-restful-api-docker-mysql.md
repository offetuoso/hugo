---
title: "RESTful API에 Docker Mysql과 Mybatis 연동"
image: "bg-rest.png"
font_color: "white"
font_size: "22px"
opacity: "0.4"
date: 2021-06-02
slug: "restful-api-3"
description: "레스트풀 API"	
keywords: ["Restful"]
draft: true
categories: ["Restful"]
tags: ["Restful","Api", "Docker", "Mysql","Mybatis"]
math: false
toc: true
---

# RESTful API - Docker의 Mysql과 Mybatis 연동
![contact](/images/develop/backend/demo-rest-api-1/demo-restapi-1-000.png)

## Docker
> Docker에 Mysql을 올리는 것은 저번 포스팅에서 진행하였기 때문에 <a href="https://offetuoso.github.io/blog/develop/backend/docker/docker-mysql/">도커에 Mysql 올리기</a> 링크를 남기고 다음부터 진행합니다.

> 지난 포스트에서 생성한 Docker의 Mysql 컨테이너를 실행

> 1. docker ps -a ("컨테이너 조회")

> 2. docker start <container name> ("컨테이너 시작")
>    - docker restart <container name> ("컨테이너에 재시작하기")
>    - docker stop <container name> ("컨테이너에 종료하기")
>    - docker attach <container name> ("현재 실행중인 컨테이너에 접속하기")

> 3. sudo docker exec -it <container name> /bin/bash ("컨테이너의 CLI 접속")

```
PS C:\WINDOWS\system32> docker ps -a
CONTAINER ID   IMAGE       COMMAND                  CREATED      STATUS                    PORTS                                       NAMES
4b6fb99160bf   mysql:5.6   "docker-entrypoint.s…"   9 days ago   Exited (255) 2 days ago   0.0.0.0:9876->3306/tcp, :::9876->3306/tcp   test_mysql
PS C:\WINDOWS\system32> docker start test_mysql
test_mysql
PS C:\WINDOWS\system32> sudo docker exec -it test_mysql /bin/bash
```

![contact](/images/develop/backend/demo-rest-api-2/demo-restapi-2-000.png)

## DBeaver 연결 및 테이블 생성
> 지난 포스트 <a href="/blog/develop/database/mysql/mysql-dbeaver-install/">Mysql DBeaver 설치</a> 참조

>  UserProfile table 생성

```
-- test.UserProfile definition

CREATE TABLE `UserProfile` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(64) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

## Dependency 추가 

### Dependency란 ? 
> 자바 프로젝트 관리 도구인 <a href="https://ko.wikipedia.org/wiki/%EC%95%84%ED%8C%8C%EC%B9%98_%EB%A9%94%EC%9D%B4%EB%B8%90">아파치 메이븐</a>의 XML형태의 라이브러리(의존성)이며, Spring에서 Pom.xml에 추가하는 것을 의존성 주입이라 하며, 
xml 형식으로 추가하면 <a href="https://mvnrepository.com/">Maven Repositoy</a>에서 라이브러리 파일을 자동으로 받아준다.

