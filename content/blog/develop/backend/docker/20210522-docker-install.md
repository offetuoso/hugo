---
title: "도커 설치 (Docker Install) "
image: "bg-docker.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-22
slug: "docker-install"
description: "도커 설치"	
keywords: ["Docker"]
draft: false
categories: ["Docker"]
tags: ["Docker","Install"]
math: false
toc: true
---


# 도커 (Docker) 
![contact](/images/docker/docker_install_0.png)

## 도커란 ?
> 도커란 리눅스의 응용 프로그램들을 프로세스 격리 기술을 사용해 컨테이너로 실행하고 관리하는 오픈 소스 프로젝트.
> 도커 웹 페이지의 기능을 인용하면 다음과 같다:
``` 
도커 컨테이너는 일종의 소프트웨어를 소프트웨어의 실행에 필요한 모든 것을 
포함하는 완전한 파일 시스템 안에 감싼다. 
여기에는 코드, 런타임, 시스템 도구, 시스템 라이브러리 등 서버에 설치되는
 무엇이든 아우른다. 
이는 실행 중인 환경에 관계 없이 언제나 동일하게 실행될 것을 보증한다.
```

### 도커의 특징
> 1. 도커의 컨테이너는 각각 독립적이다. 독립적으로 존재하기 때문에 원하는 어떤 환경이든 모듈적으로 관리 가능하다.
> 2. 하나의 서버에 각각의 여러개의 컨테이너를 갖을 수 있다.
> 3. 컨테이너는 줄이거나 늘릴 수 있다. 예를 들면 자바 서버의 트래픽이 늘어 난다면, 장고 서버를 줄이고 자바를 더 싣을 수 있다.
> 4. 도커를 사용하면 서버를 늘릴 때마다 서버를 구매하고 다시 설치할 필요가 없어진다
> 5. 원하는 개발 환경 파일에 저장을 하면, docker는 이를 원하는 어떤 머신이든 해당 환경을 시뮬레이션 해준다.

### 도커의 장/단점

####장점
> 1. 빠른 실행 환경 구축
> 2. 가볍고 빠른 실행 속도
> 3. 하드웨어 자원 절감
> 4. 공유 환경 제공, DockerHub를 통해 검증된 많은 이미지들 사용가능 
> 5. 쉬운 배포(Deploy) 제공

####단점
> 1. 초기 진입장벽에 의한 업무효율 감소
> 2. 리눅스 기반


## 도커 설치 (Window 10)

### 1. 도커 설치를 위한 준비

> Windows 10에서 도커를 설치 하기 위해서는 <a href="https://docs.microsoft.com/ko-kr/virtualization/hyper-v-on-windows/about/">Hyper-V</a>를 설치해야 합니다. Hyper-V를 사용하면 Windows에서 가상 머신으로 여러 운영 체제를 실행할 수 있습니다. 


![contact](/images/docker/docker_install_1.png)


### 2. 도커 다운로드 및 설치
> - <a href= "https://hub.docker.com/editions/community/docker-ce-desktop-windows/">도커 웹 페이지</a>에서 Get Docker 클릭 하여 다운로드
![contact](/images/docker/docker_install_2.png)


> - Ok를 눌러 넘어갑니다. 
> - <a href="https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4%EC%9A%A9_%EC%9C%88%EB%8F%84%EC%9A%B0_%ED%95%98%EC%9C%84_%EC%8B%9C%EC%8A%A4%ED%85%9C">WSL2(Windows Subsystem for Linux 2)</a>란? 
>
![contact](/images/docker/docker_install_3.png)


> - 설치가 완료 되면 "Close and log out" 를 클릭하여 재접속 합니다.
![contact](/images/docker/docker_install_4.png)

> - 재접속 후에는 Host에 docker의 Localhost가 추가 되어 Window에서 악성코드에 의하여 Host파일이 변경되었다고 알람이 뜰 수도 있습니다. Host 내용 한번 확인하시고 아래와 같은 내용이라면 무시해도 됩니다. 
![contact](/images/docker/docker_install_5.png)

> - 도커가 실행되며,
![contact](/images/docker/docker_install_6.png)
> - 윈도우 트레이 아이콘에서도 확인 할 수 있습니다.
![contact](/images/docker/docker_install_7.png)


## 윈도우에서 sudo 사용하기

> Docker를 공부하는 도중 명령어 중에 sudo가 포함된 명령어를 실행시 cmd 기준 아래와 같은 화면이 나타났다.
![contact](/images/docker/docker_running_2.png)

> 윈도우에서는 기본적으러 sudo를 지원하지 않기 때문인거같아 choco라는 패키지 관리자를 이용하여 설치를 하여 해결하였다.

> <a href="https://chocolatey.org/">choco</a>라는 패키지 관리자를 통하여 sudo 패키지를 설치하면 된다. 
```
choco install sudo
choco upgrade sudo
```
![contact](/images/docker/docker_running_1.png)

> 참고 : 
> - <a href="https://www.docker.com/why-docker">도커 웹 페이지</a>