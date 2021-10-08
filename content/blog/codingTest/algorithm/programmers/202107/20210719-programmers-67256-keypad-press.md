---
title: "Programmers 67256 키패드 누르기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-19
slug: "programmers-67256-keypad-press"
description: "Programmers 키패드 누르기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 67256 키패드 누르기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/67256">Programmers 67256 링크</a>

> 스마트폰 전화 키패드의 각 칸에 다음과 같이 숫자들이 적혀 있습니다.


![kakao_phone1](https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/4b69a271-5f4a-4bf4-9ebf-6ebed5a02d8d/kakao_phone1.png) 

>이 전화 키패드에서 왼손과 오른손의 엄지손가락만을 이용해서 숫자만을 입력하려고 합니다.<br>
맨 처음 왼손 엄지손가락은 * 키패드에 오른손 엄지손가락은 # 키패드 위치에서 시작하며, <br>엄지손가락을 사용하는 규칙은 다음과 같습니다.

> 엄지손가락은 상하좌우 4가지 방향으로만 이동할 수 있으며 키패드 이동 한 칸은 거리로 1에 해당합니다. <br>
왼쪽 열의 3개의 숫자 1, 4, 7을 입력할 때는 왼손 엄지손가락을 사용합니다.<br>
오른쪽 열의 3개의 숫자 3, 6, 9를 입력할 때는 오른손 엄지손가락을 사용합니다.<br>
가운데 열의 4개의 숫자 2, 5, 8, 0을 입력할 때는 두 엄지손가락의 현재 키패드의 위치에서 더 가까운 엄지손가락을 사용합니다.<br>
4-1. 만약 두 엄지손가락의 거리가 같다면, 오른손잡이는 오른손 엄지손가락, 왼손잡이는 왼손 엄지손가락을 사용합니다.<br>
순서대로 누를 번호가 담긴 배열 numbers, 왼손잡이인지 오른손잡이인 지를 나타내는 문자열 hand가 매개변수로 주어질 때, <br>
각 번호를 누른 엄지손가락이 왼손인 지 오른손인 지를 나타내는 연속된 문자열 형태로 return 하도록 solution 함수를 완성해주세요.

## Condition
> - numbers 배열의 크기는 1 이상 1,000 이하입니다.
> - numbers 배열 원소의 값은 0 이상 9 이하인 정수입니다.
> - hand는 "left" 또는 "right" 입니다.
> - "left"는 왼손잡이, "right"는 오른손잡이를 의미합니다.
> - 왼손 엄지손가락을 사용한 경우는 L, 오른손 엄지손가락을 사용한 경우는 R을 순서대로 이어붙여 문자열 형태로 return 해주세요.




## input output
> 입출력 예

numbers	| hand	|result
-------|-------|----------
[1, 3, 4, 5, 8, 2, 1, 4, 5, 9, 5] |	"right" |	"LRLLLRLLRRL"
[7, 0, 8, 2, 8, 3, 1, 5, 7, 6, 2] |	"left" |	"LRLLRRLLLRR"
[1, 2, 3, 4, 5, 6, 7, 8, 9, 0] |	"right" |	"LLRLLRLLRL"

>입출력 예에 대한 설명
입출력 예 #1

>순서대로 눌러야 할 번호가 [1, 3, 4, 5, 8, 2, 1, 4, 5, 9, 5]이고, 오른손잡이입니다.

왼손 위치 |	오른손 위치 |	눌러야 할 숫자 |	사용한 손	| 설명
---|---|---|---|----
\* |	# |	1 |	L |	1은 왼손으로 누릅니다.
1 |	# |	3 |	R |	3은 오른손으로 누릅니다.
1 |	3 |	4 |	L |	4는 왼손으로 누릅니다.
4 |	3 |	5 |	L |	왼손 거리는 1, 오른손 거리는 2이므로 왼손으로 5를 누릅니다.
5 |	3 |	8 |	L |	왼손 거리는 1, 오른손 거리는 3이므로 왼손으로 8을 누릅니다.
8 |	3 |	2 |	R |	왼손 거리는 2, 오른손 거리는 1이므로 오른손으로 2를 누릅니다.
8 |	2 |	1 |	L |	1은 왼손으로 누릅니다.
1 |	2 |	4 |	L |	4는 왼손으로 누릅니다.
4 |	2 |	5 |	R |	왼손 거리와 오른손 거리가 1로 같으므로, 오른손으로 5를 누릅니다.
4 |	5 |	9 |	R |	9는 오른손으로 누릅니다.
4 |	9 |	5 |	L |	왼손 거리는 1, 오른손 거리는 2이므로 왼손으로 5를 누릅니다.
5 |	9 |	- |	- |	

