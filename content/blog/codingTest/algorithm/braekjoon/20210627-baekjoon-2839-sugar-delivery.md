---
title: "BAEKJOON - 설탕배달"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-27
slug: "sugar-delivery"
description: "백준 설탕배달"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# 백준 2839 설탕배달

## Task description

> 상근이는 요즘 설탕공장에서 설탕을 배달하고 있다. 상근이는 지금 사탕가게에 설탕을 정확하게 N킬로그램을 배달해야 한다. 설탕공장에서 만드는 설탕은 봉지에 담겨져 있다. 봉지는 3킬로그램 봉지와 5킬로그램 봉지가 있다.

> 상근이는 귀찮기 때문에, 최대한 적은 봉지를 들고 가려고 한다. 예를 들어, 18킬로그램 설탕을 배달해야 할 때, 3킬로그램 봉지 6개를 가져가도 되지만, 5킬로그램 3개와 3킬로그램 1개를 배달하면, 더 적은 개수의 봉지를 배달할 수 있다.

> 상근이가 설탕을 정확하게 N킬로그램 배달해야 할 때, 봉지 몇 개를 가져가면 되는지 그 수를 구하는 프로그램을 작성하시오.

## Condition
> - 첫째 줄에 N이 주어진다. (3 ≤ N ≤ 5000)


> 입력예시
>	18

> 출력예시
>	4


> 입력예시
>	4

> 출력예시
>	-1


> 입력예시
>	6

> 출력예시
>	2


> 입력예시
>	9

> 출력예시
>	3


> 입력예시
>	11

> 출력예시
>	3


## Solution 


```
N = int(input())
a = N//5
aa = N%5

result = 0

if aa == 0 :
    result += a
else : 
    if a == 0 and not N % 3 == 0 :
        result = -1

    elif aa%3 == 0 : 
        result = a
        result += aa // 3
    else :
        for i in range(1, a+1) :
            if (aa+(5*i)) %3 == 0 :
                result = (a-i)
                result += (aa+(5*i)) // 3
                break
            else :
                if i == a :
                    result = -1
                    break

print(result)

```



## TestCase
```
18 #4
4  #-1
6  #2
9  #3
11 #3
```
