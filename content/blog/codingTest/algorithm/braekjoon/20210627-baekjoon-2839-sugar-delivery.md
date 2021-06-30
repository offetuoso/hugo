---
title: "BAEKJOON - 2839 설탕배달"
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

## input output

case   | input  | ouput
-------|--------|-------
1      | 18     | 4
2      | 4      | -1
3      | 6      | 2
4      | 9      | 3
5      | 11     | 3


## Solution 
> 1. 5로 최대한 나눈다. 
> 2. 5로 나누어 몫이 0인경우, 0이 아닌경우로 나누어진다. <br>
	1. 5로 나누어 <mark>몫이 0인경우 5의 배수이므로 5로 나눈 값(division) 이 결과</mark>
> 3. 5로 나누어 몫이 아닌경우 <br>
	1. <mark>5로 나눌수 없고(값이 0) 3으로 나누어 떨어지지 않는경우 -1 이 결과</mark>  <br>
	2. 5로 나눈 몫을 3으로 나누어 몫이 0인 경우 <mark>5로 나눈 값(division)와 5로 나눈 몫을 3으로 나눈 값(quotient//3)을 더한 값이  	결과</mark> ; 
	3. 5로 나눈 몫을 3으로 나누어 몫이 0이 아닌경우 1~ 5로 나눈 값 까지 루프를 생성
		1. <mark>5로 나눈것을 1단계씩 되돌려, 3으로 나누어 몫이 0으로 나누어 떨어지는 값 찾으면, (division-i)+(quotient+(5*i)) 이 값</mark>
		2. 끝까지 못찾았을때 -1이 결과

```
N = int(input())
division = N//5 # 5로 나눈 값
quotient = N%5  # 5로 나눈 몫

result = 0

if quotient == 0 : # 5로 나누어 떨어지면 
    result = division # 5로 나눈 값이 결과
    
else : 			# 5로 나누어 몫이 남는 경우

    if division == 0 and not N % 3 == 0 :	# 5로 나눌수 없고(값이 0) 3으로 나누어 떨어지지 않는경우 -1 이 결과
        result = -1

    elif quotient%3 == 0 : 				# 5로 나눈 몫을 3으로 나누어 몫이 0인 경우 <mark>5로 나눈 값(division)와 5로 나눈 몫을 3으로 나눈 값(quotient//3)을 더한 값이 결과
        result = division
        result += quotient // 3
        
    else :							# 5로 나눈 몫을 3으로 나누어 몫이 0이 아닌경우
        for i in range(1, division+1) : 	# 1~ 5로 나눈 값 까지 루프
        
            if (quotient+(5*i)) %3 == 0 :	# 5로 나눈것을 1단계씩 되돌려, 3으로 나누어 몫이 0으로 나누어 떨어지는 값 찾으면, (division-i)+(quotient+(5*i)) 이 값
                result = (division-i) 	
                result += (quotient+(5*i)) // 3
                break
                
            else :
                if i == division :	# 끝까지 못찾았을때 -1이 결과
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
