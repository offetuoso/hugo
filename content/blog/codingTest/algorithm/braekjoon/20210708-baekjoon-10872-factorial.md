---
title: "BAEKJOON - 10872 팩토리얼"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-08
slug: "baekjoon-10872-factorial"
description: "백준 팩토리얼"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 10872 팩토리얼(Factorial)

## Task description

원문 : <a href="https://www.acmicpc.net/problem/10872">백준 10872 링크</a>

> 0보다 크거나 같은 정수 N이 주어진다. 이때, N!을 출력하는 프로그램을 작성하시오.


## Condition
> - 첫째 줄에 정수 N(0 ≤ N ≤ 12)가 주어진다.

## input output

```
예제 입력 1 복사
10
예제 출력 1 복사
3628800
예제 입력 2 복사
0
예제 출력 2 복사
1
```

## Solution 
> 0이면 1리턴
> 0이 아니면 N * factorial(N-1) 리턴  # N * (N-1)!

```
def factorial(N): 
	if ( N != 0) :
		return  N * factorial(N-1) #N * (N-1)!
	else :
		return  1
N = int(input())
fn = factorial(N)

print(fn)

	
```


## TestCase
```
```
