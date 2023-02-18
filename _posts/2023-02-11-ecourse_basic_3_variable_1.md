---
layout: post
author: doodoo
title: "[C++ Basic] C++ 변수의 특징 #1"
subtitle: "C++에서 추가된 변수의 특징에 대해 알아보자!"
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
오늘 포스팅에서는 *C++11 변수 특징* /  *uniform initialization* /  *nullptr* /  *using 사용법* /  *auto*에 대해 알아보겠습니다.

### C++11 추가된 변수특징
C++ 같은 경우 C++11을 기점으로 많은 변화가 일어났다. 그래서 C++11 시점이후 C++을
우리는 modern C++ 이라고 부른다.

Modern C++에는 다양한 기능들이 문법과 기능들이 추가됐는데, 그 중 우리는 *변수에
관련한 변화된 특징* 몇 가지를 살펴보고자 한다.

변화된 특징은 아래와 같다.

*🌱 2진수 표기법과 자리수 표기법 추가* <br>
*🌱 변수 중간 선언 가능하도록 변경* <br>
*🌱 bool 타입 추가 (C언어 99버전에 추가됨)* <br>
*🌱 구조체 만들 경우 멤버를 초기화 할 수 있음* <br>
*🌱 구조체 사용 시, struct 표시 안해도 됨*

위 특징을 코드에서 보면 다음과 같다.

```cpp
struct Point
{
	int x;
	int y;
};

int main()
{
	// 1. 이진수 표현 추가
	int n1 = 0b10; // "0b"를 써주면 이진수로 인식됨

	// 2. 자리수 표기법
	int n2 = 1000000000; // 가독성이 떨어짐.

	// 자리를 끊어서 적을 수 있음 (') 표시를 적어주면 되는데, 인식은 따로 되지 않는다.
	int n3 = 1'000'000'000

	// 3. 변수 중간 선언
	int n4 = 0; // C언어의 legacy 컴파일러는 중간 선언자체가 불가능.

	// 4. bool 타입 추가
	bool b = true; // C99 에도 추가됨

	// 5. 구조체 만들 경우 초기화 가능, struct 키워드 없어도 됨.

	Point p1 = { 1,2 };
}
```

외에도 다양한 것들이 추가됐지만 차근차근 공부하면서 알아보도록 하자

### uniform initialization
이번에는 새롭게 추가된 *초기화* 방법에 대해 알아보자.

```cpp
struct Point {
	int x, y;
};

int main() {

	// 일반적 변수 초기화
	int n1 = 0;

	// C++에서는 함수형 초기화도 가능
	int n2(0);

	// 배열 같은 경우 '='이 아닌 '{}'를 활용해  초기화 됨.
	int x[2] = { 1, 2 };

	// C++에서 struct는 적을 필요 없고, '{}'를 활용해 초기화함.
	Point p = { 1, 2 };

	// ------------ 뭐가 이렇게 달라.. 😮💨 -----------
}
```

위 코드를 통해 알 수 있듯이 C++에서 초기화를 할 때, *구조체*, *배열*, *변수* 다
다르게 초기화 해야된다.

C, C++를 지속적으로 사용해온 사람이라면 이것을 문제라고 느끼지 않을 텐데,
초심자는 어렵게 느낀다.

따라서, 이를 Modern C++ 에서는 일관성있게 통일하고자 `{}` 를 활용하는 uniform initialization 개념을 도입했다.

초기화는 크게 2가지로 나뉘게된다.

1. "=" 를 사용하지 않는 direct 초기화
2. "=" 를 통한 copy 초기화

```cpp
struct Point {
	int x, y;
};

int main() {
	// '='를 사용하지 않고 직접 초기화.
	// direct initialization
	int n1 {0};
	int n2 {0};

	int x[2]{1,2};
	Point p {1,2};

	// '=' 활용한 복사 초기화
	// copy initialization
	int n3 = {0};
	int n4 = {0};

	int y[2] = { 1, 2 };
	Point p2 = { 1, 2 };
}
```

직/간접 초기화는 *미묘한 차이*가 존재한다. 그 이야기는 추후 알아보도록 한다.

#### uniform initialization의 또다른 매력
*uniform initialization* 초기화를 활용할 경우 *에러를 줄일 수 있다는 장점*이
있다.

```cpp
#include <iostream>

int main()
{
	// 컴파일러 암시적 형변환으로 데이터 손실이 발생함.
	// n1은 3이 담김.
	// 컴파일은 잘됨.
	int n1 = 3.4;

	// 컴파일 부터 에러남.
	int n2 {3.4};
}
```

위 코드를 실행하면, `n2`를 초기화하는 과정에서 데이터 타입이 달라 컴파일 에러를 발생시킨다. 데이터 손실로 발생한 버그는 찾기가 너무어렵다. 따라서 애당초 *초기화 할때 컴파일 에러*를 발생시키면 개발자가 손실을 미리 방지할 수 있다.

```cpp
#include <iostream>

int main()
{
	char c1 { 100 };

	// char 값을 벗어나는 값이 입력됨.
	// 이러면 초기화 에러남.
	char c2 { 300 };
}
```

위 코드와 같이, `char` 데이터 타입을 벗어나는 경우도 에러가 발생한다. `char`
타입 같은 경우 255까지만 가능하기 때문이다.

끝으로, `{}`에 아무것도 적어주지 않는다면 0으로 초기화 된다.

