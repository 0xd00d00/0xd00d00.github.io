---
layout: post
author: 널두
title: "[C++ Basic] This의 활용 / 주의사항"
subtitle: "C++ this pointer의 원리를 이해해보자! 🥸"
date: 2023-03-28
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ This 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *C++ this의 개념 / 활용 / 주의사항*에 대해 알아보겠습니다.

### This의 개념
아래의 코드를 보자.

```cpp
#include <iostream>

class Point
{
  int x = 0;
  int y = 0;
public:
  void set(int a, int b)
  {
    x = a;
    y = b;
  }
};

int main()
{
  Point p1;
  Point p2;

  p1.set(10,20);
}
```

위 코드 `p1`이 `set()`를 호출할 때, 어떻게 동작하는지 알아보자.

`Point` 객체를 생성할 경우 *멤버 데이터를 갖는 객체가 메모리에 2개*가 각각 생긴다. 하지만 우리가 사용하는 멤버 함수 같은 경우 객체 별로 생길까?

그렇지 않다. 멤버함수 같은 경우, 코드메모리에서 공용으로 사용하도록 해 *메모리 낭비*를 줄이도록 한다.

그렇다면 *공용으로 사용하는 멤버함수*에서 어떻게 내 객체가 `set()`를 호출할까?

*컴파일러의 도움*을 통해 구별한다.
컴파일러 같은 경우 `set()`를 아래와 같은 모양으로 변경하고, 객체가 사용할 경우 *1번째 인자값으로* 본인을 전달하도록 만든다.

```cpp
Point(Point* const this, int a, int b)
{
  x = a;
  y = b;
}

int main()
{
  Point p1;

  // p1.set(10,20);
  // 아래와 같이 변경..
  set(&p1, 10 ,20);
}
```

컴파일러는 함수형식으로 `Point` 객체를 전달해, 연관있는 멤버를 수정하도록 한다. 조금 더 자세하게 이야기하면 *함수의 호출*을 통한 것이 아닌 *레지스터를 통해* 값을 변경하지만, 우선 this라는 것이 있다는 점을 알아두자.

this가 내가 호출한 객체와 동일한지를 확인하기 위해서는 아래와 같이 출력해보면 된다.

```cpp
#include <iostream>

class Point
{
  int x = 0;
  int y = 0;
public:
  void set(int a, int b)
  {
    std::cout << "p1 == " << this << std::endl;
    x = a;
    y = b;
  }
};

int main()
{
  Point p1;
  Point p2;

  std::cout << &p1 << std::endl;
  p1.set(10,20);
}
```

위와 같이 출력해볼 경우 값이 모두 동일하다는 것을 알 수 있다.

그렇다면 이 `this` 포인터를 어디서 활용할까?

### This의 활용
#### 활용1
가장 간단하게 생각해볼 수 있는 활용방법은 아래와 같다.

```cpp
#include <iostream>

class Point
{
  int x = 0;
  int y = 0;

public:
  void set(int x, int y)
  {
    x = x;
    y = y;
  }
};

int main()
{
  Point p;
  p.set(10,20);
}
```

위와 같이 `set()`에서 동일한 이름을 활용할 경우 *이름 충돌*이 발생하게 된다. 그 때 `x` 같은 경우 멤버냐? 인자냐?를 고민하게 되는데, 보통 가장 가까운쪽을 따라간다.
멤버라고 지칭하기 위해서는 꼭  `this`를 활용해 `this->x`와 같이 구별할 수 있도록 해야한다.

`set()` 수정하면 아래와 같다.

```cpp
void set(int x, int y)
{
  this->x = x;
  this->y = y;
}
```

위와 같이 할 경우 *이름충돌* 발생하는 것을 막을 수 있고 *코드의 가독성*이 좋아진다.

#### 활용2
```cpp
class Test
{
  int data;

public:
  Test* foo() { return this; }
};

int main()
{
  Test t;

  t.foo()->foo()->foo();
}
```

