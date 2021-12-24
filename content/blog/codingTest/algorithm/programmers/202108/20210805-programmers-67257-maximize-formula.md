---
title: "Programmers 67257 수식 최대화"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-05
slug: "programmers-67257-maximize-formula"
description: "67257 수식 최대화"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 67257 수식 최대화

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/67257">Programmers 67257 링크</a>

>IT 벤처 회사를 운영하고 있는 라이언은 매년 사내 해커톤 대회를 개최하여 우승자에게 상금을 지급하고 있습니다.<br>
이번 대회에서는 우승자에게 지급되는 상금을 이전 대회와는 다르게 다음과 같은 방식으로 결정하려고 합니다.<br>
해커톤 대회에 참가하는 모든 참가자들에게는 숫자들과 3가지의 연산문자(+, -, *) 만으로 이루어진 연산 수식이 전달되며,<br>
 참가자의 미션은 전달받은 수식에 포함된 연산자의 우선순위를 자유롭게 재정의하여 만들 수 있는 가장 큰 숫자를 제출하는 것입니다.<br>
단, 연산자의 우선순위를 새로 정의할 때, 같은 순위의 연산자는 없어야 합니다. 즉, + > - > * 또는 - > * > + 등과 같이<br>
 연산자 우선순위를 정의할 수 있으나 +,* > - 또는 * > +,-처럼 2개 이상의 연산자가
 동일한 순위를 가지도록 연산자 우선순위를 정의할 수는 없습니다. <br>
 수식에 포함된 연산자가 2개라면 정의할 수 있는 연산자 우선순위 조합은 2! = 2가지이며, 연산자가 3개라면 3! = 6가지 조합이 가능합니다.<br>
만약 계산된 결과가 음수라면 해당 숫자의 절댓값으로 변환하여 제출하며 제출한 숫자가 가장 큰 참가자를 우승자로 선정하며, 우승자가 제출한 숫자를 우승상금으로 지급하게 됩니다.

>예를 들어, 참가자 중 네오가 아래와 같은 수식을 전달받았다고 가정합니다.

>"100-200*300-500+20"

>일반적으로 수학 및 전산학에서 약속된 연산자 우선순위에 따르면 더하기와 빼기는 서로 동등하며 곱하기는 더하기, 빼기에 비해 우선순위가 높아 * > +,- 로 우선순위가 정의되어 있습니다.<br>
>대회 규칙에 따라 + > - > * 또는 - > * > + 등과 같이 연산자 우선순위를 정의할 수 있으나 +,* > - 또는 * > +,- 처럼 2개 이상의 연산자가 동일한 순위를 가지도록 연산자 우선순위를 정의할 수는 없습니다.<br>
>수식에 연산자가 3개 주어졌으므로 가능한 연산자 우선순위 조합은 3! = 6가지이며, 그 중 + > - > * 로 연산자 우선순위를 정한다면 결괏값은 22,000원이 됩니다.<br>
>반면에 * > + > - 로 연산자 우선순위를 정한다면 수식의 결괏값은 -60,420 이지만, 규칙에 따라 우승 시 상금은 절댓값인 60,420원이 됩니다.

>참가자에게 주어진 연산 수식이 담긴 문자열 expression이 매개변수로 주어질 때, 우승 시 받을 수 있는 가장 큰 상금 금액을 return 하도록 solution 함수를 완성해주세요.




## Condition
>- expression은 길이가 3 이상 100 이하인 문자열입니다.
>- expression은 공백문자, 괄호문자 없이 오로지 숫자와 3가지의 연산자(+, -, *) 만으로 이루어진 올바른 중위표기법(연산의 두 대상 사이에 연산기호를 사용하는 방식)으로 표현된 연산식입니다. 잘못된 연산식은 입력으로 주어지지 않습니다.<br>
즉, "402+-561*"처럼 잘못된 수식은 올바른 중위표기법이 아니므로 주어지지 않습니다.<br>
expression의 피연산자(operand)는 0 이상 999 이하의 숫자입니다.<br>
즉, "100-2145*458+12"처럼 999를 초과하는 피연산자가 포함된 수식은 입력으로 주어지지 않습니다.<br>
"-56+100"처럼 피연산자가 음수인 수식도 입력으로 주어지지 않습니다.<br>
expression은 적어도 1개 이상의 연산자를 포함하고 있습니다.<br>
연산자 우선순위를 어떻게 적용하더라도, expression의 중간 계산값과 최종 결괏값은 절댓값이 263 - 1 이하가 되도록 입력이 주어집니다.<br>
같은 연산자끼리는 앞에 있는 것의 우선순위가 더 높습니다.

###입력 형식


expression	| result
----------------|-----------
"100-200*300-500+20" |	60420
"50*6-3*2"| 300

>입출력 예에 대한 설명<br>
입출력 예 #1

