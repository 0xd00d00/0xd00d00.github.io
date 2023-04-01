---
layout: post
author: 널두
title: "[C++ Basic] 대입연산자 재정의 구현"
subtitle: "대입연산자를 재정의해보자! 😁"
date: 2023-04-01
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 대입 연산자 재정의 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
오늘 포스팅에서는 *대입연산자 재정의*에 대해 알아보겠습니다.

### 대입연산자란?
우선 사람들이 많이 햇갈려 하는 부분을 알아보자.

```cpp
class Point
{
  //...
};

int main()
{
  Point p1(2,2); // p1을 만듬.
  Point p2 = p1; // p2를 만들기 위한
                 // 복사 생성자.

  Point p3(3,3); // p3을 만듬.
  Point p4(4,4); // p4을 만듬.

  p3 = p4;
}
```

위와 같이 있을 때, `Point p2 = p1;` 동작과 `p3 = p4;` 동작이 동일한 것 같다고 생각한다. *하지만!!!* 전혀 다르다. `Point p2 = p1;` 같은 경우 *생성하면서 복사하는* 동작 즉, *복사 생성자*를 호출하는 동작이다.

`p3 = p4;` 동작같은 경우 *이미 만들어진 객체에 대입하는 동작* 즉, *대입 연산자*를 호출하는 동작이다.

두 개는 다른 동작이고, *객체가 만들어지면서 수행되는 동작인지에 따라 구별* 된다.

그럼 이제부터 *대입연산자의 재정의*에 대해 알아보자.

```cpp
class Point
{
  int x, y;

public:
  Point(int a = 0, int b = 0) : x(a), y(b) {}

  void print() const
  {
    std::cout << x << ", " << y << std::endl;
  }
};

int main()
{
  Point p1(1,1);
  Point p2(2,2);

  // p1+p2;
  p1=p2;

  p1.print();
}
```

위 코드에서, 우리는 앞서 배운 개념을 통해  `p1+p2`를 할 경우 어떤 동작이 일어날지 알고 있다. 해당 동작을 수행할 경우 *사용자 정의 타입의 + 연산으로* 사용자가 정의한 `opeartor+()`을 부를 것이다.

하지만, 현재 `Point`에는 `opeartor+()`가 정의 되어있지않아 분명 *에러가 발생*할 것이다.

이를 주석처리하고, 아래의 `p1 = p2;`는 어떨까?

이것도 `+`연산을 고려해봤을 때, 사용자 정의 타입의 `=` 이기 떄문에 분명 사용자 정의 타입의 `perator=()`연산이 불릴 것이다. 그렇다면 동일하게 *에러가 발생해야되는데..* 해당 코드는 잘 동작할 것이다.

그말인 즉, *컴파일러가 만들지 않을 경우 제공* 해준다 즉, 우리가 앞서 배웠던 *생성자* / *소멸자*와 같이 디폴트로 컴파일러가 직접만들어주는 것 처럼 *대입연산자*도 직접 컴파일러가 만들어준다는걸 유추해볼 수 있다.

컴파일러가 만들어주는 것이 아닌 우리가 직접사용하기 위해서는 `operator=()`를 만들면 된다.

#### operator=() ver.1
아래와 같이, `operator=()` 를 만들어보자.

```cpp
#include<iostream>
class Point
{
  int x, y;

public:
  Point(int a = 0, int b = 0) : x(a), y(b) {}

  void print() const
  {
    std::cout << x << ", " << y << std::endl;
  }

  void operator=(const Point& p) 
  {
    x = p.x;
    y = p.y;

    std::cout << "=" << std::endl;
  }
};

int main()
{
  Point p1(1,1);
  Point p2(2,2);

  p1=p2;

  p1.print();
}
```

위 코드에서는 `operator=()`를 만들고, 사용자 정의 타입과 컴파일이 만든 디폴트 타입을 구별하기 위해 *logging*함으로 구별했다. 실제 동작해보면 우리가 logging한 `=`가 찍히는 것을 볼 수 있을 것이다.

