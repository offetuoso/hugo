---
title: "Programmers 12915 문자열 내 마음대로 정렬하기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-10-12
slug: "programmers-12915-sort-string-at-will"
description: "12915 문자열 내 마음대로 정렬하기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12915 문자열 내 마음대로 정렬하기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12915">Programmers 12915 링크</a>

### 문제 설명

> 문자열로 구성된 리스트 strings와, 정수 n이 주어졌을 때, 각 문자열의 인덱스 n번째 글자를 기준으로 오름차순 정렬하려 합니다. 예를 들어 strings가 ["sun", "bed", "car"]이고 n이 1이면 각 단어의 인덱스 1의 문자 "u", "e", "a"로 strings를 정렬합니다.




## Condition
>- strings는 길이 1 이상, 50이하인 배열입니다.
>- strings의 원소는 소문자 알파벳으로 이루어져 있습니다.
>- strings의 원소는 길이 1 이상, 100이하인 문자열입니다.
>- 모든 strings의 원소의 길이는 n보다 큽니다.
>- 인덱스 1의 문자가 같은 문자열이 여럿 일 경우, 사전순으로 앞선 문자열이 앞쪽에 위치합니다.

###입력 형식
>입출력 예

strings	|n	|return
-----|------|-------
["sun", "bed", "car"]|	1	|["car", "bed", "sun"]
["abce", "abcd", "cdx"]	|2|	["abcd", "abce", "cdx"]

## Solution 

```
import java.util.ArrayList;
import java.util.Collections;

class SortStringAtWill {
	
	public static void main(String[] args) {
		String[] strings = {"car", "bed", "sun"};
		String[] result = new SortStringAtWill().solution(strings, 1);
		
		for(int i=0; i<result.length;i++) {
			System.out.println(result[i]);
		}
	}
	
    public String[] solution(String[] strings, int n) {
        
    	ArrayList<String> list = new ArrayList<String>();
    	
    	
    	for(int i=0;i<strings.length;i++) {
    		list.add(strings[i].charAt(n)+strings[i]);
    	}
    	
    	Collections.sort(list);
    	
    	for(int i=0; i<list.size();i++) {
    		strings[i] = list.get(i).substring(1);
    	}
    	
		return strings;
    }
}

```


## TestCase
strings	|n	|return
-----|------|-------
["sun", "bed", "car"]|	1	|["car", "bed", "sun"]
["abce", "abcd", "cdx"]	|2|	["abcd", "abce", "cdx"]