```cpp
#include <iostream>

int main() {
	int n3{};// 0으로 초기화 됨.
	int n4 = {};// 0으로 초기화 됨.

	// 0을 출력함.
	std::cout << n3 << std::endl;
	std::cout << n4 << std::endl;
}
```

### nullptr의 등장
우리는 습관적으로 `*` 값에 0을 넣을 경우, `null` 값으로 인식된다는 것을 알고
있고, 초심자 때 느낌적으로 배우곤한다.

`int*`에 0을 넣을 경우 컴파일러가 *암시적 형변환*을 통해 `null`로 인식하도록
한다. 하지만 이는 *함수 오버로딩* / *템플릿* 사용에서 문제가 발생하는데, 실제
발생하는 부분은 추후 다루도록 한다.

따라서, 이를 막기위해 등장한 개념이 `nullptr` 이다.

```cpp
int main() {
	// null로 암시적 형변환이 발생함.
	int* p1 = 0;

	// 실제 포인터 값에 어떤 정수 값으로 초기화를 하려고 할 경우 "에러 발생"
	/* error 문구 */
	// error: cannot initialize a variable of type 'int *' with an rvalue of type 'int'
	int* p2 = 10;

	// 이는 정수가 아니라 포인터이기 때문에, 에러 발생.
	// nullptr 은 "포인터"이다.
	/* error 문구 */
	// error: use of undeclared identifier 'nullptr'
	int n = nullptr;
}
```

#### *bool type* with nullptr
bool type 같은 경우 nullptr로 초기화가 된다. 물론 warning은 발생함 ㅠ.. 하지만, *direct initialization*을 통해서 초기화가 가능하다고 표준문서에는 적혀있다.

즉, *copy initialization*은 가능하다 안하다가 정해져있지 않다. 즉 *undefined*
영역이다. 컴파일러마다 다를 수 있다.

```cpp
#include <iostream>

int main() {
	// 에러
	bool b1 = nullptr;

	// ok direct 초기화
	bool b2(nullptr);
	bool b3{nullptr};
}
```

### using의 활용
C++에서는 using이라는 지시어말고, 키워드가 존재한다. `using`의 키워드는 우리가
이제까지 사용해온 메크로 `typedef`를 대체하는 역핧을 한다.

우리는 타입에 *다른 이름을 부여*하기 위해 `typedef`를 사용해왔다. `typedef`를
적을 경우 컴파일러가 컴파일 타임에 해당 이름에 지정된 타입으로 변환하는 동작을
수행한다.


```cpp
#include <iostream>

// using은 해당 문장을 정확히 대체한다.
// typedef int DWORD;
// typedef void(*F)(int);

// 가독성은 더 좋아짐.
using DWORD = int;
using F = void(*)(int);

int main() {
	int main()
	{
		DWORD n;
		F f;
	}
}
```

`using`은 `typedef` 기능을 정확히 대체한다. 그럼 `using`은 왜 사용하는가?

`typedef` 같은 경우 *타입*에 대해서만 오직 별칭이 가능했다. `using` 같은 경우
*template*에 대해 별칭을 만들 수 있다.

*template*에 대한 내용은 뒷부분 혹은 다른 강좌에서 다루도록 한다.

우선, `using` 키워드가 있고, `typedef`를 대체하며 더 넓은 기능을 제공하니 별칭을
사용해야된다면 `using`을 사용하자!

### auto 타입
Modern C++ 에는 새로운 타입 `auto`가 등장한다.

```cpp
#include <iostream>

int main()
{
	// int x[3] = { 1, 2, 3 };
	// int n1 = x[0];
	// int 형태를 double로 변경하려면? 직접 타입을 모두 바꿔줘야함.
	double x[3] = { 1, 2, 3 };
	double n1 = x[0];
}
```

위의 코드에서 보이는 것과 같이 기존에 `int`로 선언해 둔 배열을 `double`로
변경하게 될 경우 배열의 타입 뿐만아니라 `n1`과 같이 값을 꺼내는 부분을 모두 변경해줘야한다.

너무 귀찮은 작업이다. C++ 진영에서는 이런 귀찮은 작업을 막기위해 *우변의 수식을
보고, 좌변의 타입을 결정*하도록 `auto` 타입을 만들었다.

```cpp
#include <iostream>

int main()
{
	double x[3] = { 1, 2, 3 };
	auto n1 = x[0];

	auto n2; // 컴파일 에러발생.
}
```

위의 코드와 같이 `auto`는 좌변의 값을 통해 우변의 타입을 결정한다. `auto`의 큰
특징은 *반드시 초기값을 전달*해야한다. 만약 초기값이 없다면 Error가 발생하게
된다.

타입을 결정하는 게 *실행시간이 아니라 Compile 타임에 결정하도록* 되어있기 때문에
성능상 문제가 없다.

#### decltype이란?
뒷 포스팅에서 자세하게 다루겠지만, `decltype` 같은 경우 초기값 유무와 관계 없이
*괄호 내 들어있는 타입으로* 만들어달라고 지시하는 키워드이다.

```cpp
#include <iostream>

int main()
{
	double x[3] = { 1, 2, 3 };
	auto n1 = x[0];

	// decltype 괄호 내 있는 타입으로 만들어줘 ->  double
	decltype(n1) n2;
}
```

우선 문법적 내용만 보도록하자. 사실 더 심화내용이 있지만 그건 중급 내용 혹은 뒷
포스팅에서 다루도록 한다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
