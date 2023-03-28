---
layout: post
author: 널두
title: "[C++ Basic] 임시객체 / RVO"
subtitle: "RVO, NRVO에 대해 알아보자 😁"
date: 2023-02-15
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 임시객체 개념과 해결방법에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>

### Intro.
이번 포스팅에서는 *임시객체* / *RVO (Return Vaule Optimization)* 에 대해 알아보겠습니다.

### 임시객체 (Temporary Object)
아래의 코드는 호출 순서를 알아위해 log를 작성한 `Point` 클래스이다.

해당 클래스에서는 *생성자* / *복사생성자* / *소멸자* 호출을 로깅하고 있다. 아래의 모든 코드에서 사용하는 `Point`는 해당 클래스를 참고한다.

```cpp
#include <iostream>

class Point {
  int x, y;

public:
  Point(int a = 0, int b = 0)
  {
    std::cout << "Point() 생성자" << std::endl;
  }

  Point(const Point& p)
  {
    std::cout << "Point(const Point&) 복사 생성자" << std::endl;
  }

  ~Point()
  {
    std::cout << "~Point() 소멸자" << std::endl;
  }
};
```

아래의 코드의 호출 순서는 어떻게 될까?

```cpp
int main()
{
  Point p1(1,1);
  std::cout << "this is main" << std::endl;
}
```

위 코드의 로깅 순서는 *1. Point()생성자* -> *2. "this is main" 문장* -> *3. ~Point() 소멸자* 순서로 기록된다.

우린 보통 이와 같이 작성을 해서 많이 사용한다.

보통 객체를 생성하더라도, *이름*을 적고 뒤에 `()`를 통해 값을 넣어 인자를 전달하거나, 인자가 없는 객체를 생성한다.

만약 아래와 같이 사용하게 될 경우, 어떤 의미를 가질까?

```cpp
int main()
{
  Point(1,1); // 클래스의 이름 없이 "인자"를 전달함.
  std::cout << "this is main" << std::endl;
}
```

위와 같이 `Point` 클래스의 이름이 없이, 클래스명 다음 `()`를 적는 경우를 우리는 *임시객체*를 만들었다고 이야기한다.

*임시 객체의 중요한 특징*은 "수명이 단일 문장"이라는 점이다. 즉, 임시객체를 적은 문장 내에서만 존재하고, 문장을 마치고(;) 다음 문장으로 넘어갈 경우 *파괴*된다는 특징이 있다. 보통 *이름 없는 객체*라고도 부른다.

그렇다면 해당 *임시 객체의 호출순서*는 어떻게 될까?

임시객체의 호출 순서는 *1. Point() 생성자* -> *2. ~Point() 소멸자* -> *3. "this is main" 문장* 이다.

즉, 단일 문장(;)이 끝나면 임시객체는 파괴된다. 따라서, `Point`는 먼저 소멸되고 문자열이 찍히는 특징을 볼 수 있다.

임시객체의 활용은 언제 하는가? 사실 임시객체의 활용은 굉장히 방대하다. 따라서, 중급내용에서 좀 더 다루기로하고, 우선 RVO 개념에 대해 좀 더 중점을 두고 알아보도록 한다. (중급 포스팅이 완료되면, 해당 포스팅에 [링크]()를 활용할 수 있도록 하겠다.)

### 전역변수 값 반환
아래의 코드는 전역 객체를 만들고, 해당 객체를 `foo()`내부에서 반환하는 동작을 수행한다.

```cpp
Point pt(1,1);

Point foo()
{
  std::cout << "foo()" << std::endl;
  return pt;
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

`foo()` 내부에서 전역 객체를 반환하고 있는데, 이와 같이 값을 반환할 경우 컴파일러는 `pt`의 *임시객체를 만들어 값*을 담아두고, 반환하다록 한다.

해당 코드의 실행순서는 어떻게 될것인가?

*1. 전역 객체 Point() 생성자 호출* <br>
*2. "foo()" 문자열* <br>
*3. pt 임시객체 Point(const Point&) 복사 생성자 호출* <br>
*4. pt 임시객체 ~Point() 소멸자 호출* <br>
*5. "this is main" 문자열* <br>
*6. 전역객체 ~Point() 소멸자 호출*

위와 같은 순서로 호출이 이루어진다.

여기서 주목할 점은 *전역 객체 값 반환 시 임시객체* 생성한다는 점과 함수 반환 후 다음 문장으로 넘어갈 경우 *소멸*된다는 점이다.

임시객체를 만들면 필연적으로 따라오는게, *복사 생성자* / *소멸자* 가 따라오게 된다. 이는 함수 호출을 2회를 추가로 하기 때문에 *성능 저하*로 이어질 수 있다. 이를 좀 개선할 수 있는 방법을 알아보자.

#### 최적화 방법
임시 객체를 만들면 *성능저하*가 발생할 수 있다. 전역 객체를 값으로 반환하기 위해서는 임시 객체 생성 보다 *참조로 반환*하도록 하자.

```cpp
Point pt(1,1);

