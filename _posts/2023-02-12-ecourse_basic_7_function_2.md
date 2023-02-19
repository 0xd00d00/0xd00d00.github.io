---
layout: post
author: 널두
title: "[C++ Basic] C++ function의 특징 #2"
subtitle: "C++ template의 기본 사용법에 대해 알아보자!"
date: 2023-02-12
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ template에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
오늘 포스팅에서는 *C++ template 기본적 문법*에 대해 알아보겠습니다.

### template 기본 문법
우리는 [이전 포스팅]() 을 통해 function overloading에 대해 알아보았다.

```cpp
int square(int a)
{
	return a*a;
}

double square(double a)
{
	return a*a;
}

int main()
{
	// int square(int a) 호출
	square(3);

	// double square(double a) 호출
	square(3.3);
}
```

위의 코드에서 `sqaure` 함수를 활용해 function overloading 작업을 수행하고 있다.
function overloading에서 사용된 함수를 자세하게 보면 실질적으로 다른 부분은
*인자, return type* 2가지이다. 그리고 *나머지 부분은 모두 동일* 하다.

동일한 함수를 미묘한 차이로 개발자가 변경할 경우 *불편함과 실수*를 유발할 수
있다.

따라서, C++은 함수에서 특정 일부분만 다르고 모두 동일할 경우 *틀을 만들어* 찍어
내도록 하자.

우리가 일상생활에서 볼 수 있는건 *붕어빵 틀*이다. 붕어빵 장사하는 걸 보면 붕어빵
틀에 필요요소 (밀가루, 팥)을 넣고 동일한 모양으로 붕어빵을 만들어 낸다.

위의 예시와 같이, 전체적인 틀은 동일하게 하고, 필요요소 (인자, return
type)정도만 넣어서 알 수 있게 해준다면 함수를 찍어 만들 수 있다.

C++에서 사용하는 *틀*을 *template*이라고 부른다.

template을 만드는 방법을 알아보자.

template을 만들기 위해서는 타입을 받도록 해야한다. 관례상 T를 적어 받도록 한다.

```cpp
template<typename T>
T square(T a)
{
	return a*a;
}
```

위와 같이 틀을 만들면 된다. `template`이라는 키워들을 적어주고, 전달받을 요소의
값을 정해주면된다. 전달받을 요소를 위해 `typename`이라는 키워드를 통해
컴파일러에게 알려준다. 예전에는 `typename`을 `class` 라는 키워드를 활용했다. 둘
다 사용가능하지만 요즘 스타일로 `typename`을 선호하도록 하자!

위와같이 틀을 만들어두고, 사용할 때 아래와 같이 필요 요소를 알려주면된다.

`square` 함수는 *인자 와 return type* 두개가 필요하지만, 동일한 type이기 떄문에
하나의 정보만 넘겨주면 된다.

```cpp
int main()
{
	square<int>(3);
	sqaure<double>(3.3);
}
```

위의 코드와 같이 전달하는 요소를 `< >` 표현안에 넣어주면된다. 컴파일러는 이를
활용해 기존에 개발자가 만들던 아래와 같은 코드를 자동으로 만들어준다.

```cpp
// 아래의 코드를 컴파일러가 자동적으로 만들어줌!
int square(int a)
{
	return a*a;
}

double square(double a)
{
	return a*a;
}
```

만약 `< >` 표현을 쓰는게 귀찮을 경우, 일반함수 만드는 템플릿 같은 경우
컴파일러가 *전달되는 값을 자동으로 값을 추론하여* 위의 코드를 만들어 주기도
한다.

```cpp
int main()
{
	// < > 쓰기 싫으면 아래와 같이 안써도됨!
	// square<int>(3);
	// sqaure<double>(3.3);

	// 단, 일반 함수를 호출하는 템플릿 같은 경우만 가능!!
	//  뒷부분에 나오는 구조체 템플릿은 안됨!
	// 추론이 가능하니 아래와 같이 사용해도 템플릿 만들어진다!
	square(3);
	sqaure(3.3);
}
```

### 구조체 template
앞서 배운 함수형 템플릿 구조 뿐만아니라 *구조체*도 템플릿화 할 수 있다.

```cpp
struct Point
{
    int x;
    int y;
};

int main()
{
  Point p1;
  p1.x = 3.3;
}
```

위와 같이 `Point` 내부 값을 `int` 타입으로 묶어 만들어뒀는데, 사용자가 `double`
값을 넣을 경우 데이터 손실이 발생한다.

Library 개발자 입장에서 사용자가 dobule을 넣을 경우 double형 구조체를 사용할 수
있도록 구현해야한다.

*사용자가 원하는 타입을 결정해 구조체를 만들 수 있도록* 설계하기 위해서는
template을 활용하면 된다.

```cpp
template <typename T>
struct Point
{
    T x;
    T y;
};

int main()
{
    Point<int> p1;
    p1.x = 3;

    Point<double> a2;
    p2.x = 3.3;
}
```

위와 같이 사용자가 원하는 데이터 타입을 가진 구조체를 만들 수 있도록
*template 구조체*를 만들어두면 데이터 손실 없이 사용자가 사용할 수 있다.

사용방법은 `< >`에 원하는 정보를 넘겨주면 된다.

일반함수 템플릿과 달리 구조체 템플릿은 *사용자에게 원하는 타입*을 받아야
가능하기 떄문에 *추론이 불가능*하다. 따라서, 사용자가 꼭 데이터를 전달해야한다.

### template 장 / 단점
*template의 장점*은 개발자의 불편함과 실수를 줄일 수 있게 만들어준다.

*template의 단점*은 *code bloat현상* 즉, 코드 메모리가 너무 커질 수 있는 문제가
존재한다.

특히, 스마트폰 OS, C++을 활용해야하는 임베디드 작업환경같은 경우 문제가 될 수
있다. 최근에 C++ 진영에서 이를 막기 위해 최적화를 진행하고 있고 메모리용량도
커져서 template을 많이 활용하는 추세이다.

teamplate 같은 경우 배울 부분이 많기 때문에 추후 포스팅에서 다루도록 하고, 우선
*사용방법 위주*로 알아두자.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!

