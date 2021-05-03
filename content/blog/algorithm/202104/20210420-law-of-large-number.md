---
title: "큰수의 법칙 (그리디 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-04-20
slug: "law-of-large-number"
description: "코딩테스트 큰수의 법칙"
keywords: ["Algorism", "CodingTest", "Python","Java"]
draft: false
tags: ["Algorism",, "Greedy" "이코테", "수열"]
math: false
toc: true
---

## [문제1] 큰 수의 법칙

###[문제] 큰 수의 법칙 : 문제 설명
> 출제자는 큰 수의 법칙을 본인만의 방식으로 다르게 사용하고 있다. 이 큰 수의 법칙은 다양한 수로 이루어진 배열이 있을 때 주어진 수들을 M번 더하여 가장 큰수를 만드는 법칙이다. 단 배열의 특정한 인덱스(번호)에 해당하는 수가 연속해서 K번을 초과하여 더해질 수 없는 것이 이 법칙의 특징이다.

> 예를 들어 순서대로 2, 4, 5, 4, 6으로 이루어진 배열이 있을 때 M이 8이고, K가 3이라고 가정하자. 이 경우 특정한 인덱스의 수가 연속해서 세 번까지만 더해질 수 있으므로 큰 수의 법칙에 따른 결과는 6+6+6+5+6+6+6+5인 46이 된다.

>	배열의 크기 N, 숫자가 더해지는 횟수 M, 그리고 K가 주어질 때 출제자의 큰 수의 법칙에 따른 결과를 출력하시오

###[문제] 조건 
> 조건 
>	시간 1초, 메모리 120mb

> 입력조건
>	첫째 줄에 N(2 <= N <= 1,000), M(1 <= M <= 10,000), K(1 <= K <= 10,000)의 자연수가 주어지며, 각 자연수는 공백으로 구분한다.
둘째 줄에 N개의 자연수가 주어진다. 각 자연수는 공백으로 구분한다. 단, 각각의 자연수는 1 이상 10,000 이하의 수로 주어진다.
입력으로 주어지는 K는 항상 M보다 작거나 같다

> 출력조건
>	첫째 줄에 큰 수 의 법칙에 따라 더해진 답을 출력한다

> 입력예시
>	5 8 3
>	2 4 5 4 6


> 출력예시
>	46


### 아이디어 
>최초 while 안에 k번의 반복문을 두어 큰수를 반복시키려고 했다만 
문제 조건의 시간과 메모리의 조건이 있어 최대 입력값인 1000, 10000, 10000 이라면 
열심히 풀고도 오답이 나올것이다. 


>n m k
>5 7 2
> 2 1 5 4 3

>{5, 5, 4, 5, 5, 4, 5}

> 코딩문제인줄 알았으나 수열문제 였다. 일단 5의 갯수를 세어 count * 5로 반복문 없이 계산을 하려한다. 
 
> 첫번째로 반복되는 수열중 5의 갯수를 구하는 법이다. 
반복되는 5, 5, 4는 (k+1) 3이며 전체의 총 개수에서 몇번 사용할 수 있는지 생각해 보면
 m // (k+1) 몫은 2가 나온다. 여기에 k를 다시 곱해준다  (m // (+1) 2)*k 여기까지 계산하면 반복되는 수열중의 제일 큰 수를 계산한다. 
 
> 하지만 수열에 포함되지 않은 5의 갯수를 더해줘야한다. 
> 딱 나눠떨어지면 0, 나머지가 있다면 나머지 만큼의 5를 더해 줘야한다. 
여기에 자주 쓰이는 % 연산자가 있다 

> m % (k+1)   으로 1이나온다. 
> 나머지의 갯수를 계산하는 식 m % (k+1)

> count = (m // (+1) 2)*k 
> count += m % (k+1)

> 이렇게 하면 {(5), (5), 4, (5), (5), 4, (5)} 5의 개수를 얻었고 
> 이제 4의 개수를 얻어보자 
> 아까 구했던 수열이 반복되는 (m // (k+1)) 만큼 4를 곱해준다 

> count2 = (m // (k+1))
> 나머지는 2번째 수가 나오지 못하여, 몫으로 안떨어지고 나머지가 된것이기 때문에 2번째 큰수는 나머지 추가로 더해줄게 없다

> result = (count*첫번째큰수)+(count2*두번째큰수)


###law_of_large_number.py
```
n, m, k = map(int, input().split()) 
l = list(map(int, input().split()));
l.sort();

first = l[n-1] 
second = l[n-2]

count = (m // (k+1))*k 
count += m % (k+1)

count2 = (m // (k+1)) #m-count

result = (count*first) + (count2*second)

print(result)
     

```

###LawOfLargeNumber.java
```
package ex.algorism.greedy;
import java.util.Arrays;
import java.util.Collections;
import java.util.Scanner;

public class LawofLargeNumber {
	
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		
		int result = 0;
		
		String str1 = sc.nextLine();
		String str2 = sc.nextLine();
		
		int n = Integer.parseInt(str1.split(" ")[0]);
		int m = Integer.parseInt(str1.split(" ")[1]);
		int k = Integer.parseInt(str1.split(" ")[2]);
		String list[] = str2.split(" ");
		Arrays.sort(list);
		
		int first = Integer.parseInt(list[n-1]);
		int second = Integer.parseInt(list[n-2]);
		
		//System.out.println("n"+n);
		//System.out.println("m"+m);
		//System.out.println("k"+k);
		//System.out.println("first"+first);
		//System.out.println("second"+second);
		
		//5 5 4 5 5 4 5
		
		int count = (m/(k+1))*k;
		count += m%(k+1);
		int count2 = m-count; 
		
		//System.out.println(count);
		
		result = (count*first) + (count2*second);
				
		System.out.println(result);
	}
}

```


이 자료는 나동빈님의 이코테 저서를 보고 정리한 자료입니다.
   


