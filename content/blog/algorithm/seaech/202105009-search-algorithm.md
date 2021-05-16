---
title: "탐색 알고리즘"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-09
slug: "search-algorithm"
description: "탐색 알고리즘."
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm"]
math: false
toc: true
---

## 탐색 알고리즘 

### 탐색(search)
> 탐색이란 많은 양의 데이터 중에서 원하는 데이터를 찾는과정. 
> 그래프 또는 트리의 자료구조에서 데이터를 찾는 문제가 주로 나온다. 
> 대표적으로 DPS, BPS가 있으며, 원리를 제대로 이해해야 코딩테스트 문제를 풀 수 있다.
> 그런데 DPS와 BPS를 이해하기 위해서 기본 자료구조인 스택, 큐, 재귀 함수 등을 이해가 전제로 되어야한다.
 
### 자료구조
> 자료구조란 데이터를 표현하고 관리하고 처리하기 위한 구조
> 스택과 큐는 삽입(Push)과 출력(Pop)이라는 두 핵심적인 함수로 구성
> 실제 구현할땐 오버플로우와 언더플로우를 고민해야한다.

### 스택
> 스택의 구조는 <mark>선입후출</mark> 또는 <mark>후입선출</mark>구조.
> 스택은 박스 쌓기로 비유할 수 있다. 

![contact](/images/search_1.png)

### 스택의 요소


<div style="overflow-x: auto; width:900px;">

| 기능&nbsp;&nbsp;&nbsp;     | 명칭&nbsp;&nbsp;&nbsp;  | 설명&nbsp;&nbsp;&nbsp;                |
| ---------- | --------- | ----------------- | 
| push(x) |삽입 | 스택의 마지막에 엘리먼트를 추가(append)하며, 마지막에 삽입된 인덱스(top)가 증가한다.                       |
| pop() | 추출(삭제) | 스택의 마지막 엘리먼트를 반환하고 삭제(del)하며, 마지막에 삽입된 인덱스(top)가 감소한다.                |
| peak() | 스택의 마지막 엘리먼트 반환 | 스택의 마지막 엘리먼트를 반환한다, 마지막에 삽입된 인덱스(top)는 변화가 없다.            |
| top() | 스택의 top 반환 | 마지막에 삽입된 인덱스(top)를 반환한다. 엘리먼츠(리스트)의 사이즈 -1                            |
| isEmpty() | 스택이 비어있는지 체크 | 엘리먼츠(리스트)가 비어있으면 True/ 비어있지 않으면 False 반환                          |
| clear() | 스택 초기화 | 엘리먼츠(리스트)를 초기화, 마지막에 삽입된 인덱스(top)도 -1                                     |
| size() | 스택의 사이즈 반환 | 엘리먼츠(리스트) 사이즈 반환                                                           |
| contains() | 엘리먼츠(리스트) 초기화 | 엘리먼츠를 초기화, 마지막에 삽입된 인덱스(top)도 -1                               |
| search() | 엘리먼츠(리스트) 초기화 | 엘리먼츠를 초기화, 마지막에 삽입된 인덱스(top)도 -1                                 |

</div>


#### stack.py

```
class Stack :
    #초기화
    def __init__(self) :
        self.elements = [] #stack 엘리먼츠 생성

    #데이터 추가
    def push(self, x) :
        self.elements.append(x) #stack 엘리먼트 추가

    #최근에 추가된(Top) 데이터 삭제
    def pop(self) :
        if self.isEmpty() :
            return "stack underflow!"
        else :        
            del self.elements[self.top()]
            return self.elements[self.top()]

    #최근에 추가된(Top) 데이터 삭제
    def peek(self) :   
        return(self.elements[self.top()])

    #최근에 추가된 인덱스 반환    
    def top(self) :
        return self.size()-1 #인덱스 = (사이즈-1) 

    #stack의 값이 비었는지 확인, 비었으면 true, 아니면 false
    def isEmpty(self) :
        if (self.top() == -1) :
            return True
        else :
            return False

    #stack 초기화
    def clear(self) : 
         self.elements = [] #엘리먼츠 초기화

    #stack의 길이 반환
    def size(self) :
        return (len(self.elements))

    #stack의 값이 포함되어있는지 확인, 비었으면 true, 아니면 false
    def contains(self, x) :
        if(x in self.elements) : #x가 엘리먼츠에 포함되어있는지
            return True 
        else :
            return False
    
    #엘리먼트를 보관한 인덱스 반환(리스트 인덱스의 역방향, 1부터 시작)
    def search(self, x) :
        result = -1
        for i in range(1,self.size()+1) :
            if x == self.elements[(self.size()-i)] : 
                result = i

        return result
       

stack = Stack() 

print(stack.elements)

stack.push(1)
print(stack.elements)


stack.push(2)
print(stack.elements)


stack.push('banana')
print(stack.elements)

stack.push(4)
print(stack.elements)

stack.push(5)

print(stack.elements)


print("size() ", stack.size())

print("contains(1) ", stack.contains(1))
print("search(1) ", stack.search(1))
print("search(2) ", stack.search(2))

print("peek() ", stack.peek())
print("pop() ",stack.pop())
print("pop() ",stack.pop())
print("pop() ",stack.pop())


print("stack.clear() ")
stack.clear() 

print("size() ", stack.size())
print("top() ", stack.top())
print("pop() ",stack.pop())



```



