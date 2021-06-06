---
title: "Codility - Cyclic Rotation"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-05
slug: "codility-cyclic-rotation"
description: "Cyclic Rotation"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# CyclicRotation

> Codility - Lesson2 - Array - <a href="https://app.codility.com/programmers/lessons/2-arrays/cyclic_rotation/">CyclicRotation</a>

## Task description


> N 개의 정수로 구성된 배열 A와 오른쪽으로 회전할 횟수 K가 제공됩니다.
> A의 각 요소가 오른쪽으로 K 번 이동합니다.
> N 개의 정수와 K로 구성된 배열 A가 주어지면 배열 A가 K 번 회전 된 배열을 반환합니다.

> 예를 들어, 주어진

> -  A = [3, 8, 9, 7, 6]
> -  K = 3

>함수는 [9, 7, 6, 3, 8]을 반환해야합니다. 세 가지 회전이 이루어졌습니다.
```
    [3, 8, 9, 7, 6]-> [6, 3, 8, 9, 7]
    [6, 3, 8, 9, 7]-> [7, 6, 3, 8, 9]
    [7, 6, 3, 8, 9]-> [9, 7, 6, 3, 8]
```


## Condition

> - 함수 작성 : class Solution {public int [] solution (int [] A, int K); }
> - N 및 K는 [ 0 .. 100 ] 범위 내의 정수입니다 .
> - 배열 A의 각 요소는 [ -1,000 .. 1,000 ] 범위 내의 정수 입니다.




## Solution

```
# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(A, K):
    N = len(A)

    for value in A :
        if not (-1000 <= value <= 1000) :
            print("this is a debug message")
            return A

    if not (0 <= N <= 100) :
        print("this is a debug message")
        return A
    elif not (0 <= K <= 100) :
        print("this is a debug message")
        return A
    else :
    
        B = []
        for i in range(0,N) :
            B.append(0)    

        for i in range(0,N) :
            rotate = (i+K) % N
            B[rotate] = (A[i])

        A = B
       
    return A

    pass
```

![contact](/images/algorithm/codility/CyclicRotation-001.PNG)

## TestCase
```

```