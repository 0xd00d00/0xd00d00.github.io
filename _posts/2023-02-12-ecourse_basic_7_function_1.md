---
layout: post
author: 널두
title: "[C++ Basic] C++ function의 특징 #1"
subtitle: "default parameter, function overloading, inline의 특징을 알아보자!!"
date: 2023-02-12
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 함수 특징에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *default parameter* / *function overloading* / *inline
function* 에 대해 알아보겠습니다.

### default paramter
C++ 함수에서 사용하고 있는 함수의 특징 중 default paramter라는 것이 있다. 이걸
왜 사용하는지와 어떤 주의사항이 있는지에 대해 알아보자.

```cpp
void setAlarm(int h, int m, int s)
{
}

int main() {
	setAlarm(3, 4, 5);
}
```

위의 코드를 보면 Alarm을 세팅하는 프로그램이다. 3시 4분 5초에 알람을 맞춰줘 라고
작성된 프로그램이다.

사람들은 통상 알람을 맞출 경우 3시, 4시에 맞춘다. 그럴 경우 아래와 같이
프로그램이 수정되어야하는데, 0의 값을 계속 넣어주는게 귀찮을 수 있다.

```cpp
int main() {
	// 귀찮을 수 있음.. 0을 넣는게
	setAlarm(3, 0, 0);
}
```

C++ 함수에서는 위와 같이 기본적으로 사용되어야 하는 값 즉, 0과 같이 자주 사용되는 값을 default 값으로 설정해둘 수 있다.

```cpp
void setAlarm(int h, int m = 0, int s = 0)
{
	// 0을 입력할 필요 없다.
}

int main() {
	// 가능
	setAlarm(3);

	// 인자 2개 넣는거 가능
	setAlarm(3, 4);

	// 인자 3개 넣는거 가능
	setAlarm(3, 4, 5);

	// 인자 안주면 -> 에러..
	setAlarm();
}
```

위 코드와 같이, default 값이 설정된다면 이후 값을 전달하지 않아도 기본적으로
값이 세팅된다. 만약 사용자가 값을 전달하기 원한다면 값을 추가로 전달했을 때
전달된 값을 사용하도록 한다.

하지만, default 값이 설정되지 않은 부분에 값을 주지 않는다면 컴파일 에러가
발생한다는 점을 기억하자.

#### default parameter 사용 시 주의 사항
주의사항은 2가지이다.

*🌱 함수의 마지막 파라미터 부터 차례대로 지정해야됨*

```cpp
void setAlarm(int h, int m = 0, int s) {}

int main() {
	setAlarm(3, 4);
}
```

위와 같이 코딩할 경우 컴파일러가 `4`를 `m`에대 보내야할지 `s`에다 보내야할지 알
수없기 때문에 *컴파일 에러*가 발생한다.

default paramter를 지정할 때는 *함수 오른쪽, 가장 마지막 부터 순차적*으로 지정해야된다는
점을 꼭 기억하자.

그럼 이건 될까?

```cpp
void setAlarm(int h = 0, int m , int s = 0) {}
```

위 코드도 에러가 발생한다. *default parameter는 순차적으로 오른쪽부터*
넣어야하기 때문이다. `m`을 건너뛰고 `h`를 default로 지정할 수 없다!!

*🌱 함수 선언과 구현을 분리할 경우 선언에만 디폴트 값 표기*

프로그램을 작성하다보면 "선언" 과 "구현"을 분리해서 사용하는 경우가 많다.

이때 default parameter는 어디에 적어야될까? 우선 둘 다 적을 경우 어떤 문제가
있을까?

*1. 선언부와 구현부에 모두 default paramter를 적을경우*

```cpp
void setAlarm(int h , int m = 0, int s = 0);

int main()
{
	// 둘다 적어줌
	setAlarm(3,4);
}

void setAlarm(int h , int m = 0, int s = 0) {
}
```

아래와 같이 선언부에 있는 데.. *재정의 하려고한다고 에러*를 만나게 될 것 이다.

```cpp
test.cc:9:27: error: redefinition of default argument
void setAlarm(int h , int m = 0, int s = 0) {
                          ^   ~
test.cc:1:27: note: previous definition is here
void setAlarm(int h , int m = 0, int s = 0);
```

기억하자!! 둘 중 하나만 적어야한다!

*2. 구현부에만 default paramter를 적을경우*

