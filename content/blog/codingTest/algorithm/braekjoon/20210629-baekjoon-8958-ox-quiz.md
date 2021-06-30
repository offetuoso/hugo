---
title: "BAEKJOON - 8958 OX 퀴즈"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-29
slug: "ox-quiz"
description: "백준 OX 퀴즈"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# 백준 8958 ox quiz

## Task description

> "OOXXOXXOOO"와 같은 OX퀴즈의 결과가 있다. O는 문제를 맞은 것이고, X는 문제를 틀린 것이다. 문제를 맞은 경우 그 문제의 점수는 그 문제까지 연속된 O의 개수가 된다. 예를 들어, 10번 문제의 점수는 3이 된다.

> "OOXXOXXOOO"의 점수는 1+2+0+0+1+0+0+1+2+3 = 10점이다.

> OX퀴즈의 결과가 주어졌을 때, 점수를 구하는 프로그램을 작성하시오.

## Condition
> - 첫째 줄에 테스트 케이스의 개수가 주어진다. 각 테스트 케이스는 한 줄로 이루어져 있다.
> - 길이가 0보다 크고 80보다 작은 문자열이 주어진다. 
> - 문자열은 O와 X만으로 이루어져 있다.

## input

```
5
OOXXOXXOOO
OOXXOOXXOO
OXOXOXOXOXOXOX
OOOOOOOOOO
OOOOXOOOOXOOOOX
```

## output

```
10
9
7
55
30
```


## Solution 
> 1. 입력 받은 N 만큼 케이스를 입력받아 반복한다.
> 2. 케이스를 입력받고 길이만큼 반복한다.
> 3. 점수(score)와 더해줄 값(addition)을 0으로 초기화 한다.
> 4. 케이스를 문자열로 변경하고 문자열 하나씩 슬라이스하여 str에 저장.
> 5. str의 값을 비교하여
	1. O인경우, addition을 1 증가시키고 score에 addition을 더해준다.
	2. X인경우, addition을 0 으로 초기화 시킨다.
> 6. 케이스의 마지막 str일때 score를 출력한다. 

```
n = int(input()) 		# 입력받을 케이스 갯수

for i in range(n): 	# 입력받은 수 만큼 반복
    case = input()	# 케이스 입력받음 ex) OOXXOXXOOO
    score = 0			# 케이스의 점수
    addition = 0		# 점수에 더해지는 값

    for j in range(0,len(case)):	# 케이스의 길이 만큼 len(OOXXOXXOOO)
        str = case[j] 				# 케이스를 인덱스로 1개씩 순회
        if str == 'O' :			# O인경우 addtion 1증가 score에 addtion 더함
                addition +=1
                score += addition      
        else : 					# X인경우 addtion 0으로 초기화
            addition = 0
        if j == len(case) -1 :		# 케이스의 마지막 str인 경우 score 출력
            print(score)
```



## TestCase
```
5
OOXXOXXOOO
OOXXOOXXOO
OXOXOXOXOXOXOX
OOOOOOOOOO
OOOOXOOOOXOOOOX
```
