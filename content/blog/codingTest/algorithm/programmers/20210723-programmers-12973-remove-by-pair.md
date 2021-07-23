---
title: "Programmers 12973 짝지어 제거하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-23
slug: "programmers-12973-remove-by-pair"
description: "Programmers 짝지어 제거하기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12973 짝지어 제거하기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12973">Programmers 12973 링크</a>

> 짝지어 제거하기는, 알파벳 소문자로 이루어진 문자열을 가지고 시작합니다. 먼저 문자열에서 같은 알파벳이 2개 붙어 있는 짝을 찾습니다. <br>
그다음, 그 둘을 제거한 뒤, 앞뒤로 문자열을 이어 붙입니다. 이 과정을 반복해서 문자열을 모두 제거한다면 짝지어 제거하기가 종료됩니다. <br>
문자열 S가 주어졌을 때, 짝지어 제거하기를 성공적으로 수행할 수 있는지 반환하는 함수를 완성해 주세요. <br>
성공적으로 수행할 수 있으면 1을, 아닐 경우 0을 리턴해주면 됩니다.

>예를 들어, 문자열 S = baabaa 라면

>b aa baa → bb aa → aa →

>의 순서로 문자열을 모두 제거할 수 있으므로 1을 반환합니다.



## Condition
> - 문자열의 길이 : 1,000,000이하의 자연수
> - 문자열은 모두 소문자로 이루어져 있습니다.


## input output
> 입출력 예

s|	result
--|--
baabaa |	1
cdcd |	0

> 입출력 예 설명 <br>
입출력 예 #1<br>
위의 예시와 같습니다.<br>

>입출력 예 #2 <br>
문자열이 남아있지만 짝지어 제거할 수 있는 문자열이 더 이상 존재하지 않기 때문에 0을 반환합니다.


## Solution 
> 1. stack 생성
> 2. stack이 비어있거나, stack의 마지막과 현재 순회중인 문자열(S)과 다르면 추가
> 3. stack의 마지막과 현재 순회중인 문자열이 같으면 stack의 마지막 pop
> 4. stack이 비어있으면 1 남아있는게 있으면 0 리턴

```
def solution(string):
    stack = [] # stack 생성
    for s in string :
        if len(stack) == 0 or stack[-1] != s: # stack이 비어있거나, stack의 마지막과 현재 순회중인 문자열(S)과 다르면 추가
            stack.append(s)
        elif stack[-1] == s : #stack의 마지막과 현재 순회중인 문자열이 같으면 stack의 마지막 pop
            stack.pop()
    if len(stack) == 0 : #stack이 비어있으면 1 
        return 1
    else :			#남아있는게 있으면 0 리턴
        return 0
        
```

## TestCase
```
# solution('baabaa')
# solution('babaa')
# solution('cdcd')

```