// 참조로 반환하도록 변경함.
Point& foo()
{
  std::cout << "foo()" << std::endl;
  return pt;
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

위와 같이 `foo()`의 반환값을 `Point` -> `Point&` 로 변경할 경우 *임시 객체를 제거*할 수 있다.

위 코드의 호출 순서는 다음과 같다.

*1. 전역 객체 Point() 생성자 호출* <br>
*2. "foo()" 문자열* <br>
*3. "this is main" 문자열* <br>
*4. 전역객체 ~Point() 소멸자 호출*

전역 객체를 값으로 반환할 때는 꼭 *참조 값으로 반환*하는 연습을 하자.

### 지역 변수 값 반환
지역변수를 값으로 반환 할 경우 어떤 일이 발생할까?

기존의 `Point(1,1)`를 전역변수에서 *지역변수*로 바꿔서 생각해보자.

```cpp
Point foo()
{
  Point pt(1,1);
  std::cout << "foo()" << std::endl;
  return pt;
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

위와 같이 지역변수 내부에서 객체를 만들고, 해당 객체를 반환할 경우 컴파일러가 *전역 변수*와 동일하게 *임시 객체를 생성*해 반환하도록 한다. 해당 함수 호출 순서는 다음과 같다.

*1. 지역 객체 Point() 생성자 호출* <br>
*2. "foo()" 문자열* <br>
*3. pt 임시객체 Point(const Point&) 복사 생성자 호출* <br>
*4. pt 임시객체 ~Point() 소멸자 호출* <br>
*5. 지역 객체 ~Point() 소멸자 호출* <br>
*6. "this is main" 문자열*

전역객체와 다른점은 *소멸자가 연달아 2번*불린다는 점이다.

해당 케이스를 g++로 빌드할 경우, 위와 같은 로그를 볼 수 없다면 *-fno-elide-constructor* 옵션을 통해 확인해보도록 하자.

지역객체 같은 경우도 *임시 객체*를 없애려면 *참조*로 만들면 될까?

*지역변수의 참조 반환은 절대 안된다!!!*

지역 변수 같은 경우 함수를 벗어나면 *파괴*되기 때문에 해당 값을 참조하게 되면 큰 버그를 유발하게 된다. 그러면 *임시객체*를 없앨 수 있는 방법은 없을까?

그래서 등장한 개념이 *RVO*이다.

### RVO
*RVO*의 핵심개념은 *만들면서 반환하자* 이다.

지금 문제가 객체를 만들고, 반환하기 위한 객체를 또 만드는 것이다.
즉, 불필요한 객체를 생성하기 때문에 *생성 / 소멸*이 각 1번씩 추가로 불리는것이 문제의 본질...!!

이를 해결하기 위해 총 2번의 객체 생성 동작을 1번에 처리하도록 한다. 즉, 반환하면서 *이름 없는 임시 객체*로 처리하도록 한다.

```cpp
Point foo()
{
  // Point pt(1,1);
  std::cout << "foo()" << std::endl;
  // return pt;
  return Point(1,1); // unnamed object 반환
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

위 코드와 같이 `return Point(1,1);` 할 경우 객체는 1개 이며, 만들면서 동시에 반환하고 파괴하는 동작을 수행한다. 동작 순서는 아래와 같다.

*1. "foo()" 문자열* <br>
*2. Point 임시객체 Point() 생성자 호출* <br>
*3. Point 임시객체 ~Point() 소멸자 호출* <br>
*4. "this is main" 문자열*

#### NRVO
요새는 컴파일러가 똑똑해져서 아래와 같은 문장을 우리가 아는 RVO로 변경해 처리하도록 한다.

```cpp
Point foo()
{
  Point pt(1,1);
  std::cout << "foo()" << std::endl;
  return pt;
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

위 문장은 우리가 임시객체를 추가로 만들어 호출하기 떄문에 *문제*라고 한 코드이다. 최근에는 해당 코드를 컴파일러가 컴파일 할 때, 아래와 같이 RVO를 적용해 만들어준다.

```cpp
// 위 코드가 컴파일러 때문에 이렇게 변경됨!!!!!!!!!!!!!
Point foo()
{
  std::cout << "foo()" << std::endl;
  return Point(1,1); // unnamed object 반환
}

int main()
{
  foo();
  std::cout << "this is main" << std::endl;
}
```

위와 같이 변경되는 현상을 NRVO (Named RVO)라고 부른다. 즉, 이름이 있는 객체라도, RVO 적용을해 성능 개선을 할 수 있도록 만들어 준다는 의미로 사용된다. 요즘 대부분 컴파일러는 해당 기법을 활용하도록 한다.

용어가 너무 자주 나오니, RVO / NRVO는 기억하도록하자!!

### Outro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!

