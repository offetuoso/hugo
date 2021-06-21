---
title: "Codility - MissingInteger"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-21
slug: "missing-integer"
description: "MissingInteger"
keywords: ["Algorithm", "CodingTest"]
draft: true
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# MissingInteger

> Codility - Lesson4 - Counting Elements - <a href="https://app.codility.com/programmers/lessons/4-counting_elements/missing_integer/">MissingInteger</a>


## Task description

> This is a demo task.

Write a function:

class Solution { public int solution(int[] A); }

that, given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A.

For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.

Given A = [1, 2, 3], the function should return 4.

Given A = [−1, −3], the function should return 1.

Write an efficient algorithm for the following assumptions:

N is an integer within the range [1..100,000];
each element of array A is an integer within the range [−1,000,000..1,000,000].



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

def solution(X, A):
    total = sum(range(X+1))			# 1~X 까지의 합을 생성
    chked = [None for i in range(X)] 	# 체크 배열을 None으로 초기화 하여 생성
    chk_sum = 0
    for i in range(len(A)) :
        if( chked[A[i]-1]  == None) : # 체크 배열에 값이 없는지 체크
            chked[A[i]-1] = A[i]
            chk_sum +=  A[i]
            if total == chk_sum : 	# total과 chk_sum같다면 모든 1~X까지 찾은 상태이므로 현재의 i를 반환
                return i
        
    if total != chk_sum :			# total과 chk_sum 다르다면 1~X까지의 찾은 숫자중에 나오지 않은 수가 있는것 
        return -1
```

> 시간 복잡성 O(N)



## TestCase
```
solution(5, [1,3,1,4,2,3,5,4])
```
