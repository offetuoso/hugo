---
title: "BAEKJOON - 4949 균형잡힌 세계"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-11
slug: "baekjoon-4949-a-balanced-world"
description: "백준 균형잡힌 세계"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 4949 균형잡힌 세계

## Task description

원문 : <a href="https://www.acmicpc.net/problem/4949">백준 4949 링크</a>

> 메시지를 입력받아 괄호를 열고 닫아야 한다.
> 열고 닫는 괄호가 균형 맞게 되어있으면 yes 아니면 no 출력
> - ex) asd(b)dd(d[ddd]) yes
> - ex) (asdasd] no
> 메시지의 끝은 .으로 끝나고 
> 메시지가 "." 이면 종료


## Condition
> - 모든 왼쪽 소괄호("(")는 오른쪽 소괄호(")")와만 짝을 이뤄야 한다.
> - 모든 왼쪽 대괄호("[")는 오른쪽 대괄호("]")와만 짝을 이뤄야 한다.
> - 모든 오른쪽 괄호들은 자신과 짝을 이룰 수 있는 왼쪽 괄호가 존재한다.
> - 모든 괄호들의 짝은 1:1 매칭만 가능하다. 즉, 괄호 하나가 둘 이상의 괄호와 짝지어지지 않는다.
> - 짝을 이루는 두 괄호가 있을 때, 그 사이에 있는 문자열도 균형이 잡혀야 한다.
> - 하나 또는 여러줄에 걸쳐서 문자열이 주어진다. 각 문자열은 영문 알파벳, 공백, 소괄호("( )") 대괄호("[ ]")등으로 이루어져 있으며, 길이는 100글자보다 작거나 같다.
> - 7번째의 " ."와 같이 괄호가 하나도 없는 경우도 균형잡힌 문자열로 간주할 수 있다.
> - 입력의 종료조건으로 맨 마지막에 점 하나(".")가 들어온다.

## input output

```
예제 입력 1 
So when I die (the [first] I will see in (heaven) is a score list).
[ first in ] ( first out ).
Half Moon tonight (At least it is better than no Moon at all].
A rope may form )( a trail in a maze.
Help( I[m being held prisoner in a fortune cookie factory)].
([ (([( [ ] ) ( ) (( ))] )) ]).
 .
.
예제 출력 1 
yes
yes
no
no
no
yes
yes
```

## Solution 
> 1. 메시지가 "." 이면 종료
> 2. 메시지가 '(' 또는 '[' 이면 스택에 추가

```

while True : 
	msg = input()
	if msg == '.' :	# "." 이면 종료
		break
	
	front = []	# 스택 생성
	flag = True 	# .이나오기 전에 조건에 만족(균형) X 면 False
	
	for i in range(0, len(msg)) :	
		if msg[i] == '.' : 
			if len(front) == 0 and flag: 	# 스택이 모두 pop되고, 조건에 만족(균형) 하면 yes
				print('yes')
			else : 
				print('no')
				
		elif msg[i] == '(' or msg[i] == '[' : # 메시지가 '(' 또는 '[' 이면 스택에 추가
			front.append(msg[i])
			
		elif (msg[i] == ')' or  msg[i] == ']') and len(front) == 0 : # 괄호를 안열고, 닫으려 할때 
			flag  = False
			
		elif msg[i] == ')' : 	# )가 나왔을때 
			if front[-1] == '(' :	# 스택 마지막이 ( 였다면 팝
				front.pop()
			else :
				flag  = False		# 스택 마지막이 [ 으로 조건에 만족(균형) no
				
		elif msg[i] == ']' :	# ]가 나왔을때 
			if front[-1] == '[' : 	# 스택 마지막이 [ 였다면 팝
				front.pop()
			else : 
				flag  = False		# 스택 마지막이 ( 으로 조건에 만족(균형) no
			
```


## TestCase
```
```
