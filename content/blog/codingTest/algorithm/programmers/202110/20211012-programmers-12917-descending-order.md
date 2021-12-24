---
title: "Programmers 12917 문자열 내림차순으로 배치하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-10-12
slug: "programmers-12917-descending-order"
description: "12917 문자열 내림차순으로 배치하기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12917 문자열 내림차순으로 배치하기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12917">Programmers 12917 링크</a>

### 문제 설명

> 문자열 s에 나타나는 문자를 큰것부터 작은 순으로 정렬해 새로운 문자열을 리턴하는 함수, solution을 완성해주세요.
s는 영문 대소문자로만 구성되어 있으며, 대문자는 소문자보다 작은 것으로 간주합니다.



## Condition
>- str은 길이 1 이상인 문자열입니다.

###입력 형식
>입출력 예

s	| return
-----|------
"Zbcdefg"	| "gfedcbZ"

## Solution 

```
import java.util.Arrays;

class Solution {
    public String solution(String s) {
        String answer = "";
        char[] ch = s.toCharArray();
        int[] list = new int[ch.length];
        		
	    for(int i = 0 ; i< ch.length; i++) {
	    	list[i] = ch[i];
	    }
	    
	    Arrays.sort(list);
	    
	    for(int i=list.length-1;i>-1;i--){
	    	answer = answer+String.valueOf((char)list[i]);
        }
	    
        return answer;
    }
}

```



## Others Solution 
```
import java.util.Arrays;

class Solution {
    public String solution(String s) {
        public String solution2(String s) {
        String answer = "";
        char[] ch = s.toCharArray();
	    
	    Arrays.sort(ch);
	    
        return new StringBuilder(new String(ch)).reverse().toString();
    }
}

```

## TestCase
```
"Zbcdefg"	"gfedcbZ"

```