위와 같이 구현하면 사용자 정의 타입을 만들 수 있는데 아래와 같은 동작은 잘 동작할지 생각해보자.

#### operator=() ver.2
```cpp
int main()
{
  Point p1(1,1);
  Point p2(2,2);
  Point p3;

  p3 = (p1 = p2);
}
```

위 코드가 잘 동작할까?

위 코드를 수행할 경우, `p3 = (p1 = p2)`를 할때 에러가 발생할 것이다. `(p1 = p2)`의 결과가 `void` 타입의 결과 이기 때문에 다음 `p3.operator=()` 호출할 때  `void` 인자 전달로 에러가 발생할 것이다.

그렇다면 타입을 맞추기 위해서는 return type을 `void`가 아닌 값 타입 `Point` 타입으로 변경해야한다.

```cpp
#include<iostream>
class Point
{
  int x, y;

public:
  Point(int a = 0, int b = 0) : x(a), y(b) {}

  void print() const
  {
    std::cout << x << ", " << y << std::endl;
  }

  Point operator=(const Point& p) 
  {
    x = p.x;
    y = p.y;

    std::cout << "=" << std::endl;
  }
};
```

위와 같이 변경하고 `main()`를 수행하면 잘 동작하는 것을 확인해볼 수 있다.

그렇다면 더 나아가 아래와 같은 상황은 잘 동작할까?
#### operator=() ver.3
```cpp
int main()
{
  Point p1(1,1);
  Point p2(2,2);
  Point p3;

  (p3 = p1) = p2;

  p3.print();
}
```

위와 같은 상황에서 `p3.print()`를 할경우, 어떤 값이 나올까? 우리가 기대하는 값은 `2, 2`가 출력되는 것이다. 하지만, 해당 코드를 수행하면 `1, 1`이 나오는 것을 확인할 수 있다.

우리가 앞서 많이 다뤄서 익숙하겠지만, 이는 *값으로 리턴할 경우 연쇄적 동작을* 할 수 없다는 문제이다. 즉 `(p3 = p1)`을 할경우 `p3`에 `p1`값을 담고 `Point` 값으로 리턴하게 된다.

이 때, 리턴되는 값은 *임시객체*이다. 이후 *임시객체*에 `p2` 값을 대입하다보니, `p3` 같은 경우 기존에 대입된 `p1` 값만 적용되어져있다.

따라서, `p3.print()`를 했을 때 `(1,1)` 이 나타나게 되는 것이다.

이를 개선하기 위해선 간단하다! 바로 *참조리턴*하는 것이다.

```cpp
#include<iostream>
class Point
{
  int x, y;

public:
  Point(int a = 0, int b = 0) : x(a), y(b) {}

  void print() const
  {
    std::cout << x << ", " << y << std::endl;
  }

  // 값 리턴이 아닌 *참조리턴할 것!!!*
  Point& operator=(const Point& p) 
  {
    x = p.x;
    y = p.y;

    std::cout << "=" << std::endl;
  }
};
```

위와 같이 하면 개선된 `operator=()` 함수를 마주할 수 있다.

하지만, 한 가지 더 개선해야될 점이 있다.

바로 *pointer 대입*이다. *Pointer* 같은 경우 항상 copy연산에서 문제를 유발할 수 있다. 즉, 기본적으로 컴파일러가 제공해주는 대입연산자 같은경우 *shallow copy*를 기반으로 만들어진다.

그러다보니, Pointer가 등장할 경우 runtime error를 종종만나게되는데, 이를 해결하기 위해서는 *사용자 정의 타입*을 구현해 *Deep copy* 혹은 *Reference counting*을 통해 개선해야한다.

이는 우리가 뒷부분에서 만드는 String 클래스에서 다뤄보도록 한다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
