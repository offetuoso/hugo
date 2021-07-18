---
title: "RESTful API에 AWS RDS(MySql)서비스와 Mybatis 연동"
image: "bg-rest.png"
font_color: "white"
font_size: "22px"
opacity: "0.4"
date: 2021-07-06
slug: "restful-api-3"
description: "레스트풀 API"	
keywords: ["Restful"]
draft: true
categories: ["Restful"]
tags: ["Restful","Api", "AWS", "RDS", "Mysql","Mybatis"]
math: false
toc: true
---

# RESTful API에 AWS RDS(MySql)서비스와 Mybatis 연동

## AWS RDS에 MySQL 인스턴스 생성 후 연결 
> 과거 만들어둔 AWS의 RDS 서비스 인스턴스를 참조 게시물 <a href="https://offetuoso.github.io/blog/develop/database/mysql/aws-rds-mysql/">링크</a>

## MySql 데이터베이스 및 테이블 생성

### Database 생성
> 캐릭터셋 유의 
```
	CREATE DATABASE [DB명] DEFAULT CHARACTER SET [Incoding_set] COLLATE [Incoding_ci];
```
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_001.png)

### 사용자 생성 및 권한 부여

> 사용자 생성
```
	create user [userId] @localhost identified by ['userPw'];
```

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_003.png)

> 모든 권한 부여
```
	grant all privileges on [DB명].* to [userId]@localhost identified by ['userPw'];
```

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_004.png)


> DB 사용
```
	use mysql;
```

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_005.png)


### Table 생성
```
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(128) DEFAULT NULL,
  `company_address` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_name` (`company_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

```

## Spring Stater Project 생성
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_006.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_007.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_008.png)

### Lombok 라이브러리 추가
> 자바의 데이터 객체를 만들다 보면 getter와 setter, toString을 생성해줘야 하는데, <br>
Lombok의 @Data 어노테이션을 이용하면, 소스를 추가 하지 않아도 자동으로 getter, setter 등<br> 기타 메소드를 인식해준다.

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_009.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_010.png)


### CompanyMapper.java 추가
> commpany Table에 접근할 Mapper 인터페이스를 생성

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_011.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_012.png)

### Company.java 추가
> commpany Data 객체를 생성

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_013.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_014.png)

#### Lombok의 @Data 어노테이션 추가
> @Data 어노테이션을 추가하여, getter와 setter, toString 등 기능을 자동으로 적용 <br>
> @Data 어노테이션 추가후, getter setter 인식 안될때 <a>Lumbok 설치</a>

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_015.png)

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_016.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_017.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_018.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_019.png)

### CompanyController.java 추가
> CompanyController는 company에 관련된 요청을 처리할 컨트롤러입니다.

![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_020.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_021.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_022.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_023.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_024.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_025.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_026.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_027.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_028.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_029.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_030.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_031.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_032.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_033.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_034.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_035.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_036.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_037.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_038.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_039.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_040.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_041.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_042.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_043.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_044.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_045.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_046.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_047.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_048.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_049.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_050.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_051.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_052.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_053.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_054.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_055.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_056.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_057.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_058.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_059.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_060.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_061.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_062.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_063.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_064.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_065.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_066.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_067.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_068.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_069.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_070.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_071.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_072.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_073.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_074.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_075.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_076.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_077.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_078.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_079.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_080.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_081.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_082.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_083.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_084.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_085.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_086.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_087.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_088.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_089.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_090.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_091.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_092.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_093.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_094.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_095.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_096.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_097.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_098.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_099.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_100.png)
![contact](/images/develop/backend/demo-rest-api-3/springboot_mybatis_101.png)
