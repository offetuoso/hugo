---
title: "숫자 카드 게임 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-04-20
slug: "games-of-number-card"
description: "코딩테스트 숫자 카드 게임"
keywords: ["Algorism", "CodingTest", "Python", "Java"]
draft: false
tags: ["Algorism", "이코테"]
math: false
toc: true
---

## [문제1] 숫자 카드 게임

###[문제] 숫자 카드 게임 : 문제 설명
> 숫자 카드 게임은 여러 개의 숫자 카드 중에서 가장 높은 숫자가 쓰인 카드 한 장을 뽑는 게임이다. 단, 게임의 룰을 지키며 카드를 뽑아야 하고 룰은 다음과 같다.
> 1. 숫자가 쓰인 카드들이 N x M 형태로 놓여 있다. 이때 N은 행의 개수를 의미하며, M은 열의 개수를 의미한다.
> 2. 먼저 뽑고자 하는 카드가 포함되어 있는 행을 선택한다. 
> 3. 그다음 선택된 행에 포함된 카드들 중 가장 숫자가 낮은 카드를 뽑아야 한다.
> 4. 따라서 처음에 카드를 골라낼 행을 선택할 때, 이후에 해당 행에서 가장 숫자가 낮은 카드를 뽑을 것을 고려하여 최종적으로 가장 높은 숫자의 카드를 뽑을 수 있도록 전략을 세워야 한다.

> 모든 행을 순회 하여, 행의 가장 작은 수중에 가장큰 수를 찾기  

> 카드들이 N X M 형태로 놓여 있을 때, 게임의 룰에 맞게 카드를 뽑는 프로그램을 만드시오.


###[문제] 조건 
> 조건 
>	시간 1초, 메모리 120mb

> 입력조건
>	첫째 줄에 숫자 카드들이 놓인 행의 개수 N과 열의 개수 M이 공백을 기준으로 하여 각각 자연수로 주어진다. (1 <= N,M <= 100)
둘째 줄부터 N개의 줄에 걸쳐 각 카드에 적힌 숫자가 주어진다. 각 숫자는 1 이상 10,000 이하의 자연수이다.

> 출력조건
>	첫째 줄에 게임의 룰에 맞게 선택한 카드에 적힌 숫자를 출력한다	

> 입력예시
>	3 3
>   3 1 2
>   4 1 4                                                
>   2 2 2

> 출력예시
>	2

> 입력예시
>	2 4
>   7 3 1 8
>   3 3 3 4

> 출력예시
>	3


### 아이디어 
> 각 행마다 가장 작은 수를 찾은 뒤에 그 수 중에서 가장 큰 수 찾기
list에서 가장 작은 원소를 찾아주는 min() 함수 이용
입력 파라메터 중에서 가장 큰 원소를 찾아주는 max(a, b) 함수 이용

###game_of_number_card.py
```
n, m = map(int, input().split())

result = 0

for i in range(n):
    data =  list(map(int, input().split()))
    
    minumum = min(data)
    result = max(result, minumum)


print(result) 

```

### GameOfCard.java
```
package ex.algorism.greedy;
import java.util.Arrays;
import java.util.Scanner;

public class GameOfCard {
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		int result = 0;
		
		String n = sc.nextLine();
		String m = null;

		String arr[] =  n.split(" ");
		
		int maximum = 0;
		for (int i = 0; i < Integer.parseInt(arr[0]); i++) {
			m = sc.nextLine();
			String row[] = m.split(" ");
			
			//자바 String배열 -> int배열로 변경 Java8 기준
			int[] nums = Arrays.asList(row).stream().mapToInt(Integer::parseInt).toArray();
			
			/*
			int[] nums = new int[row.length];
	         for(int j=0; j<row.length; j++) {
	            nums[j] = Integer.parseInt(row[j]);
	         }
	         */
			
			Arrays.sort(nums);
			
			if(maximum < nums[0]) {
				maximum = nums[0];
			}
			
		}
		
		System.out.println(maximum);
	}
}

    	
```


### 파이썬 모범답안 1
```
#n, m을 공백으로 구분하여 입력받기
n, m = map(int, input().split())

result = 0
#한 줄씩 입력받아 확인
for i in range(n):
    data = list(map(int, input().split(" ")))
    # 현재 줄에서 '가장 작은 수' 찾기
    min_value = min(data)
    # '가장 작은 수'들 중에서 가장 큰 수 찾기
    result = max(result, min_value)

print(result)

```
### 파이썬 모범답안 2
```
#n, m을 공백으로 구분하여 입력받기
n, m = map(int, input().split())

result = 0
#한 줄씩 입력받아 확인
for i in range(n):
    data = list(map(int, input().split()))
    
    min_value = 10001
    
    #현재 줄에서 '가장 작은 수' 찾기
    for a in data :
        min_value = min(min_value, a)

    #'가장 작은 수 중'에서 가장 큰 수 찾기 
    result = max(result, min_value)


print(result)
    	
```





이 자료는 나동빈님의 이코테 저서를 보고 정리한 자료입니다.



