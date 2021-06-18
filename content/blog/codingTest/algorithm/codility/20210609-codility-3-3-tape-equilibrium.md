---
title: "Codility - TapeEquilibrium"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-10
slug: "tape-equilibrium"
description: "Tape Equilibrium"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# Tape Equilibrium

> Codility - Lesson3 - Time Complexity - <a href="https://app.codility.com/programmers/lessons/3-time_complexity/tape_equilibrium/">TapeEquilibrium</a>


## Task description

> N 개의 정수로 구성된 비어 있지 않은 배열 A가 제공됩니다.
> 0 <P <N 인 정수 P는이 배열 A를 두 부분으로 분할합니다 (A [0], A [1], ..., A [P − 1] 및 A [P], A [ P + 1], ..., A [N-1])
> 분할 된 두 부분의 차이는 다음의 값입니다. | (A [0] + A [1] + ... + A [P − 1]) − (A [P] + A [P + 1] + .. . + A [N − 1]) |
> 즉, 첫 번째 부분의 합과 두 번째 부분의 합 사이의 절대 차이입니다.
> 달성 할 수있는 최소 차이를 반환합니다.

> 예를 들어, 다음과 같은 배열 A가 제공됩니다.

```
  A [0] = 3
  A [1] = 1
  A [2] = 2
  A [3] = 4
  A [4] = 3
```


> 이 테이프들을 4곳으로 나눌 수 있습니다.

> - P = 1, 차이 = | 3 − 10 | = 7    # A[0]  /////  A[1] A[2] A[3] A[4]
> - P = 2, 차이 = | 4 − 9 | = 5     # A[0] A[1]  /////  A[2] A[3] A[4] 
> - P = 3, 차이 = | 6 − 7 | = 1     # A[0] A[1] A[2]  /////  A[3] A[4] 
> - P = 4, 차이 = | 10 − 3 | = 7    # A[0] A[1] A[2] A[3]  /////  A[4]


> N 정수의 비어 있지 않은 배열 A가 주어지면 달성 할 수있는 최소 차이를 반환합니다.

```
  A [0] = 3
  A [1] = 1
  A [2] = 2
  A [3] = 4
  A [4] = 3
```

> 함수는 위에서 설명한대로 1을 반환해야합니다.


## Condition

> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오.
> - N은 [ 2 .. 100,000 ] 범위 내의 정수 이고;
> - 배열 A의 각 요소는 [ -1,000 .. 1,000 ] 범위 내의 정수 입니다.


## Solution 

### 시도 1
> 루프를 1번만 사용했지만, sum() 함수를 루프 안에서 처리 했더니 O(N * N)의 시간 복잡도가 나오게 되었다.

```
def solution(A):
    minimum = 99999
    first = 0;
    for i in range(0,len(A)-1) :
        first += A[i]
        minimum = min(minimum, abs(first-(sum(A)-first)))
    return minimum
```

> 시간 복잡성 O(N * N)

### 시도 2

```
# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(A):
	minimum = 99999  # 가작작은 차이 값
    first = 0;       # 첫번째 테이프 그룹
    total = sum(A)   # A배열 전체의 합
    for i in range(0,len(A)-1) :
        first += A[i] # A[0]~A[i]까지의 합
        second = total - first #first를 제외한 나머지 테이프의 합
        minimum = min(minimum, abs(first - second)) #첫번째 그룹의 합과 두번째 그룹의 합의 차이중 가장작은것
    return minimum

```

> 시간 복잡성 O(N)



## TestCase
```
solution([3,1,2,4,3])
```