```cpp
void setAlarm(int h , int m, int s);

int main()
{
	// 구현부 적어줌
	setAlarm(3,4);
}

void setAlarm(int h , int m = 0, int s = 0) {
}
```

이 케이스도 *컴파일 에러*를 마주할 것이다. 보통 함수를 호출할 때 우리가
참고하는건 *함수의 선언*부분이다. 지금 함수의 선언 부분에는 default paramter가
없기 때문에 3개의 인자를 전달해야한다.

따라서, `main()`에서 사용하고 있는 `setAlarm`에 인자가 적다는 에러를 나타낼
것이다.

*결과적으로 default paramter는 선언부에 꼭 적어줘야한다는 것을* 알 수 있다!!!

### function overloading
C++ function overloading 개념에 대해 알아보자.

아래의 코드를 보면, `square` 함수를 호출하고 있다. `square` 같은 경우 인자로 `int` 값을 받도록 선언되어져있다.

하지만, 사용자가 `double`의 값을 보내면 어떻게 될까?

에러는 없다. Compile가 *암묵적 형변환*을 하기 때문이다. 즉, 3.3 -> 3으로 소수점 이하를 제거하는 데이터 손실이 발생하게 된다.

```cpp
#include <iostream>

int square(int a)
{
	return a*a;
}

int main()
{
	square(3);
	square(3.3);
}
```

위와 같은 데이터 손실이 발생할 경우 *알 수 없는 버그의 원인*이 된다. 미연의
방지를 꼭해야한다.

C++에서는 안전적으로 해당 문제를 해결하기 위해 *function overloading*이라는
방법을 활용한다.

구체적으로, C++에서는 *동일한 함수 이름으로 전달받는 인자의 타입*을 달리하여 overloading 할 수 있도록 하는 *function overloading* 개념을 사용한다.

C에서는 함수이름을 달리해 오버로딩을 했다면, C++에서는 동일한 함수이름으로
함수를 2개를 만들 수 있다. 단, *인자의 타입 또는 개수가 달라야*한다.

아래의 코드를 통해 확인해보자.

```cpp
#include <iostream>

int square(int a)
{
	return a*a;
}

// return 타입은 double로 변경을해도 상관없다.
// overloading을 설명하기위해 우선 리턴타입도 동일하게 적어두기로 함.
int square(double a)
{
	return a*a;
}

int main()
{
	square(3);
	square(3.3);
}
```

위와 같이, 작성할 경우 `3.3` 같은 경우 `int square(double a)` 함수를 호출하게
된다.

함수의 제작자 입장에서는 2개로 보이지만, *사용자 입장에서는 함수1개를 호출하는
것*으로 보여진다.

라이브러리를 구축할 때 사용자를 위한 일반화 프로그래밍을 할 수 있다는 장점이
생긴다.

편리한 *function overloading* 기법을 사용할 때, 2가지 주의사항을 기억해야한다.

#### function overloading 주의사항
아래의 코드와 같이 function overloading을 사용할 때, *타입과 개수*를 달리하야한다고 강조했다.

```cpp
// 타입이 다르다.
// function overloading 가능
void f1(int a) {}
void f1(double a) {}

// 인자의 개수가 다르다.
// function overloading 가능
void f2(int a) {}
void f2(int a, int b) {}
```

function overloading을 활용할 때 아래의 2가지를 꼭 주의해서 사용하자.

*🌱 default paramter 값을 조심하자*

```cpp
void f2(int a) {}

// default parameter 사용, 인자를 1개로 취급함.
// 인자의 타입과 개수가 동일하기 때문에.. -> 컴파일 에러남. 어디로 보내야할지
모름
void f2(int a, int b = 10) {}
```

`f2(1)`이라는 값을 전달할 경우, *default paramter*를 사용하는 함수 때문에 어디로
보내야하는지 컴파일러가 판단할 수 없다.

즉, 동일한 이름의 동일한 개수와 타입을 가진 함수가 2개가 있다고 판단하기 때문에
컴파일 에러가 발생한다!

*Default parameter* 사용 유무를 확인하고, function overloading을 사용하도록
해야한다.

*🌱 return type만 다를 경우*

아래와 같이 사용할 때도 컴파일 에러가 발생하게 된다.

```cpp
// return type이 다르다.
void f1(int a) {}
double f1(int a) {}
```

위 코드와 같이 *return type*만 다르고 함수의 이름과 동일한 타입, 개수를 가질
경우 컴파일러가 어떤 함수를 호출해야되는지 알 수 없다.

