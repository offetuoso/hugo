---
title: "Programmers 72412 순위 검색"
image: "bg-index.jpg"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2021-08-07
slug: "programmers-72412-rank-search"
description: "72412 순위 검색"
keywords: ["Algorithm", "CodingTest"]
draft: false
categories: ["Algorithm"]
subcategories: ["Programmers"]
tags: ["Algorithm", "CodingTest", "Programmers"]
math: false
toc: true
---

# Programmers - 72412 순위 검색

## Task description

원문 : <a href="https://programmers.co.kr/learn/courses/30/lessons/72412">Programmers 72412 링크</a>

>카카오는 하반기 경력 개발자 공개채용을 진행 중에 있으며 현재 지원서 접수와 코딩테스트가 종료되었습니다. 이번 채용에서 지원자는 지원서 작성 시 아래와 같이 4가지 항목을 반드시 선택하도록 하였습니다.

>코딩테스트 참여 개발언어 항목에 cpp, java, python 중 하나를 선택해야 합니다. <br>
지원 직군 항목에 backend와 frontend 중 하나를 선택해야 합니다. <br>
지원 경력구분 항목에 junior와 senior 중 하나를 선택해야 합니다. <br>
선호하는 소울푸드로 chicken과 pizza 중 하나를 선택해야 합니다. <br>
인재영입팀에 근무하고 있는 니니즈는 코딩테스트 결과를 분석하여 채용에 참여한 개발팀들에 제공하기 위해 지원자들의 지원 조건을 선택하면 해당 조건에 맞는 지원자가 몇 명인 지 쉽게 알 수 있는 도구를 만들고 있습니다.
예를 들어, 개발팀에서 궁금해하는 문의사항은 다음과 같은 형태가 될 수 있습니다. <br>
코딩테스트에 java로 참여했으며, backend 직군을 선택했고, junior 경력이면서, 소울푸드로 pizza를 선택한 사람 중 코딩테스트 점수를 50점 이상 받은 지원자는 몇 명인가? <br>

>물론 이 외에도 각 개발팀의 상황에 따라 아래와 같이 다양한 형태의 문의가 있을 수 있습니다. <br>

>코딩테스트에 python으로 참여했으며, frontend 직군을 선택했고, senior 경력이면서, 소울푸드로 chicken을 선택한 사람 중 코딩테스트 점수를 100점 이상 받은 사람은 모두 몇 명인가? <br>
코딩테스트에 cpp로 참여했으며, senior 경력이면서, 소울푸드로 pizza를 선택한 사람 중 코딩테스트 점수를 100점 이상 받은 사람은 모두 몇 명인가? <br>
backend 직군을 선택했고, senior 경력이면서 코딩테스트 점수를 200점 이상 받은 사람은 모두 몇 명인가? <br>
소울푸드로 chicken을 선택한 사람 중 코딩테스트 점수를 250점 이상 받은 사람은 모두 몇 명인가? <br>
코딩테스트 점수를 150점 이상 받은 사람은 모두 몇 명인가? <br>
즉, 개발팀에서 궁금해하는 내용은 다음과 같은 형태를 갖습니다. <br>

> \* [조건]을 만족하는 사람 중 코딩테스트 점수를 X점 이상 받은 사람은 모두 몇 명인가?
[문제]
지원자가 지원서에 입력한 4가지의 정보와 획득한 코딩테스트 점수를 하나의 문자열로 구성한 값의 배열 info,  <br>개발팀이 궁금해하는 문의조건이 문자열 형태로 담긴 배열 query가 매개변수로 주어질 때, <br>
각 문의조건에 해당하는 사람들의 숫자를 순서대로 배열에 담아 return 하도록 solution 함수를 완성해 주세요.




