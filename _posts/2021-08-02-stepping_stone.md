---
layout: post
author: doodoo
title: "[프로그래머스][C++][KAKAO] 징검다리 건너기"
subtitle: "카카오 문제를 접수 해봅시다! 🎶"
date: 2021-08-02
cover: /assets/img/stepping_step.png
tags: 프로그래머스 알고리즘 level3
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 2019년 카카오 개발자 겨울인턴십 문제 중 징검다리 건너기를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당문제는 카카오 2019년 개발자 겨울 인턴십 문제입니다. 문제를 보시려면 [여기](https://programmers.co.kr/learn/courses/30/lessons/64062)를 눌러서 확인해주세요 (저작권 문제 때문에 링크로 공유드립니다 😂)

### 풀이
 해당 문제를 읽어보면, 사람이 건널 때 마다 돌의 무게가 1씩 줄어드는 것을 알 수 있다. 돌의 무게가 0이 되면 건너지 못하고, 건너지 못하는 돌이 k가 됐을 때, 사람 수를 구하는 문제이다.

해당문제는 `이분탐색`을 활용하면 풀 수 있다. 우리가 이전에 풀어보았던 [입국심사](https://0xd00d00.github.io/2021/06/29/programmers_entry_test.html) 문제와 비슷한 유형이다.

조금만 생각해보면 비슷한 방법으로 풀이가 가능하다는 것을 알 수 있다!

### 접근과정
해당 문제를 처음 접근할 때, `for loop`를 활용하여 풀고 싶다는 생각이 많이 들
것이다. 하지만, 건널수 있는 사람수가 역 2억명이기 때문에 (int 자료형 기준) 시간
초과가 분명 날것이라는 직감도 가질 것이다. 그럼 어떻게 풀어야할까?

이후 든 생각은 "일정하게 줄어들고 최대 건너야하는 인원을 찾으면 되는거군" 이라는
생각과 이전에 풀었던 문제 "입국심사" 가 떠올랐다.

그렇다면, 이분탐색을 하기 위해 우리는 어떤 것을 기준으로 잡아야할까? (이부분에서
		많은 고민이 있게 된다.. 💀)

본인은 "돌의 무게 == 건너는 사람 수" 라고 생각했다. 따라서 돌의 무게를 기준으로
이분 탐색을 수행하고, 0이 아닌 돌을 한번에 K를 넘지 않고, 건너는 사람들의
최댓값을 추출했다.

![step](/assets/img/stepping_step.png)

위의 그림을 보면서 아래의 알고리즘 과정을 보자.

0. 돌의 무게 == 건너는 사람 수 기억해라!
1. 가장 무게가 작은돌과 무게가 많은 돌 추출
2. 돌의 무게 기준 이분 탐색 수행
3. 이분 탐색 값만큼 돌의 무게를 뺌
4. 무게가 0이 아닌 돌을 밟아봄
5. 0이 아닌 돌을 밟을 때 건너는 갯수가 K를 넘는지 확인
	5.1. 넘을 경우, 최대 무게를 줄여서 다시 이분 탐색
	5.2. 넘지 않을 경우, 최소 무게를 올려서 다시 수행
		5.2.1. 여기서 중요한 점, 넘지 않지만 최대값이 될 수 있기 때문에 정답에
		이분 탐색으로 구한 돌의 무게 (사람 수)를 담아둠.

*<span class="Tip">Tip</span>`5.2.1`에서 정답이 될 수 있는 이유는?*

우리는 돌의 무게를 올렸다 줄였다 하면서 이분탐색을 진행한다. 하지만, 문제에서
요구한 것은 K 를 한번에 넘지 못할 때 최대 인원 수를 구하는 것이기 때문이라는
점을 기억해야한다. 즉, 0이 아닌 돌을 밟을 때 K는 넘지 않을 경우 우리는 최적의
값을 찾기 위해 `이분 탐색`을 수행한다. 다음 수행하는 `이분탐색`에서 최적의 값이
나오리라 보장이 없기 때문에 값을 넣고 매 탐색마다 *최대값*을 갱신한다.

이해가 되지 않는 분들은 Appendix에 나와있는 주석과 함께 보면 좀 더 이해가 쉬울
것이다. (질문을 남겨도 됩니다! 😎)

### 소스코드
```cpp
#include <algorithm>
#include <string>
#include <vector>

using namespace std;

int solution(vector<int> stones, int k) {
    int answer = 0;

    int begin = *min_element(stones.begin(), stones.end());
    int end = *max_element(stones.begin(), stones.end());
    int mid;
    while (begin <= end) {
        mid = (begin + end) / 2;

        int skip_count = 0;
        int max_skip_count = 0;
        vector<int> tmp(stones);
        for (int i = 0; i < tmp.size(); i++) {
            tmp[i] -= mid;
            if (tmp[i] < 0)
                skip_count++;
            else
                skip_count = 0;
            max_skip_count = max(max_skip_count, skip_count);
        }

        if (max_skip_count < k) {
            answer = max(answer,mid);
            begin = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return answer;
}
```

### Appendix
```cpp
/****************
* 제한 사항
* 징검다리를 건너야 하는 니니즈 친구들의 수는 무제한 이라고 간주합니다.
* stones 배열의 크기는 1 이상 200,000 이하입니다.
* stones 배열 각 원소들의 값은 1 이상 200,000,000 이하인 자연수입니다.
* k는 1 이상 stones의 길이 이하인 자연수입니다.
*****************/

#include <algorithm>
#include <string>
#include <vector>

using namespace std;

/* 돌의 무게 == 건너는 사람 수 */
int solution(vector<int> stones, int k) {
    int answer = 0;
    /* 가장 큰 돌, 가장 작은 돌 구하기 */
    int begin = *min_element(stones.begin(), stones.end());
    int end = *max_element(stones.begin(), stones.end());

    int mid;
    /* 이분탐색 (초기값과 마지막 값이 역전되는 순간까지 돌아라) */
    while (begin <= end) {
        /* mid 값 뽑기.. 최적의 돌 뽑기 */
        mid = (begin + end) / 2;

        /* skip count는 현재 시점에서 돌을
           skip할 수 있는 갯수를 저장하는 변수 */
        int skip_count = 0;

        /* 최대 얼마나 돌을 skip 할 수 있는가? */
        int max_skip_count = 0;
        vector<int> tmp(stones);
        for (int i = 0; i < tmp.size(); i++) {
            /* 돌의 무게를 뺌 */
            tmp[i] -= mid;
            /* 0이 아닌 돌을 건너보자. */
            if (tmp[i] < 0)
                skip_count++;
            else
                skip_count = 0;
            /* 돌을 skip할 수 있는 최댓값 */
            max_skip_count = max(max_skip_count, skip_count);
        }

        /* 돌을 skip하는게 K 보다 작으면 */
        if (max_skip_count < k) {
            /* 우선 정답이 될 수 있으니 넣어둠
               (지금 시점이 최적값인지 몰라) */
            answer = max(answer,mid);
            begin = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return answer;
}
```

우선, 해당 문제를 설명으로 풀어내기가 굉장히 난감했다. 돌의 무게로 설명하자니
건너는 사람을 구하는 문제이고.. 진퇴양난이였다. 쉽게 생각하면 쉬운데.. 어렵게
생각하면 엄청 어려웠던 것 같다. 다시한번 풀어보면 좋을 문제이다.

꼭 `이분 탐색`과 같이 풀어보도록 하자.
