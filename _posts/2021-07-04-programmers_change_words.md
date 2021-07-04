---
layout: post
author: doodoo
title: "[프로그래머스][C++][고득점 kit] 단어변환"
subtitle: "고득점 kit의 단어변환 문제를 풀어보자. 🔥"
date: 2021-07-04
cover: /assets/img/Change_words_dfs.png
tags: 프로그래머스 알고리즘
---

### 문제
해당 문제는 프로그래머스 고득점 kit의 단어변환 문제입니다.
문제는 [여기](https://programmers.co.kr/learn/courses/30/lessons/43163) 클릭해서 확인해주세요! (문제 저작권 보호차원 링크로 공유드립니다😟)

궁금한점 댓글로 남겨주시면 성실히 답변하겠습니다. 👍

\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 풀이
해당 문제는 시작점을 기준으로 한 글자 단어를 계속 바꿔가며 타겟을 찾는 문제이다.

전형적 완전 탐색 문제이다. 완전 탐색을 푸는 방법은 여러가지가 있지만, 그 중 대중적으로 사용되는 방법은 dfs / bfs 방법이다. 해당 문제는 두 가지 방법으로 다 풀 수 있고, 본인은 `dfs 방법` 으로 문제를 해결했다.

### 문제 접근 과정
아래의 그림과 같이, input 값들을 하나의 노드로 정의하고, begin 부터 한 글자만 변경해 동일할 경우 해당 노드로 옮겨간다. 이후 현재 노드가 target값과 동일한지 판단하는 방법으로 풀었다.

![chagne_words](/assets/img/Change_words_dfs.png)

간단하게 위의 그림을 이해해보자.

Case 1.
- hit 이라는 시작점을 기준으로 Input array의 값 즉, 노드를 비교한다.
- Hit 에서 한 글자만 변경했을 때 방문 할 수 있는 경우는 pit, hot이다. 순차적으로 방문을 한다.
- 먼저 pit을 방문한다. (방문시 visited array 체크)
- pit 이 target 노드와 동일한지 확인한다.
    - Pit target node와 다르기 때문에 input array 조사함.
- pit 방문 이후 input array를 조사했을 때 탐색 값이 없음으로 다시 hit으로 돌아온다.

Case 2.
- 돌아온 hit에서 hot을 방문한다. (방문시 visited array 체크)
- Hot 이 target node와 동일한지 확인한다.
    - hot도 다르기 때문에 input array 를 조사한다. (Visited 완료된 노드는 검사안함)
- Hot 에서는 한 글자 변경으로 dot으로 갈 수 있다.

Case3.
- Dot을 방문한다.
- Dot 과 target node가 동일한지 비교한다.
    - 동일함으로 해당 dot까지 온 거리를 answer 저장한다.
        -  dot까지 도달할 수 있는 경우의 수가 여러개가 될수 있고, 우리는  문제의 조건을 참고해 경우의 수 중 최소값을 구한다.

### 소스코드

```cpp
#include <string>
#include <vector>

using namespace std;

static int answer = 50;

void bfs(string begin, const string target, vector<bool>& check, const vector<string>& words, int count = 0) {

    if (begin == target) {
        if (answer > count) answer = count;
        return;
    }

    for (int i = 0; i < words.size(); i++) {
        int b_cnt = 0;
        if (check[i]) continue;

        for (int j = 0; j < words[i].length(); j++) {
            if (begin[j] != words[i][j]) b_cnt++;
        }

        if (b_cnt == 1) {
            check[i] = true;
            bfs(words[i], target, check, words, count + 1);
            check[i] = false;
        }
    }
}

int solution(string begin, string target, vector<string> words) {
    vector<bool> check(words.size(),false);

    bfs(begin, target, check, words);
    return answer == 50 ? 0 : answer;
}
```

해당 문제의 dfs의 핵심은 *탈출조건* 과 *방문 유무를 검사하는 visisted 배열*이다.

*탈출조건*
- 현재 시점의 `begin` 노드와 `target` 노드가 동일한지 확인
	- 탈출하기 전 `answer` 값 최소값으로 변경

*방문 유무 검사*
- 초기화 시점에 `word.size()` 만큼 `visted check 배열` 을 생성함.
	- 단어가 한 글자만 같을 경우 `visited check`를 변경하고 다음 노드 방문
- 만약 방문했다면 *성능향상* 을 위해 추가로 검사하지 말고 다음 노드 검사하면 됨.


### Appendix
해당 소스코드는 필요한 부분에 주석을 추가한 소스코드이다.
해당 부분은 참고용으로 보기 바란다.

```cpp
/***********************

해당 문제 조건
- 각 단어는 알파벳 소문자
- 각 단어의 길이는 3 이상 10 이하이며 모든 단어의 길이는 같음
- words에는 3개 이상 50개 이하의 단어가 있으며 중복되는 단어 (최대 50)
- begin과 target은 같지 않음
- 변환할 수 없는 경우에는 0를 return

***********************/

#include <string>
#include <vector>

using namespace std;

static int answer = 50;

void bfs(string begin, const string target, vector<bool>& check, const vector<string>& words, int count = 0) {

    /* 탈출 조건 : begin == target */
    if (begin == target) {
        if (answer > count) answer = count;
        return;
    }

    for (int i = 0; i < words.size(); i++) {
        int b_cnt = 0;

        /* 애당초 검사했던 words라면 단어 같은지 알 필요도 없음. */
        if (check[i]) continue;

        for (int j = 0; j < words[i].length(); j++) {
            /* 글자 다른 횟수 세기 */
            if (begin[j] != words[i][j]) b_cnt++;
        }

        /*
          글자 하나만 다른 경우
            해당 글자로 begin point를 변경하고 bfs 돌면됨.
            중복 되는 경우가 없기 때문에 < 2가 아닌 == 1 로 확인하면 됨.
        */
        if (b_cnt == 1) {
            check[i] = true;
            bfs(words[i], target, check, words, count + 1);
            check[i] = false;
        }
    }
}

int solution(string begin, string target, vector<string> words) {
    vector<bool> check(words.size(),false);
    bfs(begin, target, check, words);
    return answer == 50 ? 0 : answer;
}
```

*배운 점*
- test case 3번이 계속 오류가 났다. 한 2시간 고민했나? 분명 logic은 맞을텐데 하면서 고민을 하고 또 했다. 결국 문제를 찾았는데.. `check[j]` 부분이었다. 현재 input array 기준으로 `check[i]` 배열은 검사하도록 되어져있다. 하지만 코드를 설렁설렁 짜다보니, `check[]`에 index 를 `i` 가 아닌 `j` 로 넣은 것.. 하하.. 다음 부턴 코드를 설렁짜지 말자. 🤦








