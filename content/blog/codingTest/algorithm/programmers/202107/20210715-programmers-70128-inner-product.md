---
title: "Programmers 70128 내적"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-15
slug: "programmers-70128-inner-product"
description: "Programmers 내적"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 70128 내적

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/70128">Programmers 70128 링크</a>

> 길이가 같은 두 1차원 정수 배열 a, b가 매개변수로 주어집니다. a와 b의 내적을 return 하도록 solution 함수를 완성해주세요.

> 이때, a와 b의 내적은 a[0]*b[0] + a[1]*b[1] + ... + a[n-1]*b[n-1] 입니다. (n은 a, b의 길이)

## Condition
> - a, b의 길이는 1 이상 1,000 이하입니다.
> - a, b의 모든 수는 -1,000 이상 1,000 이하입니다.

## input output


a	  |	b     	        |	result
------|-----------------|-----------------
[1,2,3,4] |	[-3,-1,0,2]	| 3
[-1,0,1]  |	[1,0,-1]	|-2

> 입출력 예 설명
> - 입출력 예 #1
		a와 b의 내적은 1*(-3) + 2*(-1) + 3*0 + 4*2 = 3 입니다.
> - 입출력 예 #2
		a와 b의 내적은 (-1)*1 + 0*0 + 1*(-1) = -2 입니다.

## Point 
> n-1이 나와서 재귀함수로 접근해야하나 싶었지만, 배열 문제에 자주 나오던 람다식으로 시도해보았다.

### 람다
> 람다는 익명 함수를 한줄의 코드로 선언하여 변수 또는 반환값, 파라미터로 사용하는 코드이다.

> 람다식 - lambda parameter : formula 
> 단독 수행 - lambda parameter : formula (input-value)
```
def hap(x,y): 
	return x+y
```

> 일반 함수로 합을 구하는 공식을 람다식으로 변환하면 아래와같고,

```
lambda x,y : x+y (10,20)
```

### map 함수
> map()은 리스트를 받아서 요소(배열의 값)들을 람다식을 적용하여, 새로운 배열로 만들어 반환.

> 리스트 1개 일때 - map(function, list)
> 리스트 1개 이상 - map(function, list1, list2..)

> 1. map 함수는 함수와 리스트를 인자로 받음.
> 2. 리스트의 요소(원소;배열의 값)를 하나씩 꺼내서 함수를 적용.
> 3. 그 결과를 새로운 리스트에 담아 반환.

```
a = [1,2,3]
b = [4,5,6]
result = []
for i in range(0,len(a)) :
    result.append(a[i]+b[i])
```

> map을 이용하면 위의 복잡한 식을 한줄로 줄일 수 있다.

```
list(map(lambda x,y : x+y, [1,2,3],[4,5,6]))
```

> 여담으로 zip 함수를 이용할 수도 있다.
```
result = []
for t in list(zip([1, 2, 3], [4, 5, 6])) : 
    result.append(sum(t))
```

## Solution 
> 1. 배열 a와 b를 map함수로, 배열의 요소 x,y를 서로 곱해서 배열로 반환
> 2. 배열의 합을 구함

```
def solution(a, b):
    return sum(list(map(lambda x,y : x*y , a,b))) 

#sum( 생성된 map 배열을 더함
#	list(map(	# a,b 배열을 받아 각 요소 x,y를 람다식을 수행
#		lambda x,y : x*y		# x,y 를 곱하는 람다식
# 	, a,b))
#) 
	    
```


## Others Solution 
> zip을 이용하여 한줄로 표현할 수 도 있다.

```
def solution(a, b):
    return sum([x*y for x, y in zip(a,b)])
```

> 람다를 for 문처럼 사용

```
def solution(a, b):
    return sum(map(lambda i: a[i]*b[i], range(len(a))))
```

## TestCase
```
solution([1,2,3,4], [-3,-1,0,2])
solution([-1,0,1],	[1,0,-1])
```
