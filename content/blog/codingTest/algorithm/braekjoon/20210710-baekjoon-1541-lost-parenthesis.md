---
title: "BAEKJOON - 1541 잃어버린 괄호 "
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-10
slug: "baekjoon-1541-lost-parenthesis"
description: "백준 잃어버린 괄호 "
keywords: ["Algorithm", "CodingTest"]
draft: true
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "BAEKJOON"]
math: false
toc: true
---

# BAEKJOON - 1541 잃어버린 괄호 

## Task description

원문 : <a href="https://www.acmicpc.net/problem/1541">백준 1541 링크</a>

> +와 -그리고 괄호를 가진 식에서 괄호를 모두 지웠다.
> 그리고 나서 <mark>괄호를 적절히 쳐서 이 식의 값을 최소</mark>로 만들려고 한다.
> 괄호를 적절히 쳐서 이 식의 값을 최소로 만드는 프로그램을 작성하시오.


## Condition
> - 첫째 줄에 식이 주어진다. 식은 ‘0’~‘9’, ‘+’, 그리고 ‘-’만으로 이루어져 있고, 가장 처음과 마지막 문자는 숫자이다. 그리고 연속해서 두 개 이상의 연산자가 나타나지 않고, 5자리보다 많이 연속되는 숫자는 없다. 수는 0으로 시작할 수 있다. 입력으로 주어지는 식의 길이는 50보다 작거나 같다.
> - 첫째 줄에 정답을 출력한다.

## input output

```
예제 입력 1 
55-50+40
예제 출력 1 
-35
```

## Solution 
> 1. +와 -그리고 숫자들을 배열에 넣는다.
> 2. 첫번째 - 이후 +는 괄호로 묶는다  (- (A + B) 랑 -A-B 와 같으므로 +여도 -로 계산한다.) 

```
message = input() 	# 입력받은 메시지
formula = [] 		# 공식 배열 (숫자,+,-)
value = ""		# 쪼개진 숫자 문자열로 조합

flag = False       # +를 -로 계산할지 여부 (첫 -가 나왔는지 여부)
result = 0		# 결과값


for i in range(0,len(message)) :					# +와 -그리고 숫자들을 배열에 넣는다.
	if message[i] == "+" or message[i] == "-" :	
		formula.append(int(value))				# +, -가 나오면 그전까지의 value를 숫자로 바꿔 formula 배열에 넣는다
		value=""
		formula.append(message[i])				# + or - 를 formula 배열에 추가
	elif i ==len(message)-1 :
		value += message[i]					# 마지막 인덱스인경우 value를 숫자로 바꿔 formula 배열에 넣는다
		formula.append(int(value))				
	else :									# 숫자는 value에 추가
		value += message[i]
	

for i in range(0,len(formula)) :

	if formula[i] == "+" or formula[i] == "-" :
		if(formula[i] == "-") :
			flag = True
	else :
		if flag == False :
			result += formula[i] 
		else :
			result -= formula[i] 

print(result)
```


## TestCase
```
```
