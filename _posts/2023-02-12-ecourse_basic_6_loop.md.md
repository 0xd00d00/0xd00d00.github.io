---
layout: post
author: doodoo
title: "[C++ Basic] 새롭게 등장한 제어문 / 반복문"
subtitle: "if constexpr, static if, range for에 대해 알아보자."
date: 2023-02-12
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 Modern C++에 새롭게 등장한 제어문, 반복문에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *C++ 17 if 제어문 특징* / *constexpr if* / *range for*에 대해
알아보겠습니다.

### C++17 if 제어문 특징
C++17에서는 if, switch 문과 같은 제어문에 새로운 문법이 추가되었다.

```cpp
#include <iostream>

int foo() { reutnr -1; }

int main() {
	int ret = foo();

	// 프로그래밍하면서 return을 받아 if 제어문을 활용해 비교하는 경우가
	// 종종있다.
	if (ret == -1)
	{
		std::cout << "fail~!" << std::endl;
	}
}
```

위의 코드와 같이, 우리는 프로그래밍을 하면서, 함수호출을 통해 return 값을 받은
후 그 값을 비교하는 경우가 있다.

C++17에서는 `if`, `switch`문을 사용할 때, 함수를 호출하고, 전달받아 바로 비교할
수 있는 문법을 추가했다.

```cpp
#include <iostream>

int foo() { reutnr -1; }

int main() {
	if (int ret = foo(); ret == -1)
	{
		std::cout << "fail~!" << std::endl;
	}

	// switch 문도 가능함.
	switch (int ret = foo(); ret)
	{
		case -1: std::cout << "-1" << std::endl; break;
	}
}
```

위 코드와 같이 `if`, `switch`문을 통해 비교하는 부분에서 지역변수로 함수를
호출해 값을 전달받은 뒤 내부에서 사용가능하다.

선언된 변수의 scope는 *if, switch문의 scope에 따르도록 한다*

`for` loop 연산과 비슷한 느낌으로 ";" 를 기준으로 나뉜다는 특징을 기억하자.

해당 문법은 *C++17 부터 적용되기 때문에* g++ 유저 같은 경우 `-std=c++1z`를 꼭
추가해 빌드하도록 하자.

### constexpr if
우리는 [이전 포스팅](https://0xd00d00.github.io/2023/02/11/ecourse_basic_3_variable_2.html) 을 통해 `constexpr`에 대한 내용을 알아 보았다.

`constexpr`는 *컴파일 시간 상수*를 보장하기 위해 만들어진 키워드이다.

그렇다는 말은, `constexpr if` 문법은 `if` 문법이 "컴파일 시간"을 보장하라는 뜻이다.

```cpp
#include<iostream>

int main()
{
	int n = 0;

	std::cin >> n;

	if ( n == 0 )
	{
		// 어떤 값을 처리함.
	}

	if constexpr ( n == 0 )
	{
		/* 해당 코드는 g++ -std=c++17 or -std=c++1z 옵션을 꼭줘야함. */
	}
}
```

위의 코드를 수행하면 `if constexpr` 때문에 컴파일 시간에 확인할 수 없은 `n`이
잘못된 표현이라 아래와 같이 에러가 발생한다.

```cpp
error: constexpr if condition is not a constant expression
        if constexpr ( n == 0 )
```

정리해보자면, `if constexpr`은 컴파일시간 제어문이다. *static if*라고 불리기도
한다. *컴파일 시간에 알 수 있는 조건*만 가능하다는 점을 기억하자.

그렇다면 해당 케이스는 언제 사용하는가?

우리가 훗날 배울 template 프로그래밍 즉, 일반화 프로그래밍에서 해당 문법을
사용한다. 보통 일반 프로그래밍할 땐 많이 볼 수 없을 것이다.

우선 새롭게 추가된 문법이 있구나 정도로 이해하자!

### range for
C++11 부터 추가된 새로운 for이다. 다른 언어 (e.g. java, c#등)을 먼저 배우고
C++를 접한다면 해당 문법은 `foreach` 구문과 비슷하다고 생각하면 된다.

`range for` 문법의 사용방법과 활용법을 알아보도록 하자.

```cpp
#include <iostream>

int main()
{
	int x[10] = { 1,2,3,4,5,6,7,8,9,10 };

	for (int i = 0; i < 10; i++) {
		std::cout << x[i] << std::endl;
	}
}
```

위 코드는 단순하게 `x`의 배열값들을  출력하는 프로그램이다.

해당 프로그램은 `x`에 들어가있는 값을 모두 출력하는 것이다. 그렇다면 배열을 쭉
읽어서 출력하기 때문에 *사용자가 지정하기 보다* 컴파일러가 *배열의 크기만큼*
출력할 수 있도록 하면 편하지 않을까?

*배열의 크기*는 컴파일 시간에 알 수 있기 때문에 컴파일러가 *배열의 갯수*를 알 수
있다. 이를 참고해 그냥 쭉 출력해주면 된다. 위의 개념을 통해 새로운 문법인 `range
for`가 등장하게 됐다.

```cpp
#include <iostream>

int main()
{
	int x[10] = { 1,2,3,4,5,6,7,8,9,10 };

	// 컴파일시간에 알 수 있으니, 배열에 쭉 돌면서 출력해줘~
	for (int n : x)
	{
		std::cout << n << std::endl;
	}
}
```

위의 코드와 같이 `for`의 문법이 단순화 될 수 있단느 것을 알 수 있다.

`range for` 같은 경우 문법을 단순화한다는 장점이 있지만, 더 큰 장점은 `auto`
타입과 결합되었을 경우이다.

`auto`와 결합할 경우 특정타입에 의존적이지 않고, for에 전달된 타입을 자동으로
참고해 수행이 가능하다. 이는 일반화 프로그래밍 작성할 때 아주 큰 도움이 되며,
후에 기록할 포스팅에서 많은 도움을 볼 수 있을 것 같다.

```cpp
#include <iostream>

int main()
{
	int x[10] = { 1,2,3,4,5,6,7,8,9,10 };

	for (auto n : x) {
		// C++11 부터 지원됨.
	}
}
```

앞으로 배열을 모두 출력하는 경우가 발생할 경우 `range for`를 사용하는 습관을
기르도록 하자!

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
