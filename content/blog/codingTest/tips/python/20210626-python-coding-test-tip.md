---
title: "파이썬 코딩테스트 팁"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-26
slug: "python-coding-test-tip"
description: "파이썬 코딩테스트 팁"
keywords: ["Algorithm", "CodingTest"]
draft: true
categories: ["Algorithm"]
tags: ["Algorithm"]
math: false
toc: true
---

## 동적 생성

### 배열

> array = [0] * 5
> - [0, 0, 0, 0, 0]

### dictionary

mydictionary = {} #빈 딕셔너리 생성 시 {}사용
mydictionary = {"mouse":3, "penguin":5}

mydictionary["mouse"] # key("mouse")에 대응하는 value(3)에 접근할 때 사용
mydictionary["cat"] = 1 # key("cat")에 대한 value(1) 생성

>mydictionary = {i:0 for i in range(1,5+1)}
> - {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}