> 따라서 "LRLLLRLLRRL"를 return 합니다.

> 입출력 예 #2 <br>
왼손잡이가 [7, 0, 8, 2, 8, 3, 1, 5, 7, 6, 2]를 순서대로 누르면 사용한 손은 "LRLLRRLLLRR"이 됩니다.

> 입출력 예 #3 <br>
오른손잡이가 [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]를 순서대로 누르면 사용한 손은 "LLRLLRLLRL"이 됩니다.

## Solution 

```
def getDistance(n, target):
    keypad = {}		   # 딕셔너리로 각 좌표를 생성
    keypad[1] = [0,0]	   
    keypad[2] = [0,1]	   #		1[0,0] 2[0,1] 3[0,2] 
    keypad[3] = [0,2]	    
    keypad[4] = [1,0]      #		4[1,0] 5[1,1] 6[1,2] 
    keypad[5] = [1,1]      
    keypad[6] = [1,2]      #		7[2,0] 8[2,1] 9[2,2] 
    keypad[7] = [2,0]      
    keypad[8] = [2,1]      #		*[3,0] 0[3,1] #[3,2] 
    keypad[9] = [2,2]      
    keypad['*'] = [3,0]    
    keypad[0]   = [3,1]    
    keypad['#'] = [3,2]    
    
    targetPosition = keypad[target] 	# 타겟의 좌표
    nowPosition = keypad[n]		   	# 검사할 손의 좌표
	
    # 타겟과 검사할 손의 좌표를 y축끼리 x축끼리 빼서 절대값 변환후 더해 반환
    return (abs(targetPosition[0] - nowPosition[0]) + abs(targetPosition[1] - nowPosition[1])) 


def solution(numbers, hand):
    answer = ''


    leftHand = '*'
    rightHand = '#'
    
    for number in numbers : 
        if number in [1,4,7] : 	#1,4,7이면 결과에 L추가, leftHand 위치 변경
            answer += 'L'
            leftHand = number
        elif number in [3,6,9] : #3,6,9이면 결과에 R추가, rightHand 위치 변경
            answer += 'R'
            rightHand = number
        else :
            
            leftDistance = getDistance(leftHand, number); # 타겟과의 L거리
            rightDistance = getDistance(rightHand, number); # 타겟과의 R거리

            if leftDistance < rightDistance or (leftDistance == rightDistance and hand == 'left' ): # 거리가 left가 짧거나 거리가 같은데 왼손잡이인 경우
                answer += 'L'
                leftHand = number
            elif leftDistance > rightDistance or (leftDistance == rightDistance and hand == 'right' ): # 거리가 right가 짧거나 거리가 같은데 오른손잡이인 경우
                answer += 'R'
                rightHand = number

    return answer 

    
```

## Others Solution 
```
def solution(numbers, hand):
    answer = ''
    location = [[3, 1], [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
    left, right = [3, 0], [3, 2]
    for i in numbers:
        if i % 3 == 1:
            answer += 'L'
            left = location[i]
        elif i % 3 == 0 and i != 0:
            answer += 'R'
            right = location[i]
        else:
            l = abs(location[i][0] - left[0]) + abs(location[i][1] - left[1])
            r = abs(location[i][0] - right[0]) + abs(location[i][1] - right[1])
            if l < r:
                answer += 'L'
                left = location[i]
            elif l > r:
                answer += 'R'
                right = location[i]
            else:
                answer += hand[0].upper()
                if hand == 'right':
                    right = location[i]
                else:
                    left = location[i]                

    return answer

```

## TestCase
```
#solution( [7, 0, 8, 2, 8, 3, 1, 5, 7, 6, 2], 'left')
#solution([1, 3, 4, 5, 8, 2, 1, 4, 5, 9, 5], "right") 

```
