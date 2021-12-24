---
title: "Programmers 43165 타겟 넘버"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-31
slug: "programmers-43165-target-number"
description: "43165 타겟 넘버"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 43165 타겟 넘버

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/43165">Programmers 43165 링크</a>

>n개의 음이 아닌 정수가 있습니다. 이 수를 적절히 더하거나 빼서 타겟 넘버를 만들려고 합니다. 예를 들어 [1, 1, 1, 1, 1]로 숫자 3을 만들려면 다음 다섯 방법을 쓸 수 있습니다.

```
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3
```

>사용할 수 있는 숫자가 담긴 배열 numbers, 타겟 넘버 target이 매개변수로 주어질 때 숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 방법의 수를 return 하도록 solution 함수를 작성해주세요.




## Condition
>- 주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
>- 각 숫자는 1 이상 50 이하인 자연수입니다.
>- 타겟 넘버는 1 이상 1000 이하인 자연수입니다.

###입력 형식
>입출력 예

numbers	| target	| return
----------|----|----
[1, 1, 1, 1, 1]	| 3	| 5

입출력 예 설명
문제에 나온 예와 같습니다.

## Solution 

### BFS
```
from collections import deque
def solution(numbers, target):
    count = 0
    queue = deque()
    queue.append([0,0])

    while queue :
        sum, length = queue.popleft() 
        #print(sum,length)
        if length > len(numbers) :
            break
        elif length == len(numbers) and sum == target:
            count += 1
        queue.append([sum+numbers[length-1],length+1])
        queue.append([sum-numbers[length-1],length+1])
    return count

```

DFS

```
def solution(numbers, target):
    
    if len(numbers) == 0 :
        if target == 0 :
            return 1
        else : 
            return 0
    return solution(numbers[1:], numbers[0]+target)+solution(numbers[1:], numbers[0]-target)
    
```



## Others Solution 
```
from itertools import product
def solution(numbers, target):
    l = [(x, -x) for x in numbers]
    s = list(map(sum, product(*l)))
    return s.count(target)

```

## TestCase
```
#print(solution([1, 1, 1, 1, 1], 3), 5)
#print(solution([1, 2, 1, 2], 2), 3)
#print(solution([1, 2, 1, 2], 6), 1)
```
