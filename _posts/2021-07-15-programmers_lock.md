---
layout: post
author: doodoo
title: "[프로그래머스][C++][KAKAO] 자물쇠와 열쇠"
subtitle: "야 너두 공부하면 카카오 갈 수 있어😎"
date: 2021-07-15
cover: /assets/img/cover_lock.png
tags: 프로그래머스 알고리즘 KAKAO
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 프로그래머스 문제 중 카카오 문제를 풀어 보겠습니다!

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span>버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 프로그래머스 2020 KAKAO Blind 테스트 중 자물쇠와 열쇠 문제입니다.<br>
문제는 [여기](https://programmers.co.kr/learn/courses/30/lessons/60059) 클릭해서 확인해주세요! (문제 저작권 보호차원 링크로 공유드립니다😟)

### 풀이
해당 문제는 `완전탐색` 문제이다. 자물쇠와 열쇠의 크기가 최대 20 사이즈를 갖기
때문에 처음부터 돌면서 탐색해도 문제가 없다고 해석 할 수 있다. 또한,
	해당문제에서 핵심은 <span class="tip">회전 구현</span> 과 <span class="tip">큰 사각형</span>을 생각해 낼 수 있느냐이다.
(본인 풀이 기준으로 생각한다.. 다른 방법이 있다면 적극 댓글을 남기자! 🙄)

### 접근과정
해당 문제는 <span class="tip">회전 구현</span> 과 <span class="tip">큰 사각형</span>을 생각해 내고 탐색을 하면 풀 수 있다.
(본인도 시간이 꽤 오래 걸렸다.. 너무 좌절하지 말길!)

문제에서 key를 회전하고 상하 좌우로 움직여 자물쇠가 모두 1이 되게 만들어라고
주문했다. 추가로, 열쇠는 자물쇠 밖으로 튀어 나가도 상관없으며 자물쇠가 1인
부분에 키를 넣으면 안된다고 했다. 해당 조건을 잘 생각하고 접근해보자.

*🌱 회전 구현*

회전을 구현하는 것은 일일히 돌려가며 인덱스를 잘 생각하면 된다. 아래의 그림을
보자.

![rotation](/assets/img/rotation.png)

본인이 실제 행렬을 돌려보며 점화식을 구했다. (만약 이 글을 보는 사람이 회전을
		잘 모른다면 실제 그려보며 인덱스를 생각해 보기 바란다. 한번만 하면 잊혀지지
		않는다. 👀) 구해본 결과 `[i][j] = [j][N-i-1]` 이라는 점화식이 구해졌다. N
같은 경우 행렬의 크기이다. 그리고 `-1`을 해준 이유는 보통 배열을 인덱스 0부터
시작하기 때문에 `-1`을 해줬다. 배열의 시작지점에 따라 이것은 있을 수도 없을 수도
있다. 본인의 판단에 따라 다르게 작동한다. 우리는 이 점화식을 이용해 문제에서
회전을 할 것이다.

회전하는 부분의 위치는 Appendix의 코드를 보고 확인하자.

*🌱 큰 사각형 도출*

사실 해당 문제의 핵심이라 생각한다. 해당 문제는 제약조건이 있으며, 가장 중요한
제약은 "자물쇠를 맞추는데 열쇠는 튀어나가도 됨"이다. 즉 아래의 그림과 같이
첫번째 자물쇠의 제일 끝 부분 부터 맞춰 나갈 수 있다는 점을 잘 봐야한다.
구체적으로, *키의
9부분 중 1부분만 맞아도 자물쇠가 열릴 수 있다는 점*이다. 따라서, 자물쇠 왼쪽
상단 부분과 오른쪽 하단 부분까지 키를 맞춰가며 찾아야한다.

![big square](/assets/img/BigSquare.png)

위의 그림에 해결 방법을 잘 묘사해두었다. 자물쇠 왼쪽 상단부터 키의 가장 마지막
부분을 넣어보면 자물쇠가 열리는지 확인하는 방법으로 문제를 해결했다.

*큰 사각형을 만든 이유는 ?🤔*

여기서 큰 사각형의 행렬을 만들어야하는 이유는 자물쇠에 키를 넣는 과정을 묘사하기 위해서이다. 여기서 키를 넣는다른 표현을 정리해야하는데, 키를 넣는다 는 말은 큰 사각형에 *더한다*는 의미이다. 일일히 큰 사각형에 더하고, 자물쇠의 위치의 값을 확인한다. 만약 자물쇠의 값 중 `1`이 아닌 부분이 있다면 키가 자물쇠에 잘 넣어지지 않았다는 의미이다.

큰 사각형을 만드는 방법도 그림을 그려보면 쉽게 알 수 있다. 자물쇠의 크기와 열쇠의 크기를 고려해 수식을 만들어보자. 그림을 그려보면, 큰 사각형의 넓이는 자물쇠의 왼쪽 상단 부터 오른쪽 상단까지 열쇠를 놓아 만들 수 있다. 그렇다면 아래와 같은 수식이 나온다.

(사진이 있으면 좋을 듯)

```text
BigSuareSize = 자물쇠 크기 + 2 * (열쇠크기 - 1)
```

`-1`은 열쇠를 자물쇠에 올렸다고 가정한 크기를 빼는 것이다. 해당 문제에서 자물쇠와 열쇠의 크기는 width와 height의 길이가 동일하기 때문에 `BigSquareSize`를 기준으로 width와 height로 큰 사각형을 만들면 된다.

위에서도 설명했지만, 제약 중 키는 자물쇠 위에 겹쳐 사용할 수 없다. 즉, 자물쇠의
빈 부분 `0` 만 `1`로 만들어야 한다는 것이다.

참고로, 본인은 해당부분을 구현할 때, *값에 의한 복사 (Call by value)*를 사용해
풀었다. 큰 사각형은 계속해서 돌려 써야하기 때문에 값에 의한 복사로 원본 값을
건드리지 않는 방법으로 풀었다.

반면에, 회전은 값을 바꿔야하기 때문에 *참조에 의한 복사 (Call by reference)*로
값을 넘겨줘 원본을 회전값으로 변경하였다.

### 소스코드
자세한 소스코드 설명에 대한 주석은 아래의 Appendix 를 참고하자!
```cpp
#include <string>
#include <vector>

using namespace std;

void rotate_key(vector<vector<int>>& key)
{
    vector<vector<int>> tmp_key(key);
    int n = key.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < key[i].size(); j++) {
            tmp_key[j][n -i -1] = key[i][j];
        }
    }
    key = tmp_key;
}

bool open_lock(vector<vector<int>> BSV, vector<vector<int>> key, int x, int y, int N) {
    for (int i = 0; i < key.size(); i++) {
        for (int j = 0; j < key.size(); j++) {
            BSV[x + i][y + j] += key[i][j];
        }
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (BSV[key.size() + i - 1][key.size() + j - 1] != 1) return false;
        }
    }
    return true;
}



bool solution(vector<vector<int>> key, vector<vector<int>> lock) {
    bool answer = false;
    int M = key.size();
    int N = lock.size();
    int BS = N + (2 * (M - 1));
    vector<vector<int>> BSV(BS, vector<int>(BS, 0));

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            BSV[M+i-1][M+j-1] = lock[i][j];
        }
    }

    for (int i = 0; i < 4; i++) {
        for (int i = 0; i <= BS - M ; i++) {
            for (int j = 0; j <= BS - M; j++) {
                if(open_lock(BSV, key, i, j, N)) return true;
            }
        }
        rotate_key(key);
    }

    return answer;
}
```

### Appendix
주석이 달린 소스코드이다.

```cpp
#include <string>
#include <vector>

using namespace std;

// rotation 하는 부분
// 원본 값을 바꾸기 위해 Call by reference 전달
void rotate_key(vector<vector<int>>& key)
{
    vector<vector<int>> tmp_key(key);
    int n = key.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < key[i].size(); j++) {
            // 회전 점화식
            // (X,Y) = (Y, N - X - 1);
            tmp_key[j][n -i -1] = key[i][j];
        }
    }
    key = tmp_key;
}

// 자물쇠 맞추는 부분
// Call by value 전달
// 큰 사각형의 값이 변경되면 안되요. -> 맞춰서 답만 확인해봐야합니다.
bool open_lock(vector<vector<int>> BSV, vector<vector<int>> key, int x, int y, int N) {
    for (int i = 0; i < key.size(); i++) {
        for (int j = 0; j < key.size(); j++) {
            BSV[x + i][y + j] += key[i][j];
        }
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (BSV[key.size() + i - 1][key.size() + j - 1] != 1) return false;
        }
    }
    return true;
}

bool solution(vector<vector<int>> key, vector<vector<int>> lock) {
    bool answer = false;
    int M = key.size();
    int N = lock.size();

    // 큰 사각형 만들기
    // 넓이 구하는 공식
    int BS = N + (2 * (M - 1));
    vector<vector<int>> BSV(BS, vector<int>(BS, 0));

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            BSV[M+i-1][M+j-1] = lock[i][j];
        }
    }

    // 경계선까지 도는 부분 확인 필요함
    // BS - M 까지 돌아야합니다.
    // 열쇠가 큰 사각형의 경계까지만
    for (int i = 0; i < 4; i++) {
        for (int i = 0; i <= BS - M ; i++) {
            for (int j = 0; j <= BS - M; j++) {
                if(open_lock(BSV, key, i, j, N)) return true;
            }
        }
        // 회전은 4번 돌아야함.
        rotate_key(key);
    }

    return answer;
}
```

해당 문제에서 배웠던 점을 3가지 이다.
1. index의 크기를 잘 고려하자.
  - index의 크기를 잘 고려하지 못해 계속해서 fail을 만났다. 상하좌우 제대로 움직이는지 케이스를 줄여서 확인해보는 습관을 갖자. 내가 맞다고 판단하니까 자꾸 틀리는 것 같다. 모든 것은 데이터로 확인해 증명하는 습관을 가져야한다.

2. <span class="tip">2차원 vector</span> 0으로 초기화
  - 처음에 2차원배열을 인자로 넘겨 BigSuqare를 비교해나갔다. 하지만 2차원 배열을 넘기는 것은 포인터로 넘기는 것이기 때문에 `call by pointer`로 전달되었다. 내가 원했던 것은 `call by value` 로 넘기는 것이다. 왜냐하면 BigSquare의 값이 변경되지 않는게 중요했다. 변경될 경우 내가 계속해서 값을 초기화 시켜줘야하는 문제가 있었기 때문이다. 어떻게 하지하다가 `Vector`를 `call by value` 로 넘겨주자 생각을 했다. 하지만, 2차원 vector를 어떻게 초기화하지? 라는 의문에 부딪혔고, 아래와 같이 초기화 하면 된다는 것을 알게 되었다.
  ```cpp
  // 2차원 vector 0으로 초기화 하는 방법
  // 1차원 vector를 0으로 초기화 한 것으로 재 초기화 하면 됨.
  // 그럼 모든 vector가 0으로 초기화됨.
  vector<vector<int>> BSV(BS, vector<int>(BS, 0));
  ```
3. rotation 하는 부분
- index를 돌려가며 그림을 그려보자. 그렇게 하면 알게 될 것이고, 알게됐다면 외우는 방향이 좋다. rotation문제는 많이 등장한다. 참고로 [여기]()의 프로그래머스 문제는 rotation만 활용해서 풀어야 되는 문제이다.
