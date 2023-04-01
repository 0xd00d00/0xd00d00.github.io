---
layout: post
author: 널두
title: "[C++ Basic] Functor, 함수객체"
subtitle: "C++에서 사용하는 functor에 대해 알아보자 😉"
date: 2023-03-31
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 functor 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *C++ Functor*의 개념과 장점에 대해 알아보겠습니다.

### Functor란?
Functor란 함수객체이다.

객체를 함수처럼 사용할 수 있다는 뜻인데, 바로 *operator()() 연산자 재정의*를 통해 가능하다.
왜 사용하는지 어떤 장점이 있는지는 뒷부분에서 다루도록 하고, 우선 사용방법부터 보도록 하자.

Plus를 담당하는 Functor를 만들어보자.

```cpp
struct Plus
{
  int operator()(int a, int b)
  {
    return a + b;
  }
};

int main()
{
  Plus p;

  int n = p(1, 2); // 함수와 같은 모양
}
```

위 코드에서 보이는 것과 같이 `p(1, 2)` *함수를 호출하는 것처럼 객체를 사용하고 있다*

컴파일러 같은 경우 `Plus` 객체가 `()` 함수처럼 요청을 하게 될 경우 `operator()()`를 찾아서 호출한다.

그렇다면 Functor 즉, 함수객체를 왜 사용하는 것일까?

### Functor의 장점
Funtor의 장점은 2가지 정도 이야기 해 볼 수 있다.

*1. 일반함수보다 빠르다 (인라인 치환)*

*2. 상태를 가진 함수를 만들 수 있다*

*[1]* 같은 경우, 다양한 개념을 설명해야되서 중급과정에서 좀 더 자세하게 다루도록 한다. *[2]* 장점을 아래의 코드와 설명을 통해 알아보자.

우리가 흔히 `+` 기능을 하는 함수를 만든다고 해보자.

```cpp
int plus(int a, int b)
{
  return a + b;
}
```

위와 같이 만들 경우, `plus` 함수는 오직 *덧셈동작만 가능*하다. 만약 Functor로 만들경우, `base` 값을 둬, base 기반의 계산도 가능하다.

```cpp
struct Plus
{
  int base;

  // 기본 base는 0
  Plus(int n = 0) : base(n) {}

  int operator()(int a, int b)
  {
    // 사용자가 덧셈을 수행하면서 base추가 가능.
    return base + a + b;
  }
}
```

위 코드와 같이 `base`를 두고, 사용자가 직접 base 기반의 덧셈도 가능하게 만들어준다. 내부적 상태를 외부에서 변경할 수 있다는 장점이 있다.

그럼 이런 질문을 해 볼 수 있다. "아니.. static 연산자 활용하면 base 만들 수 있는데.."

```cpp
int plus(int a, int b)
{
  static int base = 10;
  return base + a + b;
}
```

위 함수 같은 경우 base를 한번 만들면, 값 변경이 불가능하다. `Plus 객체`라면 API를 하나 더 만들어 (e.g. `reCalculateBase()`) base 값을 수정할 수 있도록 할 수 있다.

*속도도 빠르고* / *상태 값을 가지니* Functor는 굉장히 유효하다. 이를 C++ 표준에서도 알고 표준화 작업을 진행했으며, Funtor를 표준으로 사용할수도 있다.

### 표준 Functor
우리가 Functor를 만들어 사용하기 위해서는 type별로 만들어 가지고 있어야한다. 예를들면 `Plus` Functor 같은경우 `int`, `double`등 다양한 타입에 대응할 수 있어야한다.

이 떄 사용하는게 바로 *템플릿이다*

```cpp
template<typename T> struct Plus
{
  T operator()(T a, T b)
  {
    return a + b;
  }
};

int main()
{
  Plus<int>p;

  int n = p(1,2);
}
```

위와 같이 Template을 활용하면 동일한 코드를 반복적으로 작성할 필요가 없다. (앞 포스팅에서 Template 찍먹을 해봤으니, 혹시 잘 모르겠으면 [여기](https://0xd00d00.github.io/2023/02/12/ecourse_basic_7_function_2.html)를 클릭해보자.)

C++ 표준에는 어떤 방식을 제공하고 있을까?

`functional` 이라는 헤더파일을 통해 제공하고 있으며, 다양한 Functor들이 있다.

```cpp
#include <functional>

int main()
{
  std::plus<int> p;
  int n = p(1,2);
}
```

위 코드와 같이 우리가 만든 `Plus`도 `std::plus` (표준은 소문자이다) 라는 Functor가 존재한다. 이외에도 다양한 Functor들이 있는데 (e.g. less, minus, greater등) 정말 많은 함수객체가 존재한다.

이를 알아보고 싶다면 [Cpp Reference 사이트](https://en.cppreference.com/w/cpp/header/functional)를 통해 참고해보자.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
