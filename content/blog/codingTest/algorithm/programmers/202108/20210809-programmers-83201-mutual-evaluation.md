---
title: "Programmers 83201 상호평가"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-09
slug: "programmers-83201-mutual-evaluation"
description: "83201 상호평가"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 83201 상호평가

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/83201">Programmers 83201 링크</a>

>대학 교수인 당신은, 상호평가를 통하여 학생들이 제출한 과제물에 학점을 부여하려고 합니다. 아래는 0번부터 4번까지 번호가 매겨진 5명의 학생들이 자신과 다른 학생의 과제를 평가한 점수표입니다.

No.	|0	|1	|2	|3	|4
--|--|--|--|--|--
0	|100	|90	|98	|88	|65
1	|50	|45	|99	|85	|77
2	|47	|88	|95	|80	|67
3	|61	|57	|100	|80	|65
4	|24	|90	|94	|75	|65
평균	|45.5|	81.25|	97.2	|81.6	|67.8
학점	|F	|B|	A	|B	|D

>위의 점수표에서, i행 j열의 값은 i번 학생이 평가한 j번 학생의 과제 점수입니다.

>0번 학생이 평가한 점수는 0번 행에담긴 [100, 90, 98, 88, 65]입니다.<br>
>0번 학생은 자기 자신에게 100점, 1번 학생에게 90점, 2번 학생에게 98점, 3번 학생에게 88점, 4번 학생에게 65점을 부여했습니다.<br>
>2번 학생이 평가한 점수는 2번 행에담긴 [47, 88, 95, 80, 67]입니다.<br>
>2번 학생은 0번 학생에게 47점, 1번 학생에게 88점, 자기 자신에게 95점, 3번 학생에게 80점, 4번 학생에게 67점을 부여했습니다.<br>
>당신은 각 학생들이 받은 점수의 평균을 구하여, 기준에 따라 학점을 부여하려고 합니다.<br>
>만약, 학생들이 자기 자신을 평가한 점수가 유일한 최고점 또는 유일한 최저점이라면 그 점수는 제외하고 평균을 구합니다.

>0번 학생이 받은 점수는 0번 열에 담긴 [100, 50, 47, 61, 24]입니다. 자기 자신을 평가한 100점은 자신이 받은 점수 중에서 유일한 최고점이므로, 평균을 구할 때 제외합니다.
0번 학생의 평균 점수는 (50+47+61+24) / 4 = 45.5입니다.<br>
4번 학생이 받은 점수는 4번 열에 담긴 [65, 77, 67, 65, 65]입니다. <br>
자기 자신을 평가한 65점은 자신이 받은 점수 중에서 최저점이지만 같은 점수가 2개 더 있으므로, 유일한 최저점이 아닙니다. 따라서, 평균을 구할 때 제외하지 않습니다.
4번 학생의 평균 점수는 (65+77+67+65+65) / 5 = 67.8입니다.<br>
제외할 점수는 제외하고 평균을 구한 후, 아래 기준에 따라 학점을 부여합니다.

평균	|학점
---|---
90점 |이상	A
80점  |이상 90점 미만	B
70점  |이상 80점 미만	C
50점  |이상 70점 미만	D
50점 |미만	F

>학생들의 점수가 담긴 정수형 2차원 배열 scores가 매개변수로 주어집니다. <br>
이때, 학생들의 학점을 구하여 하나의 문자열로 만들어서 return 하도록 <br>
solution 함수를 완성해주세요.


## Condition
>- 제한사항
>- 2 ≤ scores의 행의 길이(학생 수) ≤ 10
>- scores의 열의 길이 = scores의 행의 길이
>- 즉, scores는 행과 열의 길이가 같은 2차원 배열입니다.
>- 0 ≤ scores의 원소 ≤ 100


###입력 형식

scores|result
------|------------
[[100,90,98,88,65],[50,45,99,85,77],[47,88,95,80,67],[61,57,100,80,65],[24,90,94,75,65]] |FBABD"
[[50,90],[50,87]]	| A"
[[70,49,90],[68,50,38],[73,31,100]] |CFD"

