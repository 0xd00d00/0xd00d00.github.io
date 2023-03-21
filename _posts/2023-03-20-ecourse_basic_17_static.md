---
layout: post
author: 널두
title: "[C++ Basic] C++ Static member data / function"
subtitle: "C++ 멤버 Static 키워드는 언제 사용할까? 😊"
date: 2023-03-20
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 Static member 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 C++의 *static member data* 와 *static function*에 대해
알아보겠습니다.

### 전역변수의 문제점
프로그램에서 객체들이 몇개나 동작하는지 알 수 있는 방법은 어떤게 있을까?

보통 아래와 같이 생성자와 소멸자를 활용해 구현을 해 볼 수 있다.

```cpp
#include <iostream>

class Car
{
	int speed;
	int cnt;

public:
	Car() { ++cnt; }
	~Car() { --cnt; }
};

int main()
{
	Car c1, c2;
}
```

위 코드와 같이 구현하게 될 경우, 생성되고 소멸될 때 개수를 증감시켜 현재
동작하는 객체를 관리하고자 한다. 하지만, 위 코드와 같이 작성할 경우 `cnt`
데이터가 객체 간 공유되지 못해 실제 개수를 파악하기 어렵다.

`cnt` 같은 경우 멤버 데이터로, 각 객체 별로 각 독립적으로 가지고 있다.

이를 개선하기 위해서는 `cnt`를 공유할 수 있도록 해야되는데, 우리가 흔히 생각할
수 있는 방법은 *전역 변수* 선언이다.

```cpp
#include <iostream>

class Car
{
	int speed;
public:
	Car() { ++cnt; }
	~Car() { --cnt; }
};

// global 변수 선언
int cnt = 0;

int main()
{
	Car c1, c2;

	std::cout << cnt << std::endl;
}
```

위와 같이 작성할 경우, 실제 프로그램에서 동작하는 *객체의 개수*를 알 수 있다. 이
코드에는 큰 문제가 있는데, 바로 *데이터 손실*이 발생할 수 있다.

```cpp
int main()
{
	Car c1, c2;

	// cnt에 "직접" 접근해 데이터 변경 가능
	cnt = -1;

	std::cout << cnt << std::endl;
}
```

위 코드와 같이 `cnt` 값에 직접 접근해 데이터를 *변경*할 수 있다.

우리가 *객체 지향*을 하는 가장 큰 이유가 *캡슐화를 통한 데이터 관리*인데, *전역
변수*를 사용할 경우 본질적 의미를 깨버린다.

이를 해결하기 위해 등장한 것이 바로 *static member data*이다.

### static member data
우선 사용 방법 부터 보도록 하자.

```cpp
#include <iostream>

class Car
{
	int speed;
public:
	// 아래와 같이 선언해야함.
	static int cnt;
	Car() { ++cnt; }
	~Car() { --cnt; }
};

// static 멤버 데이터 정의
// cnt가 어디서 왔는지 표시하기 위해 *클래스명을 적어줘야함*
Car::cnt = 0;

int main()
{
	Car c1, c2;

	std::cout << c1.cnt << std::endl;
}
```

위 코드와 같이 작성할 경우 *멤버 데이터* 와 같이 사용하지만, static선언으로
*데이터 공유*를 할 수 있다.

해당 문법의 가장 큰 특징은 2가지이다.

*1. Class 내에는 선언을 해야한다. (static 키워드 포함)*

*2. static 멤버 데이터의 정의는 class 외부에서 해야한다. (static 키워드는 미포함)*

static 멤버 데이터를 정의할 떄는 꼭 *static* 키워드는 빼야한다는 점을 기억하자.
또한, 해당 데이터가 어떤 *class 에서 선언되었는지*를 알려주기 위해 *Class명::* 을
static 멤버 데이터 앞에 적어줘야한다.

#### Static 멤버 데이터 호출 방법
`static member data`를 호출하는 방법에는 2가지가 있다.

```cpp
int main()
{
	Car c1, c2;

	std::cout << c1.cnt << std::endl; // 1
	std::cout << Car::cnt << std::endl; // 2
}
```

*[1]* 방법 같은 경우 *멤버 내 데이터*를 호출하듯이 부르면 된다. `cnt` 값을 멤버
데이터로 가지고 있기 때문이다. *[2]* 방법은 어떻게 동작하는걸까?

`static member data` 같은 경우 메모리를 독자적으로 가지고 있으며 일종의
*전역변수*와 같이 사용된다. 즉, 객체 내 존재하는 것과 같아 보이지만, 실제로는
독자적인 메모리를 갖고 있으며, 객체에 속하는 건 아니다.

