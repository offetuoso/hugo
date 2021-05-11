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



#### stack.py

```
class stack :
    def __init__(self) :
        self.items = []

    def push(self, x) :
        self.items.append(x)

    def pop(self) :
        if self.isEmpty() :
            print("stack underflow!")
        else :        
            print("pop()", self.items[self.top()])
            del self.items[self.top()]
        
    def top(self) :
        return len(self.items)-1

    def isEmpty(self) :
        if (self.top() == -1) :
            return True
        else :
            return False

    def clear(self) : 
         self.items = []

    def size(self) :
        return(len(self.items))

    def peek(self) :   
        return(self.items[self.top()])

    def contains(self, x) :
        if(x in self.items) :
            return True 
        else :
            return False

    
    def search(self, x) :
        for i in range(1,self.size()+1) :
            if x == self.items[self.size()-i] :
                return i 

       



stack1 = stack() 

print(stack1.items)

stack1.push(1)
print(stack1.items)


stack1.push(2)
print(stack1.items)


stack1.push(3)
print(stack1.items)

stack1.push(4)
print(stack1.items)

stack1.push(5)

print(stack1.items)


print("size() ", stack1.size())

print("contains(1) ", stack1.contains(1))
print("test1.search(1) ", stack1.search(1))
print("test1.search(2) ", stack1.search(2))

print("peek() ", stack1.peek())
stack1.pop()
stack1.pop()
stack1.pop()

stack1.clear();

```



### 큐
> 큐는 대기줄에 비유할 수 있는 공정한 자료구조, 단 새치기는 없다고 가정.
> 이러한 스택의 구조를 <mark>선입선출</mark>구조.

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



