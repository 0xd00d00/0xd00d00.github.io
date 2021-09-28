---
layout: post
author: doodoo
title: "[Design Pattern][C++] 객체 생성 방법"
subtitle: "객체를 생성하는 4가지 방법에 대해 알아보자🤔"
date: 2021-09-28
cover: /assets/img/default.png
tags: Design_Pattern C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 객체 생성 방법에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro
C++에서 객체를 생성하는 방법에 대해 알아보자.

오늘 알아야할 중요한 포인트는 객체 생성 4가지 방법이다.

1. 일반적인 객체 생성
2. 객체 생성 한 곳으로 모으기
3. 생성 + 동작 부분 분리하기
4. 기존 객체 복사하기

### 일반적인 객체 생성
아래의 코드를 보자.

```cpp
#include <iostream>

using namespace std;

class Shape {
public:
	virtual ~Shape() {}
};

class Rect : public Shape
{
public:
};

class Circle : public Shape
{
public:
};

int main()
{
	Rect r; // 스택에 생성

	Shape* p = new Rect; heap 영역에 생성
}
```

위의 코드를 보면, `Shape` 기반 클래스가 있고, 해당 클래스를 상속 받아 `Rect`, `Circle` 클래스가 만들어 지는 것을 볼 수 있다.

만약 우리가 `Rect` 와 `Circle`의 객체를 생성하고자 한다면 어떻게 해야될까?

가장 기본적인 방법은 2가지이다.

1. Stack 영역에 생성
2. Heap 영역에 생성

위 방법은 *사용자가 직접 객체를 생성* 하는 방법이다. 위 방법을 사용하면, 객체 생성의 제약없이 자유롭게 생성이 가능하다. 하지만, 이는 단점으로 작용되기도 한다.

만약, `Circle` 클래스를 *오직 5개*만 만들도록 하고싶다면 어떻게 해야될까?

*사용자가 직접 생성*하는 방법으로는 해당 제약을 걸 수 없다. 제약을 주기위해서는 객체 생성하는 부분을 *한 곳으로 집중*시켜야한다.

### 객체 생성 부분을 한곳으로 모으기
객체 생성에 제약을 적용하기 위해, 생성하는 부분을 한 곳으로 집중시켜보자.

집중시키기 위한 방법은 2가지를 활용하면 된다.

1. 생성자를 private 영역에 두기
2. static 멤버 함수를 활용해 겍체 생성하는 부분 만들기

<span class="tip">Tip</span> 일반 멤버함수가 아닌 static 멤버함수로 만드는 이유는 일반 포인터에 담을 수 있게 하기 위해서이다. 문법적인 부분이니, 모르는 분들은 구글하자!

```cpp
...
// 처음 코드에 변경되는 부분만 나타낸다.

class Rect : public Shape
{
	// 생성자 private 영역에 두기
	Rect() {}
public:
	// static 멤버함수 구성
	static Shape* Create() { return new Rect; }
};

class Circle : public Shape
{
	Circle() {}
public:
	static Shape* Create() { return new Circle; }
};

int main() {

	// 에러 발생함. 생성자 호출 불가
	// Rect r;

	Shape* p = Rect::Create();
}
```

위와 같이 구성하게 되면, 일반적인 사용자 생성이 안되며, 오직 `Create()`를 통해서만 객체 생성이 가능해진다.

위와 같이 구성할 경우 *장점*은 다음과 같다.

1. 객체의 생성을 한 곳에서 수행
2. 다양한 제약 조건을 만들 수 있다.
	- 우선, 갯수 제한이 가능하고, 자원 공유도 가능해진다. 일례로, 우리가 많이 사용하는 객체를 미리 만들어두고, 필요할 때 넘겨주는 pool 방식을 생각해 볼 수 있다.
3. 객체 생성함수를 함수의 인자로 전달 할 수 있다.

*3번 문장*이 이해가 어려울 수 있다. 해당 부분을 조금 자세히 다뤄보자.

해당 문장은 `static 멤버 함수`의 특징일 활용한 장점이다. 예를들어, 우리가 생성과 그리기를 바로 할 수 있는 `CreateAndDraw()`함수를 만들었다고 가정해보자.

`CreateAndDraw()`를 활용해 다양한 도형을 만들고 바로 그릴 수 있는데, 다양한 도형의 정보를 어떻게 넘겨줄 것인가? 고민해야한다. 쉽게 생각해 볼 수 있는 방법으로는 "인자"를 넘겨줘 `if` 혹은 `switch`문을 통해 만들면 된다고 생각한다.

```cpp
...

void CreateAndDraw(string s) {
	if (s == "Rect") {
		Shape* p = new Rect;
	}
	...
}

int main() {
	CreateAndDraw("Rect");
}
```

하지만 위와 같이 구성할 경우 *OCP (Open Close Principle)*을 위배하게 된다. 즉, 우리가 도형이 추가 될 때마다 해당 함수는 변경이 발생하게 된다.

이를 피하기 위해서는 아래와 같이 *static 멤버 함수*의 장점을 활용해보자.

```cpp
...

void CreateAndDraw(Shape* (*f)())
{
	Shape* p = f();
	p->Draw();
}

int main() {
	CreateAndDraw(&Rect::Create);
	CreateAndDraw(&Circle::Create);
}
```

위와 같이 구현할 경우 외부에서 넘겨주는 "도형"객체만 변경하게 되면 된다.

*위 방법은 MFC, Qt 등의 오픈소스에서 많이 사용되는 기법이다.*

여기서 생각해 볼 점이 객체 생성하는 부분에서 제약이 많이 추가 되거나 하게 되면 하나의 객체가 너무 커지게 된다. 또한, 기본 동작 기능은 변화가 없는데 오로지 생성 부분의 제약부분만 변하게 된다면 어떨까?

OCP가 위반될 수 있다.

따라서, 우리는 생성하는 부분과 동작하는 부분을 나누어 구현해야한다.
