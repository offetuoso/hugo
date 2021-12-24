---
title: "Programmers 42883 큰 수 만들기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-02
slug: "programmers-42883-make-big-numbers"
description: "42883 큰 수 만들기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42883 큰 수 만들기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42883">Programmers 42883 링크</a>

>어떤 숫자에서 k개의 수를 제거했을 때 얻을 수 있는 가장 큰 숫자를 구하려 합니다.

>예를 들어, 숫자 1924에서 수 두 개를 제거하면 [19, 12, 14, 92, 94, 24] 를 만들 수 있습니다. 이 중 가장 큰 숫자는 94 입니다.

>문자열 형식으로 숫자 number와 제거할 수의 개수 k가 solution 함수의 매개변수로 주어집니다. number에서 k 개의 수를 제거했을 때 만들 수 있는 수 중 가장 큰 숫자를 문자열 형태로 return 하도록 solution 함수를 완성하세요.




## Condition
>- number는 1자리 이상, 1,000,000자리 이하인 숫자입니다.
>- k는 1 이상 number의 자릿수 미만인 자연수입니다.

###입력 형식
>입출력 예

number |	k |	return
----|-----|-----
"1924" |	2 |	"94"
"1231234" |	3 |	"3234"
"4177252841" |	4 |	"775841"

## Solution 
```
def solution(number, k):
    stack = []
    for i in number:
        while stack and stack[-1] < i and k>0:
            k-=1
            stack.pop()
        stack.append(i)
    return "".join(stack[:len(stack)-k])
```

## Others Solution 
```
def solution(number, k):
    stack = [number[0]]
    for num in number[1:]:
        while len(stack) > 0 and stack[-1] < num and k > 0:
            k -= 1
            stack.pop()
        stack.append(num)
    if k != 0:
        stack = stack[:-k]
    return ''.join(stack)
```

## TestCase
```
print(solution("1924",	2),	"94")
print(solution("1231234",	3),	"3234")
print(solution("4177252841"	,4), "775841")

```
