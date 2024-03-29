---
title: "Programmers 42889 실패율"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-21
slug: "programmers-42889-failure-rate"
description: "Programmers 실패율"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42889 실패율

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42889">Programmers 42889 링크</a>

> 슈퍼 게임 개발자 오렐리는 큰 고민에 빠졌다. 그녀가 만든 프랜즈 오천성이 대성공을 거뒀지만, 요즘 신규 사용자의 수가 급감한 것이다. 원인은 신규 사용자와 기존 사용자 사이에 스테이지 차이가 너무 큰 것이 문제였다.

> 이 문제를 어떻게 할까 고민 한 그녀는 동적으로 게임 시간을 늘려서 난이도를 조절하기로 했다. 역시 슈퍼 개발자라 대부분의 로직은 쉽게 구현했지만, 실패율을 구하는 부분에서 위기에 빠지고 말았다. 오렐리를 위해 실패율을 구하는 코드를 완성하라.

> 실패율은 다음과 같이 정의한다. <br>
스테이지에 도달했으나 아직 클리어하지 못한 플레이어의 수 / 스테이지에 도달한 플레이어 수 <br>
전체 스테이지의 개수 N, 게임을 이용하는 사용자가 현재 멈춰있는 스테이지의 번호가 담긴 배열 stages가 매개변수로 주어질 때, 실패율이 높은 스테이지부터 내림차순으로 스테이지의 번호가 담겨있는 배열을 return 하도록 solution 함수를 완성하라.




## Condition
> - 스테이지의 개수 N은 1 이상 500 이하의 자연수이다.<br>
> - stages의 길이는 1 이상 200,000 이하이다.<br>
> - stages에는 1 이상 N + 1 이하의 자연수가 담겨있다.
> - 각 자연수는 사용자가 현재 도전 중인 스테이지의 번호를 나타낸다.
> - 단, N + 1 은 마지막 스테이지(N 번째 스테이지) 까지 클리어 한 사용자를 나타낸다.
> - 만약 실패율이 같은 스테이지가 있다면 작은 번호의 스테이지가 먼저 오도록 하면 된다.
> - 스테이지에 도달한 유저가 없는 경우 해당 스테이지의 실패율은 0 으로 정의한다.


## input output
> 입출력 예

N |	stages |	result
---|------|-----
5	| [2, 1, 2, 6, 2, 4, 3, 3]	| [3,4,2,1,5]
4	| [4,4,4,4,4]	| [4,1,2,3]

> 입출력 예 설명
입출력 예 #1 <br>
1번 스테이지에는 총 8명의 사용자가 도전했으며, 이 중 1명의 사용자가 아직 클리어하지 못했다. <br>
따라서 1번 스테이지의 실패율은 다음과 같다.<br>
> 1 번 스테이지 실패율 : 1/8 <br>
2번 스테이지에는 총 7명의 사용자가 도전했으며, 이 중 3명의 사용자가 아직 클리어하지 못했다. <br>
따라서 2번 스테이지의 실패율은 다음과 같다.
> 2 번 스테이지 실패율 : 3/7 <br>
마찬가지로 나머지 스테이지의 실패율은 다음과 같다.<br>
> 3 번 스테이지 실패율 : 2/4<br>
> 4번 스테이지 실패율 : 1/2<br>
> 5번 스테이지 실패율 : 0/1<br>
> 각 스테이지의 번호를 실패율의 내림차순으로 정렬하면 다음과 같다.<br>
> [3,4,2,1,5]

> 입출력 예 #2<br>
>모든 사용자가 마지막 스테이지에 있으므로 4번 스테이지의 실패율은 1이며 나머지 스테이지의 실패율은 0이다.<br>
>[4,1,2,3]


## Solution 

```
def solution(N, stages):
    failureRate = {}
    challenger = len(stages)
    for stage in range(1,N+1) :
        failure = stages.count(stage) # stage별 실패자의 카운트
        if challenger == 0 :		# 도전자가 0이면 실패율 0
            failureRate[stage] =  0
        else :
		                                              # '실패율 = 실패자 / 도전자'  
            failureRate[stage] =  failure / challenger  # 실패율 dict에 스테이지별로 실패율 저장
            challenger = challenger - failure		    # 다음 스테이지 도전자 =  '도전자 - 실패자'

    return sorted(failureRate, key=lambda x : failureRate[x], reverse=True) 

```

## Others Solution 
```
def solution(N, stages):
    result = {}
    denominator = len(stages)
    for stage in range(1, N+1):
        if denominator != 0:
            count = stages.count(stage)
            result[stage] = count / denominator
            denominator -= count
        else:
            result[stage] = 0
    return sorted(result, key=lambda x : result[x], reverse=True)


```

## TestCase
```
#solution(5,	[2, 1, 2, 6, 2, 4, 3, 3])
#solution(5, [2,1,2,4,2,4,3,3])


```
