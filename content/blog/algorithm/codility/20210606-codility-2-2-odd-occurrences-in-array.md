---
title: "Codility - Odd Occurrences In Array"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-06-06
slug: "codility-odd-occurrences-in-array"
description: "Odd Occurrences In Array"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# Odd Occurrences In Array

> Codility - Lesson2 - Array - <a href="https://app.codility.com/programmers/lessons/2-arrays/odd_occurrences_in_array/">Odd Occurrences In Array</a>


## Task description


> N개의 정수가 담긴 배열 A를 입력받습니다
> 배열에는 홀수 개의 요소가 포함됩니다.
> 배열의 각 요소는 짝을 이루지 않는 한 요소를 제외하고 동일한 값을 가진 다른 요소와 짝을 가지고 있습니다.
> 짝이 없는 요소를 찾으면 해결됩니다

> 예를 들어, 주어진 A 배열은 이렇습니다.
 
```
 A [0] = 9 A [1] = 3 A [2] = 9
 A [3] = 3 A [4] = 9 A [5] = 7
 A [6] = 9
```

> 
인덱스 0과 2에있는 요소의 값은 9입니다.
인덱스 1과 3에있는 요소의 값은 3이고,
인덱스 4와 6에있는 요소의 값은 9이고
인덱스 5의 요소는 값 7을 가지며 짝을 이루지 않습니다.





## Condition

> - N은 [1..1,000,000] 범위 내의 홀수 정수이고;
> - 배열 A의 각 요소는 [ 1 .. 1,000,000,000 ] 범위 내의 정수입니다 .
> - A의 값 중 하나를 제외하고 모두 짝수 번 발생합니다.
> - 다음 가정에 대한 효율적인 알고리즘을 작성하십시오 




## Solution 

### 1회차
> 1. A의 배열을 0부터 N까지 리스트를 조회하며
> 2. 현재값 curr = A[i]를 기억해 두고 첫번째 요소 pop(0)
> 3. 남은 A배열와 체크된 숫자 배열 B에 curr가 있는지 확인해서 없으면 짝이 없기 때문에 curr 값 리턴
> 4. 아니라면 B배열에 curr 추가 


```
def solution(A):
    # write your code in Python 3.6
    B = []
    for i in range (0, len(A)) :
        curr = A[0]
        A.pop(0)
        if curr not in A and  curr not in B :
           return curr
        B.append(curr)
    pass
```

> 시간 복잡성 O (N ** 2)으로 
n = 100,003, n = 999,999 시간 초과 

> for 안에서 in을 통해 다시 조회하는 것이 시간 복잡성을 늘린거 같다


### 2회차 
> 1. A배열을 A.sort()를 사용해 asc 정렬
> 2. 정렬을 하고 0 ~ len(A)까지의 반복문중 인덱스가 홀수면 값저장, 짝수면 홀수와 비교
> 3. 마지막 인덱스가 홀수고 마지막 까지 짝이 없는 값이 없다면 마지막 값이 짝이 없는 값이므로 반환

```
# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def solution(A):
    # write your code in Python 3.6
    A.sort()
    odd = 0
    for i in range (0, len(A)) :

       if i % 2 == 0 :
            if i+1 != len(A) :
                odd = A[i]
            else :
                return A[i] 
       else :
            if odd != A[i] : 
                return odd 
    pass
```

> 시간 복잡성 O(N) or O(N*log(N))
> 하나의 for에서 처리를 해서 timeout에 걸리지 않았다.

### 다른 사람 풀이
> 풀이 방식이 비슷하나 A.sort()와 sorted(A)의 차이가 있다.

#### sort와 sorted의 차이
> 따로 정리하며 포스팅 해야겠지만, 

##### list.sort()
> - list.sort()는 list 클래스의 메서드입니다.
> - 실행 시 기본적으로 오름차순으로 리스트 객체 자체를 정렬하며 반환하는 값은 None입니다.
> - 추가로 key와 reverse 파라미터를 조정하여 정렬기준을 변경할 수 있습니다.

```
	list.sort()
```

##### sorted(list)
> - sorted 메서드는 list, tuple, string, dict, set 등 iterable 객체를 파라미터로 받아 정렬된 iterable를 반환합니다.
> - sort 메서드처럼 key와 reverse파라미터를 조정해서 정렬 기준을 변경 할 수 있다.

```
	list1 = sorted(list)
```

##### sort vs sorted?
> 데이터가 많으면 많을 수록 sorted는 새로운 객체를 생성해야하는 내부 처리가 있어서 sort보다 시간이 더 걸린다.
> 도긴 개긴이지만 sort 메서드가 미세하게 더 빠르다. 

> 하지만 list가 아닌 iterable인 경우에서는 어쩔 수 없이 sorted를 사용해야 합니다.

```
def test3(A):
    if len(A) == 1:
        return A[0]

    A = sorted(A)
    print(A)
    for i in range(0, len(A), 2):
        if i+1 == len(A):
            return A[i]
        if A[i] != A[i+1]:
            return A[i]

```

### 다른 사람 풀이2
> 시간 복잡성 O(N) or O(N*log(N))
> <a href="https://wikidocs.net/64">lambda</a>와 reduce() 메서드를 공부해 봐야겠다.

```
다른사람 코드 2
def solution(A):
  return reduce(lambda x,y: x^y, A)
```

## TestCase
```
solution([9, 3, 9, 3, 9, 7, 9])
solution([9, 3, 9, 3, 9])
```