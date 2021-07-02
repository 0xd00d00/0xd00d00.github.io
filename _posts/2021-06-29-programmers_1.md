---
layout: post
author: doodoo
title: "[Programmers][C++] 프로그래머스 입국심사"
subtitle: "고득점 kit 입국심사 문제를 풀어보자 🤓"
date: 2021-06-29
cover: /assets/img/default_1.png
tags: programmers
---

### 문제
해당 문제는 프로그래머스의 고득점 kit의 문제입니다.

문제는 [여기](https://programmers.co.kr/learn/courses/30/lessons/43238)를 클릭해 확인해주세요!

궁금한점은 댓글 남겨주시면 감사하겠습니다🙇

### 풀이
해당 문제는 `이분 탐색` 을 활용하여, 풀 수 있다.


### 코드

```cpp
#include <algorithm>
#include <string>
#include <vector>
#include <typeinfo>
#include <iostream>

using namespace std;

// 제일 빨리 끝나는 케이스가 뭘까?
// 심사위원이 많고, 처리하는 시간이 짧을 수록 빨리 끝남.

// 제일 늦게 끝나는 시간
// 심사위원 적고, 처리하는 시간이 길 경우

long long solution(int n, vector<int> times) {
    long long answer = 0;
    sort(times.begin(), times.end());

    long long min = 1;
    long long max = n * times.back();
    cout << "type " << typeid(max).name() << endl;

    long long tmp;
    while (min <= max) {

        long long avg = (max + min) / 2;
        tmp = 0;

        for (long long i = 0; i < times.size(); i++) {
            tmp += (avg / times[i]);
        }
        if (tmp >= n) {
            max = avg - 1;
            answer = avg;
        }
        else min = avg + 1;
    }
    return answer;
}


```

### 학습한 부분

해당 문제에서 새롭게 학습한 부분은 2가지이다.

1. max_element

2. long long 변환 시점
