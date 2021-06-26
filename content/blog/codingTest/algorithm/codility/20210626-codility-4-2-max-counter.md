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
draft: true
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
> - N 및 M은 [ 1 .. 100,000 ] 범위 내의 정수입니다 .
> - 배열 A의 각 요소는 [ 1 .. N + 1 ] 범위 내의 정수 입니다.


## Solution 
> 1. total = sum(range(X+1)) 			
> 2. chked = [None for i in range(X)] 	# 체크 배열을 None으로 초기화 하여 생성
> 3. 루프로 A를 순회
> 4.  if( chked[A[i]-1]  == None) : #체크 배열에 값이 없는지 체크
> 4-1. chked[A[i]-1]에 A[i] 세팅
> 4-2. chk_sum에 A[i]을 합함
> 5. if total == chk_sum :  #




```

# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(N, A):
    count = {}

    max_count = 0
    max_value = 0

    for X in A :

        if 1 <= X <= N : 
            if  count.get(X) is None :
                count[X] = 0
            count[X] += 1
            max_count = max(count[X], max_count)            
        else :
            max_value += max_count
            count.clear()
            max_count = 0

    result = [max_value] * N

    for key, value in count.items() :
        result[key-1] += value

    return result
```

> 시간 복잡성 O(N + M)



## TestCase
```
solution(5,[3,4,4,6,1,4,4])
```
