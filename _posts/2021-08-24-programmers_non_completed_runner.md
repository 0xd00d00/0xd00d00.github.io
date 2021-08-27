---
layout: post
author: doodoo
title: "[프로그래머스][C++][고득점 Kit] 완주하지 못한 선수"
subtitle: "고득점 Kit의 완주하지 못한 선수를 풀어보자😋"
date: 2021-08-24
cover: /assets/img/programmers_non_completed_runner.png
tags: 프로그래머스 알고리즘 고득점Kit
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 고득점 Kit 문제 중 완주하지 못한 선수 문제를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 고득점 Kit 문제 중 하나입니다. 자세한 내용은 [여기](https://programmers.co.kr/learn/courses/30/lessons/42576)를 참고하도록 합시다. (저작권 문제로 양해 부탁드립니다. 🙇)

### 풀이
해당 문제는 `std::map` 자료구조를 활용해 풀었습니다. map 자료구조를 잘 모르겠는 분들은 [여기](http://localhost:4000/2021/08/21/cpp_map.html)를 클릭해 자세하게 알아봅시다.

### 접근과정
해당 문제는 `level1` 문제로 아주 간단하게 접근할 수 있습니다. 우선, Input 값과 Ouput 값이 무엇인지 분석해봅시다. Input으로 주어지는 값은 경주하는 선수들의 이름과 완주한 사람들의 이름이 주어집니다. 우리가 Output으로 출력해야되는 것은 *완주된 사람들의 이름에 없는 선수* 입니다.

![완주하지 못한 선수](/assets/img/programmers_non_completed_runner.png)

위의 그림과 같이, 전달받은 선수 목록으로 `map`을 만들어 선수들의 이름의 key 값, 해당 이름을 가진 선수 숫자를 value 값으로 잡는다. (이렇게 접근하는 이유는 동명이인이 존재하기 때문이다.)

이후 전달받은 완주한 사람의 목록과 비교하여, 만약 존재한다면, 완주 했다는 의미로 `value` 값에서 하나를 빼준다.

이후 마지막으로 `map` 자료구조를 확인하면서, 만약 `value` 값이 0이 아니라면 완주하지 못한 사람으로 정답으로 간주한다.

### 소스코드
```cpp
#include <string>
#include <vector>
#include <map>

using namespace std;

string solution(vector<string> participant, vector<string> completion) {
    map<string,int> m;
    for (auto p : participant)
        m[p]++;

    for (auto c : completion)
        m[c]--;

    for (auto tmp : m)
        if (tmp.second)
            return tmp.first;
}
```

### Appendix
```cpp
#include <string>
#include <vector>
#include <map>

using namespace std;

string solution(vector<string> participant, vector<string> completion) {
	// map 준비
    map<string,int> m;

	// 참여자를 기반으로 map을 완성함
    for (auto p : participant)
        m[p]++;

	// 완주한 사람의 목록을 받아 value 값을 감소시킴
    for (auto c : completion)
        m[c]--;

	// map을 돌면서 value가 0이아닌 부분 즉, 정답을 찾음.
    for (auto tmp : m)
        if (tmp.second)
            return tmp.first;
}
```

해당 문제는 간단하게 해결할 수 있는 문제였다. 혹시 모르는 사람은 `map`자료구조의 특성을 꼭 공부하도록하자!
