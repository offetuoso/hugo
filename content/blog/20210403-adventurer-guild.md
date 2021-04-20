---
title: "모험가 길드 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-04-03
slug: "adventurer-guild"
description: "모험가 파티를 만드는 알고리즘"
keywords: ["Algorism", "CodingTest", "Python","Java"]
draft: false
tags: ["Algorism"]
math: false
toc: true
---

## [문제1] 1이 될때까지

###[문제] 1이 될때까지 : 문제 설명
> 어떠한 수 N이 1이 될때까지 다음의 두 과정 중 하나를 반복적으로 선택하여 수행하려고 합니다. 단, 두번째 연산은 N이 K로 나누어 떨어질 때만 선택할 수 있습니다.

>	1. N에서 1을 뺍니다.
>	2. N에서 K로 나눕니다.

> 예를 들어 N이 17, K가 4라고 가정하자. 이때 1번의 과정을 한 번 수행하면 N은 16이 된다.
> 이후에 2번의 과정을 두 번 수행하면 N은 1이 된다. 결과적으로 이경우 전체과정을 실행한 횟수는 3이된다. 이는 N을 1로 만드는 최소 횟수이다.
> N과 K가 주어질 때 N이 1이 될 때까지 1번 혹은 2번의 과정을 수행해야하는 최소 횟수를 구하는 프로그램을 작성하시오

###[문제] 조건 

> 입력조건
>	첫째줄에 N(2 <= N < = 100000)과 K(2 <= K < = 100000)가 공백으로 구분되며 각각 자연수로 주어진다.
이때 입력으로 주어지는 N은 항상 K보다 크거나 같다.

> 출력조건
>	첫째줄에 N이 1이 될 때까지 1번 혹은 2번의 과정을 수행해야 하는 횟수의 최솟값을 출력한다.

> 입력예시<br>
>	25 5 

> 출력예시<br> 
>	2

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




