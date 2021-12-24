---
title: "Programmers 42840 모의고사"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-04
slug: "programmers-42840-mock-exam"
description: "42840 모의고사"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42840 모의고사

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42840">Programmers 42840 링크</a>

>수포자는 수학을 포기한 사람의 준말입니다. 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 합니다. 수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍습니다.

```
1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...
```

>1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.




## Condition
>- 시험은 최대 10,000 문제로 구성되어있습니다.
>- 문제의 정답은 1, 2, 3, 4, 5중 하나입니다.
>- 가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬해주세요.

###입력 형식
>입출력 예

answers |	return
-----|---------
[1,2,3,4,5] |	[1]
[1,3,2,4,2] |	[1,2,3]

>입출력 예 설명<BR>
>입출력 예 #1

>수포자 1은 모든 문제를 맞혔습니다.<BR>
수포자 2는 모든 문제를 틀렸습니다.<BR>
수포자 3은 모든 문제를 틀렸습니다.<BR>
따라서 가장 문제를 많이 맞힌 사람은 수포자 1입니다.<BR>

>입출력 예 #2<BR>
>모든 사람이 2문제씩을 맞췄습니다.

## Solution 
> 1. 문제수와 정답 패턴의 길이를 맞춘다. 길면 자르고 모자라면 붙인다. 
> 2. 정답을 채점한다
> 3. 최고점을 찾는다.
> 4. 최고점 맞은 사람을 리스트에 담는다.

```
   def solution(answers):
    length = len(answers)
    answer = []

    studnet = [[1, 2, 3, 4, 5], [2, 1, 2, 3, 2, 4, 2, 5], [3, 3, 1, 1, 2, 2, 4, 4, 5, 5]]
    result = []

    for s in studnet :
        arr = []
        [arr.extend(s) for i in range(len(answers)//len(s))]
        
        if len(answers)%len(s) != 0 :
            arr[len(arr):len(arr)] = s[:len(answers)%len(s)]

        result.append(arr)
    
    max_score = 0
    score = {}
    for j in range(0,3) :
        score[j] = list(map(lambda i :  'O' if result[j][i] == answers[i]  else 'X', range(0,len(answers)))).count('O')
        max_score = max(score[j], max_score)
    
    print(score,max_score)
    
    for key in score.keys() :
        if score[key] == max_score :
            answer.append(key+1)

    return answer
```


## Others Solution 
> cycle 사용

```
from itertools import cycle

def solution(answers):
    giveups = [
        cycle([1,2,3,4,5]),
        cycle([2,1,2,3,2,4,2,5]),
        cycle([3,3,1,1,2,2,4,4,5,5]),
    ]
    scores = [0, 0, 0]
    for num in answers:
        for i in range(3):
            if next(giveups[i]) == num:
                scores[i] += 1
    highest = max(scores)

    return [i + 1 for i, v in enumerate(scores) if v == highest]

```


> enumerate 사용

```
def solution(answers):
    p = [[1, 2, 3, 4, 5],
         [2, 1, 2, 3, 2, 4, 2, 5],
         [3, 3, 1, 1, 2, 2, 4, 4, 5, 5]]
    s = [0] * len(p)

    for q, a in enumerate(answers):
        for i, v in enumerate(p):
            if a == v[q % len(v)]:
                s[i] += 1
    return [i + 1 for i, v in enumerate(s) if v == max(s)]

```

## TestCase
```
print(solution([1,2,3,4,5,1,2,3,4]), [1])
```
