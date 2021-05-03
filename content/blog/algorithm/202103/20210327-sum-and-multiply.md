---
title: "더하기 혹은 곱하기 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-03-27
slug: "sum-and-multiply"
description: "최고의 숫자가 되기 위하여 더하기 혹은 곱하기를 진행"
keywords: ["Algorism", "Greedy", "CodingTest", "Python", "Java"]
draft: false
tags: ["Algorism"]
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



###sum_or_multiply.py
```
s = input()

result=0

for n in list(s) :
    if result == 0 or n == 0 or result == 1 or n == 1 :    
        result += int(n)
    else :
        result *= int(n)

print(result)
   
```

### 모범답안 파이썬
```
data = input()

result = int(data[0])

for i in range(1,len(data)) :
    num = int(data[i])
    if num <= 1 or result <= 1:
    	result += num
    else:
    	result *= num
    	 
print(result)
   
```


###SumOrMultiply.java
```
package ex.algorism.greedy;
import java.util.Scanner;

public class SumOrMultiply {
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		
		String s = sc.nextLine();
		int result = 0;
		
		for (int i = 0; i < s.length(); i++) {
			int n = Integer.parseInt(s.substring(i, i+1));
			if(result == 0 || n == 0 || result == 1 || n == 1) {
				result += n;
			}else {
				result *= n;
			}
		}

		System.out.println(result);
	}
}
```

###모범답안 자바
```
package ex.algorism.greedy;
import java.util.Scanner;

public class SumOrMultiply {
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		
		String str = sc.nextLine();
		
		long result = str.charAt(0) - '0';
		for(int i=1; i < str.length();i++) {
			int num = str.charAt(i) - '0';
			if (num <= 1 ||result <= 1) {
				result += num;
			}else {
				result *= num;
			}
		}
		
		System.out.println(result);
	}
}

```

###[문제] 정당성 분석
> 곱하는 것보다 더하는 것이 더 큰 값을 얻을 수 있다.
> 곱해서 0또는 1이되는 상황보다, 곱하는게 큰 값을 얻는다

 


이 자료는 나동빈님의 이코테 유튜브 영상을 보고 정리한 자료입니다.
<br>

<a href="https://www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC">참고 : www.youtube.com/watch?v=m-9pAwq1o3w&amp;list=PLRx0vPvlEmdAghTr5mXQxGpHjWqSz0dgC</a>




