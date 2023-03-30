---
layout: post
author: 널두
title: "[C++ Basic] cout 원리 & endl 원리"
subtitle: "cout 과 endl을 만들어보며, 원리를 배워보자 🥸"
date: 2023-03-30
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 cout과 endl의 원리에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *cout 동작 원리* / *endl 동작원리* 에 대해 알아보겠습니다.

### cout 동작 원리
우리는 `cout` 객체를 화면에 출력하기 위해 사용한다.

`cout`을 활용해 출력하기 위해서는 `<<` 를 활용하는데, 해당 연산자 같은 경우 내부적으로 버전별로 재정의 되어져있다.

```cpp
namespace std
{
  class ostream
  {
    //..
    // 버전 별로 존재함.
    operator<<(int);
    operator<<(double);
    ...
  }

  ostream cout; // cout이라는 객체로 제공함.
}
```

위의 코드와 같이 `ostream` 객체 내 `cout` 이라는 객체로 제공하고, 내부적으로는 *연산자 재정의*를 활용하고 있다. `ostream` 관련해서는 뒷 부분에서 조금 더 자세하게 알아본다.

정리해보자면, `cout`은 객체로 `ostream`의 클래스를 객체화 한 것이다. 내부적으로 `operator`를 재정의해서 사용하고 있으며 `primimitve type` 같은 경우 타입별로 재정의해서 사용하고 있다.

*연산자 재정의*를 확인해보고자 한다면, 아래와 같이 `<<` 이 아닌 `operator<<()`를 활용해도 동일한 결과 값을 출력하는 것을 확인 할 수 있다.

```cpp
int main()
{
  int n = 10;
  int d = 3.4;

  cout << n; // 10
  cout << d; // 3.4

  cout.operator<<(n); // 10
  cout.operator<<(d); // 3.4
}
```

#### cout 구현
아래의 코드가 동작하도록 직접 만들어보자.

```cpp
int main()
{
  cout << 3;
}
```

우리는 출력을 간편하게 하기 위해 `<cstdio>` 헤더파일 내 `printf()`를 활용한다. 보통 `cout`과 같은 출력 함수들에서 호출하는 함수는 *시스템에서 출력하는 함수*를 호출한다. 이를 테면 *linux 환경* 같은경우 `write()` 시스템 콜을 활용해 직접 monitor 등에 쓰는동작으로 화면에 표기한다.

거기 까지 가기에는 너무 난이도가 있으니, `printf()`를 시스템 출력함숙로 간주하고 사용하고자한다.

`cout`을 통해 `3`을 출력하기 위해서는 아래와 같은 동작이 필요하다.

*1. ostream 클래스를 만든다*<br>
*2. ostream 클래스 내 필요한 타입의 <<연산자를 재정의한다*<br>
*3. 재정의한 동작 내 printf() 를 활용하여 화면에 입력받은 값을  출력하도록 한다.*<br>
*4. ostream 클래스를 cout 객체로 만들어 사용자가 접근할 수 있도록 한다*


위와 같은 동작을 기반으로 아래의 함수를 구현해 볼 수 있다.

```cpp
#include<cstdio>

class ostream
{
public:
  void operator<<(int n) {
    printf("%d", n);
    return;
  }
};

ostream cout;
```

위와 같이 만들어 위 `int main()` 코드를 합쳐 빌드할 경우 `3`이 출력되는 것을 확인할 수 있다.

만약 아래의 코드라면 어떻게 수행될까?

```cpp
int main()
{
  // 이 코드 수행시 에러남.
  cout << 3 << 4;
}
```