## Condition
>- info 배열의 크기는 1 이상 50,000 이하입니다.
>- info 배열 각 원소의 값은 지원자가 지원서에 입력한 4가지 값과 코딩테스트 점수를 합친 "개발언어 직군 경력 소울푸드 점수" 형식입니다.
>- 개발언어는 cpp, java, python 중 하나입니다.
>- 직군은 backend, frontend 중 하나입니다.
>- 경력은 junior, senior 중 하나입니다.
>- 소울푸드는 chicken, pizza 중 하나입니다.
>- 점수는 코딩테스트 점수를 의미하며, 1 이상 100,000 이하인 자연수입니다.
>- 각 단어는 공백문자(스페이스 바) 하나로 구분되어 있습니다.
>- query 배열의 크기는 1 이상 100,000 이하입니다.
>- query의 각 문자열은 "[조건] X" 형식입니다.
>- [조건]은 "개발언어 and 직군 and 경력 and 소울푸드" 형식의 문자열입니다.
>- 언어는 cpp, java, python, - 중 하나입니다.
>- 직군은 backend, frontend, - 중 하나입니다.
>- 경력은 junior, senior, - 중 하나입니다.
>- 소울푸드는 chicken, pizza, - 중 하나입니다.
>- '-' 표시는 해당 조건을 고려하지 않겠다는 의미입니다.
>- X는 코딩테스트 점수를 의미하며 조건을 만족하는 사람 중 X점 이상 받은 사람은 모두 몇 명인 지를 의미합니다.
>- 각 단어는 공백문자(스페이스 바) 하나로 구분되어 있습니다.
>- 예를 들면, "cpp and - and senior and pizza 500"은 "cpp로 코딩테스트를 봤으며, 경력은 senior 이면서 >- 소울푸드로 pizza를 선택한 지원자 중 코딩테스트 점수를 500점 이상 받은 사람은 모두 몇 명인가?"를 의미합니다.

###입력 형식

info	| query |	result
-------------|---------|---------
["java backend junior pizza 150","python frontend senior chicken 210","python frontend senior chicken 150","cpp backend senior pizza 260","java backend junior chicken 80","python backend senior chicken 50"] |	["java and backend and junior and pizza 100","python and frontend and senior and chicken 200","cpp and - and senior and pizza 250","- and backend and senior and - 150","- and - and - and chicken 100","- and - and - and - 150"] |	[1,1,1,1,2,4]

>입출력 예에 대한 설명
지원자 정보를 표로 나타내면 다음과 같습니다.

언어	|직군	|경력|	소울 푸드|	점수
----|---|---|----------|----
java	|backend	|junior	|pizza	|150
python	|frontend	|senior	|chicken	|210
python	|frontend	|senior	|chicken	|150
cpp	|backend|	|senior	|pizza	|260
java	|backend	|junior	|chicken	|80
python	|backend	|senior	|chicken	|50

>- "java and backend and junior and pizza 100" : java로 코딩테스트를 봤으며, backend 직군을 선택했고 junior 경력이면서 소울푸드로 pizza를 선택한 지원자 중 코딩테스트 점수를 100점 이상 받은 지원자는 1명 입니다.
>- "python and frontend and senior and chicken 200" : python으로 코딩테스트를 봤으며, frontend 직군을 선택했고, senior 경력이면서 소울 푸드로 chicken을 선택한 지원자 중 코딩테스트 점수를 200점 이상 받은 지원자는 1명 입니다.
>- "cpp and - and senior and pizza 250" : cpp로 코딩테스트를 봤으며, senior 경력이면서 소울푸드로 pizza를 선택한 지원자 중 코딩테스트 점수를 250점 이상 받은 지원자는 1명 입니다.
>- "- and backend and senior and - 150" : backend 직군을 선택했고, senior 경력인 지원자 중 코딩테스트 점수를 150점 이상 받은 지원자는 1명 입니다.
>- "- and - and - and chicken 100" : 소울푸드로 chicken을 선택한 지원자 중 코딩테스트 점수를 100점 이상을 받은 지원자는 2명 입니다.
>- "- and - and - and - 150" : 코딩테스트 점수를 150점 이상 받은 지원자는 4명 입니다.


## Solution 
> 테스트 케이스를 통과하였지만, 효율성을 통과하지 못한 답변 1

```
   def solution(info, query):
    answer = []
    datas = []
    query_cnt = 5
    for i in range(0,len(info)) :
        datas.append(re.split(r' ',info[i]))

    for i in range(0,len(query)) :
        _datas = datas 
        order = str(query[i].replace('and ', '', query_cnt)).split()
    
        
        for k in range(0,query_cnt) :
            if k < query_cnt-1 :
                _datas =  [user for user in _datas if order[k] == user[k] or order[k] == '-'] 
            else : 
                _datas =  [user for user in _datas if int(order[k]) <= int(user[k]) or order[k] == '-'] 
        
        
        answer.append(len(_datas))

    return answer
```

