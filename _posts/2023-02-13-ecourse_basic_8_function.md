---
layout: post
author: 널두
title: "[C++ Basic] C++ function의 특징 #3"
subtitle: "constexpr 함수, delete, suffix return에 대해 알아보자~"
date: 2023-02-13
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 함수의 특징에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
오늘의 포스팅에서는 *constexpr 함수* / *delete 키워드* / *suffix return* 에 대해
알아보겠습니다.

### constexpr 함수
```cpp
int main()
{
	int n = 1 + 2;
}
```

위 코드와 같이, `n` 값에 지정되는 `1+2` 동작은 *컴파일 시간*에 할까? *실행
시간*에 할까?

위와 같이 적을 경우 `1+2` 동작은 *컴파일 시간*에 발생한다.

```cpp
int Add(int a, int b)
{
	return a + b;
}

int main() {
	Add(1, 2);
}
```

위 코드는 인자를 *컴파일 상수값*으로 전달했는데, 이 경우는 *컴파일 시간*에
실행할까? *실행 시간*에 할까?

위와 같이 적을 경우 `Add()` 호출동작이 필요함으로, 전달하는 인자값과 관계없이
*실행 시간*에 일어난다.

사용자는 분명 *컴파일 상수값*을 전달했는데, *컴파일 시간*이 아닌 *실행 시간*에
값을 돌려받으니.. 이를 개선할 방법이 없을까? 하는 시작점에서 해당 문법은
출발한다.

