---
title: "AWS RDS에 MySQL 인스턴스 생성 후 연결"
image: "bg-aws.png"
font_color: "white"
font_size: "30px"
opacity: "0.7"
date: 2021-06-17
slug: "aws-rds-mysql"
description: "AWS RDS를 이용한 Mysql"
keywords: ["RDS"]
draft: false
categories: ["Backend"]
subcategories: ["AWS"]
tags: ["AWS", "RDS", "MySQL"]
math: false
toc: true
---

# AWS RDS
![contact](/images/develop/backend/database/aws-rds-mysql/000.png)

## RDS 서비스 생성

> <a href="https://aws.amazon.com/ko/console/">AWS Management Console</a>에서 RDS 접속

![contact](/images/develop/backend/database/aws-rds-mysql/001.png)


### RDS 데이터베이스 인스턴스 생성
> RDS에 MySQL <a href="https://ko.wikipedia.org/wiki/%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)">인스턴스를</a> 생성한다.


> 데이터베이스 생성 클릭

![contact](/images/develop/backend/database/aws-rds-mysql/002.png)



> 데이터베이스 생성 
> 1. 표준 생성
> 2. 원하는 데이터베이스 선택

![contact](/images/develop/backend/database/aws-rds-mysql/003.png)

> Mysql 버전 선택과 템플릿 설정 
> 1. Mysql Community 
> 2. Mysql 버전 선택 - MySQL 5.7.22
> 3. 템플릿 선택 - 

![contact](/images/develop/backend/database/aws-rds-mysql/004.png)



> DB 인스턴스 설정
> 1. 인스턴스명 추가
> 2. DB에 접근할 계정 정보 입력

![contact](/images/develop/backend/database/aws-rds-mysql/006.png)



> DB 인스턴스 크기

![contact](/images/develop/backend/database/aws-rds-mysql/007.png)




> DB 인스턴스 크기
> 1. 스토리지 자동조정 해제 - 체크 해두면 자동 스토리지 증설로 인한 요금부과가 될 수 있습니다.

![contact](/images/develop/backend/database/aws-rds-mysql/008.png)




> 연결 설정
> 1. 추가 연결 구성 클릭후 펼치기

![contact](/images/develop/backend/database/aws-rds-mysql/008-1.png)


> 2. 외부 연결을 위한 퍼블릭 액세스 수정 - 예

![contact](/images/develop/backend/database/aws-rds-mysql/008-2.png)


> 데이터베이스 생성

> 생성된 데이터베이스 인스턴스 확인
![contact](/images/develop/backend/database/aws-rds-mysql/008-3.png)


### 파라미터 그룹 추가
> 데이터베이스의 문자 인코딩 관련 파라미터를 UTF-8로 설정을 한다.


> 왼쪽 메뉴 파라미터 그룹 - 파라미터 그룹 생성

![contact](/images/develop/backend/database/aws-rds-mysql/009.png)



> 파라미터 그룹 생성 
> 1. 생성한 MySQL 버전을 선택 - 잘못 선택되면 파라미터 그룹 선택 창에서 보이지 않음
> 2. 파라미터 정보 추가

![contact](/images/develop/backend/database/aws-rds-mysql/019.png)



> 생성된 파라미터 그룹명 클릭 

![contact](/images/develop/backend/database/aws-rds-mysql/020.png)



> 파라미터 인코딩 수정
> 1. cha 검색

![contact](/images/develop/backend/database/aws-rds-mysql/021.png)




> 1.1. utf8 선택 가능한 것들 모두 수정

![contact](/images/develop/backend/database/aws-rds-mysql/022.png)




> 2. col 검색

![contact](/images/develop/backend/database/aws-rds-mysql/023.png)



> 2.1. utf8 선택 가능한 것들 모두 수정

![contact](/images/develop/backend/database/aws-rds-mysql/024.png)


> 생성된 데이터베이스 인스턴스 수정

![contact](/images/develop/backend/database/aws-rds-mysql/024-1.png)

![contact](/images/develop/backend/database/aws-rds-mysql/024-2.png)



> 생성한 파라미터 그룹 선택

![contact](/images/develop/backend/database/aws-rds-mysql/025.png)

> 데이터베이스 인스턴스 수정
> 1. 수정 예약 - 즉시 적용


> 수정중

![contact](/images/develop/backend/database/aws-rds-mysql/027.png)




### 보안 설정 (인바운스)
> 외부에서 접속이 안되는 경우 확인 해봐야 할것 
> 1. 연결 - 퍼블릭액세스 (예)
> 2. 보안 - 인바운스 규칙

> 데이터베이스 - 인스턴스 - 수정

![contact](/images/develop/backend/database/aws-rds-mysql/024-2.png)



> 인바운스 default 클릭

![contact](/images/develop/backend/database/aws-rds-mysql/037.png)




> 보안그룹 클릭

![contact](/images/develop/backend/database/aws-rds-mysql/038.png)



> 인바운스 규칙 편집 

![contact](/images/develop/backend/database/aws-rds-mysql/039.png)



> 인바운스 규칙 저장 

![contact](/images/develop/backend/database/aws-rds-mysql/041.png)



### DBeaver 연결

![contact](/images/develop/backend/database/aws-rds-mysql/029.png)



> 연결 생성 

![contact](/images/develop/backend/database/aws-rds-mysql/030.png)



> Server 정보 추가  

![contact](/images/develop/backend/database/aws-rds-mysql/031.png)



> 1. Server Host는 생성한 RDS의 엔드포인트 입력
> - RDS 왼쪽 메뉴 데이터베이스 - 인스턴스 - 연결및 보안

![contact](/images/develop/backend/database/aws-rds-mysql/032.png)



> 연결 완료

![contact](/images/develop/backend/database/aws-rds-mysql/042.png)

## End 
 
 
