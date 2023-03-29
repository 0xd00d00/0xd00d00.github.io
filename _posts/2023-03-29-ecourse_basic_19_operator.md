---
layout: post
author: 널두
title: "[C++ Basic] C++ 연산자 재정의 / 주의사항"
subtitle: "연산자 재정의 개념과 주의사항을 알아보자! 😯"
date: 2023-03-29
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 연산자 재정의에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *연산자 재정의 개념과 방법* / *주의사항* 에 대해 알아보겠습니다.

### 연산자 재정의 개념과 방법
사용자 정의 타입으로 덧셈 연산을 수행하면 어떻게 될까?

```cpp
#include <iostream>

class Complex
{
  int re, im;

public:
  Complex(int r = 0, int i = 0) : re(r), im(i) {}

  void print() const
  {
    std::cout << re << ", " << im << std::endl;
  }
};

int main()
{
  int n = 3 + 4; // 덧셈 연산

  Complex c1(1,1);
  Complex c2(2,2);

  // 이 연산이 수행될까??????????/
  Complex c3 = c1 + c2;
}
```

위 코드를 수행하면 *컴파일 에러* 발생한다. 그 이유는 `Complex c3 = c1 + c2`를 컴파일러가 어떻게 해야될지 모르기 때문이다.

보통 primitve 타입으로 `a + b`를 수행할 경우 덧셈 연산을 수행한다.
하지만, 사용자 정의 타입 (객체)를 활용할 경우 덧셈을 수행할 수 없다. 이 경우 컴파일러는 아래와 같은 함수를 찾아본다. 만약 해당 함수가 있다면, 활용해 덧셈연산을 수행한다.

```cpp
// 컴파일러가 사용자 정의 타입 덧셈을 수행할 때 찾는 함수
Complex c3 = c1 + c2;

// 위 코드 수행시 아래와 같은 함수를 찾는다
c1.operator+(c2);
operator+(c1,c2);
```

우리는 위와 같은 함수를 `+` 즉, 연산자라고 부르고, 사용자 정의 타입에 따라 덧셈 방식이 다르기 때문에 *연산자를 재정의해서 사용하도록* 한다. 이를 C++에서는 연산자 재정의라고 부른다.

C++에는 다양한 연산자가 존재하는데, 뒷 부분에서 자세하게 다루도록 하고 해당 포스팅에서는 `+` 연산자 위주로 설명한다.

`c1.operator+(c2);` 해당 연산자 재정의 같은 경우, *사용자 정의 타입의 함수를 호출*하기 때문에 *멤버함수 연산자 재정의*라고 부른다.

`operator+(c1, c2)` 해당 연산자 재정의 같은 경우, *일반함수 연산자 재정의*라고 부른다.

우선순위 같은 경우 *멤버함수 연산자 재정의*가 더 높다. (보통 연관성이 높을 수록 우선순위가 높다!)

2가지 재정의 방법에 대해 알아보자.

#### 멤버함수 연산자 재정의
```cpp
#include <iostream>

class Complex
{
  int re, im;

public:
  Complex(int r = 0, int i = 0) : re(r), im(i) {}

  void print() const
  {
    std::cout << re << ", " << im << std::endl;
  }

  // return 값으로 class를 전달해야 대입이 가능하다.
  Complex operator+(const Complex& c)
  {
    Complex temp( re + c.re, im + c.im );
    return temp;
  }
};

int main()
{
  Complex c1(1,1);
  Complex c2(2,2);

  // 멤버함수 연산자 재정의된 함수를 호출함.
  Complex c3 = c1 + c2;

  c3.print();
}
```

위와 같이 멤버함수 내 `operator+()`를 재정의하면 된다. 해당 함수의 인자로는 동일한 타입을 전달받아 처리하도록 한다. (꼭 동일한 타입을 받을 필요는 없다. 뒷 부분에 자세히 나옴.) 이때, 값 변경 자체가 없고 overhead를 줄이기 위해 `const &`를 통해 전달받는다.

*멤버함수 내 operator()* 사용하기 때문에 인자는 *하나만 전달*하면 된다. 내부적으로 `this`를 활용해 내부 데이터를 알 수 있고, 전달받은 값을 추가로 더하면 되는 것이기 떄문에 값은 *오직 하나만* 전달하면 된다.

return 값 같은 경우 *대입*을 추가로 해야되기 때문에 값으로 전달한다.

함수 내부에서는 사용자가 원하는대로 작성하면 되는데, 보통 임시객체 하나 만들어서 더하고 해당 객체를 반환하는 방식으로 사용한다.