### 큐
> 큐는 대기줄에 비유할 수 있는 공정한 자료구조, 단 새치기는 없다고 가정.
> 이러한 스택의 구조를 <mark>선입선출</mark>구조.




### 선형 큐

<div style="overflow-x: auto; width:900px;">

| 기능&nbsp;&nbsp;&nbsp;     | 명칭&nbsp;&nbsp;&nbsp;  | 설명&nbsp;&nbsp;&nbsp;                |
| ---------- | --------- | ----------------- | 
| enQueue(x) |삽입 | 큐의 마지막에 엘리먼트를 추가하며, 마지막에 삽입된 인덱스(rear)가 증가한다.                       |
| deQueue() | 추출(삭제) | 큐의 첫번째 엘리먼트를 반환하고 삭제(빈값으로 세팅 None)하며 , 마지막에 삽입된 인덱스(front-1)가 감소한다. 
큐가 마지막의 인덱스에 도달했다면 초기화 (or 삭제 시 한칸씩 땡긴다.)               |
| peak() | 큐의 첫번째 엘리먼트 반환 | 큐의 첫번째 엘리먼트를 반환한다, front 변화 없음            |
| isEmpty() | 큐가 비어있는지 체크 | 프론트와 리어가 같으면 True/ 프론트와 리어가 같지 않으면 False 반환                          |
| size() | 큐의 사이즈 반환 | 사용된 엘리먼츠 리스트의 숫자 반환 (rear - front)                                                          |

</div>



#### linearQueue.py
```
MAX = 5
class LinearQueue :
    #초기화 
    def __init__(self, max = MAX) :

        self.maxSize = max
        self.elements = [None] * self.maxSize #비어있는 배열은 None으로 초기화
        self.front = -1 #queue의 앞쪽 인덱스, 삭제 시 증가  
        self.rear = -1 #queue의 뒤쪽 인덱스 , 삽입 시 증가

    #queue의 값이 비었는지 확인, 비었으면 true, 아니면 false
    def isEmpty(self) :
        if self.front == self.rear : #front와 rear가 같으면 비어있음
            result = True
        else : 
            result = False 
        return result

    #queue의 제일 뒷부분에 데이터 추가 
    def enQueue(self, x) :
        if(self.rear+1 == self.maxSize) : #rear+1이 maxSize면 오버플로우
            print("queue Overflow!")

        else :
            self.rear += 1 
            self.elements[self.rear] = x #rear+1에 새로운 데이터 추가
    
    #queue의 제일 앞의 데이터 삭제 및 반환
    def deQueue(self) :
        
        if self.isEmpty() : #queue가 비어있는지 확인
            return("queue is Empty!")

        else :
            
            
            self.front += 1
            result = self.elements[self.front]
            self.elements[self.front] = 'None' #front+1의 데이터 None으로 삭제
            return result

           #queue가 비어있으면서 front가 마지막 인덱스(maxSize-1) 까지 도달
            if(self.isEmpty() and self.front == self.maxSize-1) :
                  self.front = -1 #front를 초기화
                  self.rear = -1 #rear를 초기화

            """
            # 삭제 후 한 칸씩 옮기는 로직

            for i in range(0,self.maxSize) :
                if(i+1 != self.maxSize) :
                    self.elements[i] = self.elements[i+1]
                else : 
                    self.elements[i] = None

            self.front -= 1
            self.rear -= 1
            
            """

    #queue의 제일 앞의 데이터 반환
    def peek(self) :
        return self.elements[self.front+1]
    
    #queue의 사이즈 반환
    def size(self) :
     return self.rear - self.front 


queue = LinearQueue(5);

print(queue.elements)

queue.enQueue(1)
print(queue.elements)


queue.enQueue(2)
print(queue.elements)


queue.enQueue('banana')
print(queue.elements)

queue.enQueue(4)
print(queue.elements)

queue.enQueue(5)

print(queue.elements)


print("size() ", queue.size())


print("peek() ", queue.peek())
print("deQueue() ",queue.deQueue())
print("deQueue() ",queue.deQueue())
print("deQueue() ",queue.deQueue())


print("size() ", queue.size())
print("deQueue() ",queue.deQueue())

```

![contact](/images/search_2.png)

### 재귀 함수
> 자기 자신을 다시 호출하는 함수.
> 재귀 함수의 종료조건을 반드시 명시해야 한다. 
> 컴퓨터 내부적인 스택 자료구조를 이용한다. 
> 마지막 함수까지 끝나고 나서야 다시 역순으로 돌아가 종료된다.

 
![contact](/images/search_3.png)



### 유클리드 호제법

이 자료는 나동빈님의 이코테 서적과 유튜브 영상을 보고 정리한 자료입니다.

![contact](http://image.yes24.com/goods/91433923/800x0)
<a href="http://www.yes24.com/Product/Goods/91433923">참고 : http://www.yes24.com/Product/Goods/91433923</a>

{{< youtube 7C9RgOcvkvo >}}



