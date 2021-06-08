---
title: "파이썬 기본개념"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-03-15
slug: "basic-java"
description: "파이썬 기본 개념정리."
keywords: ["python", "basic", "tutorial"]
draft: true
categories: ["Python"]
tags: ["python"]
math: false
toc: true
---


## 숫자처리 함수 

### Abs() 절대값 
```
print(abs(-7)) # 7
```

### Pow() 제곱 
```
print(pow(4,2)) # 4^2 = 4*4 = 16
```

### Max() 최대값
```
print(max(5,11)) # 11
```

### Min() 최소값
```
print(min(5,11)) # 5
```

### Round() 반올림
```
print(round(3.14)) # 3
```

### Floor() 내림
```
from math import *
print(floor(4.99)) # 9
```

### Ceil() 올림
```
from math import *
print(ceil(3.14)) # 4
```

### Sqrt() 제곱근
```
from math import *
print(sqrt(16)) # 4
```

### Random() 랜덤, 난수
```
from random import *
print(random()) # 0.0 >= N > 1.0  (0.0 ~ 1.0 미만의 임의의 값 생성)

print(random() * 10 ) # 0.0 >= N > 10.0  (0.0 ~ 10.0 미만의 임의의 값 생성)

print(int(random() * 10)) # 0 >= N > 10  (0 ~ 10 미만의 임의의 값 생성)

print(int(random() * 10)+1) # 1 >= N >= 10 (1 ~ 10 이하의 임의의 값 생성)

print(int(random() * 45)+1) # 1 >= N >= 45 (1 ~ 45 이하의 임의의 값 생성)

print(randrange(1,45)) # 1 >= N > 45 (1 ~ 45 미만의 임의의 값 생성)
print(randrange(1,46)) # 1 >= N > 46 (1 ~ 46 미만의 임의의 값 생성)

print(randint(1,45)) # 1 >= N >= 45 이하의 임의의 값 생성 

```


## 문자열

### '문자열' 문자열 따옴표 
```
sentence = '테스트입니다.'
print(sentence) 
```

### "문자열" 문자열 큰 따옴표 
```
sentence = "테스트입니다."
print(sentence) 
```

### """문자열 여러줄""" 문자열을 여러줄 입력 큰 따옴표*3   
```
sentence = """
테스트입니다1.
테스트입니다2.
테스트입니다2.
"""
print(sentence) 
```

## 슬라이싱

### 문자열 인덱싱 및 슬라이싱
```         
jumin = "880101-1000000"

print("성별 : "+jumin[7]) # 성별 : 1

print("연 : "+jumin[0:2]) # 연 : 88 (0부터 2직전까지)
print("월 : "+jumin[2:4]) # 월 : 00 (2부터 4직전까지)
print("일 : "+jumin[4:6]) # 일 : 00 (4부터 6직전까지)

print("생년월일 : "+jumin[:6]) # 생년월일 : 880000 (처음부터 6직전까지)
print("뒤 7자리 : "+jumin[7:]) # 뒤 7자리 : 1000000 (7 부터 끝까지)

print("뒤 7자리 (뒤에부터) : "+jumin[-7:]) # 뒤 7자리 (뒤에부터) : 1000000 (맨 뒤에서 7번째부터 끝까지)





```





### Reduce()

### lambda 

### 삼항 연산자
> [Condition] and [True Condition] or [False Condition]

```
(Y-X) % D == 0 and (Y-X) // D or ((Y-X) // D) + 1  

```
