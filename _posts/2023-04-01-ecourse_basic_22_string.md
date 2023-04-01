---
layout: post
author: 널두
title: "[C++ Basic] String class 만들기"
subtitle: "String 클래스를 만들어보면서 복습해보자!"
date: 2023-04-01
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 String class를 만들어보자.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *String class를 만들어보고, 복습*해보겠습니다.

### 표준 String class
이번 시간에는 이제까지 만들어 온 연산자 재정의를 정리할 겸 string 클래스를 만들어보는 시간을 가져본다.

```cpp
#include <iostream>

int main()
{
  char s1[10] = "hello";
  char s2[10];

  // 이렇게 할 경우 에러가 발생한다.
  // 문자열 복사하기 위해선 strcpy
  s2 = s1;
}
```

위와 같이 C언어로 "hello" 문자열을 복사하기 위해서는 `=`를 사용하면 안되고, `strcpy()`를 활용해 복사해야한다.

C++ 언어 같은 경우 문자열을 편리하게 하기 위해 `std::string`를 제공한다.

```cpp
#include <iostream>
#include <string>

int main()
{
  std::string s1 = "hello";
  std::string s2;

  // =를 사용해 복사가능하다.
  s2 = s1;
}
```

위와 같이 `std::string`을 활용할 경우 `=` 연산자를 활용해 쉽게 복사가 가능하다.

이와 같이, string class에는 다양한 기법들이 녹아있는데, 실제 만들어보며 몇가지 기능을 만들어보자.

### String class 만들기
String 클래스는 많은 기능을 담고 있다.

우리는 이 중 4가지 정도를 만들어보고자 한다.

```cpp
int main()
{
  // 1. 데이터를 담을 수 있는 클래스 및 초기화 기능
  String s1 = "hello";

  // 2. cout으로 출력이 가능해야함.
  std::cout << s1 << std::endl;

  // 3. 복사 생성자 사용 가능해야함.
  String s2 = s1;

  // 4. 대입연산자 가능해야함.
  String s3 = "world";

  s2 = s3;
}
```

위 코드에서 주석으로 언급한 것과 같이 4가지 기능을 차례차례 만들어보고자 한다.

*1. String 클래스를 만들고, 초기화 기능을 할 수 있도록 함*

*2. cout을 활용해 출력 가능하게 함.*

*3. 복사 생성자 기능을 가능하게 함.*

*4. 대입 연산자 기능을 가능하게 함.*

#### String 클래스 만들기 (1)
가장 먼저 해야되는 "*1. String 클래스를 만들고, 초기화 기능을 할 수 있도록 함*" 동작을 구현해보자.

```cpp
#include <iostream>
#include <cstring>

class String
{
  int size;
  char* buff;

public:
  String(const char* s) {
    size = strlen(s);
    buff = new char[size + 1]; // null 포함

    strcpy(buff, s);
  }

  ~String() { delete[] buff; }
};

int main()
{
  // 1.
  String s1 = "hello";
}
```
위 코드는 `String` 객체의 기본 골격 클래스를 만든 것이다. 생성자를 통해 문자열을 전달받고, 해당 문자열의 길이를 구해 `buff`를 초기화한다.

이 때, `+1` 동작을 하는 이유는 `null` 문자열까지 포함해야되기 때문이다. `buff`가 생성된 이후 `strcpy`를 통해 전달받은 문자열을 객체에 *복사해 보관*하도록 한다.

추가로, 우리는 *생성자*를 통해 `buff`를 생성했으니 *소멸자*에서 해당 `buff`를 제거할 수 있는 동작을 추가해야한다. 추가하지 않을 경우 개발자가 *메모리 관리*를 직접 수행해야하는데, 이 때 많은 버그가 유발 될 수 있으니 *소멸자*를 통해 자원을 해제하도록 하자!

#### String 클래스 만들기 (2)
`cout`을 통해 String 객체의 데이터를 출력하는 동작을 만들어보자.

