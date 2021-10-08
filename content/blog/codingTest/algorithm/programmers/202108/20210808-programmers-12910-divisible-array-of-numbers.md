---
title: "Programmers 12910 나누어 떨어지는 숫자 배열"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-08
slug: "programmers-12910-divisible-array-of-numbers"
description: "12910 나누어 떨어지는 숫자 배열"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12910 나누어 떨어지는 숫자 배열

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12910">Programmers 12910 링크</a>

>array의 각 element 중 divisor로 나누어 떨어지는 값을 오름차순으로 정렬한 배열을 반환하는 함수, solution을 작성해주세요.<br>
divisor로 나누어 떨어지는 element가 하나도 없다면 배열에 -1을 담아 반환하세요.



## Condition
>- arr은 자연수를 담은 배열입니다.
>- 정수 i, j에 대해 i ≠ j 이면 arr[i] ≠ arr[j] 입니다.
>- divisor는 자연수입니다.
>- array는 길이 1 이상인 배열입니다.

###입력 형식

arr	|divisor|	return
---|---|---
[5, 9, 7, 10] |	5|	[5, 10]
[2, 36, 1, 3] |	1|	[1, 2, 3, 36]
[3,2,6]	| 10|	[-1]

>입출력 예 설명<br>
입출력 예#1 <br>
arr의 원소 중 5로 나누어 떨어지는 원소는 5와 10입니다. 따라서 [5, 10]을 리턴합니다.

>입출력 예#2<br>
arr의 모든 원소는 1으로 나누어 떨어집니다. 원소를 오름차순으로 정렬해 [1, 2, 3, 36]을 리턴합니다.

>입출력 예#3<br>
3, 2, 6은 10으로 나누어 떨어지지 않습니다. 나누어 떨어지는 원소가 없으므로 [-1]을 리턴합니다.

## Solution 
> 1. 배열의 요소 i를 divisor로 나눠떨어지면 배열에 담는다.
> 2. 반환된 배열을 정렬한다.
> 3. 배열이 비어있다면, [-1]로 반환한다.


```
   def solution(arr, divisor):
    return sorted([i for i in arr if i%divisor == 0]) if len([i for i in arr if i%divisor == 0]) != 0 else [-1]

```

## Others Solution 
>마지막 [] 이면 이라는 조건을 단지 or로 사용

```
def solution(arr, divisor): return sorted([n for n in arr if n%divisor == 0]) or [-1]

```

## TestCase
```
print(solution([5, 9, 7, 10],	5),	[5, 10])
print(solution([2, 36, 1, 3],	1),	[1, 2, 3, 36])
print(solution([3,2,6],	10),	[-1])

```
