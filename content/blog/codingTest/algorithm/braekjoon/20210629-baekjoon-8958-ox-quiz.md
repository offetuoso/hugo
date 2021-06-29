---
title: "BAEKJOON - OX 퀴즈"
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

```
n = int(input())
for i in range(n):
    case = input()
    score = 0
    addition = 0

    for j in range(0,len(case)):
        str = case[j]
        if str == 'O' :
                addition +=1
                score += addition      
        else : 
            addition = 0
        if j == len(case) -1 :
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
