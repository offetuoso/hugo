---
title: "Codility - Binary Gap"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-05-26
slug: "codility-binary-gap"
description: "Binary Gap"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
tags: ["Algorithm", "CodingTest", "Codility"]
math: false
toc: true
---

# BinaryGap

> Codility - Lesson1 - Iterations - <a href="https://app.codility.com/programmers/lessons/1-iterations/">BinaryGap</a>

## Task description

> 1. 정수 N을 입력받아 2진으로 변환 후
> 2. 예를 들어 N = 1041이면 함수는 5를 반환해야합니다. N은 이진 표현 10000010001 이고 따라서 가장 긴 이진 간격은 길이 5이기 때문입니다. 

> N = 32이면 함수는 0을 반환해야합니다. N은 이진 표현 '100000'이므로 바이너리 갭이 없습니다.

## Condition
> - 함수 작성 : class Solution {public int solution (int N); }
> - N은 [ 1 .. 2,147,483,647 ] 범위 내의 정수 입니다.
> - 양의 정수 N이 주어지면 가장 긴 이진 간격의 길이를 반환합니다. N에 이진 갭이 없으면 함수는 0을 반환해야합니다.

>다음 가정에 대한 효율적인 알고리즘을 작성하십시오 .


## Solution

```
// you can also use imports, for example:
// import java.util.*;

// you can write to stdout for debugging purposes, e.g.
// System.out.println("this is a debug message");

class Solution {
    public int solution(int N) {
       int result = 0;
    	
        StringBuffer sb = new StringBuffer(Integer.toBinaryString(N));
    	
        int buf = 0;
        int count = 0;
        
        for (int i = 0; i < sb.length(); i++) {
        	 if(i < sb.length()) {
        		int value = Integer.parseInt(sb.substring(i,i+1).toString());

        		buf += value;
        		
        		if(buf == 1 && value == 0){
        			count += 1;
        		}else {
        			result = Math.max(result, count); 
        			count = 0;
        			buf = 1;
        		}
        	  }
		}
		return result;
    }
}
```

## TestCase
```
package coding;

// you can also use imports, for example:
// import java.util.*;

// you can write to stdout for debugging purposes, e.g.
// System.out.println("this is a debug message");

class Solution {
	public static void main(String[] args) {
		Solution sol = new Solution();
		System.out.println(sol.solution(2147223647));
		/*
		example1
		example test n=1041=10000010001_2✔OK
		▶example2
		example test n=15=1111_2✔OK
		▶example3
		example test n=32=100000_2✔OK
		expand allCorrectness tests
		▶extremes
		n=1, n=5=101_2 and n=2147483647=2**31-1✔OK
		▶trailing_zeroes
		n=6=110_2 and n=328=101001000_2✔OK
		▶power_of_2
		n=5=101_2, n=16=2**4 and n=1024=2**10✔OK
		▶simple1
		n=9=1001_2 and n=11=1011_2✔OK
		▶simple2
		n=19=10011 and n=42=101010_2✔OK
		▶simple3
		n=1162=10010001010_2 and n=5=101_2✔OK
		▶medium1
		n=51712=110010100000000_2 and n=20=10100_2✔OK
		▶medium2
		n=561892=10001001001011100100_2 and n=9=1001_2✔OK
		▶medium3
		n=66561=10000010000000001_2✔OK
		▶large1
		n=6291457=11000000000000000000001_2✔OK
		▶large2
		n=74901729=100011101101110100011100001✔OK
		▶large3
		n=805306373=110000000000000000000000000101_2✔OK
		▶large4
		n=1376796946=1010010000100000100000100010010_2✔OK
		▶large5
		n=1073741825=1000000000000000000000000000001_2✔OK
		▶large6
		n=1610612737=1100000000000000000000000000001_2
		*/
		
		
		//▶example1
		System.out.println("example test n=1041=10000010001_2✔OK "+sol.solution(1041));
		
		//▶example2
		System.out.println("example test n=15=1111_2✔OK "+sol.solution(15));
				
		//▶example3
		System.out.println("example test n=32=100000_2✔OK "+sol.solution(32));
		
		/*
		▶extremes
		n=1, n=5=101_2 and n=2147483647=2**31-1✔OK
		▶trailing_zeroes
		n=6=110_2 and n=328=101001000_2✔OK
		▶power_of_2
		n=5=101_2, n=16=2**4 and n=1024=2**10✔OK
		▶simple1
		n=9=1001_2 and n=11=1011_2✔OK
		▶simple2
		n=19=10011 and n=42=101010_2✔OK
		▶simple3
		n=1162=10010001010_2 and n=5=101_2✔OK
		▶medium1
		n=51712=110010100000000_2 and n=20=10100_2✔OK
		▶medium2
		n=561892=10001001001011100100_2 and n=9=1001_2✔OK
		▶medium3
		n=66561=10000010000000001_2✔OK
		▶large1
		n=6291457=11000000000000000000001_2✔OK
		▶large2
		n=74901729=100011101101110100011100001✔OK
		▶large3
		n=805306373=110000000000000000000000000101_2✔OK
		▶large4
		n=1376796946=1010010000100000100000100010010_2✔OK
		▶large5
		n=1073741825=1000000000000000000000000000001_2✔OK
		▶large6
		n=1610612737=1100000000000000000000000000001_2
		*/
		
	}
	
    public int solution(int N) {
        // write your code in Java SE 8
    	
    	int result = 0;
    	
        StringBuffer sb = new StringBuffer(Integer.toBinaryString(N));
    	
        int buf = 0;
        int count = 0;
        
    	for (int i = 0; i < sb.length(); i++) {
        	if(i < sb.length()) {
        		int value = Integer.parseInt(sb.substring(i,i+1).toString());
        		System.out.println(value);
        		buf += value;
        		
        		if(buf == 1 && value == 0){
        			count += 1;
        		}else {
        			result = Math.max(result, count); 
        			count = 0;
        			buf = 1;
        		}
        	}
		}
        
		return result;
    }
}

```