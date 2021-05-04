---
title: "거스름돈 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-03-20
slug: "reverse-charge"
description: "그리디 알고리즘."
keywords: ["Algorism", "CodingTest", "Python","Java"]
draft: false
tags: ["Algorism", "Greedy","이코테"]
math: false
toc: true
---

## [문제1] 거스름돈

### [문제] 거스름돈 : 문제 설명

>	당신은 음식점의 계산을 도와주는 점원입니다. 카운트에서는 거스름돈으로 사용할 500원, 100원, 50원, 10원짜리 동전이 무한히 존재한다고 가정합니다.
손님에게 거슬러 주어야 할 돈이 N원일 때, 거슬러 주어야 할 동전의 최소 개수를 구하세요. 단, 거슬로 줘야 할 돈은 N은 항상 10의 배수입니다.


### [문제] 거스름돈 : 문제 해결 아이디어

>	- 최적의 해를 빠르게 구하기 위해서는 가장 큰 화폐의 단위부터 돈을 거슬러 주면 됩니다.
>	- N원을 거슬러 줘야 할 때, 가장먼저 500원으로 거슬러 줄 수 있을 만큼 거슬러줍니다.
>	- 이후에 100원, 50원, 10원짜리 동전을 차례대로 거슬러 줄 수 있을 만큼 거슬러주면 됩니다.
>	- N = 1,260일 때의 예시를 확인해 봅시다.

> 1,260 원을 500원부터 거슬러 준다면 아래와 같이 

![contact](/images/greedy_question_01_01.PNG)


   화페단위     | 500   | 100   | 50    | 10    |
--------------|-------|-------|-------|-------|
 손님이 받은 개수 | 2     | 2     | 1     | 1     |
 

### [문제] 거스름돈 : 정당성 분석
>	- 가장큰 화폐단위부터 돈을 거슬러 주는 것이 최적의 해를 보장하는 이유는 무엇일까요?
>	- 가지고 있는 동전중에서 <mark>큰 단위가 항상 작은 단위의 배수이므로 작은 단위의 동전들을 종합해 다른 해가 나올 수 없기 때문</mark>입니다.
>	- 만약 800원을 거슬러 주어야 하는데 화폐 단위가 500원 400원 100원이라면 어떻게 될까요 ? -> 400원 짜리 2개가 정답이됨
>	- 그리디 알고리즘 문제에서는 이처럼 문제 풀이를 위한 최소한의 아이디어를 떠올리고 이것이 정당한지 검토할 수 있어야 합니다.


### reverse_change.py
```
n =1260
count  = 0 

array = [500,100,50,10]

for coin in array:
    count += n / coin
    n %= coin 

print(count)
```

### ReverseCharge.java
```
package ex.algorism.greedy;

public class ReverseCharge {
	
	public static void main(String[] args) {
		
		int n = 1260;
		int[] coins = {500,100,50,10};
		int count = 0;
		
		for (int coin : coins) {
			count += n/coin;
			n %= coin;
		}
		
		System.out.println(count);
	}
}
```

#### [문제] 거스름돈 : 시간 복잡도 분석
>	- 화폐의 종류가 K라고 할때, 소스코드의 시간복잡도는 O(K)이다.
>	- 이 알고리즘의 시간복잡도는 거슬러줘야 하는 금액과는 무관하며, 동전의 총 종류에만 영향을 받는다.



이 자료는 나동빈님의 이코테 유튜브 영상을 보고 정리한 자료입니다.
<br>

<a href="https://www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC">참고 : www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC</a>




