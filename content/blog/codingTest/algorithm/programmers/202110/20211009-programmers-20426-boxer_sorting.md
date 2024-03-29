---
title: "Programmers 20426 복서 정렬하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-10-09
slug: "programmers-20426-boxer-sorting"
description: "20426 복서 정렬하기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 20426 복서 정렬하기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/20426">Programmers 20426 링크</a>

### 문제 설명
> 복서 선수들의 몸무게 weights와, 복서 선수들의 전적을 나타내는 head2head가 매개변수로 주어집니다. 복서 선수들의 번호를 다음과 같은 순서로 정렬한 후 return 하도록 solution 함수를 완성해주세요.

> 1. 전체 승률이 높은 복서의 번호가 앞쪽으로 갑니다. 아직 다른 복서랑 붙어본 적이 없는 복서의 승률은 0%로 취급합니다.
> 2. 승률이 동일한 복서의 번호들 중에서는 자신보다 몸무게가 무거운 복서를 이긴 횟수가 많은 복서의 번호가 앞쪽으로 갑니다.
> 3. 자신보다 무거운 복서를 이긴 횟수까지 동일한 복서의 번호들 중에서는 자기 몸무게가 무거운 복서의 번호가 앞쪽으로 갑니다.
> 4. 자기 몸무게까지 동일한 복서의 번호들 중에서는 작은 번호가 앞쪽으로 갑니다.





## Condition
>- weights의 길이는 2 이상 1,000 이하입니다.
>- weights의 모든 값은 45 이상 150 이하의 정수입니다.
>- weights[i] 는 i+1번 복서의 몸무게(kg)를 의미합니다.
>- head2head의 길이는 weights의 길이와 같습니다.
>- head2head의 모든 문자열은 길이가 weights의 길이와 동일하며, 'N', 'W', 'L'로 이루어진 문자열입니다.
>- head2head[i] 는 i+1번 복서의 전적을 의미하며, head2head[i][j]는 i+1번 복서와 j+1번 복서의 매치 결과를 의미합니다.
>- 'N' (None)은 두 복서가 아직 붙어본 적이 없음을 의미합니다.
>- 'W' (Win)는 i+1번 복서가 j+1번 복서를 이겼음을 의미합니다.
>- 'L' (Lose)는 i+1번 복사가 j+1번 복서에게 졌음을 의미합니다.
>- 임의의 i에 대해서 head2head[i][i] 는 항상 'N'입니다. 자기 자신과 싸울 수는 없기 때문입니다.
>- 임의의 i, j에 대해서 head2head[i][j] = 'W' 이면, head2head[j][i] = 'L'입니다.
>- 임의의 i, j에 대해서 head2head[i][j] = 'L' 이면, head2head[j][i] = 'W'입니다.
>- 임의의 i, j에 대해서 head2head[i][j] = 'N' 이면, head2head[j][i] = 'N'입니다.

###입력 형식
>입출력 예

n	|	result	
---|----
6	|	8
16	|	4
626331 |  -1

weights	| head2head	| result
---|----|--------
[50,82,75,120]	|["NLWL","WNLL","LWNW","WWLN"]	|[3,4,1,2]
[145,92,86]	|["NLW","WNL","LWN"]|	[2,3,1]
[60,70,60]	|["NNN","NNN","NNN"]	|[2,1,3]


입출력 예 #1

다음은 선수들의 정보를 나타낸 표입니다.

선수 | 번호|	vs 1번|	vs 2번|	vs 3번	|vs 4번	|승률|	자기보다 무거운 복서를 이긴 횟수	|몸무게
--|--|--|---|---|---|---|---|---
1 | 1번	|	-	|	패배	|	승리	|	패배	|	33.33%	|	1회	|50kg
2 |	2번	|	승	|	-	|	패배	|	패배	|	33.33%	|	0회	|82kg
3 |	3번	|	패	|	승리	|	-	|	승리	|	66.66%	|	2회	|75kg
4 |	4번	|	승	|	승리	|	패배	|	-	|	66.66%	|	0회	|120kg


## Solution 

```
def solution(weights, head2head):
    answer = []
    player = []

    for i in range(len(weights)):
        win_cnt = 0
        total_cnt = 0
        win_heavier_cnt = 0
        for j in range(len(head2head[i])):
            if head2head[i][j] != "N": total_cnt += 1
            if head2head[i][j] == "W":
                win_cnt += 1
                if weights[i] < weights[j]:
                    win_heavier_cnt += 1

        data = []
        try:
            rate = (win_cnt / total_cnt) * 1000000
        except:
            rate = 0
        data.append(rate)  # 승률
        data.append(win_heavier_cnt)  # 무거운 사람에게 승수
        data.append(weights[i])  # 무게
        data.append(i + 1)  # 번호
        player.append(data)

    for i in sorted(player, key=lambda x: (-x[0], -x[1], -x[2], x[3])):
        answer.append(i[3])

    return answer

```



## Others Solution 
```
def solution(weights, head2head):
    result = []
    l = len(weights)
    # 한 번에 정렬해서 풀어봅시다!
    ans = [[0 for _ in range(4)] for _ in range(l)] # 승률, 무거운복서 이긴횟수, 자기 몸무게, 번호(음수로)
    for i in range(l):
        ans[i][2] = weights[i]
        ans[i][3] = -(i+1)
        cnt = 0 # 판수
        for j in range(l):
            if head2head[i][j] == 'W':
                ans[i][0] += 1 # 일단 이김
                cnt += 1
                if weights[i] < weights[j]:
                    ans[i][1] += 1 # 무거운 복서 이김
            elif head2head[i][j] == 'L':
                cnt += 1 # 판수만 늘려준다
        if cnt == 0:
            ans[i][0] = 0
        else:
            ans[i][0] /= cnt
    ans.sort(reverse=True) # 역순으로 정렬하면 모든 조건이 한 번에 정렬된다

    for i in range(l):
        result.append(-ans[i][3])
    return result
```

## TestCase
```
print(solution([50, 82, 75, 120], ["NLWL", "WNLL", "LWNW", "WWLN"]), [3, 4, 1, 2])
print(solution([145, 92, 86], ["NLW", "WNL", "LWN"]), [2, 3, 1])
print(solution([60, 70, 60], ["NNN", "NNN", "NNN"]), [2, 1, 3])


```
