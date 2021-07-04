---
title: "BAEKJOON - 1712 손익분기점"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-04
slug: "baekjoon-1712-break-even-point"
description: "백준 손익분기점"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 1712 손익분기점(break even point)

## Task description

원문 : <a href="https://www.acmicpc.net/problem/1712">백준 1712 링크</a>

>  노트북 제조하는데 노트북 판매 대수에 상관없이 A만원의 고정 비용이 든다.<br>
>  한 대의 노트북을 생산하는 데에는 B만원의 가변 비용이 든다<br>
>  A=1,000, B=70이라고 하자. 이 경우 노트북을 한 대 생산하는 데는 총 1,070만원이 들며,<br> 열 대 생산하는 데는 총 1,700만원이 든다.<br>
> 노트북 가격이 C만원으로 책정되었다고 한다.<br>
> 생산 대수를 늘려 가다 보면 어느 순간 총 수입(판매비용)이 총 비용(=고정비용+가변비용)보다 많아지게 된다. 최초로 총 수입이 총 비용보다 많아져 이익이 발생하는 지점을 손익분기점(BREAK-EVEN POINT)이라고 한다.<br>
> A, B, C가 주어졌을 때, 손익분기점을 구하는 프로그램을 작성하시오.



## Condition
> - 첫째 줄에 A, B, C가 빈 칸을 사이에 두고 순서대로 주어진다. A, B, C는 21억 이하의 자연수이다.
> - 첫 번째 줄에 손익분기점 즉 최초로 이익이 발생하는 판매량을 출력한다. 손익분기점이 존재하지 않으면 -1을 출력한다.

## input output

```
예제 입력 1 
1000 70 170
예제 출력 1 
11
예제 입력 2 
3 2 1
예제 출력 2 
-1
예제 입력 3 
2100000000 9 10
예제 출력 3 
2100000001
```

## Solution 

> 일단 하나씩 계산해서 손익분기점을 찾아보았으나.. 시간초과에 걸린다.


```
a, b, c = map(int, input().split())


qty = 0

if(c < 2):
	print(-1)
	exit()
else :
	while True :
		qty += 1
		formula1 = a + (b*qty)
		formula2 = (c*qty)

		if(formula1 < formula2):
			print(formula2)
			break
	
```

> 루프 없이 어떻게 계산을 해야할까 고민하다 가변, 판매단가만 곱했을때 변하는것을 보고 <br>
`판매단가 - 가변비용`를 생각하였다. 


```
a, b, c = map(int, input().split())

if(b >= c):	# 가변비용이 판매단가와 같거나 크면, 아무리 수량을 늘려도 손익분기점에 도달하지 못한다
	print(-1)
else :
	print((a//(c-b))+1) # (고정비/(단가-가변비용)) +1 (+1를 추가되어 손익분기점이 됨)

```

> 




## TestCase
```

```
