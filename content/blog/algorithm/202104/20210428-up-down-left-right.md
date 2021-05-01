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
n = int(input()) 		# map의 최대 크기
m = list(map(str, input().split())) 		#공백으로 구분된 이동플랜

x, y = 1, 1		# 시작위치

for move in m: 	# 입력받은 이동 커맨드
    if (move == "U") and (x - 1) > 0:   	# U (x-1, y)를 x-1이 1보다 작아지지 않는 선에서 수행 
        x -= 1
    elif (move == "D") and (x + 1) <= n :  # D (x+1, y)를 x+1이 n보다 커지지 않는 선에서 수행 
        x += 1
    elif (move == "L") and (y - 1) > 0:    # L (x, y-1)를 y-1이 1보다 작아지지 않는 선에서 수행 
        y -= 1
    elif (move) == "R") and (y + 1) <= n : # R (x, y+1)를 y+1이 n보다 커지지 않는 선에서 수행 
        y += 1

print(x,' ',y) 
            
```


###up-down-left-right1.py
```
n = int(input())
m =  input().split()

x, y = 1, 1

move_type = ['U','D','L','R']

dx = [-1, +1, 0, 0]
dy = [0, 0, -1, +1]


for move in m:

    for i in range(0, len(move_type)) :
        if move == move_type[i] :
            if( 1 <= x+dx[i] <= n and 1 <= y+dy[i] <= n )  :
                x += dx[i]
                y += dy[i]

print(x,' ',y)
            
```




### 파이썬 모범답안 1
```


```
### 파이썬 모범답안 2
```
    	
```




이 자료는 나동빈님의 이코테 저서를 보고 정리한 자료입니다.



