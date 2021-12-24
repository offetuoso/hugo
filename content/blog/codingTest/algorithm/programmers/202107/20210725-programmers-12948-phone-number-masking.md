---
title: "Programmers 12948 핸드폰 번호 가리기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-25
slug: "programmers-12948-phone-number-masking"
description: "12948 핸드폰 번호 가리기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12948 핸드폰 번호 가리기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12948">Programmers 12948 링크</a>

> 프로그래머스 모바일은 개인정보 보호를 위해 고지서를 보낼 때 고객들의 전화번호의 일부를 가립니다.
전화번호가 문자열 phone_number로 주어졌을 때, 전화번호의 뒷 4자리를 제외한 나머지 숫자를 전부 *으로 가린 문자열을 리턴하는 함수, solution을 완성해주세요.



## Condition
> - s는 길이 4 이상, 20이하인 문자열입니다.


## input output
> 입출력 예

입출력 | 예
-------|--------
phone_number	|return
"01033334444"	|"*******4444"
"027778888"	|"*****8888"


## Solution 
> 1. 받아온 숫자를 뒤 4번째 부터 자른다.
> 2. 1에서 만든 4자리에 원래 받아온 숫자 자리수 까지 왼쪽을 *로 채운다 

```
def solution(phone_number): 
    return phone_number[-4:].rjust(len(phone_number),'*')
```

## Others Solution 
```
def hide_numbers(s):
    return "*"*(len(s)-4) + s[-4:]
```

## TestCase
```
solution("01033334444")
solution("027778888")
solution("4444")

```
