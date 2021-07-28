---
layout: post
author: doodoo
title: "[프로그래머스][C++][KAKAO] 크레인 인형뽑기 게임"
subtitle: "카카오 문제를 부숴봅시다 👊"
date: 2021-07-28
cover: /assets/img/crane.png
tags: 프로그래머스 알고리즘 KAKAO
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 카카오 문제 중 크레인 인형뽑기 게임을 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당문제는 카카오 2019년 개발자 겨울 인턴십 문제입니다. 문제를 보시려면
[여기](https://programmers.co.kr/learn/courses/30/lessons/64061)를 눌러서
확인해주세요 (저작권 문제 때문에 링크로 공유드립니다 😂)

### 풀이
해당 문제는 `stack`자료구조를 활용하면 쉽게 풀 수 있다. 해당 문제는 level1
문제라 쉽게 풀 수 있는 문제이다. (만약 풀지 않았다면, 접근과정을 보기 전에
풀어보고 코드를 확인하기 바란다. 🤗)

### 접근과정
해당 문제를 접근하는 것은 어렵지 않았다. 문제 자체에서 주는 시그널도 있어 더욱
쉽게 느껴진 것 같다. 가장 크게 느낀 시그널은 문제의 그림이다. 문제에서 배열에 넣는 부분을 그림으로 표현하는데, 해당 그림을 보면 아.. 딱 `stack` 혹은
`queue`로 접근하면 되겠구나 하는 생각이 들었다. 본인은 `stack`이 적절한 것 같아
해당 자료구조를 활용해 문제를 해결하였다.

이 문제를 해결하기 위해서는 `stack`의 `top()`, `pop()`, `push()` 함수의 정확한
사용법을 알아야한다. (만약 모른다면, Google에 how to use stack in C++ 이라고
		검색해보자! 😎)

*❗ 문제 접근 과정을 구체적으로 생각해보자.*

문제에서는 `move`라는 배열이 주어지고, `move`값을 하나의 `board`의 열 (세로
		축)으로 참고한다. `board`의 열에서 0이 아닌 부분 가장 최상위에 있는 요소를 뽑아낸다.

이후 해당 요소를 `stack`이라는 자료구조에 넣어야한다. 넣기 전 `stack`의 마지막
요소가 현재 집어 넣을 요소와 동일한지 확인한다.

만약 요소가 동일하다면, 문제에서 주어진 것 처럼 상쇄 시키고, 상쇄 시킨 요소를
카운팅하면 된다.

만약 요소가 동일하지 않다면, `push()`를 활용해 현재 `stack`에 넣어 주면 된다.

해당 과정을 그림으로 표현해보았다.

![crane](/assets/img/crane.png)

그림을 통해 위의 접근과정을 다시 생각해보자.

1. `move` 값을 활용해 첫 번째 열의 최상단 요소 (*어피치*)를 꺼낸다.
2. *어피치*를 넣기 전 `stack`의 최상단 요소가 동일한 *어피치* 인지 확인한다.
	* 만약 *어피치*가 동일하다면, 상쇄 시키고 "+2"를 정답에 추가해준다.
	* 만약 *어피치*가 ₩아닌 다른 요소 (*프로도*)일 경우, `stack`에 그냥
	`push()`하고 동일한 과정을 반복 수행한다.

### 소스코드
```cpp
#include <stack>
#include <string>
#include <vector>

using namespace std;

int solution(vector<vector<int>> board, vector<int> moves) {
    int answer = 0;
    int depth = board.size();
    stack<int> s;

    for (int i = 0; i < moves.size(); i++) {
        for (int j = 0; j < depth; j++) {
            if (board[j][moves[i]-1]) {
                if (!s.empty() && s.top() == board[j][moves[i]-1]) {
                    answer += 2;
                    s.pop();
                } else {
                    s.push(board[j][moves[i]-1]);
                }
                board[j][moves[i]-1] = 0;
                break;
            }
        }
    }
    return answer;
}
```

### Appendix
주석이 달린 소스코드이다.

```cpp
#include <stack>
#include <string>
#include <vector>

using namespace std;

int solution(vector<vector<int>> board, vector<int> moves) {
    int answer = 0;
    int depth = board.size();
    // stack 할당, #include<stack> 필요함.
    stack<int> s;

    /* move 값을 돌고 하나의 열을 선택함. */
    for (int i = 0; i < moves.size(); i++) {
        /* 행을 증가시켜가며, 확인해본다 */
        for (int j = 0; j < depth; j++) {
            /* 0이 아닐 경우 하나의 요소를 픽해야함 */
            if (board[j][moves[i]-1]) {
                /* 요소가 동일 할 경우 상쇄 */
                if (!s.empty() && s.top() == board[j][moves[i]-1]) {
                    answer += 2;
                    s.pop();
                } else {
                    /* 상쇄가 되지 않으면, push() */
                    s.push(board[j][moves[i]-1]);
                }
                /* 값을 사용한 후 없음으로 처리 */
                board[j][moves[i]-1] = 0;
                break₩;
            }
        }
    }
    return answer;
}
```

행렬을 어떻게 접근하는지 잘 구별 하는게 좋다. 구체적으로, 2차원 배열을 어떤 방식으로 x,
	y축을 움직이는지 확실하게 정리해놓는 것이 좋을 것 같다. 만약 어떤 시험을
	치르거나 할 때, 해당 부분이 햇갈려 늦게 풀게 되면 진정으로 어려운 부분에서
	고민할 시간이 줄어든다. 최대한 시간을 아낄 수 있는 부분을 아끼는 습관을 들이는
	것이 좋을 것 같다👊
