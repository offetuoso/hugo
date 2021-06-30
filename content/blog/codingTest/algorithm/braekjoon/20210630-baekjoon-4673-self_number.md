---
title: "BAEKJOON - 4673 셀프 넘버"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-30
slug: "self-number"
description: "백준 셀프 넘버"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# 백준 4673 Self Number

## Task description

> 문제
셀프 넘버는 1949년 인도 수학자 D.R. Kaprekar가 이름 붙였다. <br>
양의 정수 n에 대해서 d(n)을 n과 n의 각 자리수를 더하는 함수라고 정의하자. <br>
예를 들어, d(75) = 75+7+5 = 87이다.

> 양의 정수 n이 주어졌을 때, 이 수를 시작해서 <br>
n, d(n), d(d(n)), d(d(d(n))), ...과 같은 무한 수열을 만들 수 있다. 

> 예를 들어, 33으로 시작한다면 다음 수는 33 + 3 + 3 = 39이고, <br>
> 그 다음 수는 39 + 3 + 9 = 51, 다음 수는 51 + 5 + 1 = 57이다. <br>
> 이런식으로 다음과 같은 수열을 만들 수 있다.<br>

```
 33, 39, 51, 57, 69, 84, 96, 111, 114, 120, 123, 129, 141, ...
```

> n을 d(n)의 생성자라고 한다. 위의 수열에서 33은 39의 생성자이고, 39는 51의 생성자, 51은 57의 생성자이다.
> 생성자가 한 개보다 많은 경우도 있다. <br>
예를 들어, 101은 생성자가 2개(91과 100) 있다. 

> 생성자가 없는 숫자를 셀프 넘버라고 한다. 
100보다 작은 셀프 넘버는 총 13개가 있다. 

```
1, 3, 5, 7, 9, 20, 31, 42, 53, 64, 75, 86, 97
```

> 10000보다 작거나 같은 셀프 넘버를 한 줄에 하나씩 출력하는 프로그램을 작성하시오.

## Condition
> - 10,000보다 작거나 같은 셀프 넘버를 한 줄에 하나씩 증가하는 순서로 출력한다.

## input
> 없음

## output

```
1
3
5
7
9
20
31
42
53
64
 |
 |       <-- a lot more numbers
 |
9903
9914
9925
9927
9938
9949
9960
9971
9982
9993
```

## Solution 
> 1. 1부터 10001까지 모든 숫자 조회
> 2. 숫자를 문자로 바꿔 저장
> 3. no는 자기자신의 값 i로 세팅
> 4. 숫자의 자리수 만큼 반복
> 5. 자리수의 숫자를 no에 더해줌
> 6. 생성된 d(n) 값을 self dict에 추가
> 7. 1 ~ 10001 까지의 숫자중 dict에 없는 숫자만 출력



```

self = {} #dist 생성

for i in range(1, 10001) : # 1 ~ 10000 까지
    sNo = str(i)	# 숫자를 문자열로 변경
    no = i 		# 자기 자신을 세팅하여, <mark>33</mark> + 3 + 3 = 39 부분을 처리

    for j in range(0,len(sNo)) :	# 반복문으로 자리수 마다 no에 더해주며, 33 <mark>+ 3 + 3</mark> = 39 부분을 처리
        no += int(sNo[j])
    
    self[no] = no # 생성된 값을 dist에 추가

for i in range(1, 10001) :		# 1 ~ 10000까지 숫자중 
    if self.get(i) is None :	# d(n)를 통하여 생성되지 않은 숫자를 찾음
        print(i)	# self number 출력
```



## TestCase
```
```
