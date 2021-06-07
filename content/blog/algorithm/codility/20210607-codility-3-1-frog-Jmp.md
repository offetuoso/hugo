---
title: "Codility - Frog Jmp"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-07
slug: "codility-frog jmp"
description: "Frog Jmp"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# Frog Jmp

> Codility - Lesson3 - Time Complexity - <a href="https://app.codility.com/programmers/lessons/3-time_complexity/frog_jmp/">Frog Jmp</a>


## Task description

> 세 개의 정수 X, Y, D를 입력받는 함수를 작성합니다.
> - X는 개구리의 위치
> - Y는 개구리의 목표 위치
> - Y는 개구리의 이동거리 
> 위치 X에서 D씩 최소의 이동을 하여 목표를 Y에 도달하거나 넘어가기 위하여 이동하는 최소 횟수 반환 


> 예를 들면 다음과 같습니다.
 
```
  X = 10
  Y = 85
  D = 30
```

> 개구리는 다음과 같이 위치하므로 함수는 3을 반환해야합니다.

```
 첫 번째 점프 후 위치 10 + 30 = 40
 두 번째 점프 후 위치 10 + 30 + 30 = 70
 세 번째 점프 후 위치 10 + 30 + 30 + 30 = 100
```





## Condition

> - def solution(X, Y, D)
> - X, Y 및 D는 [ 1 .. 1,000,000,000 ] 범위 내의 정수입니다 .
> - X ≤ Y.
> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오 .




## Solution 

> 1. Y == X 이 경우 개구리가 뛸 필요가 없기 때문에 0을 반환 (이 테스트 케이스를 생각하지 못해서 틀렸었다.)
> 2. 
> - Y-X  = (목표위치 - 시작위치 =남은 거리)
> - (Y-X) % D == 0 ("남은 거리 // D가 0으로 떨어지는지 나머지가 있는지 조건")
> - True(나머지 0) :  (Y-X) // D 
> - False(나머지 0아님) : ((Y-X) // D) + 1  

```
# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(X, Y, D):
    if (Y == X)   :
        return 0
    
    return  (Y-X) % D == 0 and (Y-X) // D or ((Y-X) // D) + 1  
    pass
```

> 시간 복잡성 O(1)

![contact](/images/algorithm/codility/FrogJmp-001.PNG)


```
▶example
example test✔OK
1.0.040 sOK
collapse allCorrectness tests
▶simple1
simple test✔OK
1.0.040 sOK
2.0.040 sOK
▶simple2✔OK
1.0.040 sOK
2.0.040 sOK
▶extreme_position
no jump needed✔OK
1.0.040 sOK
2.0.040 sOK
▶small_extreme_jump
one big jump✔OK
1.0.040 sOK
collapse allPerformance tests
▶many_jump1
many jumps, D = 2✔OK
1.0.040 sOK
▶many_jump2
many jumps, D = 99✔OK
1.0.040 sOK
▶many_jump3
many jumps, D = 1283✔OK
1.0.040 sOK
▶big_extreme_jump
maximal number of jumps✔OK
1.0.040 sOK
▶small_jumps
many small jumps✔OK
1.0.040 sOK

```


## TestCase
```
solution(10, 75, 30)
solution(2, 2, 1)
solution(1, 101, 10)
```
