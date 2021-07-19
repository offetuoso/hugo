---
title: "Programmers 42862 체육복"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-18
slug: "programmers-42862-gym-suit"
description: "Programmers 체육복"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42862 체육복

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42862">Programmers 42862 링크</a>

> 점심시간에 도둑이 들어, 일부 학생이 체육복을 도난당했습니다. 
다행히 여벌 체육복이 있는 학생이 이들에게 체육복을 빌려주려 합니다. <br> 
학생들의 번호는 체격 순으로 매겨져 있어, 바로 앞번호의 학생이나 바로 뒷번호의 학생에게만 체육복을 빌려줄 수 있습니다. 
예를 들어, 4번 학생은 3번 학생이나 5번 학생에게만 체육복을 빌려줄 수 있습니다. <br>
체육복이 없으면 수업을 들을 수 없기 때문에 체육복을 적절히 빌려 최대한 많은 학생이 체육수업을 들어야 합니다.

> 전체 학생의 수 n, 체육복을 도난당한 학생들의 번호가 담긴 배열 lost, <br>
 여벌의 체육복을 가져온 학생들의 번호가 담긴 배열 reserve가 매개변수로 주어질 때, <br>
 체육수업을 들을 수 있는 학생의 최댓값을 return 하도록 solution 함수를 작성해주세요.

## Condition
> - 전체 학생의 수는 2명 이상 30명 이하입니다.
> - 체육복을 도난당한 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
> - 여벌의 체육복을 가져온 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
> - 여벌 체육복이 있는 학생만 다른 학생에게 체육복을 빌려줄 수 있습니다.
> - 여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있습니다. 이때 이 학생은 체육복을 하나만 도난당했다고 가정하며, 남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없습니다.이상 2,000,000,000 이하의 정수가 되는 올바른 입력만 s로 주어집니다.


## input output
> 입출력 예

n	| lost |	reserve |	return
---|----|----|---------
5	|[2, 4]	|[1, 3, 5]	|5
5	|[2, 4]	|[3]	|4
3	|[3]	|[1]	|2

> 입출력 예 설명 <br>

>예제 #1<br>
1번 학생이 2번 학생에게 체육복을 빌려주고, 3번 학생이나 5번 학생이 4번 학생에게 체육복을 빌려주면 학생 5명이 체육수업을 들을 수 있습니다.

>예제 #2<br>
3번 학생이 2번 학생이나 4번 학생에게 체육복을 빌려주면 학생 4명이 체육수업을 들을 수 있습니다.


## Solution 
### filter()
> 원하는 조건에 맞는 요소만 리스트로 다시 만들어 주는 함수<br>
> filter(함수, 리스트)

> 1. 자신이 예비를 가져왔지만, 도둑 맞은경우 제거
	- reserve에 해당하지 않는 lost만 _lost로 생성 
	- lost에 해당하지 않는 reserve만 _reserve 생성
> 2. _reserve를 순회하여 옷가져온 학생(r)의 앞 학생(r-1)이 _lost에 해당하는지 확인
	- 해당하면 _lost.remove(앞 학생(r-1)) 
> 3. _reserve를 순회하여 옷가져온 학생(r)의 뒤 학생(r+1)이 _lost에 해당하는지 확인 
	- 해당하면 _lost.remove(뒤 학생(r+1))
> 4. 총학생수(n) - 체육복을 못빌린 학생 (len(_lost) )

```
def solution(n, lost, reserve):
	# 자신이 예비를 가져왔지만, 도둑 맞은경우 제거
    _lost = list(filter(lambda x : x not in reserve, lost))
    _reserve = list(filter(lambda x : x not in lost, reserve))

    for r in _reserve :
        if r-1 in _lost :   # 앞 학생(r-1)이 _lost에 해당하는지
            _lost.remove(r-1)	# 빌려줌으로 _lost에서 제거
        elif r+1 in _lost : # 뒤 학생(r+1)이 _lost에 해당하는지
            _lost.remove(r+1)	# 빌려줌으로 _lost에서 제거
        
    return n - len(_lost)
    
```

## Others Solution 
```
def solution(n, lost, reserve):
    _reserve = [r for r in reserve if r not in lost]
    _lost = [l for l in lost if l not in reserve]
    for r in _reserve:
        f = r - 1
        b = r + 1
        if f in _lost:
            _lost.remove(f)
        elif b in _lost:
            _lost.remove(b)
    return n - len(_lost)
```

## TestCase
```
#solution(10, [8,10], [6,7,9])
#solution(5,	[2, 4],	[1, 3, 5])
#solution(5, [2,3,4] ,[1,2,3])
#solution(5,	[2, 4],	[3])
#solution(3,	[3],	[1])
```
