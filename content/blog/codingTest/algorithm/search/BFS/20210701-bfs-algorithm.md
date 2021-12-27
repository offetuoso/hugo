---
title: "너비 우선 탐색 알고리즘"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-01
slug: "bfs-algorithm"
description: "bfs 탐색 알고리즘."
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Search"]
tags: ["Algorithm"]
math: false
toc: true
---

# 너비 우선 탐색 알고리즘

## BFS (Breadth-First Search)
> BFS는 너비 우선 탐색이라고 부르며, 시작 위치에서 가까운 노드부터 우선적으로 탐색하는 알고리즘이다.

> BFS는 큐 자료구조를 이용하며, 구체적인 동작 과정은 아래와 같다.

> 1. 탐색 시작 노드를 큐에 삽입하고 방문 처리를 합니다.
> 2. 큐에서 노드를 꺼낸 뒤에 해당 노드의 인접 노드 중에서 방문하지 않은 노드를 모두 큐에 삽입하고 방문 처리.
> 3. 더 이상 2번의 과정을 수행할 수 없을 때까지 반복함.

> 1. 그래프를 준비하고, 시작 노드는 1로 BFS를 시작한다. (번호가 낮은 인접 노드부터 방문)

![contact](/images/algorithm/search/bfs/bfs-001.png)

> 2. 시작 노드인 '1'을 큐에 삽입하고 방문 처리를 한다.

![contact](/images/algorithm/search/bfs/bfs-002.png)

> 3. 큐에서 노드 '1'을 꺼내 방문하지 않은 인접 노드 '2', '3', '8'을 큐에 삽입하고 방문 처리한다.

![contact](/images/algorithm/search/bfs/bfs-003.png)

> 4. 큐에서 노드 '2'를 꺼내 방문하지 않은 인접 노드 '7'을 큐에 삽입하고 방문 처리한다.

![contact](/images/algorithm/search/bfs/bfs-004.png)

> 5. 큐에서 노드 '3'을 꺼내 방문하지 않은 인접 노드 '4', '5'를 큐에 삽입하고 방문 처리한다.

![contact](/images/algorithm/search/bfs/bfs-005.png)

> 6. 큐에서 노드 '8'을 꺼내고 방문하지 않은 인접 노드가 없으므로 무시한다.

![contact](/images/algorithm/search/bfs/bfs-006.png)

> 7. 큐에 남아있는 '4', '5', '6'을 꺼낸다.

![contact](/images/algorithm/search/bfs/bfs-007.png)

> 이러한 과정을 반복하여 전체 노드의 탐색 순서는 다음과 같다.

```
1 2 3 8 7 4 5 6 
```

### BFS 소스코드 예제 (Python)
> 아래 소스는 노드를 2차원 배열로 생성하여 [0]은 비워두고, <br>
> 인덱스 별로 배열로 인접 노드를 정의함.  <br>
> 예를들어, graph[1] = [2, 3, 8] 로 1번 노드에 인접한 2, 3 8로 구성된다.

```
from collections import deque

# BFS 함수 정의
def bfs(graph, start, visited):
    # 큐(Queue) 구현을 위해 deque 라이브러리 사용
    queue = deque()
    # 시작 노드(1)를 큐에 넣고, 방문 처리
    queue.append(start)
    visited[start] = True
    
    # 큐가 빌 때까지 반복
    while queue :
        # 큐에서 하나의 원소를 뽑아 출력
        v = queue.popleft()
        print(v, end=' ') # print()의 기본 옵션중 end=' '를 통해 개행하지 않고 옆으로 출력을 붙인다.
        
        # 해당 원소와 연결된, 아직 방문하지 않은 원소들을 큐에 삽입
        for i in graph[v]:
            if not visited[i] :
                queue.append(i)
                visited[i] = True
        
    pass


# 각 노드가 연결된 정보를 리스트 자료형으로 표현(2차원 리스트)
graph = [
  [],
  [2, 3, 8],
  [1, 7],
  [1, 4, 5],
  [3, 5],
  [3, 4],
  [7],
  [2, 6, 8],
  [1, 7]
]

# 각 노드가 방문된 정보를 리스트 자료형으로 표현(1차원 리스트)
visited = [False] * 9

# 정의된 BFS 함수 호출
bfs(graph, 1, visited)
```

#### 참고 

> - <a href="https://infinitt.tistory.com/11">파이썬(Python) 기초 print ( )문의 옵션 (sep , end , format , Escape )</a>

{{< youtube CJiF-muKz30 >}}
> - <a href="http://www.yes24.com/Product/Goods/91433923"> ![contact](http://image.yes24.com/goods/91433923/800x0)</a>



