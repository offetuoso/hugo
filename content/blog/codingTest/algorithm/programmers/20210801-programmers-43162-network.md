---
title: "Programmers 43162 네트워크"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-01
slug: "programmers-43162-network"
description: "43162 네트워크"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 43162 네트워크

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/43162">Programmers 43162 링크</a>

>네트워크란 컴퓨터 상호 간에 정보를 교환할 수 있도록 연결된 형태를 의미합니다. 예를 들어, <br>
컴퓨터 A와 컴퓨터 B가 직접적으로 연결되어있고, 컴퓨터 B와 컴퓨터 C가 직접적으로 연결되어 있을 때 <br>
컴퓨터 A와 컴퓨터 C도 간접적으로 연결되어 정보를 교환할 수 있습니다. <br>
따라서 컴퓨터 A, B, C는 모두 같은 네트워크 상에 있다고 할 수 있습니다.

>컴퓨터의 개수 n, 연결에 대한 정보가 담긴 2차원 배열 computers가 매개변수로 주어질 때, <br>
네트워크의 개수를 return 하도록 solution 함수를 작성하시오.



## Condition
>- 컴퓨터의 개수 n은 1 이상 200 이하인 자연수입니다.
>- 각 컴퓨터는 0부터 n-1인 정수로 표현합니다.
>- i번 컴퓨터와 j번 컴퓨터가 연결되어 있으면 computers[i][j]를 1로 표현합니다.
>- computer[i][i]는 항상 1입니다.

###입력 형식
>입출력 예

n	|	computers	|	return
---|----|---
3	|	[[1, 1, 0], [1, 1, 0], [0, 0, 1]]	|	2
3	|	[[1, 1, 0], [1, 1, 1], [0, 1, 1]]	|	1

>입출력 예 설명 <br>
예제 #1<br>
아래와 같이 2개의 네트워크가 있습니다.<br>

## Solution 
#DFS
```
from collections import deque

def dfs(i, visited, computers):
    visited[i] = True
    for c in range(0,len(computers[i])) :
        if c != i and visited[c] == False and computers[i][c] == 1:
            dfs(c, visited, computers)


    return  0

def solution(n, computers):
    count = 0
    visited = [False for i in range(0,n)]

    for i in range(0,n) :
        if not visited[i] : 
            dfs(i, visited, computers)
            count += 1
    
    return count
```



## Others Solution 
```
def solution(n, computers):    
    def BFS(node, visit):
        que = [node]
        visit[node] = 1
        while que:
            v = que.pop(0)
            for i in range(n):
                if computers[v][i] == 1 and visit[i] == 0:
                    visit[i] = 1
                    que.append(i)
        return visit
    visit = [0 for i in range(n)]
    answer = 0
    for i in range(n):
        try:
            visit = BFS(visit.index(0), visit)
            answer += 1
        except:
            break
    return answer
```

## TestCase
```
solution(3, [[1, 1, 0], [1, 1, 0], [0, 0, 1]]	)

```
