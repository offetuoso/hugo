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
![contact](/images/develop/backend/restapi/demo-rest-api-1/demo-restapi-1-000.png)

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

![contact](/images/develop/backend/restapi/demo-rest-api-2/demo-restapi-2-000.png)
