---
title: "Programmers 12906 같은 숫자는 싫어"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-30
slug: "programmers-12906-i-hate-the-same-number"
description: "12906 같은 숫자는 싫어"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12906 같은 숫자는 싫어

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12906">Programmers 12906 링크</a>

>배열 arr가 주어집니다. 배열 arr의 각 원소는 숫자 0부터 9까지로 이루어져 있습니다. 이때, 배열 arr에서 연속적으로 나타나는 숫자는 하나만 남기고 전부 제거하려고 합니다. 단, 제거된 후 남은 수들을 반환할 때는 배열 arr의 원소들의 순서를 유지해야 합니다. 예를 들면,

```
arr = [1, 1, 3, 3, 0, 1, 1] 이면 [1, 3, 0, 1] 을 return 합니다.
arr = [4, 4, 4, 3, 3] 이면 [4, 3] 을 return 합니다.
배열 arr에서 연속적으로 나타나는 숫자는 제거하고 남은 수들을 return 하는 solution 함수를 완성해 주세요.
```

## Condition
>- 배열 arr의 크기 : 1,000,000 이하의 자연수
>- 배열 arr의 원소의 크기 : 0보다 크거나 같고 9보다 작거나 같은 정수

###입력 형식
>입출력 예

arr |	answer
---------|---------
[1,1,3,3,0,1,1] |	[1,3,0,1]
[4,4,4,3,3]	| [4,3]

## Solution 

```
def solution(arr):
    answer = []
    for x in arr : 
        if len(answer) == 0 : 
            answer.append(x)
        elif answer[-1] != x :
            answer.append(x)
    return answer

```

## Others Solution 
```
def no_continuous(s):
    return [s[i] for i in range(len(s)) if s[i] != s[i+1:i+2]]
```

```
def no_continuous(s):
    return [ v for i,v in enumerate(s) if s[i-1]!=s[i]]
```

## TestCase
```
```
