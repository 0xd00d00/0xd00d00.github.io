---
layout: post
author: 널두
title: "[C++ Basic] const member function"
subtitle: "const member function의 필요성에 대해 알아보자!! 😁"
date: 2023-03-21
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 const member function 필요성에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 C++에서 사용하는  *const member function 의 사용법 및 필요성 / 특징* 에 대해 알아보겠습니다.

### Const member function 필요성
```cpp
#include <iostream>

class Point
{
	int x, y;
public:
	Point (int a, int b) : x(a), y(b) {}

	void set(int a, int b)
	{
		x = a;
		y = b;
	}

	void print()
	{
		std::cout << x << ", " << y << std::endl;
	}
};
int main()
{
	const Point p(1,2);

	// p.set(1,1); 에러 발생
	p.print();
}
```

위와 같은 코드가 있다고 하자.

`set` 함수 같은 경우, `const`객체의 값을 변경하고자 하기 때문에 *에러를 발생*
시킨다는 것을 우리는 쉽게 알 수 있다. 그렇다면 그저 출력만 담당하는 `print()`는 어떨까?

해당 함수는 문제가 없지 않을까?
코드를 컴파일 해보면 에러가 발생한다.

에러가 나는 이유를 생각해보자.

우리는 보통 함수를 작성할 때, 선언부와 구현부를 나눠 작성한다.

```cpp
#include <iostream>

class Point
{
public:
	...
	// 선언부만 있는 상황
	void print();
};

Point::print()
{
	std::cout << x << ", " << y << std::endl;
}

int main()
{
	const Point p(1,2);

	p.print();
}
```

위와 같은 상황에서 컴파일러는 `print()` 선언만 알 수 있다. 즉, 구현부는 어떻게
되어있는지 알 수 없다. 그건 *링커*의 역할이기 때문이다. 따라서, 컴파일러는
구현부에서 변경될 가능성이 있기 때문에 알 수 없어서 에러를 유발한다.

그렇다면 `print()`는 정말 사용할 수 없는 것일까?

바로 `const` 멤버함수로 만들 경우 해당 함수를 부를 수 있다. `const` 함수를
만드는 상황을 꼭 기억하자! 필요성이 정말 중요하다!

```cpp
// const 키워드를 멤버함수 뒤에 적어주면됨.
Point::print() const
{
	std::cout << x << ", " << y << std::endl;
}
```

위와 같이 `print()` 멤버함수 뒤에 `const` 키워드를 적어줄 경우 *컴파일러 에게
이건 상수 전용이다. 즉, 내부적으로 값을 변경하지 않아..* 라는 것을 알려주는
것이다.

`const` 멤버함수 잘 안쓰는거 아니야? 생각할 수 있는데, 우리 정말 많이 사용한다.
내부적으로 값을 변경하지 않을 경우 무조건 `const`를 붙여줘야한다.

또다른 상황을 한번 보자.

```cpp
class Point
{
	int x, y;
public:
	Print(int a, int b) : x(a) , y(b) {}

	void print()
	{
		std::cout << x << ", " << y << std::endl;
	}
};

void foo(const Point& p)
{
	p.print(); //??
}

int main()
{
	Point p(1, 2);

	p.print(); // ok
	foo(p);
}
```

