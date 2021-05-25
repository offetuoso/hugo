---
title: "도커에 Mysql 올리기-1 (Docker Mysql)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-23
slug: "docker-mysql"
description: "도커에 Mysql 올리기"	
keywords: ["Docker"]
draft: false
categories: ["Docker"]
tags: ["Docker","Mysql"]
math: false
toc: true
---


# 도커에 Mysql 올리기
![contact](/images/docker/docker_running_0.png)


## 도커 버전 체크 
> cmd창 또는 Windows PowerShell을 싱행한다. 
![contact](/images/docker/docker_mysql_0.png)

## 도커 초기화 
> 일단 도커의 이미지/컨테이너들을 모두 지워주는 것 부터 시작하겠습니다.
```
PS C:\> sudo docker rm -f `sudo docker ps -a -q`
PS C:\> sudo docker rmi -f `sudo docker images`
```

![contact](/images/docker/docker_mysql_1.png)

## 도커 이미지 가져오기 (get Mysql Image for Docker)
> Mysql의 경우 DockerHub에 있기 때문에, 쉽게 이미지를 받아 올 수 있습니다.
> - DockerHub에서 mysql 이미지 받아오기

```
PS C:\> docker pull mysql
Using default tag: latest
latest: Pulling from library/mysql
Digest: sha256:d50098d7fcb25b1fcb24e2d3247cae3fc55815d64fec640dc395840f8fa80969
Status: Image is up to date for mysql:latest
docker.io/library/mysql:latest
```

![contact](/images/docker/docker_mysql_2.png)

> - 다운받은 도커 이미지 확인

```
PS C:\> docker images
REPOSITORY               TAG       IMAGE ID       CREATED        SIZE
mysql                    latest    c0cdc95609f1   13 days ago    556MB
docker/getting-started   latest    3ba8f2ff0727   2 months ago   27.9MB
```

![contact](/images/docker/docker_mysql_3.png)

### Mysql 컨테이너 설정 
> sudo docker run -d -p 9876:3306 -e MYSQL_ROOT_PASSWORD=passw0rd --name test_mysql mysql:5.6

```
PS C:\> sudo docker run -d -p 9876:3306 -e MYSQL_ROOT_PASSWORD=passw0rd --name test_mysql mysql:5.6
```

#### docker 옵션 
> 1. <mark>-d</mark> 는 컨테이너를 백그라운드에서 동작하는 어플리케이션으로 실행

> 2. <mark>-p 9876:3306</mark> 는
-p 옵션은 호스트와 컨테이너 간의 포트(port) 배포(publish)/바인드(bind)를 위해서 사용되는데요. 호스트(host) 컴퓨터에서 컨테이너에서 리스닝하고 있는 포트로 접속할 수 있도록 설정해줍니다.
위 커맨드는 컨테이너 내부에서 3306 포트로 리스닝하고 있는 HTTP 서버를 호스트 컴퓨터에서 9876 포트로 접속할 수 있도록 해줍니다.

> 3. <mark>-e</mark> 는 Docker 컨테이너의 환경변수를 설정하기 위해서는 -e 옵션을 사용합니다. 또한, -e 옵션을 사용하면 Dockerfile의 ENV 설정도 덮어써지게 됩니다. 아래 커맨드는 FOO 환경 변수를 bar로 세팅을 하고, 환경 변수를 출력하고 있습니다.

> 4. <mark>MYSQL_ROOT_PASSWORD=passw0rd</mark>는 mysql의 기본 비밀번호를 설정합니다.

> 5. <mark>--name test_mysql</mark>은 
Docker 컨테이너를 제어할 때 컨테이너 ID를 사용하면 읽거나 기억하기가 어려워서 불편하게 느껴집니다. 이럴 경우, --name 옵션을 사용해서 컨테이너에 이름을 부여해주면 해당 <mark>test_mysql</mark> 이름으로 컨테이너를 식별할 수 있습니다.



### 생성된 Mysql 컨테이너 확인
> docker ps -a 명령어 실행

```
PS C:\> docker ps -a
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS          PORTS                                                  NAMES
af3dd622e753   mysql     "docker-entrypoint.s…"   28 hours ago   Up 32 minutes   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   test_mysql
```

![contact](/images/docker/docker_mysql_4.png)

### Mysql 컨테이너 test_mysql의 CLI 접속 
> sudo docker exec -it <mark>test_mysql</mark> /bin/bash 명령어 실행

```
PS C:\> sudo docker exec -it test_mysql /bin/bash
```

![contact](/images/docker/docker_mysql_5.png)

### Mysql 테스트

#### 설치시 등록한 암호 입력
> mysql -u root -p

```
root@4b6fb99160bf:/# mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2021, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

![contact](/images/docker/docker_mysql_6.png)

#### Mysql user 생성 및 권한 부여
> 개발에 사용할 developer라는 유저 생성

```
mysql> CREATE USER 'developer'@'%' IDENTIFIED BY 'passw0rd';
Query OK, 0 rows affected (0.00 sec)
```

> developer에게 모든 권한 부여

```
mysql> GRANT ALL PRIVILEGES ON *.* TO 'developer'@'%';
Query OK, 0 rows affected (0.00 sec)

mysql>
```
![contact](/images/docker/docker_mysql_7.png)

#### 유저 변경

```
mysql> quit
Bye
root@4b6fb99160bf:/# mysql -u developer -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2021, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

#### 데이터베이스 생성 

```
mysql> create database test;
Query OK, 1 row affected (0.00 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
4 rows in set (0.00 sec)

mysql>
```

![contact](/images/docker/docker_mysql_8.png)



> 참고 : 
> - <a href="https://www.docker.com/why-docker">도커 웹 페이지</a>