> 테스트 케이스를 통과하였지만, 효율성을 통과하지 못한 답변 2

```
import re

def solution(info, query):
    answer = []
    datas = []
    query_cnt = 5
    for i in range(0,len(info)) :
        datas.append(re.split(r' ',info[i]))

    for i in range(0,len(query)) :
        _datas = datas 
        order = str(query[i].replace('and ', '', query_cnt)).split()
    
        _datas =  [user for user in _datas if order[0] == user[0] or order[0] == '-'] 
        _datas =  [user for user in _datas if order[1] == user[1] or order[1] == '-'] 
        _datas =  [user for user in _datas if order[2] == user[2] or order[2] == '-'] 
        _datas =  [user for user in _datas if order[3] == user[3] or order[3] == '-'] 
        _datas =  [user for user in _datas if int(order[4]) <= int(user[4]) or order[4] == '-'] 
        answer.append(len(_datas))

    return answer
```

> -까지 포함된 모든 경우의 수를 키로 만들어 dic 으로 점수를 저장
> dic을 정렬하고 2진검색을 사용하여 검색

```
def solution(info, query):
    answer = []
    dic = {}
    comb = [0, 1, 2, 3]
    for i in info:
        data = i.split()
        conditions = data[:-1]
        score = int(data[-1])

        for j in range(5):
            for k in list(combinations(comb, j)):
                temp = conditions.copy()
                for idx in k:
                    temp[idx] = '-'
                key = ''.join(temp)
                if key in dic:
                    dic[key].append(score)
                else:
                    dic[key] = [score]

    for value in dic.values():  
        value.sort()

    for i in query:
        q_list = []
        for j in i.split():
            if j == 'and':
                continue
            q_list.append(j)

        key = ''.join(q_list[:-1])
        value = int(q_list[-1])
     
        if key in dic:
            dic_list = dic[key]

            index = bisect_left(dic_list, value)
            answer.append(len(dic_list) - index)
        else:
            answer.append(0)
            continue
    return answer
```

## Others Solution 
```
from itertools import combinations
def solution(info, query):
    answer = []
    db = {}
    for i in info:                   # info에 대해 반복
        temp = i.split()
        conditions = temp[:-1]       # 조건들만 모으고, 점수 따로
        score = int(temp[-1])  
        for n in range(5):           # 조건들에 대해 조합을 이용해서  
            combi = list(combinations(range(4), n))
            for c in combi:
                t_c = conditions.copy()
                for v in c:          # '-'를 포함한 새로운 조건을 만들어냄.
                    t_c[v] = '-'
                changed_t_c = '/'.join(t_c)
                if changed_t_c in db:     # 모든 조건의 경우에 수에 대해 딕셔너리
                    db[changed_t_c].append(score)
                else:
                    db[changed_t_c] = [score]

    for value in db.values():             # 딕셔너리 내 모든 값 정렬
        value.sort()
 
    for q in query:                       # query의 모든 조건에 대해서
        qry = [i for i in q.split() if i != 'and']
        qry_cnd = '/'.join(qry[:-1])
        qry_score = int(qry[-1])
        if qry_cnd in db:                 # 딕셔너리 내에 값이 존재한다면,
            data = db[qry_cnd]
            if len(data) > 0:          
                start, end = 0, len(data)     # lower bound 알고리즘 통해 인덱스 찾고,
                while start != end and start != len(data):
                    if data[(start + end) // 2] >= qry_score:
                        end = (start + end) // 2
                    else:
                        start = (start + end) // 2 + 1
                answer.append(len(data) - start)      # 해당 인덱스부터 끝까지의 갯수가 정답
        else:
            answer.append(0)

    return answer

```

## TestCase
```
info = ["java backend junior pizza 150","python frontend senior chicken 210","python frontend senior chicken 150","cpp backend senior pizza 260","java backend junior chicken 80","python backend senior chicken 50"]	
query = ["java and backend and junior and pizza 100","python and frontend and senior and chicken 200","cpp and - and senior and pizza 250","- and backend and senior and - 150","- and - and - and chicken 100","- and - and - and - 150"]
solution(info, query)

```
