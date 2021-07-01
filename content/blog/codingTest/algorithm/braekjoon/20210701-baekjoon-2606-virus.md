---
title: "BAEKJOON - 2606 바이러스"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-01
slug: "baekjoon-2606-virus"
description: "백준 셀프 넘버"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 2606 바이러스(virus)

## Task description

>신종 바이러스인 웜 바이러스는 네트워크를 통해 전파된다. 한 컴퓨터가 웜 바이러스에 걸리면 그 컴퓨터와 네트워크 상에서 연결되어 있는 모든 컴퓨터는 웜 바이러스에 걸리게 된다.

>예를 들어 7대의 컴퓨터가 <그림 1>과 같이 네트워크 상에서 연결되어 있다고 하자. <br>
1번 컴퓨터가 웜 바이러스에 걸리면 웜 바이러스는 2번과 5번 컴퓨터를 거쳐 <br>
3번과 6번 컴퓨터까지 전파되어 2, 3, 5, 6 네 대의 컴퓨터는 웜 바이러스에 걸리게 된다. <br>
하지만 4번과 7번 컴퓨터는 1번 컴퓨터와 네트워크상에서 연결되어 있지 않기 때문에 영향을 받지 않는다.

![contact](/images/algorithm/baekjoon/2606-virus/001.png)

> 어느 날 1번 컴퓨터가 웜 바이러스에 걸렸다. 컴퓨터의 수와 네트워크 상에서 서로 연결되어 있는 정보가 주어질 때, 1번 컴퓨터를 통해 웜 바이러스에 걸리게 되는 컴퓨터의 수를 출력하는 프로그램을 작성하시오.

> 입력<br>
첫째 줄에는 컴퓨터의 수가 주어진다. 컴퓨터의 수는 100 이하이고 각 컴퓨터에는 1번 부터 차례대로 번호가 매겨진다. <br>
둘째 줄에는 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수가 주어진다.  <br>
이어서 그 수만큼 한 줄에 한 쌍씩 네트워크 상에서 직접 연결되어 있는 컴퓨터의 번호 쌍이 주어진다.<br>

> 출력<br>
1번 컴퓨터가 웜 바이러스에 걸렸을 때, 1번 컴퓨터를 통해 웜 바이러스에 걸리게 되는 컴퓨터의 수를 첫째 줄에 출력한다.




## Condition
> - 1 번 컴퓨터가 탐색 시작 노드이다.
> - 1 <= N >= 100 (컴퓨터의 수)
> - M (네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수)
## input
```
7
6
1 2
2 3
1 5
5 2
5 6
4 7
```

## output

```
4
```

## Solution 
> 1. 1부터 10001까지 모든 숫자 조회
> 2. 숫자를 문자로 바꿔 저장
> 3. no는 자기자신의 값 i로 세팅
> 4. 숫자의 자리수 만큼 반복
> 5. 자리수의 숫자를 no에 더해줌
> 6. 생성된 d(n) 값을 self dict에 추가
> 7. 1 ~ 10001 까지의 숫자중 dict에 없는 숫자만 출력



```
from collections import deque

N = int(input()) # 컴퓨터의 갯수
M = int(input()) # 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수

# 그래프 생성
graph = [[] for i in range(N+1)] # 0부터 N까지의 배열 (0은 사용안함)
for i in range(0,M) : # 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수만큼 반복
    K =  list(map(int, input().split()))	# 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍
    graph[K[0]].append(K[1])	# 그래프에 연결 추가
    graph[K[1]].append(K[0])   # 반대의 경우도 연결 추가

# 방문을 체크할 배열 생성
visited = [False for i in range(N+1)] # 방문 안한것으로 0~N까지의 배열 생성 (0은 사용 안함)

queue = deque() # 큐 생성

count = 0 # 결과 (1번 컴퓨터로 인해 바이러스 감염된 컴퓨터의 수)
start = 1 # 탐색 시작 컴퓨터 1
queue.append(start)	# 큐에 추가
visited[start] = True	# 1번 컴퓨터 방문처리

while queue : # 큐의 데이터가 있는 동안
    idx = queue.popleft() # 검사할 컴퓨터의 번호를 팝
    #print(idx) # BFS 출력 하지만 문제

    if idx != start : # 탐색 시작 노드 1이 아닌것
        count += 1	# 1번 컴퓨터로 인해 감염된 컴퓨터 카운트
        
    for node in graph[idx]: # 검사할 컴퓨터의 인접노드(graph[idx])의 연결된 인접 컴퓨터(노드) 만큼
        if not visited[node] : # 방문한 컴퓨터가 아닌 경우
            queue.append(node)	# 큐에 추가
            visited[node] = True # 방문처리

print(count) # 결과 출력 (1번 컴퓨터로 인해 바이러스 감염된 컴퓨터의 수)


```

> 최초 함수로 코딩했으나, 백준에서는 함수를 사용하면 오답처리가 되었다.

```

from collections import deque

def bfs(graph, start ,visited) :
    count = 0
    queue = deque()
    queue.append(start)
    visited[start] = True

    while queue :
        idx = queue.popleft()
        #print('pop',idx)
        if idx != start :
            count += 1
        for node in graph[idx]:
            if not visited[node] :
                queue.append(node)
                visited[node] = True
    return count


N = int(input())
M = int(input())

graph = [[] for i in range(N+1)]

for i in range(0,M) :
    K =  list(map(int, input().split()))
    graph[K[0]].append(K[1])
    graph[K[1]].append(K[0])

visited = [False for i in range(N+1)]



#print (graph,'\n', visited)

bfs(graph,1,visited)

```


## TestCase
```
예제 입력  
7
6
1 2
2 3
1 5
5 2
5 6
4 7

예제 출력 
4

```
