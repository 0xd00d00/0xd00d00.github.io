---
layout: post
author: 널두
title: "[C++ Basic] 객체지향 프로그래밍 개념"
subtitle: "객체 지향의 기본 원리를 알아보자! 😁"
date: 2023-02-17
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 객체지향개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 객체지향 프로그래밍에서 중요한 *데이터 구조화*와 *멤버함수의 사용*에 대해서 알아보겠습니다.

### 데이터 구조화
아래의 코드는 복소수를 더할 수 있는 `Add()`를 생성하는 중의 코드이다. 여기서 `?` 로 표시된 부분에는 어떤 정보들이 들어가야할까?

코드를 이해하기 전, 우선 복소수의 개념을 알아야한다.

복소수는 *실수 와 허수*로 나뉘며, 실수부는 실수부대로 허수부는 허수부대로 각각 덧샘을 진행해야되는 프로그램을 만들어야한다.

```cpp
? Add(int xr, int xi, int yr, int yi)
{
  // 더한 값을 리턴?
}

int main()
{
  // *r = 실수부.
  // *i = 허수부.
  int ar = 1, ai = 1; // 1 + 1i
  int br = 2, bi = 2; // 2 + 2i

  Add(ar, ai, br, bi);
}
```

위의 코드와 같이, C언어에서는 리턴타입으로 오직 하나의 값만 전달해야된다. 하지만 복소수 같은 경우 값을 2개를 전달해야된다. 이럴 경우 어떤 방식을 활용해 문제를 해결해야될까?

우리가 이전에 배웠던 내용과 같이, 전달하는 파라미타에 값을 돌려 받고 싶다면 *Call by Pointer* 개념을 활용해 해결할 수 있다.

```cpp
void Add(int xr, int xi, int yr, int yi, /* 결과를 전달받기 위한 포인터 */ int* sr, int* si)
{
  // 값을 담아서 전달하면 됨.
  *sr = xr + yr;
  *si = xi + yi;
}

int main()
{
  // *r = 실수부.
  // *i = 허수부.
  int ar = 1, ai = 1; // 1 + 1i
  int br = 2, bi = 2; // 2 + 2i

  // 결과값을 전달받을 수 있는 변수
  int sr, si;

  // 주소를 넘겨라.
  Add(ar, ai, br, bi, &sr, &si);
}
```

위의 코드와 같이, 파라미타를 활용해 `Add()`를 구축할 수 있다.

현재 `Add()`에 전달되는 파리미타의 종류는 2가지이다.

1. in parameter = 전달을 위한 파라미타 <br>
2. out parameter = 결과 값을 전달받기 위한 파라미타

위와 같이 2 종류의 파라미터를 보낼 경우 처리가 가능하다.

하지만, 위 코드의 문제점은 *복잡하고 읽기 어려움*이 있고, 만약 복소수에 값이 하나가 추가 될 경우 함수 API를 전부 바꿔야하는 문제가 있다.

이런 문제가 왜 발생하는 것일까?

*복소수*는 하나의 타입인데, 이를 프로그래밍에서 표현할 수 있는 *primitive 타입*으로 *복소수 타입*을 만들려해서 발생하는 문제이다. 즉, 복소수에서는 실수부와 허수부를 나타낼 수 있어야 하는데, 프로그래밍에서 기본으로 제공되는 타입에는 복소수 타입이 없어, *int 2개*를 활용해 이를 처리하고자 한다.

![타입 설계](/assets/img/cpp_prime/make_type.png)

이런 문제를 해결하기 위해, 위 그림과 같이  *새로운 타입*을 만들어 처리하도록 하면 좀 더 간단하게 처리할 수 있다.
다수의 primitive가 필요한 경우 새로운 타입을 만드는게 중요하다! 그림에서 보이는 것 처럼 *Complex* / *Date* / *Person*과 같이 새로운 타입으로 만들 경우 다수의 primitive 타입을 하나로 묶을 수 있다. (우리 주민번호 등록증을 봐도 다양한 데이터들이 하나로 묶여있지 않던가..!)

C 언어에서도 새로운 타입을 만들 수 있는 *구조체 타입*이 존재한다.

#### 새로운 타입
C언어에서는 구조체 (새로운 데이터 타입 구성)를 활용하면 전달이 쉬워진다.

```cpp
struct Complex
{
  int re;
  int im;
};

Complex Add(Complex c1, Complex c2)
{
  Complex temp;

  temp.re = c1.re + c2.re;
  temp.im = c1.im + c2.im;

  return temp;
}

int main()
{
  Complex c1 = { 1,1 }; // 1 + 1i
  Complex c2 = { 2,2 }; // 2 + 2i

  Add(c1, c2);
}
```

위와 같이 새로운 복소수 타입 즉, 사용자 정의 타입 `Complex`를 생성한 후 사용할 경우 보기도 편하고, 데이터가 추가될 경우 API를 바꾸기 보다 `Complex` 데이터 타입에 추가하도록 할 수 있다.

위의 코드에서 `Add()`호출의 퍼포먼스를 향상시키고 싶다면 `const &`를 활용해 변경할 수 있다. 데이터를 참고용으로 사용하기 때문에 불필요한 복사로 인해 발생하는 성능적 이슈를 아래의 코드를 통해 제거할 수 있다.

```cpp

// Complex Add(Complex c1, Complex c2)
Complex Add(/* const & 로 변경*/const Complex& c1, const Complex& c2)
{
  Complex temp;

  temp.re = c1.re + c2.re;
  temp.im = c1.im + c2.im;

  return temp;
}
```

`Complex`라는 데이터 타입을 만들어 전달을 용이하게 했다. 더 나아가 생각해보자. `Add` 함수 같은 경우 `Complex`를 위한 동작아닌가? 그럼 `Complex`가 없으면 `Add`가 필요 없으니 해당 함수는 `Complex`에 의존되어져있다고 볼 수 있다.

그렇다면 같이 묶어서 관리하는게 좋지 않을까?

하지만... C언어의 *구조체*에서는 데이터만 담을 수 있고, 함수는 담을 수 없다. 이를 개선해 종속적 관계 즉, 데이터와 데이터 행위를 묶을 수 있도록 C++에서는 *클래스 (class)* 개념을 추가해 사용한다.

이후 포스팅을 통해 *class (클래스)를 활용*할 경우 기존 *구조체*보다 어떤점이 좋은지를 알아보도록 하자.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
