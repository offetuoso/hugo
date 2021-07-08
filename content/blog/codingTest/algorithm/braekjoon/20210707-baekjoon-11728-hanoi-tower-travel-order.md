---
title: "BAEKJOON - 11729 하노이 탑 이동 순서"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-07
slug: "baekjoon-11729-hanoi-tower-travel-order"
description: "백준 하노이 탑 이동 순서"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 11729 하노이 탑 이동 순서(Hanoi Tower Travel Order)

## Task description

원문 : <a href="https://www.acmicpc.net/problem/11729">백준 11729 링크</a>

> 세 개의 장대가 있고 첫 번째 장대에는 반경이 서로 다른 n개의 원판이 쌓여 있다. <br>
각 원판은 반경이 아래서 부터 큰 순서대로 쌓여있다. <br>
이제 수도승들이 다음 규칙에 따라 첫 번째 장대에서 세 번째 장대로 옮기려 한다.<br>
이 작업을 수행하는데 필요한 이동 순서를 출력하는 프로그램을 작성하라. 

> 아래 그림은 원판이 5개인 경우의 예시이다.

![contact](/images/algorithm/baekjoon/11729-hanoi/001.png)

## Condition
> - 한 번에 한 개의 원판만을 다른 탑으로 옮길 수 있다.
> - 쌓아 놓은 원판은 항상 위의 것이 아래의 것보다 작아야 한다. 
> - 이동 횟수는 최소가 되어야 한다.

## input output

```
예제 입력 1 복사
3
예제 출력 1 복사
7
1 3
1 2
3 2
1 3
2 1
2 3
1 3
```

## Solution 
> 1. 첫번째 봉에 있는 1~n-1 까지의 원반을 두번째 봉에 옮김
> 2. 첫번째 봉에 있는 n 원반을 세번째 봉에 옮김
> 3. 세번째 봉에 있는 1~n-1 까지의 원반을 세번째 봉에 옮김

```
def hanoi(n, first, second ,third) :
	if n == 1 :
		result.appthird(str(first)+' '+str(third)) # n이 1까지 재귀로 호출되면 결과 배열에 담음
	else : 
		hanoi(n-1, first, third, second) # first에서 n-1의 모든 원반을 second로 모두 옮김, 임시 경유는 third
		hanoi(1, first, second, third)	# first에서 third로 마지막(N번째) 원반을 third로 옮김, 임시 경유는 second
		hanoi(n-1, second, first, third) # second에 있는 n-1의 모든 원반을 third로 옮김, 임시 경유는 first

result = []
n = int(input())
hanoi(n, 1, 2, 3) # hanoi(옮길 원반수, 1번 봉, 2번 봉, 3번 봉)
print(len(result))

for item in result :
	print(item)
	
```


## TestCase
```
```
