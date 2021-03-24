---
title: "더하기 혹은 곱하기 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-03-24
slug: "sum-and-multiply"
description: "최고의 숫자가 되기 위하여 더하기 혹은 곱하기를 진행"
keywords: ["Algorism", "CodingTest", "Python", "Java"]
draft: false
tags: ["java"]
math: false
toc: true
---

## [문제1] 곱하기 혹은 더하기

###[문제] 곱하기 혹은 더하기 : 문제 설명
> 각 자리가 숫자(0부터 9)로만 이루어진 문자열 S가 주어졌을 때, 왼쪽부터 오른쪽으로
하나씩 모든 숫자를 확인하며 숫자 사이에 'x' 혹은 '+' 연산자를 넣어 결과적으로 만들어질 수 있는
가장 큰 수를 구하는 프로그램을 작성. 단, + 보다 x를 먼저 계산하는 일반적인 방식과는 달리,
모든 연산은 왼쪽에서부터 순서대로 이루어진다고 가정.

>	1. 예를 들어, 02984라는 문자열로 만들 수 있는 가장 큰 수는 ((((0 + 2)x 9)x 8)x 4) = 576이다.
>	2. 또한 만들어질 수 있는 가장 큰 수는 항상 20억 이하의 정수가 되도록 입력이 주어짐.



###[문제] 조건 

> 입력조건
>	첫째 줄에 여러개의 숫자로 구성된 하나의 문자열 S가 주어집니다.(1<=S의 길이 <=20)


> 출력조건
>	첫째 줄에 만들어 질 수 있는 가장 큰 수를 출력합니다.

> 입력예시<br>
>	02984 

> 출력예시<br> 
>	576


- 문자열 내 연산자 계산 가능 메소드
```
eval()
result = eval('(3+5)*7')
print(result) # 56
- 리스트 내 item들을 하나의 문자열로 만들어주는 메소드 

list = ['a', 'b', 'c'] 
print(''.join(list)) # print: abc
- 리스트에 item 추가 시, 위치 선정이 가능토록하는 메소드

# list = ['a', 'b', 'c'] 
list.insert(0, "new")
print(list) # ['new', 'a', 'b', 'c'] 

```



###make_one.py
```
n, k = map(int, input().split()) 	#n=13, k=5

result = 0

while True :
    # n을 K로 나눈 몫에 k를 곱하여,
    # 나눌수 있는 값을 계산             # roof 1 step                         # roof 2 step
    target = (n // k) * k 		#target = 10 						#target = 0
    result += (n - target)       #result += 3  <<한번에 카운트 3을 추가하고     #result(4) += 2
    n = target                   #n = target   <<13을 10으로 만듬          #n=0

    if n < k :                   #false                                #true
        break
    result += 1				#나눗셈에 대한 result(3) +1	
    n //= k					#n = 2

result += (n - 1)                                                      #result(6) += -1   <n을 0까지 만들면서, 횟수 -1
print(result)                                                          #5        

```

###MakeOne.java
```
package ex.algorism.greedy;
import java.util.Scanner;

public class MakeOne {
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		
		int n = sc.nextInt();
		int k = sc.nextInt();
		int result = 0;
		
		while (true) {
			int target = (n/k)*k;
			result += n-target;
			n = target;
			
			if(n < k) {
				break;
			}
			
			n = n / k;
			result++;
			
		}
		result += (n-1);
		System.out.println(result);
	}
}

```

###[문제] 정당성 분석
> 1을 빼는 것보다 나누는 것이 더 기하급수적으로 빠르게 줄일 수 있다.
> K가 2보다 크다면, K로 나누는 것이 1을 빼는것 보다 항상 빠르게 N을 줄일 수 있다.
> 또한 N은 항상 1에 도달하게 됨.
 


이 자료는 나동빈님의 이코테 유튜브 영상을 보고 정리한 자료입니다.
<br>

<a href="https://www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC">참고 : www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC</a>