위와 같이, `this`를 리턴할 수 있으며, 전달받은 객체를 통해 동일한 함수를 여러번 호출 할 수 있다.
또한 Pointer가 아닌 값으로도 리턴받을 수 있다.

```cpp
#include <iostream>

class Test
{
  int data;

public:
  Test* foo() { return this; }
  Test goo() { return *this; }
};

int main()
{
  Test t;

  t.foo()->foo()->foo();
  // (.) 연산자를 활용해 호출 가능
  t.goo().goo().goo();
}
```

주석과 같이 `.` 연산자를 활용해 연속적으로 동일한 함수를 호출할 수 있다. *여기서 중요한 점*은 goo() 호출할 때 전달받는 객체가 *동일한 객체*인지를 생각해봐야한다.

아래의 코드와 같이 `goo()`에 주소를 출력하는 로그를 추가하고 출력해보자.

```cpp
// 위 코드에서 goo()를 아래와 같이 변경해라.
Test goo() { 
  std::cout << "addr " << this << std::endl;
  return *this; 
}
```

위 코드를 넣고, 빌드해서 확인해보면 주소값이 *다르게 나오*는 것을 확인할 수 있다.

이를 해결하기 위해서는 *값 반환이 아닌 참조 (reference) 반환을 하면 된다*

우리가 앞서 *call by reference*를 공부할 때, *값으로 리턴할 경우, 임시객체를 반환* 한다고 배웠다. 이런 overhead 및 버그를 줄이고자 *reference를 활용* 했었다.
자세한 내용은 [여기](https://0xd00d00.github.io/2023/02/15/ecourse_basic_10_reference_4.html)를 클릭해 복습하기 바란다.

```cpp
// 값 반환이 아닌 *참조*로 반환해라
Test& goo() { 
  std::cout << "addr " << this << std::endl;
  return *this; 
}
```

위와 같이 소스코드를 변경해 확인해보자. 주소 값이 동일하게 출력되는 것을 확인할 수 있다.

그렇다면 이런 *연쇄적인 함수 호출 동작*을 통해 우리는 무엇을 할 수 있을까? 

우리가 흔히 사용하는 `cout` 혹은 `cin`과 같은 함수를 만들 수 있다.

```cpp
int main(){
  // << 연산을 하면서 분명 this를 참조로 반환하고 있을 것이다.
  cout << "A " << "B" << "C";
}
```

위 내용은 연산자 재정의에서 좀 더 자세하게 다루도록 한다.

### This 사용 시 주의사항
`this`를 활용할 때 주의해야될 점은 *static 연산*이다.

```cpp
class Test
{
  int data;
public:

  static void foo()
  {
    std::cout << this << std::endl;
  }
};

int main()
{
  Test t;
  t.foo();

  // 아래처럼도 사용가능.
  Test::foo();
}
```

위 코드 같은 경우 `foo()` 호출함에서 에러가 발생한다. 그 이유는 *static 연산 같은 경우 객체없이 동작*할 수 있기 때문에 `this`가 없을 수도 있다.

즉, *static*함수는 `main`에 작성된 것과 같이 `Test::foo()`라는 방식으로 호출할 수 있다. 앞서 설명한것과 같이,`foo(Test* this)` 라는 함수로 컴파일러가 변환할 경우  `this` 값을 전달할수 없다.

이런 모호함을 제거하기 위해 *static*에서는 `this`를 사용하지 못하게 했다. 또한 *static 멤버함수 내 멤버 데이터 접근*이 불가능하다. 보통 우리가 멤버데이터를 접근하기 위해서는 `this->data` 형식으로 변환해서 활용한다. (위에서 언급한 것 참고..!)

우리가 공식처럼 외웠던 *static 멤버함수 내에서는 static 데이터만 접근 가능하다* 라는 것이 바로 위와 같은 이유때문이라는 것을 이해하도록 하자!

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
