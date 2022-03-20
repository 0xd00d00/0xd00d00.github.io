---
layout: post
author: doodoo
title: "[C++][Modern C++] enable_shared_from_this 란?"
subtitle: "Shared pointer를 사용할 때 발생할 수 있는 문제를 알아보자 😷"
date: 2022-03-19
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 enable_shared_from_this 사용법에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
이전 포스팅부터 함께 사용해 온 `car.h` 헤더파일을 공유한다. 이 header file의 근원을 보고 싶다면, [여기](https://0xd00d00.github.io/2022/03/09/cpp_smart_ptr_2.html)를 클릭해서 알아보자.

```cpp
// car.h
#include <iostream>

class Car {
  int color;
  int speed;

public:
  Car(int c = 0, int s = 0) : color(c), speed(s) {}

  // 언제 파괴되는지 알아보는 로그용
  ~Car() { std::cout << "~Car()" << std::endl; }

  void Go() { std::cout << "Car go!" << std::endl; }
};
```

위 `car.h`파일을 인클루딩해서 사용하고자 한다. 해당 코드는 생성자, 소멸자, `Go()` 기능을 구현하고 있는 단순한 Car class이다.

### Shared_ptr로 발생할 수 있는 문제
[이전 포스팅](https://0xd00d00.github.io/2022/03/10/cpp_smart_ptr_3.html)을 통해 `shared_ptr` 같은 경우 RAII 원칙을 지켜 초기화 해야되는 것을 알게되었다.

만약 이 원칙을 지키지 않고, Raw pointer를 활용하여 초기화하게 될 경우 어떤
문제가 발생하는지 알아보자. multi-thead에서 문제를 확인할 수 있는데 해당
케이스를 보도록 하자.

```cpp
#include <iostream>
#include <memory>
#include <thread>
#include "Car.h"

using namespace std;

class Worker {
	Car c;

public:
	void Run()
	{
		thread t(&Worker::Main, this);
		t.detach();
	}

	void Main() {
		c.Go();	// 멤버 data(Car) 사용
		cout << "finish thread" << endl;
	}
};

int main()
{
	shared_ptr<Worker> sp = make_shared<Worker>();
	sp->Run();
	getchar();
}
```

위의 코드를 보면, 문제 없이 잘 동작하는 코드라고 볼 수 있다. Worker의 `Run()`를
호출하게 되면, 내부적으로 thread를 생성해, Main 문을 수행하는 함수이다.

만약 아래와 같이, shared_ptr의 수명 scope가 달라지게 된다면 어떻게 될까?

```cpp
int main()
{
	{
		shared_ptr<Worker> sp = make_shared<Worker>();
		sp->Run();
	}
	getchar();
}
```

위와 같이 작성할 경우 아래 그림과 같은 문제가 발생할 수 있다.

![sptr8](/assets/img/sptr8.png)

`Worker` 객체를 생성하고, 내부적으로 thread를 생성해 Main을 수행하는 도중
scope를 벗어나게 된다. 그럴 경우 `Worker`객체를 가리키고 있는 `shared_ptr`의 파괴로 대상 객체가
파괴되고, 내부적인 `Car` 객체도 파괴되게된다. thread는 `Car` 객체를 활용해
작업을 하고 있는데, *대상객체가 먼저 파괴되는 일이 발생한다*

즉, `Worker` 객체의 수명으로 인해 발생되는 문제라고 볼 수 있다.

이 문제를 해결하기 위해서는, `sp1`이 사용유무와 관계없이 thread 가 종료되면
`sp1`을 파괴하도록 해야한다. 이 방법으로 진행하기 위해서는 thread 생성 시,
*참조계수*를 *+1* 증가시켜야한다.

#### Raw pointer를 추가하는 케이스

*참조계수*를 증가시키기 위해 `Worker` 클래스내 `shared_ptr` 포인터를 하나
둬야한다. 만약 아래와 같이 코드를 작성하게 된다면 잘 동작할까?

```cpp
class Worker {
	Car c;
	// 참조계수를 증가시키기 위한
	// shared_ptr 추가!!
	shared_ptr<Worker> holdMe;

public:
	void Run()
	{
		// Raw pointer를 추가.. //
		holdeMe = this;
		thread t(&Worker::Main, this);
		t.detach();
	}

	void Main() {
		c.Go();	// 멤버 data(Car) 사용
		cout << "finish thread" << endl;
	}
};
```

위와 같이 `holdMe`라는 포인터를 만들어 참조 계수를 증가시키고자 한다. `Worker`
본인을 가리키면 되지 않을까 해서 `this`로 초기화하게 될 경우 raw pointer로
`shared_ptr`를 초기화 하게 된다. 이럴 경우 [이전 포스팅](https://0xd00d00.github.io/2022/03/10/cpp_smart_ptr_3.html) 에서 만났던 문제, 제어블록이 2개 생기고 *참조계수*는 증가하지 않는 문제가 발생하게 된다.

이 문제를 해결하기 위해서는 외부에서 `shared_ptr`를 전달받아야한다.

#### shared_ptr를 전달받아 초기화
`shared_ptr`를 외부에서 전달받아 초기화할 경우 *참조계수*를 증가시킬 수 있다.

```cpp
class Worker {
	Car c;
	// 참조계수를 증가시키기 위한
	// shared_ptr 추가!!
	shared_ptr<Worker> holdMe;

public:
	void Run(shared_ptr<Worker> p)
	{
		// Raw pointer를 추가.. //
		holdeMe = p;
		thread t(&Worker::Main, this);
		t.detach();
	}

	void Main() {
		c.Go();	// 멤버 data(Car) 사용
		cout << "finish thread" << endl;
	}
};
```

위와 같이 `Worker` 클래스를 작성하고, 외부에서 `shared_ptr`를 전달해
참조계수를 하나 증가시키는 방식으로 진행한다. 그렇다면 외부에서는 어떻게
전달해야될까?

```cpp
int main()
{
	{
		shared_ptr<Worker> sp = make_shared<Worker>();
		// 인자로 sp 전달..
		// 모양이 안이쁨..
		sp->Run(sp);
	}
	getchar();
}
```

위와 같이 `sp->Run(sp)`와 같이, 부르게 되는데 이렇게 부를 경우 *코드의 가독성*이
떨어지게 된다. 이를 해결하기 위해 등장한 개념이 바로
`enable_shared_from_this`이다.

### enable_shared_from_this 의 사용
사용방법은 `enable_shared_from_this` 클래스를 상속받아 사용하며, Template 인자로 본인의
이름을 전달하면 된다. 이런 방법을 우리는 *CRTP*라고 부른다.

아래의 코드를 통해 사용방법을 보자.

```cpp
class Worker : public enable_shared_from_this<Worker> // CRTP
{
	Car c;
	shared_ptr<Worker> holdMe;

public:
	void Run(shared_ptr<Worker> p)
	{
		// 현재 객체의 제어블록을 공유해줘~
		holdeMe = shared_from_this();
		thread t(&Worker::Main, this);
		t.detach();
	}

	void Main() {
		c.Go();	// 멤버 data(Car) 사용
		cout << "finish thread" << endl;
	}
};
```

`enable_shared_from_this`를 사용하면, `this`객체를 활용해 `shared_ptr`의
제어블록을 공유할 수 있도록 한다. 제어블록을 공유하기 위해서는
`shared_from_this()`라는 함수를 호출하면 된다.

여기서 주의할 점이 2가지 있다.

1. `shared_from_this()` 호출하기 전에 반드시 `shared_ptr`객체가 만들어 즉,
   제어블럭이 만들어져 있어야한다. 만약 안만들어져있을 경우 `undefined`로 미정의
   동작을 수행한다. (가장 위험함... 😑)

2. `shared_from_this()`를 사용할 경우 직접 `reset()`을 호출해줘야한다.

```cpp
class Worker : public enable_shared_from_this<Worker>
{
	...

	void Main() {
		c.Go();
		cout << "finish thread" << endl;

		// 참조계수 감소 필요!!
		HoldMe.reset();
	}

	...
};
```

위와같이, 조건에 맞춰서 참조계수를 내려줄 수 있는 `reset()`을 호출해야된다.
지금같은 케이스는 thread를 모두 사용하고 `reset()`을 하지만, 경우에 따라 다를 수
있으니 *주의해서 사용*하도록 하자.


