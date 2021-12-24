---
title: "도커에 Mysql 올리기-2 (Docker Mysql)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-25
slug: "docker-mysql"
description: "도커에 Mysql 올리기-2"	
keywords: ["Docker"]
draft: true
categories: ["Backend"]
subcategories: ["Docker"]
tags: ["Docker","Mysql"]
math: false
toc: true
---


# 도커에 Mysql 올리기
![contact](/images/docker/docker_running_0.png)

## 생성된 Mysql로 접속해보기 
> mysql 나가기
```
mysql> exit
Bye
```

> 이제 컨테이너 안의 설치된 Mysql로 접속해 보도록 하겠습니다.
> 컨테이너의 세부정보를 알기 위하여 docker insspect 명령어를 실행합니다.

> - docker ps -a
> - docker inspect test_mysql
  
``` 
  PS C:\> docker ps -a
CONTAINER ID   IMAGE       COMMAND                  CREATED        STATUS          PORTS                                       NAMES
4b6fb99160bf   mysql:5.6   "docker-entrypoint.s…"   27 hours ago   Up 14 minutes   0.0.0.0:9876->3306/tcp, :::9876->3306/tcp   test_mysql
PS C:\> docker inspect test_mysql

...
...
  "Ports": {
                "<mark>3306</mark>/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "<mark>9876</mark>"
                    },
                    {
                        "HostIp": "::",
                        "HostPort": "<mark>9876</mark>"
                    }
                ]
            },
            "SandboxKey": "/var/run/docker/netns/5cc99d43b2eb",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "db6043d43246bca175329edc047471608f42927e9adbd333bac5c93f3528aaa2",
            "Gateway": "<mark>172.17.0.1</mark>",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": <mark>"172.17.0.2"</mark>,
...
...

```







> 참고 : 
> - <a href="https://www.docker.com/why-docker">도커 웹 페이지</a>