---
layout: post
author: doodoo
title: "[C++ Basic] C++ 변수의 특징 #2"
subtitle: C++에서 추가된 변수의 특징에 대해 알아보자!
date: 2023-02-11
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 변수 특징에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
오늘의 포스팅에서는 *string* / *structured binding* / *constexpr* 에 대해
알아보겠습니다.

### string
C언어에서 우리는 문자열을 사용하고싶다면, `char*` 또는 `char[]`를 활용했다.
또한, 문자열을 복사하거나 비교할 때 특정 문자열 함수 `strcmp`, `strcpy` 등을
활용했다.

C++ 에서는 문자열 처리를 담당하는 새로운 타입 `string`을 만들었다.

해당 타입을 활용하면 *문자열 처리가 정수형 변수와 같이 직관적*으로 사용가능하다.

```cpp
#include <iostream>
#include <string>

int main()
{
	char s1[] = "hello";
	char s2[10];

	// 이렇게 쓰면 복사안됨.
	s2 = s1;

	// C에서 문자열 복사를 위해서는 아래와 같이 함수를 활용해야 된다.
	if (s1 == s2) {  /* 이렇게하면 주소값 비교됨.ㅠㅠ */}

	if (strcmp(s2,s1) == 0) {  /* 문자열 함수 활용 */}

	// C++의 새로운 타입
	std::string s3 = "hello";
	std::string s4;

	if (s3 == s4) { /*문자열 비교 가능*/ }

	// char* 가지고 싶을 경우 c_str() 활용
	char* tmp = s3.c_str();
}
```

좀 더 자세한 내용을 확인하기 위해서는 [여기](https://en.cppreference.com/w/cpp/header/string) 참고해보자.

### structured binding
C++17에 추가된 문법으로 *구조체 혹은 배열의 각 멤버*를 꺼낼 때 사용하는
문법이다.

해당 문법을 활용할 경우 값을 좀 더 쉽게 추출 할 수 있다.

해당 문법을 수행하기 위해서는 `g++`의 경우 꼭 `-std=C++1z` 옵션을 추가해주자!

소스코드를 통해 확인해보도록 하자.

```cpp
#include <iostream>

struct Point
{
	int x = 10;
	int y = 20;
};

int main()
{
	Point p;

	int a = p.x;
	int b = p.b;

	// 위와 같이 각각의 멤버를 꺼내 초기화하는 것이 아니라, 바로 값을 모두
	꺼내올 수 있다.

	// auto type을 활용해 선언하고, 멤버변수를 옮길 변수를 적어주면 된다.
	auto [a, b] = p;

	// 반드시 auto type만 가능하다.
	// const화 하는 것도 가능하다.
	const auto [a,b] = p;

	// 구조체로만 꺼낼 수 있는건 아니다.
	// 배열이 있다. 배열에서 값을 꺼낼 때도 사용가능하다.
	int x[2] = { 1, 2 };

	auto [a, b] = x;

	std::cout << a << ", " << b << std::endl;
}
```

C++17에 등장한 문법으로, 우선 이런 것들이 있다 정도만 이해하고 있도록 하자.

### constexpr
이번 포스팅에서 가장 강조하고자 하는 문법이다.

해당 문법은 큰 코드 (Open source)에서도 많이 사용되고 있다.

우선, constexpr은 뭐고, 문제는 무엇인지에 대해 알아보도록 하자.

C언어에서 우리는 어떤 값을 상수화 하고싶을 경우 `const`키워드를 활용한다.

```cpp
#include <iostream>

int main()
{
	int n = 0;
	n = 10;

	const int c = 10;

	// const 선언된 이후 변경이 불가능함.
	c = 20;
}
```

위의 코드를 보면 `const`로 선언된 `c` 같은 경우 상수로 지정되기 때문에 변경이
불가능하다.

아래의 문법은 가능할까?

```cpp
int main() {
	int n = 10;

	// 이건 가능할까?
	const int c2 = n;
}
```

위와 같이 할 경우 *정상적*으로 컴파일 되고 실행된다.

어떻게 이게 가능한 것일까???

`const`를 활용할 경우 컴파일러는 컴파일 시간에 `const`로 선언된 모든 값을 읽어
관련된 변수를 *치환하는 작업*을 한다. 하지만 *만약 상수 값이 아닌 변수가
있다면...* 변환하지 않고 실행시간에 메모리 값을 초기화 하도록 한다.

이럴 경우 *HW 의존성*이 발생한다. 즉, HW를 접근해 값을 가져오는 순간 값이
신뢰성있다는 것을 보장할 수 없게 된다. (e.g. 전기적 신호로 값의 순서가
변경된다거나 할 수 있는 위험이 존재한다.)

`const`로 선언한 상수는 *변수 값을* 활용해 초기화할 수 있다는 문제점이있다.

그 외 또다른 큰 문제를 가지고 있는데, 아래의 코드를 통해 알아보자.

```cpp
#include <iostream>

int main() {
	int n = 10;

	// 이건 가능할까?
	const int c = n;
	int* p = (int*)&n;

	*p = 20;

	std::cout << c << std::endl; // 10
	std::cout << *p << std::endl; // 20
}
```

C언어 *캐스팅*을 통한 값이 변경 가능해진다. 위 코드를 보면 `const`로 선언된 `c`
같은 경우 컴파일 시간에 먼저 초기화 되고, c의 실제 메모리 영역은 `*p`를 통해 가리킬
수 있는 상황이다.

이 때, `*p`를 활용해 `c`의 내부 값을 10에서 20으로 변경하는 작업을한다. 이와
같이 데이터의 신뢰성이 깨질 수 있는 가능성이 있다.

따라서, *상수 주소를 비상수 포인터가 가리킬 수 없도록* 해야한다.

`const`의 문제점은 컴파일 타임 상수와 실행시간 (e.g. 변수 혹은 비상수 포인터
접근) 타임 상수라는 2가지 특징을 모두 가지고 있어서 발생한다.

즉, 이를 막기 위해서는 *컴파일 타임 / 실행 타임*을 분리해서 관리해야한다.

이를 위해 등장한 C++ 키워드가 바로 `constexpr`이다.

`constepxr` 같은 경우 *컴파일 타임 상수*를 보장한다. 따라서, 변수와 같은 값으로
초기화 할 수 없다. 또한, 컴파일 시간에 모든 것을 처리하는 것을 보장해야되기
때문에 값이 바뀔 수 있는 *비상수 포인터*를 활용한 포인팅을 하지 못하도록 한다.

```cpp
#include <iostream>

int main() {
	int n = 10;

	// 컴파일 오케이
	const int c = n;

	// 컴파일 에러 발생.
	constexpr int c2 = n;
}
```

보통 `constexpr`은 컴파일 상수 시간을 보장한다고 많이 말한다. 해당 키워드를
사용할 경우 *컴파일러 최적화 입장에서도 굉장이 유효*하다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
