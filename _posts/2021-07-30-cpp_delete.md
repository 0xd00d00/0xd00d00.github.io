---
layout: post
author: doodoo
title: "[C++][Modern C++] C++ delete 연산"
subtitle: "C++11 에서 추가된 delete 연산을 알아보자😁"
date: 2021-07-30
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 C++11 추가된 delete 연산에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### C++11 delete function의 등장
C++11 문법 중 delete function 이라는 문법이 추가로 등장했다. 해당 문법은 언제 사용해야되며, 사용해야된다면 어떤 이유때문일까? 알아보자.

```cpp
#include <iostream>

using namespace std;

void foo(int n) {
  cout << "foo(int)" << endl;
}

int main() {
  foo(3.4); // foo(double형 타입)
}
```

*🗨 위의 코드를 보자.*

int 하나를 인자로 전달받는 `foo()`를 만들었다. `main()`에서 `foo()`를 호출하지만, 전달하는 인자값은 `dobule형 타입`의 "3.4"를 전달한다. 이런 경우 코드는 어떻게 동작할까? 흔히 알다시피, C++에서는 `double`을 `int`형으로 *형변환*한 후 컴파일을 수행한다. 이후 문제 없이 동작한다. 위의 코드를 실제 돌려보기바란다..😙

하지만, 이런 *암시적 형변환*은 추후 에러를 유발하고, 프로그래머에게는 독이 될 수 있다. 즉, 밤날 세서 찾았는데 결국 문제가 *형변환*이였다는 허탈함을 경험하게 될 것이다.

따라서, `int형 타입`인자를 전달받는 함수에 `double형 타입`을 전달할 때, 에러를 발생하게 해보자.

```cpp
...

void foo(int n) {
  cout << "foo(int)" << endl;
}

void foo(double n); // 선언만 하면됨

int main() {
  foo(3.4); // foo(double형 타입)
}
```

위와 같이, 에러를 유발하기 위해 `foo(double n);` 을 선언만 해둔다. 이럴 경우 `compiler` 입장에서 선언되어져 있는 것을 확인하고 컴파일은 통과시킨다. (구체적으로, 컴파일러 입장에서는 현재 선언이 있는 것을 보고 정의가 어딘가에는 있겠지 생각한다. 해당 파일에 없으면 외부에서 연결해주겠지 하고 역할을 넘겨버린다..😔) 결국, Linker에서 linking을 하는 과정에서 에러가 발생하게 된다.

```text
// 아래의 명령어를 실행할 경우
g++ test.cc -std=c++11
/tmp/ccFxgpgj.o: In function `main':
test.cc:(.text+0x4f): undefined reference to `foo(double)'
collect2: error: ld returned 1 exit status
```

위와 같이, 선어만 할경우 `double형 타입`을 전달할 때, 에러를 낼 순 있지만, 컴파일 타임이 아닌 링크타임에 에러를 발견한다. (에러는 빨리 알수록 좋다.) 일례로, 라이브러를 구축해서 누군가에게 전달할 때는 컴파일이 완료된 데이터를 넘긴다.

이후 사용자가 라이브러리를 사용하는데, *링크에러*를 만나게 되고, 결국 *형변환* 문제라는 것을 아주아주 시간을 쏟아야 알 수 있게 되는 문제가 있을 수도 있다.

따라서, 컴파일 에러로 변경하는 것이 좋으며, 이런 변경을 위해 C++11에서는 `delete function`을 새롭게 도입했다.

사용하는 문법은 간단하다.

```cpp
...

void foo(int n) {
  cout << "foo(int)" << endl;
}

// delete 라는 키워드를 적어주면됨
void foo(double n) = delete;

int main() {
  foo(3.4); // foo(double형 타입)
}
```

위의 `delete`키워드를 사용할 경우 *함수를 삭제* 해달라는 의미가 된다. 따라서, 컴파일러는 함수를 제거하고 만약 해당 함수를 호출할 경우 컴파일 에러를 유발한다.

`delete function`활용 부분을 알아보기 전에 아래의 내용은 꼭 기억하도록 하자!

❗ 함수를 제공하지 않을 때 => 함수 호출 시 인자가 변환 가능 타입을 가지는 동일이름의 다른 함수를 호출한다.

❗ 선언만 할 경 때 => 링크 에러를 유발한다

