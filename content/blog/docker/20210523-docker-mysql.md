---
title: "도커에 Mysql 올리기 (Docker Mysql)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-23
slug: "docker-mysql"
description: "도커에 Mysql 올리기"	
keywords: ["Docker"]
draft: true
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

## github에 Docker 프로젝트 올리기
> 1. 우선 github에 repository를 생성 

```
offetuoso@DESKTOP-T63V4LM MINGW64 /c/develop/Git
$ git clone https://github.com/offetuoso/docker_practicse.git
Cloning into 'docker_practicse'...
warning: You appear to have cloned an empty repository.

offetuoso@DESKTOP-T63V4LM MINGW64 /c/develop/Git
$ cd docker_practicse/

```



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

> 참고 : 
> - <a href="https://www.docker.com/why-docker">도커 웹 페이지</a>