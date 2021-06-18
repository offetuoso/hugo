---
title: "Codility - PermMissingElem"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-09
slug: "perm-missing-elem"
description: "PermMissingElem"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# Perm Missing Elem

> Codility - Lesson3 - Time Complexity - <a href="https://app.codility.com/programmers/lessons/3-time_complexity/perm_missing_elem/">PermMissingElem</a>


## Task description

> 배열 A는 1 ~ N+1의 범위의 정수를 담고 있는 배열이며
> 1 ~ N+1의 정수중 1개의 숫자(요소)가 빠져있다.



> 예를 들면 다음과 같습니다.
 
```
  A[0] = 2
  A[1] = 3
  A[2] = 1
  A[3] = 5
```

> 1~5까지의 숫자중 4가 빠져 있기 때문에 4를 반환

## Condition

> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오.
> - N은 [ 0 .. 100,000 ] 범위 내의 정수입니다.
> - A의 요소는 모두 구별됩니다.
> - 배열 A의 각 요소는 [1 .. (N + 1)] 범위 내의 정수입니다.


## Solution 

> 1. N은 배열의 길이+1 (인덱스가 0부터 시작하기 때문에 +1)
> 2. Sum(range(N+1)) - Sum(A) (1 ~ N+1 까지의 합) - (배열의 요소의 합) = 1 부터 N+1 까지의 숫자중 빠진 수
```
# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(X, Y, D):
    N = len(A)+1
    return  sum (range(N+1)) - sum(A)
    pass
```

> 시간 복잡성 O(N) or O(N * log(N))



## TestCase
```
```