우리는 앞서 `const &`를 활용해 `call by value` 에서 발생하는 값 복사 overhead를
제거했다. 자세한 내용은 [여기](https://0xd00d00.github.io/2023/02/15/ecourse_basic_10_reference_1.html)를 확인하기 바란다.

위와 같이 함수의 인자로 받을 때 `const&`를 활용하게 된다면 전달받는 함수가
`const`화 된다.

이떄, 내부 멤버함수를 호출하게 될 경우 어떻게 될까? 바로 *에러가 발생*한다.

`const` 객체가 일반 멤버함수를 부를 경우 내부적으로 값이 변경될 수 있기 떄문에
에러가 발생한다.

따라서, 이 경우에도 아래와 같이 `const`화 해줘야한다.

보통 잘 모르면, `const`는 나랑 안맞아하고.. `const`를 제거하는데.. 절대 하면
안된다. overhead를 제거하기 위해 넣은 것인데, 만약 제거한다면 overhead 발생하게
된다.

```cpp
class Point
{
	void print() const
	{
		std::cout << x << ", " << y << std::endl;
	}
};
```

이외에도 우리가 만약 멤버 데이터를 얻어오는 *getter* 동작만 있다면 보통
`const`를 붙여주는 게 좋다. 아래와 같이 `getX` `getY`를 만드는 습관을 들이자.

```cpp
class Point
{
	int x, y;
public:
	getX() const { return x; }
	getY() const { return y; }
};
```

### const member function 특징
#### (1) mutable
아래의 코드가 있을 때, `print()`의 성능을 측정하고자 한다면 어떻게 해야될까?

```cpp
#include <iostream>

class Point
{
	int x, y;
	int cnt = 0;
public:
	void print() const
	{
		cnt++; // 이거 가능할까?
		std::cout << x << ", " << y << std::endl;
	}
};

int main()
{
	Point p(1,2);
	p.print();
}
```

`print()`의 성능을 알기 위해 `cnt`를 활용해 함수의 호출 횟수를 기록해 성능
지표로 만들고자 한다.

`cnt`를 증가시키는 행위가 가능할까? 현재의 코드에서는 불가능하다. `const`
멤버함수로 선언되어 있기 때문에 내부에서 어떤 것도 변경할 수 없다.

이 경우 어떻게 해야할까?

보통 오픈소스에서 많이 활용하는데, `mutable`이라는 키워드를 활용한다.

해당 변수는 특별한 경우 사용하는 것으로, 테크닉상 `const` 멤버 함수 내에서도
값을 변경할 수 있도록 한다.

```cpp
class Point
{
	...
	// 아래의 cnt를 mutable로 선언해주어라.
	mutable int cnt = 0;
public:
	...
}
```

위와 같이 `mutable`로 선언할 경우 문제없이 컴파일되고 실행되는 것을 확인 할 수
있을 것이다.

이름 그대로 *돌연변이*라서 특정한 경우에 사용해야되고, 일반적인 소스에서는 잘
만나지 않을 것 같다 정도로 이해하면 좋다. (그래도 혹시 나올 수 있으니, 키워드
정도와 왜 사용하는지는 알아두자!)

#### (2) const overloading
```cpp
class Test
{
	int data = 0;
public:
	int* getPoint() const { return &data; }
};

int main()
{
	Test t;
	t.getPoint();
}
```

위 코드에서 `getPoint()`를 호출할 때 에러가 발생한다. `const`멤버함수라 안에서
변경하는 것도 없는데 왜 에러가 발생할까?

그 이유는 `return` 값에 있다. `data`의 주소값을 리턴하게 될 경우 외부에서
전달받아 값을 변경할 수 있다. 따라서, `const` 멤버함수의 특징을 벗어나게 됨으로
해당 문법은 에러를 유발한다.

이를 막기위해서는 `return` 값을 `const`로 선언해주면 된다.

```cpp
class Test
{
	int data = 0;
public:
	// 이와 같이, const로 반환할 경우 compile 에러를 제거할 수 있다.
	const int* getPoint() const { return &data; }
};

int main()
{
	Test t;
	t.getPoint();
}
```

또다른 `const` 멤버함수의 특징은 *const overloading*이다.

```cpp
class Test
{
public:
	void foo { std::cout << "1" << std::endl; }
	void foo const { std::cout << "2" << std::endl; }
};

int main()
{
	Test t1;
	t1.foo();

	const Test t2;
	t2.foo();
}
```

`t1`을 통해 `foo()` 호출할 경우 "1" 이 호출되게 된다. 만약 없을 경우 "2"를
호출하도록 한다.

즉, C++에서는 `const` 멤버함수와 일반함수를 구별하도록 한다.

만약 `t2`와 같이 `const`로 선언된 class일 경우 무조건 "2" 를 호출하도록 한다.
만약 없을 경우 compile error를 유발한다.

이를 통해 알 수 있는 것은 우리가 선언부에 `const` 멤버함수를 적고 외부에서
구현부를 만들 경우 꼭 `const`를 붙여줘야한다는 점이다.

아래와 같이 붙여줘야하는데, 만약 붙여주지 않을 경우 *일반함수와 const 멤버함수를
구별 할 수 없기* 때문에 compile 입장에서는 const가 없어 일반함수로 간주하게
된다.

따라서, 선언부에서 `const` 멤버함수의 선언이 있지만, 구현부가 없어 에러날 수
있으니 꼭 구현부에도 `const`를 적어주도록 하자.

```cpp
class Test
{
public:
	void foo() const;
};

// const 빼면 에러남.
void Test::foo() const{

}

int main(){

}
```

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
