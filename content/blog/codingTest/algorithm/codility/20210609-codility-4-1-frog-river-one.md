---
title: "Codility - FrogRiverOne"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-12
slug: "frog-river-one"
description: "FrogRiverOne"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# FrogRiverOne

> Codility - Lesson4 - Counting Elements - <a href="https://app.codility.com/programmers/lessons/4-counting_elements/frog_river_one/">FrogRiverOne</a>


## Task description

> 은 개구리가 강 건너편으로 가고 싶어합니다. 개구리는 처음에 강의 한 둑 (위치 0)에 있으며 반대쪽 둑 (위치 X + 1)에 도달하려고합니다. 잎은 나무에서 강 표면으로 떨어집니다.

> 엽을 나타내는 N 개의 정수로 구성된 배열 A가 제공됩니다. A[K]는 초 단위로 측정 된 시간 K에서 한 잎이 떨어지는 위치를 나타냅니다.

> 는 개구리가 강 반대편으로 점프 할 수있는 가장 빠른 시간을 찾는 것입니다. 개구리는 잎이 1에서 X까지 강 건너 모든 위치에 나타날 때만 건널 수 있습니다 (즉, 1에서 X까지의 모든 위치가 잎으로 덮여있는 가장 빠른 순간을 찾고 싶습니다). 강의 흐름 속도가 무시할 정도로 작다고 가정 할 수 있습니다. 즉, 잎이 강에 떨어지면 위치가 바뀌지 않습니다.

> 예를 들어, 다음과 같은 정수 X = 5 및 배열 A가 제공됩니다.
```
  A [0] = 1
  A [1] = 3
  A [2] = 1
  A [3] = 4
  A [4] = 2
  A [5] = 3
  A [6] = 5
  A [7] = 4
```

> 번째 6에서는 잎이 위치 5로 떨어집니다. 이것은 잎이 강 건너 모든 위치에 나타나는 가장 빠른 시간입니다.

> N 개의 정수와 X로 구성된 비어 있지 않은 배열 A가 주어지면 개구리가 강 반대편으로 점프 할 수있는 가장 빠른 시간을 반환합니다.
개구리가 강 반대편으로 점프 할 수없는 경우 함수는 −1을 반환해야합니다.

> 예를 들어, 주어진 X = 5이고 배열 A는 다음과 같습니다.

```
  A [0] = 1
  A [1] = 3
  A [2] = 1
  A [3] = 4
  A [4] = 2
  A [5] = 3
  A [6] = 5
  A [7] = 4
```

> 함수는 위에서 설명한대로 6을 반환해야합니다.



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