>출력 예 설명<br>
입출력 예 #1

>문제 예시와 같습니다.

>입출력 예 #2

No.	 |0	|1
---|---|---
0	 |50	|90
1	|50	|87
평균	|50	|90
학점	|D	|A

>1번 학생이 자기 자신을 평가한 87점은 [90, 87]에서 유일한 최저점이므로, 평균을 구할 때 제외합니다.


>입출력 예 #3

No.	|0	|1	|2
--|--|---|--
0	|70	 |49	|90
1	|68	|50	|38
2	|73	|31|	100
평균	|70.33…	|40	|64
학점	|C	|F	|D

>1번 학생이 자기 자신을 평가한 50점은 [49, 50, 31]에서 유일한 최고점이므로, 평균을 구할 때 제외합니다.

>2번 학생이 자기 자신을 평가한 100점은 [90, 38, 100]에서 유일한 최고점이므로, 평균을 구할 때 제외합니다.

>return 값 형식<br>
>0번 학생의 학점부터 차례대로 이어 붙인 하나의 문자열을 return 합니다.

## Solution 
> 1. 테이블을 피봇하여 n번학생이 평가한 항목 리스트가 아닌, n번 학생에 대한 평가 리스트로 변경 
> 2. 자신이 평가한 최대값 또는 최소값이 유일한 최소, 최대값이라면 리스트에서 제거
> 3. 2.의 리스트의 평균을 구하여, 등급을 메겨서 문자열로 붙여서 반환 

> 몇가지 케이스를 통과하지 못해서 좀더 풀어봐야 할거같다.


```
def solution(scores):
    answer = ''

    pivot = []
    
    for i in range(0, len(scores)) :
        for j in range(0, len(scores)) :
            if j == 0 :
                temp = []
            temp.append(scores[j][i])
        pivot.append(temp)

    answer = ''
    for i in range(0, len(pivot)) : 
        score = pivot[i]

        min_value = min(score)
        min_cnt  = score.count(min_value)
        max_value = max(score)
        max_cnt  = score.count(max_value)

        _score = [ score[k]  for k in range(0, len(score)) if i != k or not ( (i == k and min_value == score[k] and min_cnt == 1)  or (i == k and max_value == score[k] and max_cnt == 1) )]

        avg = sum(_score)/len(_score)

        if  90 <=  avg:
            answer += 'A'
        elif 80 <= avg  < 90 : 
            answer += 'B'
        elif 70 <= avg  < 80 : 
            answer += 'C'
        elif 50 <= avg  < 70 : 
            answer += 'D'
        elif avg  < 50 : 
            answer += 'F'

    return answer
```

## Others Solution 
```
def solution(scores):
    answer = ''

    for i, score in enumerate(zip(*scores)):
        avg = (sum(score) - score[i]) / (len(score) - 1) if score[i] in (min(score), max(score)) and score.count(score[i]) == 1 else sum(score) / len(score)
        answer += "%s" % (
            "A" if 90 <= avg else
            "B" if 80 <= avg else
            "C" if 70 <= avg else
            "D" if 50 <= avg else
            "F"
        )

    return answer
```

```
from collections import Counter
def solution(scores):   
    answer = ''

    for idx, score in enumerate(list(map(list, zip(*scores)))):
        length = len(score)
        if Counter(score)[score[idx]] == 1 and (max(score) == score[idx] or min(score) == score[idx]):
            del score[idx]
            length -= 1

        grade = sum(score) / length

        if grade >= 90:
            answer += 'A'
        elif grade >= 80:
            answer += 'B'
        elif grade >= 70:
            answer += 'C'
        elif grade >= 50:
            answer += 'D'
        else:
            answer += 'F'

    return answer

```

## TestCase
```
print(solution([[100,90,98,88,65],[50,45,99,85,77],[47,88,95,80,67],[61,57,100,80,65],[24,90,94,75,65]]),	"FBABD")
print(solution([[50,90],[50,87]]),	"DA")
print(solution([[70,49,90],[68,50,38],[73,31,100]]),	"CFD")
print(solution([[0,50,0],[50,0,0],[50,0,0]]),	"CFD")

```
