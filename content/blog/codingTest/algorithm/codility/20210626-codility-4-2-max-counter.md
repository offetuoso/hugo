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

> This is a demo task.

You are given N counters, initially set to 0, and you have two possible operations on them:

increase(X) − counter X is increased by 1,
max counter − all counters are set to the maximum value of any counter.
A non-empty array A of M integers is given. This array represents consecutive operations:

if A[K] = X, such that 1 ≤ X ≤ N, then operation K is increase(X),
if A[K] = N + 1 then operation K is max counter.
For example, given integer N = 5 and array A such that:

    A[0] = 3
    A[1] = 4
    A[2] = 4
    A[3] = 6
    A[4] = 1
    A[5] = 4
    A[6] = 4
the values of the counters after each consecutive operation will be:

    (0, 0, 1, 0, 0)
    (0, 0, 1, 1, 0)
    (0, 0, 1, 2, 0)
    (2, 2, 2, 2, 2)
    (3, 2, 2, 2, 2)
    (3, 2, 2, 3, 2)
    (3, 2, 2, 4, 2)
The goal is to calculate the value of every counter after all operations.

Write a function:

class Solution { public int[] solution(int N, int[] A); }

that, given an integer N and a non-empty array A consisting of M integers, returns a sequence of integers representing the values of the counters.

Result array should be returned as an array of integers.

For example, given:


    A[0] = 3
    A[1] = 4
    A[2] = 4
    A[3] = 6
    A[4] = 1
    A[5] = 4
    A[6] = 4


the function should return [3, 2, 2, 4, 2], as explained above.

Write an efficient algorithm for the following assumptions:

N and M are integers within the range [1..100,000];
each element of array A is an integer within the range [1..N + 1].



## Condition
> - def solution(X, A)
> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오 .
> - N 및 X는 [ 1 .. 100,000 ] 범위 내의 정수입니다 .
> - 배열 A의 각 요소는 [ 1 .. X ] 범위 내의 정수 입니다.


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
        
        
        #print(K,X)

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
