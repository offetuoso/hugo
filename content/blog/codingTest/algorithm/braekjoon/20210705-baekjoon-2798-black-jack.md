---
title: "BAEKJOON - 2798 블랙잭"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-04
slug: "baekjoon-2798-black-jack"
description: "백준 블랙잭"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 2798 블랙잭(black jack)

## Task description

원문 : <a href="https://www.acmicpc.net/problem/2798">백준 2798 링크</a>

> - 첫번째 줄은 카드의 (장)수 N과 블랙잭 넘버(목표 값) M을 입력받는다.
> - 두번째 줄은 공백으로 구분된 N장의 카드 입력받는다.
> - M이 넘지 않는 3장의 합중 가장 큰 경우 출력.



## Condition
> - 첫째 줄에 카드의 개수 N(3 ≤ N ≤ 100)과 M(10 ≤ M ≤ 300,000)이 주어진다. 둘째 줄에는 카드에 쓰여 있는 수가 주어지며, 이 값은 100,000을 넘지 않는 양의 정수이다.
> - 합이 M을 넘지 않는 카드 3장을 찾을 수 있는 경우만 입력으로 주어진다.

## input output

```
예제 입력 1 
5 21
5 6 7 8 9
예제 출력 1 
21

예제 입력 2 
10 500
93 181 245 214 315 36 185 138 216 295
예제 출력 2 
497
```

## Solution 

> 완전탐색 (Brute-Force) 문제로 경우의 수를 모두 찾아본다.
> 1. 같은 배열을 자리수 만큼 반복
> 2. 이전에 나온것은 사용하지 않는다.

```
n, m = map(int, input().split())
numbers = list(map(int, input().split()))

result = 0
for i in numbers :
	for j in numbers :
		if i != j :	# 첫번째에서 선택한 값이 아닌것 
			for k in numbers :
				sum = i+j+k
				if i != k and j != k and sum <= m: #첫번째 두번째에서 선택한 값이 아닌것이며, i,j,k의 값이 sum을 넘지 않는것
					result = max(sum,result) # 그 중에 가장 큰 값

print(result)
	
```




## TestCase
```
#n, m = 5, 21
#numbers = [5, 6, 7, 8, 9]

#n, m = 10, 500
#numbers = [93, 181, 245, 214, 315, 36, 185, 138, 216, 295]
```
