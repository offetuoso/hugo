---
title: "Codility - MaxCounter"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-26
slug: "max-counter"
description: "MaxCounter"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# MaxCounter

> Codility - Lesson4 - Counting Elements - <a href="https://app.codility.com/programmers/lessons/4-counting_elements/">MaxCounter</a>


## Task description

> 처음에는 0으로 설정된 N 개의 카운터가 제공되며 두 가지 가능한 작업이 있습니다.

> 증가 (X) -카운터 X가 1 증가합니다.
최대 카운터 -모든 카운터는 모든 카운터의 최대 값으로 설정됩니다.
M 개의 정수로 구성된 비어 있지 않은 배열 A가 제공됩니다. 이 배열은 연속 작업을 나타냅니다.

> A [K] = X, 즉 1 ≤ X ≤ N이면 연산 K는 증가 (X), 
A [K] = N + 1이면 작업 K는 최대 카운터입니다.
예를 들어, 정수 N = 5이고 배열 A가 다음과 같은 경우 :

```
    A [0] = 3 
    A [1] = 4 
    A [2] = 4 
    A [3] = 6 
    A [4] = 1 
    A [5] = 4 
    A [6] = 4
```

> 각 연속 작업 후 카운터 값은 다음과 같습니다.

```
    (0, 0, 1, 0, 0) 
    (0, 0, 1, 1, 0) 
    (0, 0, 1, 2, 0) 
    (2, 2, 2, 2, 2) 
    (3, 2, 2 , 2, 2) 
    (3, 2, 2, 3, 2) 
    (3, 2, 2, 4, 2)
```

> 목표는 모든 작업 후 모든 카운터의 값을 계산하는 것입니다.

> 정수 N과 M 개의 정수로 구성된 비어 있지 않은 배열 A가 주어지면 카운터 값을 나타내는 정수 시퀀스를 반환합니다.
결과 배열은 정수 배열로 반환되어야합니다.
예를 들면 다음과 같습니다.

```
    A [0] = 3 
    A [1] = 4 
    A [2] = 4 
    A [3] = 6 
    A [4] = 1 
    A [5] = 4 
    A [6] = 4
```
  
> 함수는 위에서 설명한대로 [3, 2, 2, 4, 2]를 반환해야합니다.


## Condition
> - def solution(N, A)
> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오 .
> - N은 [ 1 .. 100,000 ] 범위 내의 정수입니다 .
> - 배열 A의 각 요소는 [ 1 .. N + 1 ] 범위 내의 정수 입니다.


## Solution 
> 이번 문제 풀이의 핵심은 increase(X) 보다, max counter를 루프를 돌지 않고 해결하는가 였습니다. 
> 카운트는 0부터 값을 세지만, max counter 이후에는 max counter 시점의 최대 카운트 값부터 다시 카운트를 세고,
> max counter 시점의 최대 카운트 값을 모든 배열에 적용 후 각각의 카운트 값(다시 카운트를 센 카운트 값)을 더해주면 
> 루프 없이 해결할 수 있습니다.


> 1. count라는 딕셔너리를 생성
> 2. 배열 A를 루프로 선회하며, 값은 X (A[K])

> 3. increase(X) 기능 (1 <= X <= N 일때)
	> - count에 키가 X인 딕셔너리가 없으면 0으로 생성
	> - count[X] 1증가
	> - max_count(현재 최대 카운트) 값 구함

> 4. 1 <= X <= N 아닌 ( N+1 == X) 경우
	> - max counter 실행시 최대 카운트 세팅 
	> - 모든 count 값 삭제
	> - 현재 최대 카운트 값 0으로 초기화

> 5. N개의 요소를 가지는 결과 배열을 max_value(max counter 실행시 최대 카운트) 값으로 생성
> 6. count 딕셔너리로 루프 
	> - max_value 부터 추가된 count[X]의 값 결과 배열 result[X-1]에 세팅 # -1 은 인덱스 번호로 변경 0~ X-1



```

# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(N, A):
    count = {}

    max_count = 0 # 현재 최대 카운트 값
    max_value = 0 # max counter 이후에는 max counter 시점의 최대 카운트 값

    for X in A :

        if 1 <= X <= N : 	# increase(X) 기능 (1 <= X <= N 일때)
            if  count.get(X) is None :				# count에 키가 X인 딕셔너리가 없으면 0으로 생성
                count[X] = 0
            count[X] += 1							# count[X] 1증가
            max_count = max(count[X], max_count)        	# 현재 최대 카운트 값 구함    
            
        else : 			# max counter 기능 (N+1 == X인 경우)
            max_value += max_count					# max counter 실행시 최대 카운트 세팅 
            count.clear()							# 모든 count 값 삭제
            max_count = 0							# 현재 최대 카운트 값 0으로 초기화

    result = [max_value] * N 						# N개의 요소를 가지는 결과 배열을 max_value(max counter 실행시 최대 카운트) 값으로 생성

    for X, value in count.items() :
        result[X-1] += value						# max_value 부터 추가된 count[X]의 값 결과 배열 result[X-1]에 세팅 # -1 은 인덱스 번호로 변경 0~ X-1

    return result
```

> 시간 복잡성 O(N + M)



## TestCase
```
solution(5,[3,4,4,6,1,4,4])
```
