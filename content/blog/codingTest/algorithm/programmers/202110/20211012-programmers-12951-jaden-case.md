---
title: "Programmers 12951 JadenCase 문자열 만들기"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-10-12
slug: "programmers-12951-jaden-case"
description: "12951 JadenCase 문자열 만들기"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 12951 JadenCase 문자열 만들기

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/12951">Programmers 12951 링크</a>

### 문제 설명

> JadenCase란 모든 단어의 첫 문자가 대문자이고, 그 외의 알파벳은 소문자인 문자열입니다. 문자열 s가 주어졌을 때, s를 JadenCase로 바꾼 문자열을 리턴하는 함수, solution을 완성해주세요.





## Condition
>- s는 길이 1 이상인 문자열입니다.
>- s는 알파벳과 공백문자(" ")로 이루어져 있습니다.
>- 첫 문자가 영문이 아닐때에는 이어지는 영문은 소문자로 씁니다. ( 첫번째 입출력 예 참고 )

###입력 형식
>입출력 예


s	| return
---|----
"3people unFollowed me"	|"3people Unfollowed Me"
"for the last week"	|"For The Last Week"

## Solution 

```
class JadenCase {
	
	public static void main(String[] args) {
		
		System.out.println(new JadenCase().solution("3people unFollowed me"));
	}
	
	public String solution(String s) {
        String answer = "";
        s = s.toLowerCase();
        
        int idx = 0;
        for(int i=0; i < s.length() ;i++) {
        	char ch = s.charAt(i);
        	
        	if(ch == ' ') {
        		idx = 0;
        	}else {
        		idx ++;
        	}
        	
        	if(idx == 1) {
        		answer += String.valueOf(ch).toUpperCase();
        	}else {
        		answer += String.valueOf(ch);
        	}
        }
        return answer;
    }
}

```



## Others Solution 
```
class JadenCase {
	
	public static void main(String[] args) {
		
		System.out.println(new JadenCase().solution("3people unFollowed me"));
	}
	
	public String solution(String s) {
	        String answer = "";
	        String[] sp = s.toLowerCase().split("");
	        boolean flag = true;

	        for(String ss : sp) {
	            answer += flag ? ss.toUpperCase() : ss;
	            flag = ss.equals(" ") ? true : false;
	        }

	        return answer;
	  }

}

```

## TestCase
```

"3people unFollowed me"	"3people Unfollowed Me"
"for the last week"	"For The Last Week"

```
