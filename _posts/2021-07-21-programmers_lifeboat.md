---
layout: post
author: doodoo
title: [프로그래머스][C++][고득점 Kit] 구명보트
subtitle: "고득점 kit의 구명보트 문제를 Greedy한 방식으로 풀어보자. 🔥"
date: 2021-07-21
cover: /assets/img/lifeboat.png
tags: 프로그래머스 알고리즘 고득점Kit
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 고득점 Kit 구명보트를 풀어봅시다.
🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 고득점 Kit의 Greedy 문제 중 구명보트라는 문제입니다. <br>
문제는 [링크](https://programmers.co.kr/learn/courses/30/lessons/42885) 로 공유드립니다. (저작권 문제가 있어서 링크 클릭 부탁드립니다. 🙇)

### 풀이
해당 문제는 `greedy`방식으로 문제를 풀 수 있다.

<span class="tip">greedy 방식</span> 내가 원하는 값들을 취하고 나머지 값은 버리는 방식이라고 우선 생각하자!

문제에서 2명밖에 못타고 가장 적은 구명보트를 움직이라고 제시했다. 따라서, 본인은 *무거운 사람 1명* 과 *가벼운 사람 1명* 을 태워서 내보내자. 라는 방식으로 문제를 해결하였다.

### 접근 방법
해당 문제는 조건만 잘 이해하면 금방 해결 할 수 있다.

- 한 번에 최대 2명씩 밖에 탈 수 없고
- 무게 제한
- 구명보트를 최대한 적게 사용하여 모든 사람을 구출

3가지 조건을 합쳐서 생각해보면, 무게 제한 내에서 2명 이하의 사람을 태우고 가장 적은 구명보트를 태워 나와야 한다는 것이다.

위와 같은 도출로 2명을 가지고 `limit`에 가장 적절하게 다가갈 수 있는 방법을 고민해야한다. 2명의 조합식은 다음과 같다.

1. 무거운 사람만 태우기 ❌
  - 무게가 얼마나 갈지 몰라, limit를 넘어 둘을 못 태울 수 있다.

2. 가벼운 사람만 태우기 ❌
  - 무게가 너무 가벼워, 더 태울 수 있는데 비효율 적이다.

3. 둘 다 태우기 🔵
  - 가장 적절한 대안이다.

해당 문제를 해결 하기 위해선, 아래와 같이 무게별로 정렬을 해야한다. 이후, 가우스의 덧셈을 하듯 가장 무거운 사람과, 가장 가벼운 사람을 더 해 `limit`를 넘어가는지 확인한다.

![lifeboat](/assets/img/lifeboat.png)

그림을 참고해서 보자. `limit`를 넘어갈 경우 가벼운 사람이 아닌 무거운 사람만 구명보트에 태워 보낸다. 가벼운 사람은 더 태울 수 있기 때문에 남겨두는 방식으로 해결한다. 만약 무거운 사람을 구명보트에 태운다면 begin을 증가시키고, 가벼운 사람을 태운다면 end를 증가시킨다. 정답에 가장 근사한 방법을 맞춰가는 방식 *greedy*한 방식으로 문제를 해결해보자.

### 소스코드
```cpp
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int solution(vector<int> people, int limit) {
    int answer = 0;
    int begin = 0;
    int end = people.size() - 1;
    sort(people.begin(), people.end(),greater<int>());

    while (begin <= end) {
        if (people[begin] + people[end] <= limit)
            end--;
        begin++;
        answer++;
    }
    return answer;
}
```

### Appendix
주석이 달린 코드이다.

```cpp
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int solution(vector<int> people, int limit) {
    int answer = 0;

    // 시작점
    int begin = 0;
    // 끝점
    int end = people.size() - 1;

    // 내림차순으로 가장 무거운 사람부터, 가장 가벼운사람 순으로 정렬
    sort(people.begin(), people.end(),greater<int>());

    // 시작점과 끝점이 바뀌는 상황은 모든 경우를 다 조사한 것.
    while (begin <= end) {

        // 무거운 사람 + 가벼운 사람 합계가 limit를 넘는지 확인하는 부분
        if (people[begin] + people[end] <= limit)
            end--;
        begin++;
        answer++;
    }
    return answer;
}
```

해당 문제에서 가장 중요한 점은 <span class="tip">문제를 잘 읽는 것</span>이다. 문제의 조건 중 2명만 구명보트에 탈 수 있다는 조건이 있다. 본인은 해당 조건을 잘 읽지 않아서 한참 헤맸다..😱

다른 문제를 풀거나, 혹시 잘 풀리지 않는 문제가 있다면.. 문제를 다시한번 천천히 읽어보자!