#### 일반함수 연산자 재정의
```cpp
class Complex
{
  int re, im;

public:
  Complex(int r = 0, int i = 0) : re(r), im(i) {}

  void print() const
  {
    std::cout << re << ", " << im << std::endl;
  }
  // getter를 만들거나 friend로 함수를 등록해줘야함.
  // 이거 없으면 외부에서 접근 불가능해서 에러남.
  friend Complex operator+(const Complex& c1,
                           const Complex& c2);
};

Complex operator+(const Complex& c1, const Complex& c2)
{
  Complex temp(c1.re + c2. re, c1.im + c2.im);
  return temp;
}

int main()
{
  Complex c1(1,1);
  Complex c2(2,2);

  // 일반함수 연산자 재정의된 함수를 호출함.
  Complex c3 = c1 + c2;

  c3.print();
}
```

위와 같이 *일반함수 연산자 재정의* 같은 경우 외부함수로 등록하면 된다. 멤버함수 재정의와 달리, *인자가 2개 전달되어야*한다는 점을 기억하자.

*일반함수 연산자 재정의*에서 중요한 점은 외부에서 내부 데이터가 접근이 불가능하다는 점이다. `Complex` 내부의 `re`, `im` 데이터에 접근이 불가능하기 때문에 값을 더하기 위해서는 값을 전달받는 *getter()*를 만들거나 *friend* 함수로 등록을 해야된다.

보통 `friend` 함수로 등록을 해서 사용하니, 기억하도록 하자.

2가지 재정의 방법을 알아보았다. 뒷 부분에서 다른 연산자들을 재정의하면서 조금 더 자세히 알아보도록 한다.
다른 연산자들을 알아보기 전 *연산자 재정의 주의사항*에 대해 먼저 알아보고 넘어가도록 하자.

### 연산자 재정의 주의사항
몇 가지 주의사항이 있다. 천천히 보도록 하자.

*1. 인자가 모두 primitive 타입인 경우 overloading 불가능*

```cpp
int operator+(int a, int b)
{
  return a - b;
}
```

위와 같이 인자가 모두 primitive 타입일 경우 `+`을 구현해두고 `-`으로 변경하는 기묘한 상황이 발생할 수 있다. 법칙으로 정해진 논리를 깰 수 있기 때문에 인자가 하나는 반드시 *사용자 정의 타입*이어야한다.

```cpp
Complex operator(const Complex& c, int n)
{
  // 요건 가능하다.
}
```

*2. 모든 연산자가 다 overloading 되는 건 아니다*

`.`, `*`, `?:`, `sizeof`, `typeid`, `static_cast`, `dynamic_cast`, `reinterpret_cast`, `const_cast` 는 재정의가 불가능하다.

*C++20 부터*는 `.` operator는 재정의가 가능하다는 점을 알아두자.

*3. 멤버함수와 일반함수 재정의를 모두 제공할 경우 "멤버함수가 우선적" 이다.*

*4. 첫번째 인자가 사용자정의 타입이 아닌 경우 "일반 함수만 가능" 하다*

```cpp
int main()
{
  Complex c1;
  Complex c2 = 1 + c1;
  // 위와 같이 사용할 경우.
  // 1.operator+(c1)은 불가능함.
  // 오직 operator+(int, complex) 형식으로 호출만 가능함.
}
```

위의 주석에서 적은것과 같이 *첫 번째 인자가 primitive* 타입일 경우 멤버함수를 만들 수 없기 때문에 *오직 일반함수 연산자 재정의만 호출가능하다

*5. 멤버함수만 사용할 수 있는 연산자 재정의가 존재한다*

`=` `()` `[]` `->` 와 같은 경우 *오직 멤버함수 연산자 재정의*만 가능하다

*6. 새로운 연산자를 만들거나 인자의 개수를 변경하거나 연산자 우선순위를 변경할 수 없다*

- (e.g.) 더하기는 2개의 인자를 받아서 하는데 3개의 인자를 받도록 한다는 건 안됨!!
- (e.g.) + 연산자인데 내 마음대로 +* 연산자를 만들어 재정의 하는 것 안됨!!

*7. 디폴트 파라메타 사용 불가능하다*

```cpp
Complex operator+(const Complex& c, int n = 10)
{

}
```

위와 같이 정의 되어있을 경우 `c.operator+()` 이런 형식은 안됨. 즉, `c1 + (생략불가!!)` 형태는 사용불가능하다는 점을 기억하자.

### Outro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