우리는 앞서 `cout`을 통해 값을 출력하는 것을 배웠다. 자세한 내용을 알고 싶다면 [여기](https://0xd00d00.github.io/2023/03/30/ecourse_basic_20_ostream.html) 를 클릭해 알아보자.
`cout`이 동작하기 위해서는 `operator<<()` 재정의가 필요하고, 멤버를 수정할 수 없으니 일반함수로 구현한다.

```cpp
#include <iostream>
#include <cstring>

class String
{
  int size;
  char* buff;

public:
  String(const char* s) {
    size = strlen(s);
    buff = new char[size + 1]; // null 포함

    strcpy(buff, s);
  }
  ~String() { delete[] buff; }

  // friend 필요
  friend std::ostream& operator<<(std::ostream&, const String&);
};

std::ostream& operator<<(std::ostream& os, const String& s)
{
  os << s.buff;
  return os;
}

int main()
{
  // 1.
  String s1 = "hello";

  // 2.
  std::cout << s1 << std::endl;
}
```

`operator<<`를 만들 때 주의할 점은 `&` 참조 반환을 해야한다는 점이다. 또한, `friend` 함수로 만들어 `String` 클래스 내 멤버 변수들에 접근할 수 있도록 해야한다는 점도 기억하도록 하자.

#### String 클래스 만들기 (3)
복사 생성자 기능을 만들어보자.

우선, 복사생성자는 만들지 않고 테스트를 해도 *컴파일 에러*는 발생하지 않는다. 아래의 코드를 *String 클래스 만들기(2)* `main()` 코드 내 추가하여 테스트해보자.

```cpp
String s3 = s2; // 복사 생성자.
```

*컴파일 에러*는 발생하지 않을 것이다. 하지만, *런타임 에러*가 발생하게 되는데, 이는 *링킹 동작*에서 대상체가 없어서 에러를 낼 것이다.

대충 아래의 에러와 같이 나올 것이다..

```sh
a.out(20050,0x117294600) malloc: *** error for object 0x600000950040: pointer being freed was not allocated
a.out(20050,0x117294600) malloc: *** set a breakpoint in malloc_error_break to debug
```

생각해보면 컴파일러가 만들어주는 *디폴트 복사 생성자* 같은 경우 *Shallow copy*이다. 따라서, 멤버를 전체 복사하는데, 이 경우 포인터 값도 그냥 복사하게 된다. 포인터 값을 복사해 사용하게 될 경우 *하나의 대상체를 두개의 포인터가 가리키는 상황*이 발생하게 되고, 가리키는 하나의 포인터가 *파괴 될 경우* 대상체가 지워져버려 문제가 발생한다. 이때, 런타임 에러를 내게 되는데..

이를 막기 위해서는 *Deep copy*를 통해 사용자 정의 타입 복사생성자를 재 구성해야된다.

```cpp
#include <iostream>
#include <cstring>

class String
{
  int size;
  char* buff;

public:
  String(const char* s) {
    size = strlen(s);
    buff = new char[size + 1]; // null 포함

    strcpy(buff, s);
  }
  ~String() { delete[] buff; }

  // 복사 생성자 구현
  String(const String& s) : size(s.size)
  {
    buff = new char[size + 1];
    strcpy(buff, s.buff);
  }

  friend std::ostream& operator<<(std::ostream&, const String&);
};

std::ostream& operator<<(std::ostream& os, const String& s)
{
  os << s.buff;
  return os;
}

int main()
{
  // 1.
  String s1 = "hello";

  // 2.
  std::cout << s1 << std::endl;

  // 3.
  String s3 = s2;
}
```

위와 같이 `String(const String&)` 형식으로 사용자가 직접 복사생성자를 만들어 *Deep copy* 처리를 해줄 경우 문제 없이 동작하는 것을 알 수 있다. 여기서 중요한 점은 복사 생성자도 생성자임으로 *초기화 리스트*를 활용해 초기화 될 값들을 처리하도록 하자.

#### String 클래스 만들기 (4)
마지막 *대입 연산자*를 만들어보자. *대입 연산자* 같은 경우 설명을 수월하게 하기 위해 `main()`을 좀 정리하고 작성하도록 한다.

```cpp
int main()
{
  String s1 = "apple";
  String s2 = "banana";

  s1 = s2;
}
```

위와 같이 메인문을 변경할 것인데, 이렇게 해도 컴파일은 잘된다. 우리가 복사 생성자에서 언급한 것과 같이 컴파일러가 기본적으로 *복사생성자* / *대입연산자*를 만들어주기 때문에 컴파일은 잘된다. *복사 생성자*와 동일한 문제를 *대입연사자도 가지고 있다*

컴파일러가 만들어주는 기본타입은 *shallow copy*이다. 따라서, 기본적으로 포인터가 들어갈 경우 다 무력화 된다.

이를 해결하기 위해 *대입 연산자*도 deep copy로 구성해줘야하는데, *대입 연산자* 같은 경우 기존에 가리키던 대상체를 *지워주는 것이 중요*하다. 즉, 기존에 다른 대상체를 가리키고 있다가, 복사되는 것이기 때문에 가리키는 대상체는 제거하고 복사하는 동작을 만들어야 한다는 점을 주목해서 보자.

```cpp
#include <iostream>
#include <cstring>

class String
{
  int size;
  char* buff;

public:
  String(const char* s) {
    size = strlen(s);
    buff = new char[size + 1]; // null 포함

    strcpy(buff, s);
  }
  ~String() { delete[] buff; }

  String(const String& s) : size(s.size)
  {
    buff = new char[size + 1];
    strcpy(buff, s.buff);
  }

  // 대입 연산자 구현
  String& operator=(const String& s) {
    size = s.size;

    // 기존 대상체를 제거해야돼.
    delete buff;

    buff = new char[size + 1];
    strcpy(buff, s.buff);

    return *this;
  }

  friend std::ostream& operator<<(std::ostream&, const String&);
};

std::ostream& operator<<(std::ostream& os, const String& s)
{
  os << s.buff;
  return os;
}

int main()
{
  String s1 = "apple";
  String s2 = "banana";

  s1 = s2;

  // banana 출력해야됨.
  std::cout << s1 <<std::endl;
}
```

위와 같이 구현하면 `banana`가 잘 출력되는 것을 확인 할 수 있다.

하지만 대입 연산자 같은 경우 정말 신기한 경우가 발생할 수 있는데, 아래와 같은 경우가 발생하면 어떻게 될까?

```cpp
int main()
{
  String s1 = "apple";

  // 자기 자신을 대입할 경우...
  s1 = s1;
}
```

우리가 작성한 코드로 `s1 = s1;` 코드를 수행할 경우 잘 동작할까?

*이상한 값 출력 혹은 아무 값도 출력 되지 않을 것이다.* 

우리가 작성한 코드는 *기존의 대상체를 먼저 제거*한다. 만약 위와 같은 상황이 발생할 경우 먼저 *대상체를 제거 했기 때문에* 복사할 대상체가 없어진다. 따라서 이상한 값이 들어가거나 아무것도 없는 값이 들어가지게 되는 것이다.

이를 해결하기 위해서는 본인의 주소일 경우 *대입 연산자*를 수행하지 않도록 하는 기법을 사용한다.

```cpp
if (&s == this)
  return *this;
```

즉, 전달받은 주소가 `this` 본인일 경우 `return` 하도록 만드는 것이다. C++ 내에서 사용되는 기법이고, *대입연산자*라면 무조건 넣어준다고 생각하면 된다.

위 코드를 넣고 `String` 클래스를 완성해보자.

```cpp
#include <iostream>
#include <cstring>

class String
{
  int size;
  char* buff;

public:
  String(const char* s) {
    size = strlen(s);
    buff = new char[size + 1]; // null 포함

    strcpy(buff, s);
  }
  ~String() { delete[] buff; }

  String(const String& s) : size(s.size)
  {
    buff = new char[size + 1];
    strcpy(buff, s.buff);
  }

  // 대입 연산자 구현
  String& operator=(const String& s) {

    // 자기 자신 주소 체크...!!
    if (&s == this) return *this;

    size = s.size;

    // 기존 대상체를 제거해야돼.
    delete buff;

    buff = new char[size + 1];
    strcpy(buff, s.buff);

    return *this;
  }

  friend std::ostream& operator<<(std::ostream&, const String&);
};

std::ostream& operator<<(std::ostream& os, const String& s)
{
  os << s.buff;
  return os;
}

int main()
{
  String s1 = "apple";
  String s2 = "banana";

  s1 = s2;
  s1 = s1;

  // banana 출력해야됨.
  std::cout << s1 <<std::endl;
}
```

위 코드를 빌드해보면 잘 동작하는 것을 알 수 있다.

우리는 `String` 클래스를 만들면서 이전에 배웠던 것을 복습헀다. 직접 만들어보며 익히면 좋을 것 같고, 본인도 강의를 듣고 직접 설명을 하면서 코드를 구현해보았다. 모르는 부분을 찾거나 다시 보기도 하면서... 구현했으니 여러분도 한번 시도해보자!

### Outtro
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