`sizeof` 키워드로 추출할 경우 사이즈가 *static member data*는 빠지느 값으로
출력될 것이다.

위와 같은 이유로, *객체 생성 유무와 관계없이* `cnt`는 호출이 가능하다. 다만,
`cnt`가 어떤 객체의 cnt 인지 알려주기 위해 *class명::* 붙여서 *[2]*과 같이 호출한다.

*[1]* 과 *[2]*은 둘 다 동일한 값을 출력하며, 사용방법만 다르다. C++에서는
*클래스 이름을 활용한 접근 방법*을 권장한다.

우리가 *[1]* 과 같이 사용할 경우 해당 데이터가 *멤버 데이터* 인지 *static 멤버
데이터*인지 구별이 어렵다.

다른 언어에서는 이런 문제를 해결하기 위해, `static`일 경우 무조건 `Class::`을
통한 접근만 가능하도록 해버렸다. (e.g. C#, Java)

#### Static member 사용 이유 (정리)
*Static member data*의 사용하는 이유는 2가지이다.

*1. 접근지정자를 활용한 데이터 보호 가능*

*2. 객체 간 공유가능*

위 2가지를 사용하기 위해 우리는 *static member data*를 쓴다.

### Static member function의 필요성
우리는 앞서 static memeber data에 대해 알아보았다. 예시 코드에서는
`public`영역에 해당 값을 뒀는데, 이를 `private`으로 옮길 경우 어떻게 해야되는가?
알다시피 *getter*를 활용해 외부에 interface를 통한 접근을 할 수 있도록 해야한다!

```cpp
#include <iostream>

class Car
{
	int speed;
	// private으로 옮겼기 때문에 외부에서 접근이 불가능함.
	static int cnt;
public:
	Car() { ++cnt; }
	~Car() { --cnt; }

	int getCount() { return cnt; }
};

int Cnt::cnt = 0;

int main()
{
	Car c1, c2;

	// getter 객체로 cnt를 출력할 수 있다.
	std::cout << c1.getCount() << std::endl;
}
```

위 코드와 같이, `getCount()`를 호출하여 `cnt`값을 외부에서도 출력이 가능하다.

```cpp
int main()
{
	c1.getCount(); // 에러남.. c1이 없음.
	Car c1, c2;
}
```

만약 위와 같이 자동차 객체가 없는데 `cnt`를 출력하려면 어떻게 해야될까?

우리가 일상에서 생각해보면, 자동차를 셀 때 자동차가 없어도 셀 수 있어야한다.
즉, 한대도 없다면 "0" 을 출력해야된다.

하지만, 지금 같은 경우 멤버함수로 구현되어져 있어서 `getCount()`가 객체가 없으면
사용이 불가능하다.

이를 핵결하기 위해서는 *static member function*을 활용해야한다.

### Static member function
`static` 키워드를 멤버함수에 적어주면 *static member fucntion*으로 선언함을
의미한다.

```cpp
class Car
{
    ...
public:
	// static 멤버변수 선언
	static int getCount() { return cnt; }
};

int Cnt::cnt = 0;

int main()
{
	std::cout << Car::getCount() << std::endl;
	Car c1, c2;

	// getter 객체로 cnt를 출력할 수 있다.
	std::cout << c1.getCount() << std::endl;
}
```

*static member function* 사용하기 위해서는 클래스 명을 적어줘야한다. 적어주지
않을 경우 일반함수와 구별이 불가능하기 때문에 *클래스명::*을 적어주는 것을
잊지말자!

*Static member function*의 특징에 대해 조금 더 자세하게 알아보자.

```cpp
class Test
{
	int data1;
	static int data2;

public:
	void f1()
	{
		data1 = 0; // 1
		data2 = 0; // 2
	}

	static void f2()
	{
		data1 = 0; // 3
		data2 = 0; // 4
	}
};
```

`Test` 클래스에서 함수를 호출할 경우 *1 ,2 ,3, 4* 중 어디서 에러가 발생할까?

바로 *3*에서 에러가 발생한다. (Test::f2() 호출시.)

*3* 같은 경우 일반 멤버 데이터로 *객체가 생성될 경우* 메모리에 적재된다. 반면
`data2` 같은 경우 *static 멤버데이터*로 객체 생성 유무와 관계없이 데이터가
적재되어있기 때문에 `Test::f2()`를 호출하여도 문제 없다.

위를 기반으로 생각했을 때, *Static member function* 같은 경우 *static member
data*에서만 접근가능하다는 것을 알 수 있다.

*static member function* 같은 경우 선언부에만 `static` 키워드를 붙여주면 되는데,
이는 *static member data* 선언, 구현부와 동일하다고 생각하면 된다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
