---
title: "Programmers 42576 완주하지 못한 선수"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-12
slug: "programmers-42576-players-who-did-not-finish"
description: "Programmers 완주하지 못한 선수"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42576 완주하지 못한 선수

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42576">Programmers 42576 링크</a>

>수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.
마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

## Condition
> - 마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
> - completion의 길이는 participant의 길이보다 1 작습니다.
> - 참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
> - 참가자 중에는 동명이인이 있을 수 있습니다.

## input output

participant	| completion |	return
------------|------------|----------
["leo", "kiki", "eden"] |	["eden", "kiki"] |	"leo"
["marina", "josipa", "nikola", "vinko", "filipa"] |	["josipa", "filipa", "marina", "nikola"] |	"vinko"
["mislav", "stanko", "mislav", "ana"] |	["stanko", "ana", "mislav"] |	"mislav"

## Solution 
> 1. participant 배열을 DICT로 변경
	- 키는 선수명, 값은 카운트
	- 키가 없으면 1, 키가 있다면 +1
> 2. completion를 순회 하며 DICT을 조회
	- 선수를 조회하여 카운트 값이 1이면 삭제
	- 선수를 조회하여 카운트 값이 1보다 크면 -1
> 3. 남아있는 선수의 이름을 반환
	

```

def solution(participant,completion):
	answer = ''
	
	dic = {}
	for player  in participant :		# participant 배열을 DICT로 변경
		if dic.get(player) is None :		# 키는 선수명, 값은 카운트
			dic[player] = 1	
		else :
			dic[player] += 1			# 키가 없으면 1, 키가 있다면 +1

	for player  in completion :		# completion를 순회 하며 DICT을 조회
		if dic[player] == 1 :			# 선수를 조회하여 카운트 값이 1이면 삭제
			del(dic[player])
		else :
			dic[player] -= 1			# 선수를 조회하여 카운트 값이 1보다 크면 -1

	for k in dic.keys() :			# 남아있는 선수의 이름을 반환
		answer = k

	return answer


```


## Other Solution 
> 다른 사람의 풀이를 보고 Counter라는 콜렉션의 함수를 처음 보았다. ~메모~


```
from collections import Counter

def solution(participant, completion):
    answer = Counter(participant) - Counter(completion) # Counter로 생성하여 서로 -연산을 통해 남는 카운트를 반환
    return list(answer.keys())[0]

```

## TestCase
```
solution(["leo", "kiki", "eden"],	["eden", "kiki"]) # "leo"
solution(["marina", "josipa", "nikola", "vinko", "filipa"], 	["josipa", "filipa", "marina", "nikola"]) # "vinko"
solution(["mislav", "stanko", "mislav", "ana"], ["stanko", "ana", "mislav"]) #"mislav"

```
