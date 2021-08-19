---
layout: post
author: doodoo
title: "[프로그래머스][C++][연습문제] 가장 긴 팰린드롬"
subtitle: "level 3 가장 긴 팰린드롬을 풀어보자😎"
date: 2021-08-17
cover: /assets/img/palindrome.png
tags: 프로그래머스 알고리즘 level3
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 프로그래머스 가장 긴 팰린드롬 문제를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 프로그래머스 가장 긴 펠린드롬 문제입니다. 자세한 문제의 내용은 [여기](https://programmers.co.kr/learn/courses/30/lessons/12904#)를 클릭해주시기 바랍니다. (저작권 문제가 있어 부탁드립니다 🙇)

### 풀이
해당 문제는 `문자열 인덱스`를 활용해 풀었다.

### 접근방법
해당 문제는 접근 방법이 되게 간단하다.

![palindrome](/assets/img/palindrome.png)

위의 그림과 같이, 포인터를 움직여가며 `left`와 `right`의 글자가 동일한지 확인한다. 비교하는 글자가 하나라도 다를 경우 palindrome (팰린드롬) 형태가 아니라 판단하고, *포인터를 옮기기 전*의 글자 수 중 가장 긴 글자를 찾으면 된다.

해당 문제에서 핵심은 *펠린드롬을 찾는 방법을 구현 하는 것*과 *홀수 와 짝수 케이스*를 구별해 판단할 수 있는가이다.

*펠린드롬을 찾는 방법을 구현하는 것*을 못했다면 아래의 소스코드를 보고 이해하도록 하자. `isPalindrome()` 함수가 팰린드롬을 검사하는 함수이다. 해당 함수는 팰린드롬을 검사하고, 만약 팰린드롬이 아니면 전의 글자 수를 비교하도록 한다.

(모르면 하는 방법의 코드를 외우도록하자! 😇)

*홀수 와 짝수 케이스*를 구별하는 부분이 중요하다. 보통 팰린드롬을 떠올려보면, 가운대 꼭지가 있고 양 옆이 같으면 된다. 라고 떠올리기 쉽다.

예를들면, "토마토" 와 같이 "마"를 기준으로 "토"라는 글자가 동일하니 팰린드롬이다 라고 생각한다.

하지만, "토토"도 마찬가지로 팰린드롬이다. (본인은 이걸 생각하지 못했다.)

따라서, 홀수와 짝수의 경우를 나눠 팰린드롬을 구한 후, 둘 중 큰 값을 팰린드롬중 가장 긴 팰린드롬이라고 정답화했다.

### 소스코드
```cpp
#include <string>
#include <algorithm>
using namespace std;

int isPalindrome(string s, int left, int right) {
    while(left >= 0 && right < s.size()) {
        if (s[left] != s[right]) break;
        left--;
        right++;
    }
    return right - left - 1;
}

int solution(string s)
{
    int answer=0;
    for (int i = 0; i < s.length(); i++) {
        int odd = isPalindrome(s, i, i);
        int even = isPalindrome(s, i - 1, i);
        int is_max = max(odd, even);
        answer = max(answer, even);
    }
    return answer;
}
```

### Appendix
주석이 있는 코드

```cpp
#include <string>
#include <algorithm>
using namespace std;

// 팰린드롬 확인하는 코드
int isPalindrome(string s, int left, int right) {
		// 경계선을 기준으로 loop를 돈다.
    while(left >= 0 && right < s.size()) {
				// 너 팰린드롬이니?
        if (s[left] != s[right]) break;

				// 양옆으로 늘리기 위한 코드
        left--;
        right++;
    }
		// 문자열 길이 파악
		// 혹시 길이 파악이 되지 않는다면
		// 코드를 따라 ABABA를 디버깅 해보자.
    return right - left - 1;
}

int solution(string s)
{
    int answer=0;
    for (int i = 0; i < s.length(); i++) {
				// 홀수와 짝수 케이스
        int odd = isPalindrome(s, i, i);

				// 짝수는 하나 작게 시작하면 됨.
				// 이것도 그려보면 쉽게 이해할 수 있다.
        int even = isPalindrome(s, i - 1, i);
        int is_max = max(odd, even);

				// 가장 긴 팰린드롬 길이 찾기
        answer = max(answer, even);
    }
    return answer;
}
```

처음에 본인도 팰린드롬을 어떻게 구하지 생각했다. 몰라서 정답을 보기도하고, 보고 난 후 처음부터 다시 구현하기도 했다. 가장 중요한 것은 내가 몰랐던것을 알게 됐다는 *사실*이고, 복습을 통해 *내 것*으로 만드는 것이 중요하다.

문제를 풀기 어려웠던 사람은 최소 3번은 반복해서 외우길 바란다.
