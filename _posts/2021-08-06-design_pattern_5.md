---
layout: post
author: doodoo
title: "[Design Pattern][C++] 인터페이스와 커플링"
subtitle: "강한 결합, 약한결합, 인터페이스 개념에 대해 알아보자😚"
date: 2021-08-06
cover: /assets/img/tightly_coupling.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 디자인 패턴 중 인터페이스와 커플링 개념에 대해 알아보겠습니다.

해당 포스팅은 C++ 디자인 패턴 강의를 듣고 정리한 것입니다. 자세한 내용은 [여기](https://0xd00d00.github.io/2021/07/11/design_pattern_1.html)를 클릭해주세요

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 강한 결합(Tightly Coupling)
우리는 [이전
포스팅](https://0xd00d00.github.io/2021/08/06/design_pattern_4.html)를 통해
추상클래스의 개념을 배웠다. 실제 "추상 클래스"가 어떻게 사용되는지 실생활 예시를
통해 알아보자.

```cpp
#include <iostream>
using namespace std;

class Camera
{
public:
	void take() { cout << "take picture" << endl; }
};

class People
{
public:
	void useCamera(Camera* p) { p->take(); }
};

int main()
{
	People p;
	Camera c;
	p.useCamera(&c);
}
```

위의 예시는 사람이 카메라를 사용하는 것을 코드로 구현한 것이다. `People`이라는
객체가 `Camera`를 얻어 `take()`를 활용해 사진을 찍는 것을 나타낸 것이다.

해당 프로그램은 아무문제 없이 돌아간다. 프로그램을 잘 사용하다가, 만약 시대가
변해 아래와 같은 새로운 카메라가 도입되어졌다고 가정해보자.

```cpp
...

class HDCamera
{
public:
  void take() { cout << "take HD picture" << endl; }
};
```

이럴 경우 위의 `HDCamera`라는 새로운 클래스가 추가되는데, 이때, 사람은 `HDCamera`를 이용해 사진을 찍을 수 있을까?

찍을 수 없다. 왜냐하면 `People` 클래스 내에서는 오직 `Camera`만 다루도록
되어져있기 때문에 사용하기 위해선 아래와 같이 함수를 추가해 클래스를
*변경*해줘야한다.

```cpp
...

class HDCamera
{
public:
  void take() { cout << "take HD picture" << endl; }
};

class People
{
public:
  void useCamera(Camera* p) { p->take(); }
  void useCamera(HDCamera* p) { p->take(); }
};

int main()
{
  People p;
  Camera c;
  p.useCamera(&c);

	HDCamera hc;
	p.useCamera(&hc);
}
```

위와 같이 변경하게 되면 실행은 잘된다. 하지만 이렇게 할 경우 변경할 경우 기존에
잘 돌고 있던 프로그램의 일부 코드 즉, 클래스를 *변경* 해야하는 문제가 있다. 코드를 수정한다는게 좋은일일까? 아니다. 기존에 잘 돌고 있는 코드는 바꾸면
문제가 발생할 확률이 높아진다. 따라서, 변경을 최소화해야한다.

객체지향 디자인에서는 SOLID 라는 유명한 격언이 있다.

* SRP - 단일 책임의 원칙 (Single Resposibility Principle)
* OCP - 개방 폐쇄의 원칙 (Open Close Principle)
* LSP - 리스코프 치환의 원칙 (the Liskov Substitution Principle)
* ISP - 인터페이스 분리 원칙 (Interface Segregation Principle)
* DIP - 의존성 역전의 원칙 (Dependency Inversion Principle)

위의 격언은 차차 배우게 될텐데, 해당 케이스는 *OSP* 원칙에 위배된다.

OCP (Open Close Principle) 개방 폐쇄의 법칙은 *기능확장에 열려 (Open) 있어야하고, 코드 수정에는 닫혀 (Close)있어야 한다는 이론 (principe)* 이다.

즉, 새로운 기능이 추가 되어도, 코드에 변화가 일어나면 안되는데, 현재의 경우
`HDCamera`라는 새로운 클래스가 추가됨으로 `People`의 클래스가 변경되어진다.

*❓ 그렇다면 왜 코드 수정이 발생하는가? 알아보자.*

그림을 보면, 사람이 카메라를 참조하고 있는 것을 볼 수 있다. 코드에서 봐도
함수인자로 `People`을 전달받아 사용하도록 되어져있다. 이런 경우를 강한결합
(tight-coupling)되어져 있다라고 한다.

![tight-coupling](/assets/img/tightly_coupling.png)

위와 같이, 강한 결합이 되어져있을 경우 어떤 클래스가 추가되어지게되면 즉,
	새로운 카메라가 추가되어질 경우 *OCP*를 위배하는 문제가 있다. 이런 디자인은
	<span class="tip">교체 / 확장 불가능한 경직된 디자인</span> 이라고 부르며,
	해당 문제를 해결하도록 해야한다.

*❓ 해당 문제를 어떻게 해결할까?*

### 약한 결합 (Loosely Coupling)
OCP가 위반되는 강한 결합을 해결하는 방법은 <span class="tip">약한
결합</span>으로 변경하는 것이다.

우선, 카메라 즉, 제품을 먼저 만들지말고 제품의 인터페이스 (규칙, 규약)을 먼저
만들도록 한다.

규칙이란? 모든 카메라는 아래의 클래스로부터 파생되어진다라고 정의하는 것을
말한다.

```cpp
class ICamera
{
	virtual void take() = 0;
};
```

위와 같이 `ICamera`를 추상클래스로 만든다. 이후 카메라를 만들기 위해선 해당
추상클래스를 상속받아 만들도록 해야한다.

이렇게 규약으로 미리 추상클래스를 만들어 둘 경우, 우리는 "모든 카메라는
take()라는 함수를 이용해 찍는구나" 라는 것을 알 수 있다. 즉, 다른 클래스를
설계할때, `Camera` 클래스가 없어도 카메라를 사용하는 방법을 알 수 있기 때문에
카메라를 사용하는 코드를 만들 수 있다.

```cpp
class People
{
public:
	void useCamera( ICamera* p ) { p->take(); }
};
```

위와 같이, `People`클래스를 설계할 때, 카메라라는 클래스는 아직 안만들었지만,
	규약 (카메라는 take()를 이용해 사용하는 물체) 라는 것을 알기 때문에 우리는
	`People` 클래스에 Camera를 사용하는 함수를 만들 수 있다.

사람 입장에서는 "나는 카메라를 사용하는 것만 알면돼. 왜냐면, 전세계 카메라의
사용방법은 동일한테니" 라고 생각하는 것과 같다.

이후, 카메라를 추가할 때는 해당 규약을 참고해 만들기만 하면 되고, 사람은 아무
카메라를 사용하기만 하면 된다.

```cpp
...
class Camera : public ICamera
{
public:
    void take() { cout << "take picture" << endl;}
};

class HDCamera  : public ICamera
{
public:
    void take() { cout << "take HD picture" << endl;}
};

class UHDCamera  : public ICamera
{
public:
    void take() { cout << "take UHD picture" << endl;}
};


int main()
{
    People p;
    Camera c;
    p.useCamera(&c);

    HDCamera hc;
    p.useCamera(&hc);

    UHDCamera uhc;
    p.useCamera(&uhc);
}
```

위의 코드를 보면, 카메라를 3개를 만들었는데, People에 대한 변경이 필요하지
않다는 점을 알 수 있다. 이런 OCP 법칙이 지켜지는 결합을 *약한결합* 이라고한다.

<span class="tip">Tip</span> 약한결합의 특징에 대해 알아보자.

* 객체는 상호 간에 인터페이스를 통해 통신한다.
* Client는 구현에 의존하지 말고 인터페이스에 의존한다.

### 코드 다듬기
우리는 약한 결합을 통해 OCP 위배 되는 부분을 변경했다. 코드를 약간 다듬어 보자.

```cpp
class ICamera
{
public:
	virtual void take() = 0;
	virtual ~ICamera() {}
};

struct ICamera
{
	virtual void take() = 0;
	virtual ~ICamera() {}
};

#define interface struct

interface ICamera
{
	virtual void take() = 0;
	virtual ~ICamera() {}
};
```

우리는 처음에 `class`를 활용해, `ICamera` 기반클래스를 만들었다. 레거시
코드같은 경우 `struct`를 활용해 기반클래스를 많이 작성하는데, `struct`의
접근지정자가 `public`이 default로 사용되기 때문에 한 줄을 줄일 수 있어서 많이
사용하고 한다.

또한, 추상클래스 같은 경우 규약 혹은 규칙 이라는 의미로 "인터페이스" 라고 많이 지칭하는데, 메크로로 `struct`를 `interface`라는 이름을 재정의해 많이 사용하곤 했다. 우리가 [이전포스팅](https://0xd00d00.github.io/2021/07/05/effective_4.html)에서 배운것과 같이 *메크로 사용*은 하지 않는게 좋기 때문에 해당 변경은 지양해야한다.

끝으로, 가상함수를 쓴다는 것은 "기반클래스"화 하기 때문에 [이전포스팅](https://0xd00d00.github.io/2021/08/05/effective_12.html)에서 배운것과 같이 "가상 소멸자"를 추가해줘야한다.
