---
title: "BAEKJOON - 2941 크로아티아 알파벳"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-06
slug: "baekjoon-2941-croatian-alphabet"
description: "백준 크로아티아 알파벳"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 2941 크로아티아 알파벳(Croatian Alphabet)

## Task description

원문 : <a href="https://www.acmicpc.net/problem/2941">백준 2941 링크</a>

> 예전에는 운영체제에서 크로아티아 알파벳을 입력할 수가 없었다. 따라서, 다음과 같이 크로아티아 알파벳을 변경해서 입력했다.

크로아티아 알파벳 |	변경
------------- |------
č	          |	c=
ć	          |	c-
dž	          |	dz=
đ	          |	d-
lj	          |	lj
nj	          |	nj
š	          |	s=
ž	          |	z=

> - 예를 들어, ljes=njak은 크로아티아 알파벳 6개(lj, e, š, nj, a, k)로 이루어져 있다. 
> - 단어가 주어졌을 때, 몇 개의 크로아티아 알파벳으로 이루어져 있는지 출력한다.


## Condition
> - dž는 무조건 하나의 알파벳으로 쓰이고, d와 ž가 분리된 것으로 보지 않는다. lj와 nj도 마찬가지이다. 
> - 위 목록에 없는 알파벳은 한 글자씩 센다.

## input output

```
예제 입력 1 
ljes=njak
예제 출력 1
6

예제 입력 2
ddz=z=
예제 출력 2
3

예제 입력 3
nljj
예제 출력 3
3

예제 입력 4
c=c=
예제 출력 4
2

예제 입력 5
dz=ak
예제 출력 5
3
```

## Solution 
입력  |	변경
-----|------
dz=  | 0	(dž)
z=   | 1 	(ž)	
d-   | 2 	(đ)	
c=   | 3 	(č)	
c-   | 4 	(ć)	
nj   | 5 	(nj)
s=   | 6 	(š)	
lj   | 7 	(lj)

> 알파벳과 -, =  만 입력이 이루어 지기 때문에 
> 1자리의 다른 문자열로 치환(숫자) , 순서는 dz=가 z= 보다 먼저 배열에 들어가 있어야 한다.
> 자리수를 센다.

```
msg = input() # 케이스 입력받음

croatian = ['dz=','z=','d-','c=','c-','nj','s=','lj'] #크로아티아 문자열 배열, 치환할 우선순위에 맞게 배열 생성

for i in range(0,len(croatian)) :
	msg = msg.replace(croatian[i], str(i)) #크로아티아 문자열을 배열 인덱스로 변환

print(len(msg)) #길이 출력
	
```




## TestCase
```
ljes=njak #6
ddz=z= #3
nljj #3
c=c= #2
dz=ak #3
```
