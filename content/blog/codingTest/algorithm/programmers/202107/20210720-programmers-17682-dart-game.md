---
title: "Programmers 17682 다트 게임"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-20
slug: "programmers-17682-dart-game"
description: "Programmers 다트 게임"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 17682 다트 게임

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/17682">Programmers 17682 링크</a>

> 카카오톡 게임별의 하반기 신규 서비스로 다트 게임을 출시하기로 했다. 다트 게임은 다트판에 다트를 세 차례 던져 그 점수의 합계로 실력을 겨루는 게임으로, 모두가 간단히 즐길 수 있다.
갓 입사한 무지는 코딩 실력을 인정받아 게임의 핵심 부분인 점수 계산 로직을 맡게 되었다. 다트 게임의 점수 계산 로직은 아래와 같다.

> 다트 게임은 총 3번의 기회로 구성된다. <br>
각 기회마다 얻을 수 있는 점수는 0점에서 10점까지이다.<br>
점수와 함께 Single(S), Double(D), Triple(T) 영역이 존재하고 각 영역 당첨 시 점수에서 1제곱, 2제곱, 3제곱 (점수1 , 점수2 , 점수3 )으로 계산된다.<br>
옵션으로 스타상(*) , 아차상(#)이 존재하며 스타상(*) 당첨 시 해당 점수와 바로 전에 얻은 점수를 각 2배로 만든다. 아차상(#) 당첨 시 해당 점수는 마이너스된다.<br>
스타상(*)은 첫 번째 기회에서도 나올 수 있다. 이 경우 첫 번째 스타상(*)의 점수만 2배가 된다. (예제 4번 참고)<br>
스타상(*)의 효과는 다른 스타상(*)의 효과와 중첩될 수 있다. 이 경우 중첩된 스타상(*) 점수는 4배가 된다. (예제 4번 참고)<br>
스타상(*)의 효과는 아차상(#)의 효과와 중첩될 수 있다. 이 경우 중첩된 아차상(#)의 점수는 -2배가 된다. (예제 5번 참고)<br>
Single(S), Double(D), Triple(T)은 점수마다 하나씩 존재한다.<br>
스타상(*), 아차상(#)은 점수마다 둘 중 하나만 존재할 수 있으며, 존재하지 않을 수도 있다.<br>
0~10의 정수와 문자 S, D, T, *, #로 구성된 문자열이 입력될 시 총점수를 반환하는 함수를 작성하라.<br>




## Condition
> - 점수는 0에서 10 사이의 정수이다.
> - 보너스는 S, D, T 중 하나이다.
> - 옵선은 *이나 # 중 하나이며, 없을 수도 있다.
> - 입력 형식 
		"점수|보너스|[옵션]"으로 이루어진 문자열 3세트. 예) 1S2D*3T
> - 출력 형식
  		3번의 기회에서 얻은 점수 합계에 해당하는 정수값을 출력한다. 예) 37


## input output

예제	| dartResult	|	answer	|	설명
-------|-------|----------|-----------
1	|	1S2D*3T		| 37	|11 * 2 + 22 * 2 + 33
2	|	1D2S#10S 	| 9		|12 + 21 * (-1) + 101
3	|	1D2S0T		| 3		|12 + 21 + 03
4	|	1S*2T*3S	| 23	|11 * 2 * 2 + 23 * 2 + 31
5	|	1D#2S*3S	| 5		|12 * (-1) * 2 + 21 * 2 + 31
6	|	1T2D3D#		| -4	|13 + 22 + 32 * (-1)
7	|	1D2S3T*		| 59	|12 + 21 * 2 + 33 * 2



## Solution 
> 1. 숫자(문자열)은 number에 붙임
> 2. SDT 면 number를 숫자로 변경후 해당 dart 값을 거듭제곱
> 3. \*이면 현재값, 이전값 \*2
> 4. #이면 현재값 -로 변경
> 5. 결과 배열합해서 반환

```
def solution(dartResult):
    dart  = {'S':1, 'D':2, 'T':3}
    score = [0,0,0]
    number = ''
    
    for i in range(0,len(dartResult)):
        s = dartResult[i]
        if s in dart  :		# SDT는 **1,**2,**3 
            score.append(int(number) ** dart [s])	
            number = ''
        elif s == '*' :		# *는 현재 점수 *2, 이전 점수 *2
            score[-1] *= 2
            score[-2] *= 2
        elif s == '#' :		# #은 현재 점수 *-1
            score[-1] *= -1
        else :					# 숫자 문자열 시 number에 문자열 합침
            number += s
    return sum(score)
```

## Others Solution 
```
import re


def solution(dartResult):
    bonus = {'S' : 1, 'D' : 2, 'T' : 3}
    option = {'' : 1, '*' : 2, '#' : -1}
    p = re.compile('(\d+)([SDT])([*#]?)')
    dart = p.findall(dartResult)
    for i in range(len(dart)):
        if dart[i][2] == '*' and i > 0:
            dart[i-1] *= 2
        dart[i] = int(dart[i][0]) ** bonus[dart[i][1]] * option[dart[i][2]]

    answer = sum(dart)
    return answer

```

## TestCase
```

testcase = ['1S2D*3T','1D2S#10S','1D2S0T','1S*2T*3S','1D#2S*3S','1T2D3D#','1D2S3T*']

for test in testcase :
    solution(test);


```
