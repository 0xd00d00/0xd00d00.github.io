---
layout: post
author: doodoo
title: "[프로그래머스][C++][KAKAO] 튜플"
subtitle: "야 너두 카카오 정복할 수 있어! 💣"
date: 2021-08-22
cover: /assets/img/programmers_touple.png
tags: 프로그래머스 알고리즘 level2
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 카카오 문제를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 2019년 카카오 겨울 인터십 문제 중 튜플이라는 문제입니다. 문제의 자세한 내용은 [여기](https://programmers.co.kr/learn/courses/30/lessons/64065) 클릭해주세요! (저작권 문제로 양해 부탁드립니다 😵)

### 풀이
해당 문제는 `map`을 활용하여 해결했다.

### 접근과정
문제에서는 튜플을 포함하는 *집합*이 주어지고, 집합을 보고 어떤 튜플인지를 유출해야한다. 우선 튜플이 어떤 것이가가 문제에 잘 나와있는데, *셀수있는 수량의 순서있는 열거 또는 어떤 순서를 따르는 요소들의 모음을 튜플(tuple)*이라고 한다.

즉, 문제에서는 열거된 값들을 주어주고, 어떤 튜플인지 유추하는 것인데, 주어진 집합 값을 기반으로 문제를 다시 생각해보자.

예시에서는 \{\{2\}, \{2, 1\}, \{2, 1, 3\}, \{2, 1, 3, 4}\} 가 주어질 때, 유추할 수 있는 튜플은 {2, 1, 3, 4}라고 했다. 곰곰이 생각해보면, 튜플의 순서있는 열거를 따르는 요소의 모음이다. 집합의 열거를 보면, 무조건 `2` 이라는 첫번째 요소 부터 시작하고, 다음은 `1`이라는 요소 부터 시작하는 것을 볼 수 있다.

그렇다면, 집합의 열거되는 방법은 튜플의 원소 값의 순서를 따른다는 것을 알 수 있다. 즉, 2, 1, 3, 4 일경우 무조건 2 부터 시작하고 그다음은 1 다음은 3 다음은 4 형식으로 집합의 요소가 구축되어져야한다는 말이다.

집합의 요소가 해당 패턴을 따라 열거되어져야한다면 우리는 *개수* 기반으로 다시 생각해볼 수 있다.

즉, 2, 1, 3, 4 라는 튜플은 무조건 2부터 시작해야되기 때문에 2가 *4개*가 나와야하고, 1은 *3개* ... 4는 *1개*가 나온다는 것을 알 수 있다.

이를 활용해 문제를 풀어보자.

![touple](/assets/img/programmers_touple.png)

위의 그림은 예시를 들어 둔 것이며, 개수로 파악해 튜플을 찾는 과정을 그려두었다.

주어진 집합의 숫자와 개수를 파악하려면, 어떻게 접근하는 것이 좋을까?

바로 *map* 자료구조를 활용하면 된다.

`map` 자료구조를 활용해 집합의 요소별로 카운팅을 하도록 만들면 된다. 이후 카운팅 된 `value` 값 기반으로 *내림 차순*으로 정렬하게 된다면 그 값이 바로 *touple* 값이 되는 것이다.

<span class="tip">Tip</span> C++에서는 map에 sort 함수가 존재하지 않는다. 값을 넣을 때, 오름차순으로 넣을 건지 내림차순으로 넣을 건지 정할 순 있지만, 트리가 완성된 상태에서 정렬할 수 없다. 또한, 정렬된 값도 key 값 기준이라 value 값 정렬 기준을 할 수 없다. 따라서, value 기반 정렬을 위해서는 다른 방법을 사용해야하는데, 잘 모르는 분들은 [여기](https://0xd00d00.github.io/2021/08/22/map_value_reverse.html)를 클릭해 알아보자.

### 소스코드
```cpp
#include <algorithm>
#include <string>
#include <vector>
#include <map>

#define pp pair<int,int>

using namespace std;

bool cmp(const pp& a, const pp& b) {
	if (a.second == b.second) return a.first > b.first;
	return a.second > b.second;
}

vector<int> solution(string s) {
    vector<int> answer;
    map<int, int> m;

    string tmp;
    for (int i = 1; i < s.length() - 1; i++){
      if (s[i] != '{' && s[i] != '}' && s[i] != ',') {
        tmp += s[i];
        if (s[i+1] != ',' && s[i+1] != '}') continue;
        m[stoi(tmp)]++;
      }
      tmp = "";
    }

    vector<pp> vec( m.begin(), m.end() );
	sort(vec.begin(), vec.end(), cmp);

    for (auto num : vec)
      answer.emplace_back(num.first);

    return answer;
}
```

### Appendix
주석을 추가한 코드이다.

```cpp
#include <algorithm>
#include <string>
#include <vector>
#include <map>

// 귀차니즘을 피하기 위한 메크로
#define pp pair<int,int>

using namespace std;

// value 값을 비교하기 위한 사용자 정의 함수
bool cmp(const pp& a, const pp& b) {
	if (a.second == b.second) return a.first > b.first;
	return a.second > b.second;
}

vector<int> solution(string s) {
    vector<int> answer;
    map<int, int> m;

    string tmp;
    for (int i = 1; i < s.length() - 1; i++){
      if (s[i] != '{' && s[i] != '}' && s[i] != ',') {
        // 숫자일 경우
        tmp += s[i];

		// 10 이상의 수일 경우는 계속 숫자를 넣도록 함.
        if (s[i+1] != ',' && s[i+1] != '}') continue;

		// 카운팅
        m[stoi(tmp)]++;
      }
      tmp = "";
    }

	// value 기반 정렬
    vector<pp> vec( m.begin(), m.end() );
	sort(vec.begin(), vec.end(), cmp);

    for (auto num : vec)
      answer.emplace_back(num.first);

    return answer;
}
```

처음 문제를 풀때, 10이상의 수를 고려하지 않아 테스트 케이스가 몇개 틀렸다. 10이상의 수를 고려한다는 말은 현재 집합이 문자열로 들어오기 때문에 숫자 문자를 하나씩 뽑아 `tmp`에 저장한다. 하지만 111 같은 경우 `if (s[i+1] != ',' && s[i+1] != '}') continue;` 문법이 없다면 1, 1, 1 로 인식한다. 111로 인식하기 위해선 해당 코드를 추가해야한다!

