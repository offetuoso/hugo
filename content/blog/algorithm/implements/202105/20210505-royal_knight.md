---
title: "왕실의 기사 (구현 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-03
slug: "royal_knight"
description: "코딩테스트 구현 알고리즘 왕실의 기사"
keywords: ["Algorithm", "CodingTest", "Python", "Java"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm","Implements" ,"이코테"]
math: false
toc: true
---

## [문제1] 왕실의 기사

### [문제] 왕실의 기사 : 문제 설명
>행복 왕국의 왕실 정원은 체스판과 같은 8 × 8 좌표 평면이다. 왕실 정원의 특정한 한 칸에 나이트가 서있다.
나이트는 매우 충성스러운 신하로서 매일 무술을 연마한다
나이트는 말을 타고 있기 때문에 이동을 할 때는 L자 형태로만 이동할 수 있으며 정원 밖으로는 나갈 수 없다
나이트는 특정 위치에서 다음과 같은 2가지 경우로 이동할 수 있다

> 1. 수평으로 두 칸 이동한 뒤에 수직으로 한 칸 이동하기
  2. 수직으로 두 칸 이동한 뒤에 수평으로 한 칸 이동하기

![contact](/images/algorithm/royal_knight_1.png)

>이처럼 8 × 8 좌표 평면상에서 나이트의 위치가 주어졌을 때 나이트가 이동할 수 있는 경우의 수를 출력하는
프로그램을 작성하라. 왕실의 정원에서 행 위치를 표현할 때는 1부터 8로 표현하며, 열 위치를 표현할 때는
a 부터 h로 표현한다

>c2에 있을 때 이동할 수 있는 경우의 수는 6가지이다
a1에 있을 때 이동할 수 있는 경우의 수는 2가지이다


### [문제] 조건 
> 조건 
>	풀이시간 20분 시간제한 1초, 메모리 128mb

> 입력
첫째 줄에 8x8 좌표 평면상에서 현재 나이트가 위치한 곳의 좌표를 나타내는 두 문자로 구성된 문자열이 입력된다. 입력 문자는 a1 처럼 열과 행으로 이뤄진다.

> 출력
첫째 줄에 나이트가 이동할 수 있는 경우의 수를 출력하시오.
> 입력 예시
a1

> 출력 예시
2

### 아이디어 
> 모든 

### royal_knight.py
```
n = str(input())
x = ord(n[0:1])
y = n[1:2]

#print(n[0:1])
#print(n[1:2])
#print(chr(104))
#print(ord('a'))


mv = [0 ,  1,  2,  3,  4,  5,  6,  7]
dx = [-1, +1, +3, +3, +1, -1, -3, +3]
dy = [-2, -2, -1, +1, +3, +3, +1, -1]

count = 0

for move in mv :
   
    if( ord('a') <= int(x)+dx[move] <= ord('h')
        and 1 <= int(y)+dy[move] <= 8) :
        count += 1


print(count) 

        
    


            
```

### 파이썬 모범답안 
```
n = int(input())

result = 0;
for h in range(n+1) :
    for m in range(60) :
        for s in range(60) :
            if('3' in str(h)+str(m)+str(s)) :
                result += 1

print(result)

```

### Time.java
```
package ex.Algorithm.implement;
import java.util.Scanner;

public class Time{
	public static void main(String args[]) {
		
		Scanner sc = new Scanner(System.in);
		
		int n = sc.nextInt();
		int hour = 0;
		int minute = 0;
		int second = 0;
		int count = 0;

		while (true) {
			
			if((""+hour+minute+second).contains("3")) {
				count++;
			}
			
			second++;
			
			if(second == 60){
				minute ++;
				second = 0;
			}
			if(minute == 60){
				hour ++;
				minute = 0;
			}
			if(hour == n+1){
				break;
			}
		}
		System.out.println(count);
	}
}
            
```



이 자료는 나동빈님의 이코테 저서를 보고 정리한 자료입니다.