즉, 컴파일러 입장에서는 함수의 이름, 전달하는 인자 개수와 타입을 통해 호출할
함수를 파악한다. *return type*은 전달받는 대상자에게 중요한 것이지 호출자에게는
중요한 부분이 아니다.

따라서, 컴파일러는 어떤 함수를 부를지 몰라 *컴파일 에러*를 나타낸다.

function overloading은 *return type*만 다르게해서 사용하면 안된다!

### inline function
`inline`이라는 키워드를 C++를 사용하다면 종종 만날 수 있다.

`inline`은 *컴파일러가 해당 함수를 호출하는 것이 아닌* 기계어 코드로 치환하도록
하는 키워드이다.

최적화를 위한 코드이다. 우리가 C에서 흔히 사용하는 macro와 비슷한 동작을 한다.
C++에서 도입되었지만, C언어에도 훗날 업데이트를 통해 inline 키워드를 사용할 수
있도록 추가했다.

키워드를 쓰면 어떤 식으로 동작하는지 아래의 코드를 통해 알아보자.

```cpp
#include <iostream>
int Add1(int a, int b)
{
	return a + b;
}

inline int Add2(int a, int b)
{
	return a + b;
}

int main()
{
	int a = 1, b = 2;

	int n1 = Add1(a, b);

	int n2 = Add2(a, b);
}
```

위의 코드를 봤을 때, `inline` 키워드를 붙인 `Add2` 함수 같은 경우 호출로
이뤄지는 게 아니라 내부적으로 기계어 코드로 변역해 *컴파일러가 치환동작*을 한다.

치환된 정보를 알고 싶다면 g++ -S 옵션을 통해 *assembly file*을 추출해 내부를
확인해보도록 하자. 만약 나오지 않을 경우 Compile option이 추가되어있을 수 있으니 그 부분도 충분히 확인해보도록 하자.

`inline`을 함수를 사용하면 장점과 단점은 명확하다.

장점 같은 경우, 함수의 호출이 없기 때문에 *빠르게 동작* 할 수 있다.

단점 같은 경우, 치환되는 함수의 크기가 있어서 *코드 사이즈가 커*질 수 있다.

이때, 모든 코드가 커지는 것은 아니고, 한 줄 정도의 코드라면 inline사이즈가
오히려 좀 더 작아질 수도 있다. (assembly code)를 통해 확인가능.

#### inline function 주의 사항
inline function을 사용할 때 주의해야될 점은 *Header file과 Source code를 분리*할
때이다.

우리가 보통 프로그램을 만들 때 Header file과 Source code를 분리해 관리하도록
한다.

Header file에는 선언부를 적고, Source code에는 구현부를 적는다. Compile가 컴파일
할 때, Header file을 참고해 함수를 호출하고자 하는데, 만약 선언부만 있다면
"어딘가 있겠지.. 링커가 찾아 줄거야." 하고 링커단계로 넘겨 처리하도록 한다.

하지만, *inline 함수* 같은 경우 컴파일러가 기계어코드로 변환해 치환을
해주어야한다.

```cpp
// Add.h 파일
// Header file -> 구현부는 따로 있음.
int Add1(int a, int b);
inline int Add2(int a, int b);
```

위의 코드는 헤더파일이다.

```cpp
#include "Add.h"

int main() {
	// Add2 호출하면 컴파일 에러 발생.
	Add2(1, 2);
}
```

위의 코드는 `Add2` 호출하는 코드이다. 해당 함수를 찾기 위해 `Add.h` 파일에 가서 확인해보니 `inline` 함수이다. 이를 번역해 치환해야되는데 *구현부*가 어디있는지 모른다.. 이럴 경우 컴파일러는 치환할 수 없다고 에러를 나타낸다.

즉, 구현부를 찾는 과정은 컴파일이 모두다 처리된 후 링커에서 하기 때문에, 컴파일 시점에 꼭 처리해야되는 inline 치환 처리가 에러를 유발하게 되는 것이다.

이를 해결하기 위해서는 `inline`함수를 Header file로 분리해서 사용할 땐 *항상
구현부까지 같이 적어줘야* 한다.

```cpp
// Add.h 파일
// Header file -> 구현부는 따로 있음.
int Add1(int a, int b);

// inline은 구현부랑 나누면 안되고 치환을 위해 여기서 처리하도록 해야함.
inline int Add2(int a, int b) {
	return a + b;
}
```

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
