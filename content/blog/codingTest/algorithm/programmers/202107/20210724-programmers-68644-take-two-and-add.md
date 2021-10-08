---
title: "Programmers 68644 두 개 뽑아서 더하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-24
slug: "programmers-68644-take-two-and-add"
description: "Programmers 두 개 뽑아서 더하기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 68644 두 개 뽑아서 더하기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/68644">Programmers 68644 링크</a>

> 정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.




## Condition
> - numbers의 길이는 2 이상 100 이하입니다.
> - numbers의 모든 수는 0 이상 100 이하입니다.

## input output
> 입출력 예

numbers	| result
--------|-----------
[2,1,3,4,1]	| [2,3,4,5,6,7]
[5,0,2,7]	| [2,5,7,9,12]

> 입출력 예 설명<br>
입출력 예 #1

>2 = 1 + 1 입니다. (1이 numbers에 두 개 있습니다.) <br>
3 = 2 + 1 입니다.<br>
4 = 1 + 3 입니다.<br>
5 = 1 + 4 = 2 + 3 입니다.<br>
6 = 2 + 4 입니다.<br>
7 = 3 + 4 입니다.<br>
따라서 [2,3,4,5,6,7] 을 return 해야 합니다.<br>
입출력 예 #2

>2 = 0 + 2 입니다.<br>
5 = 5 + 0 입니다.<br>
7 = 0 + 7 = 5 + 2 입니다.<br>
9 = 2 + 7 입니다.<br>
12 = 5 + 7 입니다.<br>
따라서 [2,5,7,9,12] 를 return 해야 합니다.<br>


## Solution 
> 1. numbers를 2중 루프로 순회
> 2. numbers를 인덱스 i와 j가 같지 않을때 두값을 더한다
> 3. set으로 중복제거후 sorted로 정렬 하여 반환

```
def solution(numbers):
        for i in range(0,len(numbers)) :
            for j in range(0,len(numbers)) :
                if i != j :
                    answer.append(numbers[i]+numbers[j])
        return sorted(set(answer))
        
```

## TestCase
```
# solution([2,1,3,4,1])
# solution([5,0,2,7])

```
