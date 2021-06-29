
---
title: "Codility - PermCheck"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-28
slug: "perm-check"
description: "PermCheck"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# PermCheck

> Codility - Lesson4 - Counting Elements - <a href="https://app.codility.com/programmers/lessons/4-counting_elements/perm_check/">PermCheck</a>


## Task description

> N 개의 정수로 구성된 비어 있지 않은 배열 A가 제공됩니다.<br>
> 순열은 1부터 N까지의 각 요소를 한 번만 포함하는 시퀀스입니다. <br>
> 예를 들어 배열 A는 다음과 같습니다.

```
    A [0] = 4
    A [1] = 1
    A [2] = 3
    A [3] = 2
```
    
> 순열이지만 배열 A는 다음과 같습니다.


```
    A [0] = 4
    A [1] = 1
    A [2] = 3
```


> 값 2가 없기 때문에 순열이 아닙니다.

> 목표는 배열 A가 순열인지 확인하는 것입니다.

> 배열 A가 주어지면 배열 A가 순열이면 1을 반환하고 그렇지 않으면 0을 반환합니다.<br>
> 예를 들어 다음과 같은 배열 A가 있습니다.

```
    A [0] = 4
    A [1] = 1
    A [2] = 3
    A [3] = 2
```

> 함수는 1을 반환해야합니다. <br>
> 주어진 배열 A는 다음과 같습니다.

```
    A [0] = 4
    A [1] = 1
    A [2] = 3
```
    
> 함수는 0을 반환해야합니다.


## Condition
> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오 .
> - def solution(A)
> - N은 [ 1 .. 100,000 ] 범위 내의 정수입니다 .
> - 배열 A의 각 요소는 [ 1 .. 1,000,000,000 ] 범위 내의 정수 입니다.


## Solution 
> 1. 조건1 배열 A는 순열 [1 ... N]
> 2. 배열 A를 오름 정렬한다
	1. A.sort()
	2. N = A[-1] ( A.sort()후 A[-1]은 배열의 최대값)
	
> 3. SUM(A)는 는 순열 A 배열의 합 
> 4. B(비교대상) = <mark>N*(N+1)//2  (수열의 합 공식; 1 ~  N 까지의 합)</mark> 

> 5. SUM(A) == B 는 배열의 합과 수열의 합 공식이 맞는지 비교
	1. solution[9, 5, 7, 3, 2, 7, 3, 1, 10, 8] 의 경우 합이 55가 되며, B와 같다. 이를 해결하기 위해서 중복된 숫자를 제거<br>
		A = list(set(A))
	2. set을 통해 중복제거 시 [1,1] 의 경우 문제가 생긴다. <br>
		중복제거후 [1],과 1*(1+1)//2 는 1로 통과가 되는 논리적 오류가 발생한다. <br>
		이를 해결하기 위해 중복 제거하기 전 A배열의 길이와 N값과 비교한다. 예를 들어, [1,2,3,4] 1부터 4까지의 수열이 있다면 길이와 마지막 숫자는 같을 수 밖에 없으므로 <br>
		length = N
		

```

# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(A):
    length = len(A) 	# 중복 제거하기 전 A배열의 길이
    A = list(set(A))	# 중복제거
    A.sort()			# 정렬
    
    N = A[-1]			# A의 제일 큰 수
    B =  N*(N+1)//2	# 수열의 합의 공식
    
    if sum(A) == B and length == N : # 배열 A와 수열의 합이 공식이 같고, 중복 제거하기 전 A배열의 길이와 N의 값이 같은지 체크
        return 1
    else :
        return 0
    pass

#solution([4,1,3,2])
#solution([2,2,8])
#solution([9, 5, 7, 3, 2, 7, 3, 1, 10, 8])
#solution([1,1])
```

> 시간 복잡성 O(N) or O(N * log(N))



## TestCase
```
#solution([4,1,3,2])
#solution([2,2,8])
#solution([9, 5, 7, 3, 2, 7, 3, 1, 10, 8]) << 순열이 아닌경우
#solution([1,1]) << 순열이 아닌경우2 (중복제거 해도 문제)
```