우리가 [앞선 포스팅](https://0xd00d00.github.io/2023/02/11/ecourse_basic_3_variable_2.html)에서 주야장천 이야기했던 `constexpr`을 사용하면 *컴파일
시간 실행함수*를 만들 수 있다.

```cpp
// 아래와 같이 constexpr 키워드 활용
constexpr int Add(int a, int b)
{
	return a + b;
}

int main() {
	Add(1, 2); // 컴파일 시간
	// 확인을 위해 배열 값에 인자로 넣어봐라.

	int x[ Add(1,2) ];
}
```

위와 같이 배열 크기로 *컴파일 시간 값*을 확인할 수 있다. 해당 동작은 C++
표준에서 undefined로 정의되어져 있어 *컴파일러 사*마다 다르게 동작한다.

g++ 컴파일러 같은 경우 *변수 / 함수 등* 컴파일 시간에 알 수 있는 값이면 *배열의
크기 값*으로 넣을 수 있도록 설계되었다.

다른 컴파일러인 vc++ 같은 경우 *배열의 크기*는 오직 값만 들어오도록 설계되었다.

따라서, 위 테스트를 하기 위해서는 컴파일러에 따라 다르게 동작할 수 있으니
확실하게 동작을 보고 싶다면, *g++ compiler*를 활용하도록 하자.

(본인은 g++ compiler를 활용해 테스트 했다.)

위와 같이 `constexpr` 키워드를 활용한 함수 같은 경우 *컴파일 시간 함수*이기
때문에 `Add()`를 배열 크기에 넣어도 에러가 발생하지 않는다.

보통 최적화를 위해 많이 사용한다. 그렇다면, 그냥 모든 코드에 `constexpr`을
붙여주면 되지 않을까? 생각할 수도 있다.

하지만, `constexpr`을 붙이 코드 내에서는 *모든 함수 내 동작이 컴파일 시간* 내
처리되는 것을 보장해야된다.

즉, 코드 사용에 제한이 생길 수 있다. `constexpr`를 활용한 함수는 template
부분 혹은 Library 설계하는 부분에서 많이 볼 수 있다.

### delete 키워드
Modern C++ 에서 추가된 키워드 중 `delete` 키워드가 존재한다.

왜 해당 키워드가 필요한지 알아보자!

```cpp
void foo(int a){}

int main() {
	foo(3.4);
}
```

위 코드에서 `foo()`의 문제점은 오직 `int`값만 받는 것이다. 따라서, `foo()`를
다른 타입 (e.g. double)로 호출할 경우 *데이터 손실*이 발생할 수 있다. 이
*손실*은 훗날 큰 버그를 유발하기 때문에 사전에 막는 것이 좋다.

이를 막기 위해 `double` 값이 들어간 값을 부르지 못하도록 해보자. 우리는 [앞서
배운 내용](http://localhost:4000/2023/02/12/ecourse_basic_7_function_1.html), function overloading 활용해 해당 함수를 부르지 못하도록 할 수 있다.

```cpp
// function overloading을 통해 부르지 못하도록 막아보자.
void foo(int a){}

// overloading을 통해 구현부를 안만들면 에러가 발생함.
void foo(double a);

int main() {
	foo(3.4);
}
```

위 코드와 같이 *function overloading*을 활용해 실제 불리는 함수를 만들고, 해당
함수의 구현부를 만들지 않으면 *에러를 유발*할 수 있다.

*구현부*가 없을 경우 Linker는 linking 과정에서 *어랏.. 구현부가 없네?* 하고
`collect2` 에러를 발생시킨다.

혼자 프로그램 작업할 경우 에러가 발생해도 금방 찾을 수 있다. 만약 내가 library
설계자라면 어떨까?

컴파일할 경우 *에러는 발생하지 않는다* 따라서 library 설계자는 이 컴파일된
결과물을 다른 사람에게 제공하고, library 사용자는 해당 산출물을 붙여 프로그램을
만들게 된다.

그 시점에 에러를 발견하게 되는데.. *linker 에러* 같은 경우 에러의 위치나 설명이
자세하게 나오지 않기 때문에 *버그를 찾는데.. 아주 오랜 시간*이 걸릴 수 있다.

이런 불상사를 막기 위해 C++에서는 `delete` 키워드를 C++11 부터 추가했다.

`delete` 키워드는 사용하지 않을 것이면 *명시적*으로 표시해 컴파일러가 알 수 있게
하자 하는 의미를 가지고 있다.

```cpp
// function overloading을 통해 부르지 못하도록 막아보자.
void foo(int a){}

// 컴파일 시간 에러발생.
void foo(double a) = delete;

int main() {
	foo(3.4);
}
```

위와 같이 코드를 작성할 경우, 컴파일러가 `foo(double)`을 호출하고자 할 때,
에러를 발생시킨다.

*에러는 빨리 만날수록 좋다* 라는 점을 기억하도록 하자. (링커에러보다, 컴파일
에러가 더 낫다)

#### template 삭제
우리는 [앞선 포스팅](https://0xd00d00.github.io/2023/02/12/ecourse_basic_7_function_2.html) 템플릿의 기본 사용법에 대해 배웠다. *템플릿 은 일종의 틀* 이기 때문에 다양한 타입의 함수들을 만들 수 있다.

이 상황에서 *특정 타입만 제거*하고 싶다면 어떻게 해야할까.

```cpp
template <typename T>
T square(T a)
{
	return a * a;
}

// 특정 타입만 삭제하면 된다.
double square(double) = delete;

int main()
{
	square(3.3);
}
```

위의 코드와 같이, template을 생성하고, 삭제할 특정 타입에 대해 먼저 적고 `delete`를 적어줄 경우 컴파일러는 해당 문법을 우선시해 컴파일 한다.

### suffix return
우리는 보통 함수를 만들 때 아래와 같이 `return type`을 먼저 적어 주고 만든다.

```cpp
int square(int a)
{
	return a * a;
}

int main()
{
	square(3);
}
```

위와 같이 사용하는 것이 일반적인데, C++11 부터는 *suffix return (or trailing return)*이라는 리턴타입을 뒤에 추가하는 문법이 추가되었다.

아래와 같이 작성하면 되는데, 원래 적던 `return type` 부분에는 `auto` 키워드를
적어주면 된다.

```cpp
auto square(int a) -> int
{
	return a * a;
}

int main()
{
	square(3);
}
```

위 코드에서 나온 것 처럼, 생긴 것이 익숙하지 않으니.. 어색할 수 있다. 그럼 이런
방법을 왜 만들었을까?

C++11 이후 많은 곳에서 사용되는데 특히 *람다* / *함수 템플릿* 등을 만들 때 많이
사용된다.

조금 더 구체적으로 알아보자.

#### suffix return 탄생이유
우리는 타입을 다양하게 받기 위해 *template*을 활용한다.

```cpp
template<typename T>
T Add(T a, T b)
{
	return a + b;
}

int main()
{
	Add(1 ,2);
}
```

위와 같이 사용을 하는데, 만약 아래와 같이 다른 타입으로 보내야할 경우 어떻게
해야할까?

```cpp
template<typename T, typename U>
? Add(T a, U b)
{
	return a + b;
}

int main()
{
	// int형과 double 형의 덧샘이다.
	Add(1, 2.2);
}
```

위와 같이 2개의 다른 타입을 덧샘할 경우, `return type`을 무엇으로 해야되는지 잘
모른다. 예를들어 T만 받을 경우 T로 return해주면 되는데.. 그게 아니라면.

`T`, `U` 둘 중 사용자가 어떤 타입을 먼저 넘길지 모르기 때문에 정말 애매하다.
그럼 계산된 결과를 적으면 되는거 아닌가? 할 수 있다.

우리가 [앞선 포스팅](https://0xd00d00.github.io/2023/02/11/ecourse_basic_3_variable_1.html) 을 통해 `decltype`을 배웠다. `decltype`은  *괄호 내 결과 타입을* 통해 타입을 결정하는 방법이다.

아래와 같이 적어 해결하면 안될까?

```cpp
template<typename T, typename U>
decltype(a + b) Add(T a, U b)
{
	return a + b;
}
```

위와 같이 선언할 경우, 아주 깔끔하게 해결될 것 같지만.. 에러난다. *컴파일러
입장*에서는 `decltype` 타입 내 들어있는 `a` / `b` 값이 선언되어있지 않고
사용되어진다고 판단한다.

에러를 살펴보면 함수의 호출로 인한 *인자 선언부분* 보다 `decltype`이 먼저 인자를 사용하기
떄문이다.

이를 개선하기 위해 *suffix return*이 생기게 되었다.

```cpp
template<typename T, typename U>
auto Add(T a, U b) -> decltype(a + b)
{
	return a + b;
}
```

위와 같이 사용할 경우 *선언 후 사용하는 것* 이기 때문에 문제 없이 동작한다. 주로
일반함수 사용보다는 Library 생성 할때 많이 사용하고 언급했지만 "lamda" /
"template" 을 만들 때 많이 사용한다고 알고 있으면 좋을 것 같다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
