---
title: "상하좌우 (구현 알고리즘)"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-04-28
slug: "up-down-left-right"
description: "코딩테스트 구현 알고리즘 상하좌우"
keywords: ["Algorism", "CodingTest", "Python", "Java"]
draft: false
tags: ["Algorism", "이코테"]
math: false
toc: true
---

## [문제1] 상하좌우

###[문제] 상하좌우 : 문제 설명
> 여행가 A는 N × N 크기의 정사각형 공간 위에 서 있다. 이 공간은 1 × 1 크기의 정사각형으로 나누어져 있다.
가장 왼쪽 위 좌표는 (1, 1)이며, 가장 오른쪽 아래 좌표는 (N, N)에 해당한다.
여행가 A는 상, 하, 좌, 우 방향으로 이동할 수 있으며, 시작 좌표는 항상 (1, 1)이다. 우리 앞에는 여행가 A가
이동할 계획이 적힌 계획서가 놓여 있다

>계획서에는 하나의 줄에 띄어쓰기를 기준으로 L, R, U, D 중 하나의 문자가 반복적으로 적혀있다.
각 문자의 의미는 다음과 같다

>L: 왼쪽으로 한 칸 이동
R: 오른쪽으로 한 칸 이동
U: 위로 한 칸 이동
D: 아래로 한 칸 이동

>이때 여행가 A가 N × N 크기의 정사각형 공간을 벗어나는 움직임은 무시된다
예를 들어 (1, 1)의 위치에서 L 혹은 U를 만나면 무시된다
다음은 N = 5인 지도와 계획이다



###[문제] 조건 
> 조건 
>	풀이시간 15분 시간제한 1초, 메모리 128mb

> 입력
첫째 줄에 공간의 크기를 나타내는 N이 주어집니다. (1<=N<=100)
둘째 줄에 여행가 A가 이동할 계획서 내용이 주어집니다. (1<=이동 횟수<=100)


> 출력
첫째 줄에 여행가 A가 최종적으로 도착할 지점의 좌표(X,Y)를 공백으로 구분하여 출력한다.

> 입력예시
>	5
>   R R R U D D
> 출력예시
>	3 4

###up-down-left-right1.py
```
n = int(input())
m = list(map(str, input().split()))

x = 1
y = 1

for move in m:

    if (move.upper() == "U") and (x - 1) > 0:    
        x -= 1
    elif (move.upper() == "D") and (x + 1) <= n :
        x += 1
    elif (move.upper() == "L") and (y - 1) > 0:    
        y -= 1
    elif (move.upper() == "R") and (y + 1) <= n :
        y += 1

    print(move,' ',x,' ',y)

print(x,' ',y)
            
```

### 파이썬 모범답안 1
```


```
### 파이썬 모범답안 2
```
    	
```




이 자료는 나동빈님의 이코테 저서를 보고 정리한 자료입니다.