❗ `delete`를 사용할 때 => 컴파일 에러를 유발한다.

### delete 연산의 활용
함수삭제 `delete`를 사용하는 예시는 많이 존재한다. 일례로 윗 내용에서 다룬 *일반함수 제거*의 예시도 있으며, 추가로 2가지 예시를 더 보면서 `delete`에 대해 익혀보도록 하겠다.

*🌱 함수 템플릿에서 특정 요소 제거*

```cpp
#include <iostream>

template<typename T> void goo(T a) {
}

int main()
{
  goo(3.4);
}
```

위의 코드와 같이, `goo(3.4)`를 호출 할 경우 `goo` 같은 경우 template으로 구현되어져 있다. 따라서, `dobule 형 타입`의 `goo()`를 컴파일 타임에 만들어 실행이 정상적으로 될 것이다.

만약, `goo()`의 double 형 타입을 제거하고 싶을 땐 어떻게 해야할까? 이때 사용하는 것이 `delete`이다.

```cpp
#include <iostream>

template<typename T> void goo(T a) {
}

// 함수 템플릿 보다 일반함수를 우선시 함.
void goo(dobule) = delete;

int main()
{
  goo(3.4);
}
```

위와 같이, `goo(double) = delete`라고 적을 경우, C++의 특성상 *템플릿 보다 일반함수를 우선시 함* 이라는 특성이 있기 때문에 `goo()`의 함수가 불리지 않고 컴파일 에러가 발생할 것이다. 즉, 함수 템플릿의 특정 요소를 제거할 수 있을 것이다.

*🌱 복사 생성자 제거*

```cpp
class Mutex
{
public:

};

int main()
{
  Mutex m1;
  Mutex m2 = m1;
}
```

위의 예시코드를 확인해보자. 보통 `Mutex`는 자원을 독점해 사용하는 동기화 객체이다. 해당 객체는 복사가 되면 안된다. 위의 예시처럼 `Mutex m2 = m1`이라는 문법이 허용되면 안된다. 즉, 복사 생성자 및 복사 대입 연산자가 생성되면 안된다. 따라서, 우리는 복사 생성자와 복사 대입 연산자를 제거하기 위해 `delete`를 사용해야한다.

예전에는 `private`에 복사 생성자와 복사 대입 연산자를 넣어 테크닉 적으로 객체가 복사되는 것을 막았다. 좀 더 자세하게 알아보기 위해서는 [여기](https://0xd00d00.github.io/2021/07/31/effective_11.html)를 클릭해 보기 바란다.

따라서, 위의 코드에 `delete` 키워드를 적용해보자면 아래와 같다.

```cpp
class Mutex
{
public:
  Mutex(const Mutex& rhs) = delete;
  Mutex& operator=(const Mutex& rhs) = delete;
};

int main()
{
  Mutex m1;
  Mutex m2 = m1; // 컴파일 에러 발생
}
```

코드를 변경할 경우 컴파일 에러를 만날 수 있을 것이다. (꼭 테스트 돌려보면서 확인해보자!)

### delete 연산은 public에 두는게 맞나요? private에 두는게 맞나요?
`delete` 키워드를 사용하다보면 public에 두는 것이 맞는지 혹은 private에 두는게 맞는지 궁금할 때가 있다. 이럴경우 우리는 `public`에 둔다고 이야기해야한다.

`public`에 두는 이유는 단순하다. `private`에 둘 경우 옛날 구식의 컴파일러 중 일부는 `delete`연산으로 에러가 발생하는 것이 아니라 `private`영역에 뒀기 때문에 `private`영역에 접근관련한 에러메세지를 출력한다.

따라서, 접근권한자 `private`에 사용하는 것이 아닌 `public`에 사용해 `delete`에 의도를 명확하게 하는것이 올바른 코딩이라고 할 수 있다.

### Appendix
함수 삭제의 활용은 아래와 같다.
1. 일반함수 삭제
2. 함수 템플릿 만들 때 특정 타입에 대한 삭제
3. 멤버 함수 삭제 (e.g. 복사 생성자, 복사 대입 연산자)
4. 싱글톤, 복사 금지 스마트 포인터, mutex 등에 사용할 때

위의 경우의 수는 꼭 기억하고 `delete`연산을 활용하자