위 코드 수행할 경우 에러가 발생한다. 현재 연쇄적으로 `<<` 연산자를 수행할 수 없기 떄문이다. 연쇄적으로 값을 수행하기 위해서는 `return value`를 참조타입으로 반환해야된다. [이전 포스팅](https://0xd00d00.github.io/2023/03/29/ecourse_basic_19_operator.html)을 통해 다뤘으니 참고하도록 하자.

조금 수정해서 `<<` 연쇄적 동작을 하도록 만들어보자.

```cpp
#include <cstdio>
class ostream
{
public:
  ostream& operator<<(int n) {
    printf("%d", n);
    return *this;
  }
};

ostream cout;
```

`this` 포인터를 참조로 반환함으로 임시객체가 아닌 실 객체를 반환하도록 한다. 위와 같이 작성할 경우 문제 없이 연쇄적 동작도 잘 수행된다. 여기서 `namespace`를 `std`로 씌워주면 실제 우리가 사용하는 것과 같이 `std::cout` 형태가 된다.

```cpp
#include <cstdio>
namespace std {
  class ostream
  {
  public:
    ostream& operator<<(int n) {
      printf("%d", n);
      return *this;
    }
  };
  ostream cout;
}


int main()
{
  std::cout << 3 << 4;
}
```

*연산자 재정의*를 할 수 있다면 우리도 `cout`을 쉽게 만들 수 있다.

#### basic_ostream
98년도 이전에는 `ostream`이라는 객체를 사용했다.

98년 이후 `basic_ostream`이라는 개념이 등장했으며, 내부적으로 `ostream`과 `wostream`을 객체로 만들어 사용하고 있다.

98년 이후 `ostream`에서 `basic_ostream`으로 개편된 이유는 *unicode 의 상용화* 때문이다. 유니코드 같은 경우 2byte로 나타내는 문자열인데, 해당 값을 통해 한글을 비롯해 다양한 문자를 표현할 수 있다.

기존에는 영어기반 `1byte`문자로 (ascii 코드) 표현이 가능했지만, 다양한 문자를 받고자 유니코드를 도입했다. 따라서 기존과 다른 객체양식이 필요했고, wostream이라는 개념이 등장했다.

wcout, wstring과 같은 내용을 종종 볼 수 있는데, 해당 객체는 *유니코드를 다룰 수 있는 객체*구나 정도로 이해하면된다.

### endl
`endl` 같은 경우 *객체가 아닌 함수*라는 점을 기억하자.

```cpp
#include <iostream>

using namespace std;

int main()
{
  cout << endl;

  endl(cout); // 위 동작을 아래와 같이 표현할 수 있다.
}
```

잉.. `endl()` 동작이 어떻게 되는거지?

같이 만들어보며, 이해해보자.

#### endl 구현
기존에 만들었던 `cout` 객체를 활용해 `endl`을 구현해 동작시켜 보도록 하자.

```cpp
#include <cstdio>
namespace std {
  class ostream
  {
  public:
    ostream& operator<<(int n) {
      printf("%d", n);
      return *this;
    }
    ostream& operator<<(char c) {
      printf("%c", c);
      return *this;
    }
  };
  ostream cout;
}

int main()
{
  // 해당 동작이 가능하게 만들어보자.
  std::cout << 3 << std::endl;
}
```

*endl 을 만들기 위한 로직*

*1. operator<<() 재정의를 통해 endl을 받도록한다*
*2. endl() 내부에선 개행처리를 하도록 한다*

굉장히 심플하다.

```cpp
#include <cstdio>

namespace std {
  class ostream {
    //...

    // 연산자 재정의 필요.
    // << 을 통해 전달함.
    ostream& operator(ostream&(*f)(ostream&))
    {
      f(*this); // endl(cout); 이런 방식으로 전달하면 됨.
      return *this;
    }
  }
}
```

우선 *연산자 재정의* 구현 부분 부터 보도록 하자.

`ostream&` 참조로 받는 이유는 연쇄적 동작을 위해서이다. 인자로 `ostream&(*f)(ostream&)` 은 낯설 수 있지만 함수의 포인터 형태이다. 함수를 전달받아 해당 함수에 `cout`을 전달해주는 방식으로 `endl`은 동작한다.

그렇다면 `endl` 함수 내부는 어떻게 되어있을까?

```cpp
// 형태가 중요
// ostream&(*f)(ostream&)

ostream& endl (ostream& os)
{
  // 전달받은 ostream에 연산자 재정의를 활용해 개행을 출력하도록 한다.
  // 즉, cout << '\n'; 이 모양이 됨.
  os << '\n';
  // 연쇄작용 때문.
  return os;
}
```

위와 같이 함수형식으로 구현하면 된다.

여기서 중요한 점은 전달받은 `ostream`을 활용해 연산자 재정의를 다시 호출한다는 점이다.

그렇다면 여기서 생각해볼 수 있다.

왜 이렇게 어렵게 간다는 말인가?

그냥 `\n`만 출력해주면 되는거 아니야? 라고 생각할 수 있다. 이렇게 만든이유는 *사용자가 직접정의 할 수 있도록* 유연성을 부여하기 위함이다.

예를 들어 아래와 같은 동작을 해야된다면 어떻게 해야될까?

```cpp
// tab을 구현해보자.
// tab은 사이를 tab 간격 만큼 띄우는 역할을 한다.
std::cout << 'A' << tab << 'B' << endl;
```

tab 구현은 굉장히 간단하다.

```cpp
// 형태만 맞춰주면 됨!

ostream& tab(ostream& os)
{
  os << '\t';
  return os;
}
```

위와 같이 구현해 만들어주면, `cout`에서 바로 `tab`이라는 키워드 형식의 함수를 사용할 수 있다.

우리가 흔히 사용한 *IO manipulator* 함수들도 다 이런형식으로 구현되어져 있다. (e.g. setw(10), hex 등)

아래처럼 기존의 `iostream` 의 `cout`을 활용하여 재밌게 구현해 볼 수 도 있다.

`menu`라는 출력함수를 만들어보자.

```cpp
#include <iostream>

using namespace std;

ostream& menu(ostream& os)
{
  os << "1. 짜장면\n" << "2. 탕수육\n";
  return os;
}

int main()
{
  cout << menu << endl;
}
```

위 코드를 수행하보면 아주 재밌는 결과를 만날 수 있을 것이다.

### 사용자 정의 타입 연산자 재정의
아래의 코드를 보면, `Complex`의 값을 출력하기 위해 `print()`를 사용한다는 것을 볼 수 있다.

이를 좀 더 간편하게 하기 위해 `cout`을 활용할 수 없을까?

```cpp
#include <iostream>

using namespace std;

class Complex
{
  int re, im;
public:
  Complex(int r = 0, int i = 0) : re(r), im(i) {}

  void print() const
  {
    cout << re << ", " << im << endl;
  }
};

int main()
{
  Complex c(1,1);

  cout << c; // 이렇게는 할 수 없을까?
}
```

`operator<<()` 재정의를 하면 `cout`를 활용할 수 있다. 우리가 앞서 재정의 한 방식은 `cout`을 활용해 멤버함수로 구현했는데 지금은 `std::cout`에 접근을 할 수 없다.

이 경우는 *일반함수 연산자 재정의* 방법을 활용하면 된다. 아래의 코드는 *일반함수를 활용해 재정의 한 코드*이다.

```cpp
#include <iostream>

using namespace std;

class Complex
{
  int re, im;
public:
  Complex(int r = 0, int i = 0) : re(r), im(i) {}
  // 멤버 접근을 위해!!
  friend ostream& operator<<(ostream&, const Complex&);
};

ostream& operator<<(ostream& os, const Complex& c)
{
  os << c.re << ", " << c.im;

  // 연쇄적 동작을 위해..
  // 멤버는 *this를 보내주지만, 일반함수 같은 경우 받은걸로 돌려주면 됨.
  return os;
}

int main()
{
  Complex c(1,1);

  cout << c; // 프린트 활용안하고 바로 출력가능!
}
```

위 코드는 *일반 함수 재정의* 코드이다. 여기서 주의할 점은 내부 데이터 접근이 불가능하기 때문에 `friend` 키워드를 사용했단점을 기억하자!

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!

