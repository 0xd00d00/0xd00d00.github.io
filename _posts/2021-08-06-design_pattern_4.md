---
layout: post
author: doodoo
title: "[Design Pattern][C++] 순수가상함수 와 추상클래스"
subtitle: "순수가상함수와 Abstract 개념에 대해 알아보자 💘"
date: 2021-08-06
cover: /assets/img/default.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 디자인 패턴에서 중요한 순수가상함수와 추상클래스 개념에 대해 알아보겠습니다.

해당 포스팅은 C++ 디자인 패턴 강의를 듣고 정리한 것입니다. 자세한 내용은 [여기](https://0xd00d00.github.io/2021/07/11/design_pattern_1.html)를 클릭해주세요

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 순수가상함수 와 추상클래스
C++ 문법책을 하나라도 봤다면, 가상함수에 대한 개념과 순수가상함수에 대한
개념을 배웠을 것이다.

```cpp
#include <iostream>
using namespace std;

class Shape {
	virtual void Draw() = 0;
};

int main() {
	Shape s;
	Shape* sp;
}
```

위의 프로그램이 잘 돌아갈 것인가? 생각해보자.

위의 프로그램은 실행하게 될 경우 `Shape`를 객체화 시키는 부분에서 에러를 만날
것이다. 그 이유는 위의 `virtual void Draw() = 0;` 때문인데, 해당 함수는 순수
가상함수라고 하며, 구현부가 없는게 특징이다.

순수가상함수를 선언할 경우 객체 생성을 할 수 없다. 당연히, 구현부가 없기 때문에
컴파일러 입장에서는 오류를 출력할 것이다. 하지만, 포인터의 경우 아직 누군가와
연결하지 않은 주소값이기 때문에 객체 생성부분을 제거하고 빌드를 해보면
프로그램이 정상적으로 돌아가는 것을 확인할 수 있을 것이다.

보통 우리는 "순수가상함수"를 하나 포함하고 있는 클래스를 "추상 클래스"라고
정의한다.

추상클래슨느 순수가상함수가 하나 이상 존재하기 때문에 *객체를 생성할 수 없음*이
특징이다. (객체는 아예생성 할 수 없다는 점을 잘 기억해야한다!)

그렇다면, 순수가상함수를 사용할 수 있는 방법은 무엇일까?

우리가 흔히 문법책에서 많이 봤듯이 *파생클래스*를 정의해 구현해주면 된다.

### 순수가상함수 처리를 위한 파생클래스 생성
아래의 프로그램을 보고, 파생클래스가 "추상 클래스인가 아닌가?" 를 생각해보자.

```cpp
#include <iostream>
using namespace std;

class Shape {
	virtual void Draw() = 0;
};

class Rect : public Shape {
public:
};

int main() {
	//Shape s;
	Shape* sp;
	Rect r;
}
```

위의 프로그램은 파생클래스로 추상클래스를 *상속*받아 작성한 프로그램이다. 위에서
파생클래스를 이용하면 잘 된다고 했던 것 같은데..? 라고 생각할 수 있다. 하지만,
	우리가 `virtual` 로 정의된 순수 가상 함수를 재정의 하지 않으면, 해당 함수를
	Rect에서는 그냥 갖게 된다. 따라서, Rect도 *추상클래스*가 되어버린다.

우리는 이를 피하기 위해 Rect에서는 `Draw()` 재정의하도록 하자.

```cpp
class Rect : public Shape {
public:
	void Draw() override { cout << "this is rect!" << endl; }
};
```

위의 코드와 같이, `Draw()`를 재정의하게 되면 "추상 클래스"의 특징인 "순수
가상함수"가 "일반함수"화 되어졌기 때문에 *객체 생성*이 가능해진다😎

이제 우리는 추상클래스를 사용하는 방법을 알았다. 근데, 우리가 추상클래스를 왜
만들어야 하는가? 라는 중요한 의문이 있을 수 있다.

이 중요한 질문을 생각해보자.

### 추상클래스를 만드는 의도
```cpp
#include <iostream>
using namespace std;

class Shape {
	virtual void Draw() = 0;
};

class Rect : public Shape {
public:
	void Draw() override { cout << "this is rectangle " << endl; }
};

class Square : public Shape {
public:
	void Draw() override { cout << "this is square " << endl; }
};

class Circle : public Shape {
public:
	void Draw() override { cout << "this is circle " << endl; }
};
```

위의 코드를 분석해보자, 우리는 `Shape` 라는 추상 클래스를 상속받아, `Rect`,
	`Square` 그리고 `Circle`이라는 파생클래스를 만든다. 여기서 중요한 점은
	파생클래스가 객체가 되려면 `Draw()`함수를 꼭 재정의 해야한다는 점이다.

❗ 우리가 묻는 질문 *"추상클래스는 왜 만들어야하는가?"* 라는 질문에 답이 여기 있다.

"모든 도형(추상클래스)을 만드는 사람은 꼭 `Draw()` (순수가상함수)를 재정의해서
사용해라." 라는 규칙을 정하기 위해 사용한다.

실생활에 예시를 생각해보자. 우리가 리모콘을 만든다고 할 때, 리모콘에는 채널
상위, 음량 상위, 전원 버튼 등이 필요하다. 이게 꼭 있어야 리모콘의 기능을 한다고
할 수 있다. 이런 함수들을 "순수가상함수"로 정해두고 LG 리모콘, 삼성 리모콘을
만들 때 해당 추상클래스를 상속받아 재정의해서 사용하도록 한다🚨

객체를 사용하기 위해서는 꼭 지정된 함수를 구현하도록한 의도를 가진 클래스가
<span class="tip">추상클래스</span> 라고 할 수 있다.

### Appendix
순수가상함수 및 추상클래스를 만드는 방법과 문법을 아는 것도 중요한데, 가장
중요한 것은 함수를 사용해야되는 의도를 아는 것이다. 특히, 디자인 패턴에서는 해당
의도가 정말 중요하게 사용되고 있다.

꼭 까먹지 말고 기억하도록 하자!
