---
layout  : wiki-post
author  : 널두
title   : "23년 BOJ 중급"
subtitle : 
date    : 2023-06-11 10:24:15 +0900
updated : 2023-07-15 18:39:20 +0900
---
* ToC
{:toc}

## 알고리즘 공부루틴
* 23년 6월 기준
  * 1시간 문제를 고민해 접근함
  * 문제를 풀었다면, 풀이를 보고 넘어감
  * 문제를 접근하지 못했다면
    * 아예 접근법 조차 정의하지 못할 경우, 30분 정도 더 고민
    * 코드 짜는걸 모르겠는 경우, 정답보기
  * 끝나고, 복습하기 => 다시풀기, 모르는 부분 찾아보거나 강의듣기

## 알고리즘 문제
### 부등호
* [문제링크](https://www.acmicpc.net/problem/2529)

어떤 케이스가 나올지 모르기 때문에, 모든 케이스를 고려해야함 -> brute force

필요한 자료구조.
1. 현재 숫자를 사용했는지에 대한 메모리공간 필요 -> 배열

알고리즘
* 순열방식으로 풀면 될 듯

1. 조건을 입력 받음.
2. 조건에 맞는 숫자를 하나 선택함.
3. 배열에 택한 숫자 체크함.
4. [1] 돌아가 테스트.

## 알고리즘 연습
알고리즘 실력향상을 위해 연습한 내용 로그입니다.

### 7월 15일
* 3문제 도전
  * 2문제 완료
    * 퇴사 / [14501](https://www.acmicpc.net/problem/14501)
    * 부분수열의 합 / [14225](https://www.acmicpc.net/problem/14225)
  * 1문제 다시 도전 필요
    * 가르침 / [1062](https://www.acmicpc.net/problem/1062)
      * 문제를 잘못 이해하고, 접근을 달리함.
* bitwise 구하는 방법

```cpp
// n = 3 이라고 가정할 때,
// 000, 001, 010, 011, 100, 101, 110, 111
// 비트를 만들어야함.
// 결국 n의 크기만큼 돌아야하고, 돌면서 0, 1을 구별해야함 그과정은 &연산자 활용
for (int i = 0; i < i << n; i++) {
  for (int j = 0; j < n; j++) {
    if (i & (1 << j)) {
      // 1 이라면..
    }
  }
}
```

* 복습완료 리스트
  * 부분수열의 합 / 완료

### 7월 14일
* 2문제 도전 (아직 성공하지는 못함..ㅠ) 
  * 스도미노쿠 / [4574](https://www.acmicpc.net/problem/4574)
    * 스도쿠와 비슷한데, 도미노 묶는 부분 추가해야함.
  * 퇴사 / [14501](https://www.acmicpc.net/problem/14501)
    * 재귀로 충분히 풀 수 있을만큼의 양.
    * 가능할 듯.
* 오늘 들었던 생각
  * 지금부터 푼 알고리즘 문제가 1000개가 된다면? => 전자책 발행가능.
  * 100개단위 회고 작성필요
  * 몇개정도 풀었을 때, 코테 통과하는지 전략작성
* 내일 다시 2문제 도전하고, 평일에 풀었지만, 찜찜한 부분 다시 정리 필요.

### 7월 13일
* 1문제 완료
  * 알파벳 / [1987](https://www.acmicpc.net/problem/1987)
  * 알게된 테크닉
    * [char - 'A'] 를 사용할 경우, 메모리 공간 절약가능
    * 2가지 풀이법.
    * cnt를 가져가거나, 재귀방식으로 풀거나
      * 재귀가 더 깔끔함.
    * 0,0 을 넣는 부분
      * 처음에, 이걸 어떻게 계산하지 했는데?
      * 왠걸.. 4 방향으로 움직이면, 0,1 시점에서 왼쪽으로 가면 0,0..

* cnt를 가져가는 코드

```cpp
void solve(int x, int y, int cnt) {
  if (cnt > ans) ans = cnt;

  for (int i = 0; i < 4; i++) {
    int new_x = x + dx[i];
    int new_y = y + dy[i];
    // 범위 안에 있고.
    if (new_x >= 0 && new_y >= 0 && new_x < R && new_y < C) {
      // false 일 경우, 한번도 방문 x
      if (!checked[P[new_x][new_y] - 'A']) {
        checked[P[new_x][new_y] - 'A'] = true;
        solve(new_x, new_y, cnt+1);
        checked[P[new_x][new_y] - 'A'] = false;
      }
    }
  }
}
```

* 재귀 형식으로 푸는 방법

```cpp
int solve(int x, int y) {
  int ans = 0;
  for (int i = 0; i < 4; i++) {
    int new_x = x + dx[i];
    int new_y = y + dy[i];
    // 범위 안에 있고.
    if (new_x >= 0 && new_y >= 0 && new_x < R && new_y < C) {
      // false 일 경우, 한번도 방문 x
      if (!checked[P[new_x][new_y] - 'A']) {
        checked[P[new_x][new_y] - 'A'] = true;
        int next = solve(new_x, new_y);
        if (ans < next) ans = next; 
        checked[P[new_x][new_y] - 'A'] = false;
      }
    }
  }

  return ans + 1;
}
```

### 7월 12일
* 1문제 완료
  * 스도쿠 / [1804](https://www.acmicpc.net/problem/1840)
  * back tracing
    * 백트레킹에 대한 오해
    * 무조건, 들어갔다가 나와야한다는 관념.
    * 그게 아니라 이 행위의 본질은 *가지치기*
    * 절대 안될 것 같은 경우를 *제외*하는 것에 초점.
      * N-Queen, 스도쿠 둘 다 제약사항 존재.
  * 행렬변환
    * 제외하기 가장 좋은 방법은 행렬 활용
    * 행렬 활용 시, 어떻게 값에 접근할까를 고민해봐야함.
    * 기억에 남는 코드

```cpp
int x = z / n; // 행
int y = z % n; // 열

// square 구하는 공식 => x * n + y;
```

* 복습하지 못했음
  * 🧠 업무 과중으로 복습일정 변경. 7월 15일까지 복습하기

### 7월 11일
* 1문제 완료 (7월 12일 복습)
  * N-Queen / [9663](https://www.acmicpc.net/problem/9663)
  * 유명한 문제임.
    * 2^n*n -> n^n -> n! 로 변경과정 복기
    * 배열활용 후 속도 개선
* ✅ 블로그 정리할 때 들어가면 좋은 부분

```cpp
bool check(int row, int col) {
  if (A[col])
    return false;

  if (B[row + col])
    return false;

  if (C[row-col+N])
    return false;

  return true;
}
```

### 7월 10일
* 3문제 완료 (7월 12일 복습)
  * 테트로미노 / 14500
    * BFS 시작점 체크
    * 모양 다른 것 나눠서
  * 두 동전 / 16197
    * 접근은 좋았음.
    * 재귀 넘기는 포인트 체크
    * brute force 부분, 많이해봐야 함.
  * 에너지 모으기 / 16198
    * enery summary 하는 부분에서 answer 나누는 부분 이해안됨.
    * 해당 부분 체크해볼 것.
    * 분할 정복 느낌
    * ✅ 블로그 정리할 때 넣으면 좋을 부분!

```cpp
int solve(vector<int>& a) {
  int size = a.size();
  if (size == 2) return 0;

  int ans = 0;
  int energy;
  for (int i = 1; i < size - 1; i++) {
    vector<int> b(a);
    energy = b[i-1] * b[i+1]
    b.erase(b.begin() + i);

    // 확인할 포인트
    energy += solve(b);

    if (ans < energy)
      ans = energy;
  }

  return ans;
}
```
