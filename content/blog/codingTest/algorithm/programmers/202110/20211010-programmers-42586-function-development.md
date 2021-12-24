---
title: "Programmers 42586 기능개발"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-10-10
slug: "programmers-42586-function-development"
description: "42586 기능개발"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 42586 기능개발

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/42586">Programmers 42586 링크</a>

### 문제 설명
> 프로그래머스 팀에서는 기능 개선 작업을 수행 중입니다. 각 기능은 진도가 100%일 때 서비스에 반영할 수 있습니다.
또, 각 기능의 개발속도는 모두 다르기 때문에 뒤에 있는 기능이 앞에 있는 기능보다 먼저 개발될 수 있고, 이때 뒤에 있는 기능은 앞에 있는 기능이 배포될 때 함께 배포됩니다.

> 먼저 배포되어야 하는 순서대로 작업의 진도가 적힌 정수 배열 progresses와 각 작업의 개발 속도가 적힌 정수 배열 speeds가 주어질 때 각 배포마다 몇 개의 기능이 배포되는지를 return 하도록 solution 함수를 완성하세요.



입출력 예 #2
모든 기능이 하루에 1%씩 작업이 가능하므로, 작업이 끝나기까지 남은 일수는 각각 5일, 10일, 1일, 1일, 20일, 1일입니다. 어떤 기능이 먼저 완성되었더라도 앞에 있는 모든 기능이 완성되지 않으면 배포가 불가능합니다.

따라서 5일째에 1개의 기능, 10일째에 3개의 기능, 20일째에 2개의 기능이 배포됩니다.

※ 공지 - 2020년 7월 14일 테스트케이스가 추가되었습니다.


## Condition
>- 작업의 개수(progresses, speeds배열의 길이)는 100개 이하입니다.
>- 작업 진도는 100 미만의 자연수입니다.
>- 작업 속도는 100 이하의 자연수입니다.
>- 배포는 하루에 한 번만 할 수 있으며, 하루의 끝에 이루어진다고 가정합니다. 예를 들어 진도율이 95%인 작업의 개발 속도가 하루에 4%라면 배포는 2일 뒤에 이루어집니다.



### 입력 형식
> 입출력 예

progresses	|speeds|	return
-------|-----|---
[93, 30, 55]|	[1, 30, 5]|	[2, 1]
[95, 90, 99, 99, 80, 99]|	[1, 1, 1, 1, 1, 1]|	[1, 3, 2]

#### 입출력 예 설명

>입출력 예 #1
첫 번째 기능은 93% 완료되어 있고 하루에 1%씩 작업이 가능하므로 7일간 작업 후 배포가 가능합니다.<br>
두 번째 기능은 30%가 완료되어 있고 하루에 30%씩 작업이 가능하므로 3일간 작업 후 배포가 가능합니다. 하지만 이전 첫 번째 기능이 아직 완성된 상태가 아니기 때문에 첫 번째 기능이 배포되는 7일째 배포됩니다. <br>
세 번째 기능은 55%가 완료되어 있고 하루에 5%씩 작업이 가능하므로 9일간 작업 후 배포가 가능합니다.<br>
따라서 7일째에 2개의 기능, 9일째에 1개의 기능이 배포됩니다.<br>


## Solution 

```
from collections import deque
import copy


def solution(progresses, speeds):

    required_time = []

    for i in range(len(progresses)):
        print(progresses[i], speeds[i])
        required = (100 - progresses[i]) // speeds[i]
        if (100 - progresses[i]) % speeds[i] != 0:
            required += 1
        required_time.append(required)

    que = deque(required_time)
    answer = []

    while que:
        stack = []
        tmp = copy.deepcopy(que)
        first_job = que[0]

        for i in range(len(tmp)):
            if i == 0 or first_job >= tmp[i]:
                stack.append(tmp[i])
                que.popleft()
            else:
                break

        answer.append(len(stack))

    return answer


```



## Others Solution 

### 1
```
from math import ceil

def solution(progresses, speeds):
    daysLeft = list(map(lambda x: (ceil((100 - progresses[x]) / speeds[x])), range(len(progresses))))
    count = 1
    retList = []

    for i in range(len(daysLeft)):
        try:
            if daysLeft[i] < daysLeft[i + 1]:
                retList.append(count)
                count = 1
            else:
                daysLeft[i + 1] = daysLeft[i]
                count += 1
        except IndexError:
            retList.append(count)

    return retList
```

### 2
```
def solution(progresses, speeds):
    Q=[]
    for p, s in zip(progresses, speeds):
        if len(Q)==0 or Q[-1][0]<-((p-100)//s):
            Q.append([-((p-100)//s),1])
        else:
            Q[-1][1]+=1
    return [q[1] for q in Q]
```

## TestCase
```
print(solution([93, 30, 55], [1, 30, 5]), [2, 1])
print(solution([95, 90, 99, 99, 80, 99], [1, 1, 1, 1, 1, 1]), [1, 3, 2])

```
