---
title: "Programmers 81301 숫자 문자열과 영단어"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-07-17
slug: "programmers-81301-numeric-strings-and-english-words"
description: "Programmers 숫자 문자열과 영단어"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 81301 숫자 문자열과 영단어

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/81301">Programmers 81301 링크</a>

> 네오와 프로도가 숫자놀이를 하고 있습니다. 네오가 프로도에게 숫자를 건넬 때 일부 자릿수를 영단어로 바꾼 카드를 건네주면 프로도는 원래 숫자를 찾는 게임입니다.

> 다음은 숫자의 일부 자릿수를 영단어로 바꾸는 예시입니다.
```
1478 → "one4seveneight"
234567 → "23four5six7"
10203 → "1zerotwozero3"
```

>이렇게 숫자의 일부 자릿수가 영단어로 바뀌어졌거나, 혹은 바뀌지 않고 그대로인 문자열 s가 매개변수로 주어집니다. s가 의미하는 원래 숫자를 return 하도록 solution 함수를 완성해주세요.

> 참고로 각 숫자에 대응되는 영단어는 다음 표와 같습니다.

숫자|	영단어
---|----
0	| zero
1	| one
2	| two
3	| three
4	| four
5	| five
6	| six
7	| seven
8	| eight
9	| nine










## Condition
> - 1 ≤ s의 길이 ≤ 50
> - s가 "zero" 또는 "0"으로 시작하는 경우는 주어지지 않습니다.
> - return 값이 1 이상 2,000,000,000 이하의 정수가 되는 올바른 입력만 s로 주어집니다.


## input output

s	| result
-----|----------------
"one4seveneight"	| 1478
"23four5six7"	| 234567
"2three45sixseven"	| 234567
"123"	| 123


>입출력 예 #1<br>
문제 예시와 같습니다.

>입출력 예 #2<br>
문제 예시와 같습니다.

>입출력 예 #3<br>
"three"는 3, "six"는 6, "seven"은 7에 대응되기 때문에 정답은 입출력 예 #2와 같은 234567이 됩니다.<br>
입출력 예 #2와 #3과 같이 같은 정답을 가리키는 문자열이 여러 가지가 나올 수 있습니다.

>입출력 예 #4 <br>
s에는 영단어로 바뀐 부분이 없습니다.

## Solution 
### 배열과 반복문을 이용한 해결
> 1. 배열에 담는다. (배열인덱스가 0부터 시작이므로 zero 부터 nine 까지 인덱스와 숫자 영단어와 매핑이 된다.
> 2. 문자열 s를 numbers를 순회하며, 숫자 영단어(numbers[i])의 값을 숫자(str(i)) 값으로 리플레이스 
```
def solution(s):
    numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    for i in range(0, len(numbers)) :
        s = s.replace(numbers[i],str(i))
    return int(s)
```

### 배열과 reduce()를 이용한 해결
> reduce를 누적 집계 목적으로 사용하는게 일반적이지만, 반복 처리에도 사용가능하다는 것을 배웠다.

```
from functools import reduce
def solution(s):
    numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    return int(reduce(lambda value, idx : value.replace(numbers[idx], str(idx)), range(len(numbers)) ,s))
```

#### reduce()
> reduce(function, iterable(순회 가능한 데이터) [, initializer=None(초기값)]) 
> - 누적 집계를 위해서 사용한다.
> - 파라미터의 function에는2가지 인자가 존재한다. (value(누적대상), element(iterable의 현재 값))

> reduce()를 통해 풀수 있다는 것을 다른 사람의 코드로 확인후 풀어보면서, 이해가 안가는 것이 생겨 <br>
reduce() 함수를 찾아보게 되었다. 

> reduce(lambda value, idx : formula , [0,1,2...9], 'one4seveneight') 여기에서 value와 idx의 값 매핑이 생각했던 것과 달랐다. <br>
> reduce(lambda a, b : formula , x, y) a는 x, b는 y로 매핑될것 같았지만, a는 y가 b는 x가 매핑되었다. 
> 왜 이런 결과가 나오나 이해가 되지 않아 검색하던 도중 reduce의 코드를 보고 이해가 되었다.


#### reduce code <a href="https://docs.python.org/3.11/library/functools.html?highlight=reduce#functools.reduce">link</a>
```
def reduce(function, iterable, initializer=None):
    it = iter(iterable)
    
    if initializer is None:	# initializer가 입력이 되지않은 경우
        value = next(it) # 첫값을 뽑고 인덱스++	
    else:					# initializer가 입력이된 경우
        value = initializer 
        
    for element in it:
        value = function(value, element)
        
    return value
```

> reduce의 파라미터중 initializer가 입력이 되지않는 일반적인 경우  <br>
> function의 첫번째 파라미터는 <mark>최초 iterable의 첫번째 값이며</mark>, 이후 function의 결과값(누적된 값)이 들어간다.

> reduce의 파라미터중 initializer가 입력이 되어 있는 경우 <br>
> function의 첫번째 파라미터는 <mark>최초 initializer 값이며</mark>, 이후 function의 결과값(누적된 값)이 들어간다.

> 생각했던 lambda a,b: a+b (10,20) 같은 function(10,20)의 파라미터 세팅이 아닌, <br>
> reduce(lambda a,b: a+b, [0,1,2,...9],100)의  function(100,0) 파라미터 세팅이였다.


## Others Solution 
```
from functools import reduce
digit={'zero':'0','one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9'}
def solution(s):
    return int(reduce(lambda ans,d:ans.replace(d,digit[d]),digit.keys(),s))
```

## TestCase
```
a = ["one4seveneight", "23four5six7", "2three45sixseven", "123"]

for i in a :
    solution(i)

```