> \* > \+ > \- 로 연산자 우선순위를 정했을 때, 가장 큰 절댓값을 얻을 수 있습니다.<br>
연산 순서는 아래와 같습니다.

```
100-200*300-500+20
= 100-(200*300)-500+20
= 100-60000-(500+20)
= (100-60000)-520
= (-59900-520)
= -60420
```

>따라서, 우승 시 받을 수 있는 상금은 |-60420| = 60420 입니다.

>입출력 예 #2 <br>
> \- > \* 로 연산자 우선순위를 정했을 때, 가장 큰 절댓값을 얻을 수 있습니다.<br>
연산 순서는 아래와 같습니다.(expression에서 + 연산자는 나타나지 않았으므로, 고려할 필요가 없습니다.)

```
50*6-3*2
= 50*(6-3)*2
= (50*3)*2
= 150*2
= 300
```

>따라서, 우승 시 받을 수 있는 상금은 300 입니다.

## Solution 
> 1. 숫자와 부호를 배열에 담는다.
> 2. 숫자와 부호를 부호 우선순위를 완전탐색하여 가장 높은 값을 찾는다.

```
   def solution(expression):
    answer = 0
    signs = [
          ['*','+','-']
        , ['*','-','+']
        , ['+','*','-']
        , ['+','-','*']
        , ['-','*','+']
        , ['-','+','*']
    ]
    exp = []
    
    tmp = ''
    for e in expression :
        if e == '' or e not in ['*','+','-'] :
            tmp += e
        else : 
            exp.append(int(tmp))
            exp.append(e)
            tmp =''
    exp.append(int(tmp))
    
    maximum = 0
    for sign in signs :
        _exp = exp
        _stack = []
        tmp = ''
        for s in sign:
            for i in range(0,len(_exp)) :
               
                if _exp[i-1] in ['*','+','-']  and s == _exp[i-1] :
                    prv = _stack.pop()
                    pprv = _stack.pop()

                 
                    if prv == '*' :
                        _stack.append(pprv * _exp[i])
                    elif prv == '+' :
                        _stack.append(pprv + _exp[i])
                    else :
                        _stack.append(pprv - _exp[i])

                else : 
                    _stack.append(_exp[i])
                
            if len(_stack) == 1 :
                maximum = max(abs(_stack[0]),maximum)
            
            _exp = _stack
            _stack = []


    return maximum
```

> 새로 배운 기능 

기능 | 설명 | 예
----|-----|-----
 permutations()  |순열을 조합해 주는 함수 | ['A', 'B', 'C'] -> 'ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'
 eval()  | 문자열을 수식으로 계산해주는 함수 | eval('100'+'+'+'200') ->300
 re.split(r'(\D)',expression) | 숫자와 문자를 분리 시켜켜 배열로 만들어주는 정규식 | '10+20' -> '10','+'+'20'

```

import re
import itertools

def solution(expression):
    sign = ['*','+','-']
    signs = list(map(''.join, itertools.permutations(sign))) #sighs : ['*+-', '*-+', '+*-', '+-*', '-*+', '-+*']
    exp = re.split(r'(\D)',expression)
    
    maximum = 0
    for sign in signs :
        _exp = exp[:]
        _stack = []
        
        for s in sign:
            for i in range(0,len(_exp)) :
                
                if _exp[i-1] in ['*','+','-']  and s == _exp[i-1] :
                    ex = str(_stack.pop())
                    prev = str(_stack.pop())
                    curr = str(_exp[i])

                    _stack.append(eval(prev+ex+curr))
                                        
                else : 
                    _stack.append(_exp[i])
                
            if len(_stack) == 1 :
                maximum = max(abs(_stack[0]),maximum)
            
            _exp = _stack
            _stack = []

    return maximum
```

## Others Solution 
```
import re
from itertools import permutations

def solution(expression):
    #1
    op = [x for x in ['*','+','-'] if x in expression]
    op = [list(y) for y in permutations(op)]
    ex = re.split(r'(\D)',expression)

    #2
    a = []
    for x in op:
        _ex = ex[:]
        for y in x:
            while y in _ex:
                tmp = _ex.index(y)
                _ex[tmp-1] = str(eval(_ex[tmp-1]+_ex[tmp]+_ex[tmp+1]))
                _ex = _ex[:tmp]+_ex[tmp+2:]
        a.append(_ex[-1])

    #3
    return max(abs(int(x)) for x in a)
```

```
def solution(expression):
    operations = [('+', '-', '*'),('+', '*', '-'),('-', '+', '*'),('-', '*', '+'),('*', '+', '-'),('*', '-', '+')]
    answer = []
    for op in operations:
        a = op[0]
        b = op[1]
        temp_list = []
        for e in expression.split(a):
            temp = [f"({i})" for i in e.split(b)]
            temp_list.append(f'({b.join(temp)})')
        answer.append(abs(eval(a.join(temp_list))))
    return max(answer)
```

## TestCase
```
print(solution('100-200*300-500+20'), 60420)
```
