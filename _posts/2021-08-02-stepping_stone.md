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
것이다. 하지만, 건널수 있는 사람수가 약 2억명이기 때문에 (int 자료형 기준) 시간
초과가 분명 날것이라는 직감도 가질 것이다. 그럼 어떻게 풀어야할까?

우선, 문제를 분석해보자.

우리가 문제에서 주어진 조건은 두 가지이다. 돌의 무게 리스트와 한번에 건널 수 없는 K 라는 제약사항이다. 사람은 한번에 K개의 돌을 뛰어넘을 수 없다는 제약 조건이 있는 것이다.

또한, 제약사항을 생각해보면, 사람이 건널 때, 돌의 무게가 1씩 감소하는 것을 알 수 있다. 즉, 돌의 무게는 건너는 사람 수를 나타낸다고 볼 수 있다.

이를 조합해 생각해보면, 주어진 돌의 무게에서 K라는 제약사항을 벗어나 가장 많이 건널 수 있는 사람 수를 구하면 되는 것이다. *건너는 사람 수 == 돌의 무게* 라는 조건을 활용해 생각해보자면, 주어진 돌의 무게에서 K라는 제약사항을 벗어난 가장 최적의 돌의 무게를 탐색하면 되는 것이다.

보통 탐색이라고 하면 어려가지 기법이 존재하는데, 현재 문제에서는 "기준 (돌의 무게)"가 주어지고, 최대값과 최소값을 알 수 있기 때문에 `이분 탐색`이라는 방법을 활용하면 쉽게 풀 수 있다.

<span class="tip">Tip</span> 우리가 보통 이분 탐색을 하기 위해 기준을 잡아야하는데, *건너는 사람 수*로 생각하면 "기준"을 잡기가 어렵다. 예를들어, 돌에 건너는 사람수를 뺀다? 이걸 생각하기가 굉장히 난해 하다👿 따라서, 건너는 사람 수를 주어진 문제 조건에서 어떤 걸 "기준"으로 잡아야할지 늘 고민해야한다.

지금 문제에서는, "돌의 무게"가 주어졌으며, "건너는 사람 수 == 돌의무게"이기 때문에 가장 최적의 돌의 무게를 찾는 문제라고 생각하고 문제를 풀면된다.

*가장 최적의 돌의 무게를 구해보자.*

![step](/assets/img/stepping_step.png)

위의 그림과 같이, 인자로 돌의 무게를 전달받는다. 해당 돌의 무게에서 가장 많은 사람이 건널 수 있는 최적의 돌의 무게를 찾아보자.

알고리즘은 다음과 같다

1. 가장 무게가 작은돌과 무게가 많은 돌 추출
2. 돌의 무게 기준 이분 탐색 수행
3. 이분 탐색 값만큼 돌의 무게를 뺌
4. 무게가 0보다 큰 돌을 밟아봄
5. 0보다 큰 돌을 밟을 때 건너는 갯수가 K를 넘는지 확인
	* 넘을 경우, 최대 무게를 줄여서 다시 이분 탐색
	* 넘지 않을 경우, 최소 무게를 올려서 다시 수행
		* 5.2.1. 여기서 중요한 점, 넘지 않지만 최대값이 될 수 있기 때문에 정답에
		이분 탐색으로 구한 돌의 무게 (사람 수)를 담아둠.

위와 같은 방식으로 접근하면 된다.

해당 문제에서 좀 유심히 봐야할 점은, 그냥 `이분 탐색`만 돌려서는 문제가 풀리지 않는다는 점이다. `이분 탐색`을 하면서 *주어진 조건*을 만족하는지를 확인해야한다는 점이 중요하다. 알고리즘에서 보면, 0보다 큰 돌만 밟도록 하고, 0보다 작은 돌은 카운팅하는 것을 확인할 수 있다.

0보다 작은돌을 카운팅 하는 이유가 중요한 부분이다. 구체적으로, 현재 시점에 *가장 최적의 돌*을 구해 징검다리에 적용한다. 적용할 경우 0보다 작은 돌들이 등장하게 된다. 0보다 작다는 말은 해당 돌들은 건널 수 없다는 의미이다. 현재 시점의 징검다리에서 0보다 작은 돌이 연속해서 얼마나 나오는지를 계산하기 위해 카운팅을 한다.

카운팅 된 값은 *주어진 조건* K를 넘는지를 판단해야하는 중요한 데이터이다. 해당 비교를 통해 최적의 돌의 무게를 줄일지 늘릴지 판단한다.

K를 넘지않는 부분에 최적의 돌의 무게를 정답으로 담아두는 이유도 유심히 볼 필요가 있다. 사람은 K개를 한번에 넘지 못하기 때문에 연속해서 건너는 돌의 수가 K보다 적어야한다.

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

해당 문제는 설명이 굉장히 난감한 문제였다. 돌의 무게 == 건너는 사람 수라는 것을 생각해야되고, 돌에 건너는 사람 수를 뺀다는 말이 되게 어색하게 느껴졌다.

최적의 돌을 찾아 돌을 빼고, 연속해서 건널 수 있는 있는 돌이 K보다 적을 때 가장 큰 값이 정답인데.. 이걸 설명하기가 굉장히 난해하다 라는 생각이 들었다.

좀 더 문장을 구조화하는 연습을 하고, 누군가에게 설명하는 연습을 해보자.
