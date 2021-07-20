---
layout: post
author: doodoo
title: "[프로그래머스][C++][KAKAO] 숫자 문자열과 영단어"
subtitle: "카카오 문제를 풀어보자. 두려워 하지마라. 할 수 있다! 😁"
date: 2021-07-20
cover: /assets/img/change_num_to_str.png
tags: 프로그래머스 알고리즘 KAKAO
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 *숫자 문자열과 영단어* 문제를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 2021 카카오 채용 연계형 문제 중 숫자 문자열과 영단어 문제입니다.<br>
문제를 보시려면 [여기](https://programmers.co.kr/learn/courses/30/lessons/81301)를 클릭해주세요! (저작권 문제로 링크로 공유드립니다.)

### 풀이
해당 문제는 문자열 함수 중 `substr()` 과 `compare()` 함수를 활용하여 풀었다.

level 1번 문제라 생각의 전환만 잘 한다면 누구나 풀 수 있다고 생각한다. (카카오라 두려워 하지마시오!! 🤐)

### 접근과정
아래의 그림을 통해 접근과정을 확인해보자.

![wordtonumber](/assets/img/change_num_to_str.png)

해당 문제에서는 위의 그림과 같이, `23four5six7` 와 같은 문자가 주어졌을 때, 영어로 된 부분을 *숫자* 로 변환 후 출력하는 문제이다.

해당 문제에서 핵심은 <span class="tip">숫자로된 영단어를 구별</span> 할 수 있느냐이다. 영단어를 어떻게 구별할지 생각해보면, *앞의 2자리*만 참고해 어떤 숫자인지 판별해 변환해주면 문제가 해결 될 수 있다.

예를들어, two와 three를 찾아보자. 만약 1 자리만 비교하게 된다면 `t`로 구별할 수 없을 것이다. 하지만, 2 자리로 비교 할 경우 `tw` 는 2이고, `th`는 3이다 라고 구별할 수 있을 것이다.

본인은 해당 기법을 적용해 두 가지 방법으로 문제를 풀었다.

🌱 첫 번째 방법은 원시적 방법으로 `if else`문을 모든 케이스로 구별하고 푸는 방법이다.

🌱 두 번째 방법은 `if else` 문을 줄여 코드의 깔끔성을 위해 `for loop`로 해결한 방법이다.

두 번째 방법에 대해 조금 자세하게 설명해보자면, `zero` 부터 `nine`까지 10개의 문자열 배열을 만든다. 문자열 배열이 0부터 9까지 시작하기 때문에 `index`와 `영어 문자열이` 문제의 표와 같이 접근 가능하게 된다. 아래의 코드를 참고하자.

```cpp
string numbers[10] = { "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"};
```

그리고 인자로 전달받은 문자를 순회 하면서 현재 문자가 숫자인지 판별한다. 만약 숫자가 아니라면, 아래의 코드와 같이 `for loop`를 순회한다. 순회할 때, 초점은 `j`의 인덱스이다. `j`의 시작이 `3`이고, 끝이 `5`이다. 왜냐하면 `numbers`의 배열에 들어간 영어로된 숫자의 가장 짧은 길이가 `3`, 가장 긴 길이가 `5` 이기 때문이다.

따라서, 인자로 전달받은 문자를 `substr(s, 3 or 4 or 5)`로 잘라보며, 해당 문자와 `numbers` 배열 내 존재하는 문자들 중 같은 것이 있는지 확인해 만약 같은 것이 있다면 *답에 추가* 하고 *인덱스 증가* 시켜준다.

인덱스를 증가시켜주는 이유는 전달받은 문자를 하나씩 비교하기 때문이다.

구체적으로, zero라는 문자는 z를 비교할 때, `substr(s, 4)`로 *zero*라는 문자를 추출할 수 있다. 이후 `numbers`와 비교하고, `zero`라는 문자는 전달받은 문자열 `s` 에서 제거해줘야한다. 실제 제거하지 않고 *인덱스를 증가* 시키는 방법으로 *제거하는 효과* 를 내는 것이다.

해당 설명한 부분을 소스코드로 확인해보자.

```cpp
 for (int i = 0; i < s.size(); i++) {

        // 숫자 인지 검사하는 부분
        char isNumber = s[i] - '0';
        if (isNumber >= 0 && isNumber < 10) {
            answer += s[i];
            continue;
        }

        // 해당 flag는 2중 for loop를 빠져나가기 위한 트릭이다.
        bool check_flag = false;

        // 문자열 사이즈 최소 3, 최대 5
        for (int j = 3; j <= 5; j++) {
            // 떼어본다.
            string changeStr = s.substr(i,j);

            // 동일한 문자열 있는지 돌면서 확인
            for (int k = 0; k < 10; k++) {
                if (! changeStr.compare(numbers[k])) {
                    i += (numbers[k].size() - 1);
                    answer += '0' + k;
                    check_flag = true;
                }
            }
            if (check_flag) break;
        }
```

### 소스코드
소스 코드는 두가지 버전으로 제공한다.

*🌱 첫 번째 방법은 `if else` 사용*


```cpp
#include <vector>
#include <string>

using namespace std;

int solution(string s) {

    string answer;

    for (int i = 0; i < s.size(); i++) {
        char isNumber = s[i] - '0';
        if (isNumber >= 0 && isNumber < 10) {
            answer += s[i];
            continue;
        }

        string changeStr = s.substr(i, 2);
        if (!changeStr.compare("ze")) {
            i += 3;
            answer += '0';
        } else if (!changeStr.compare("on")) {
            i += 2;
            answer += '1';
        } else if (!changeStr.compare("tw")) {
            i += 2;
            answer += '2';
        } else if (!changeStr.compare("th")) {
            i += 4;
            answer += '3';
        } else if (!changeStr.compare("fo")) {
            i += 3;
            answer += '4';
        } else if (!changeStr.compare("fi")) {
            i += 3;
            answer += '5';
        } else if (!changeStr.compare("si")) {
            i += 2;
            answer += '6';
        } else if (!changeStr.compare("se")) {
            i += 4;
            answer += '7';
        } else if (!changeStr.compare("ei")) {
            i += 4;
            answer += '8';
        } else if (!changeStr.compare("ni")) {
            i += 3;
            answer += '9';
        }
    }

    return stoi(answer);
}
```

*🌱 두 번째 방법은 `for loop` 사용*

```cpp
#include <vector>
#include <string>

using namespace std;

int solution(string s) {

    string numbers[10] = { "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"};
    string answer;

    for (int i = 0; i < s.size(); i++) {
        char isNumber = s[i] - '0';
        if (isNumber >= 0 && isNumber < 10) {
            answer += s[i];
            continue;
        }
        bool check_flag = false;
        for (int j = 3; j <= 5; j++) {
            string changeStr = s.substr(i,j);

            for (int k = 0; k < 10; k++) {
                if (! changeStr.compare(numbers[k])) {
                    i += (numbers[k].size() - 1);
                    answer += '0' + k;
                    check_flag = true;
                }
            }
            if (check_flag) break;
        }
    }

    return stoi(answer);
}
```

### Appendix
문제가 아주 어렵지는 않아, 주석 코드는 생략하고자 한다.

(모든 사람이 동일한 지식 수준을 갖고 있다고 생각하지 않는다. 본인도 모르는 부분이 많다. 혹시, 필요하다면 과감하게 댓글에 모르는 부분을 적어 물어보자! 😸)

해당 문제는 <span class="tip">if else 사용 풀이</span> 와 <span class="tip">for loop 사용 풀이</span> 어느 것으로 풀어도 상관없다. 코드상 길이가 짧아 진다 정도지, 데이터 그렇게 많지않아 효율성을 따질 문제는 아닌 것 같다. 그냥 방향을 두 가지로 생각해 볼 수 있다 정도로만 이해하고, 핵심인 `substr()` 사용과 `문자 2자리 비교` 만 기억하자.
