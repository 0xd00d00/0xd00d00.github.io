---
layout: post
author: doodoo
title: "[Design Pattern][C++] UpCasting, 가상함수, Override 키워드에 대해 알아보자."
subtitle: "동족의 묶음 UpCasting에 대해 알아보자🔤"
date: 2021-07-26
cover: /assets/img/upcasting1.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Design pattern 중 upcasting 개념에 대해 알아보겠습니다.

C++ 디자인 패턴 강의를 듣고 정리하고자 합니다. 자세한 내용은 [여기](https://0xd00d00.github.io/2021/07/11/design_pattern_1.html)를 클릭해주세요.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### UpCasting
UpCasting이라는 개념은 C++ 책을 좀 읽어 봤다면 한번은 접해봤을 개념이다.
해당개념은 너무 중요하기 때문에 자세하게 다뤄보도록하자.

```cpp
#include<iostream>
using namespace std;

class Animal
{
	int age;
};

class Dog : public Animal
{
	int color;
};

int main()
{
	Dog d;

	Dog* dp1 = &d;		// ok.

	double* dp2 = &d;		// error.

	Animal* ap1 = &d;		// ok.
}
```

위의 예시를 보자.

첫번째 정의부분에서 `Dog* dp1 = &d;`는 사용가능하다. 당연히 동일한 타입이니
포인팅이 가능하다.

두번째 정의 부분인 double으로casting이 될까? `double* dp2 = &d;` 해당 정의를 수행하면 에러가 발생한다.
당연히 타입이 달라 에러가 발생하고, 조금더 생각해보면, 우리가 할당받은 double
크기에 Dog라는 객체를 담을수 없기 때문이라고 생각해볼 수도 있다.

마지막으로, `Animal* ap1 = &d;` 해당 케이스는 될까? 된다. `Dog` 객체는 `Animal` 객체를 상속받아 작성되었기 때문에 포인팅이 된다.

우리는 이와 같이 *기반클래스* 가 *파생클래스*를 가리킬수 있는 개념을 <span class="tip">UpCasting</span>이라고 부른다.

근데 왜 상속받으면 포인팅이 가능할까? (메모리 관점에서 생각해보자. 🤔)

![memory](/assets/img/memory_pic.png){: height="400px" width="570px"}

위의 그림을 보면, 우리가 `Animal`을 상속받아 `Dog` 객체를 생성하면, `Animal`의
멤버 변수를 취하고 아래 자신의 멤버 변수를 취하는 것을 볼 수 있다. 따라서,
	`Animal`을 갖고 포인팅을 해도 `Animal`은 자신의 멤버를 가리키고 있는 것이기
	때문에 포인팅이 가능한 것이다. 메모리 관점에서 보면 <span
	class="tip">UpCasting</span> 은 당연시 할 수 있는 내용이다.

그렇다면 UpCasting이 왜 필요하고, 언제 사용되는지 알아보자.🙄

### UpCasting의 사용이유
기반클래스를 활용해 파생클래스를 가리킬 수 있는 개념을 *Upcasting*이라고 했다.
그렇다면, UpCasting은 언제 활용할까? 아래의 예시를 보자.

![upcasting1](/assets/img/upcasting1.png)

위의 그림과 같이, 폴더 구조를 만든다고 생각해보자.

우선, 폴더 내 자료들을 관리하기 위해 우리는 Vector 자료구조를 활용해야한다.
해당 폴더 내 자료구조들을 담아야하는데 어떻게 담아야할까? 현재 폴더 내에는
`sample`이라는 파일 객체와 `test`라는 폴더 객체가 존재한다.

만약 `vector`자료구조를 `sample` 타입만 받도록 한다면, 파일객체만 받을 수 있을
것이다. (`test` 객체만 설정해도 마찬가지이다..😓) 이렇게 구성하게 된다면, 우리는
폴더 구조를 만들지 못할 것이다. 폴더 내에는 `sample`이라는 파일과 `test`라는
폴더가 존재하기 때문이다. 이 둘의 객체를 한번에 묶어서 관리하기 위해선
어떻게해야할까? 이때 사용해야되는 개념이 <span class="tip">UpCasting</span>이다. 둘을 `folder`라는 기반 클래스로 묶어 관리하면된다.

구체적으로, `folder`라는 기반클래스를 하나 생성하고, `sample`과 `test`는 `folder`를 상속받는 파생클래스로 구성하면 된다. 그렇다면, 기반클래스에서 파생클래스를 가리킬 수 있는 <span class="tip">UpCasting</span> 개념을 활용할 수 있다.

`vector`를 `folder`라는 기반클래스가 되는 객체로 묶게될 경우 `sample` 과
`test`를 모두 `vector`내 담을 수 있게 된다.

만약, `folder`를 또 다른 `folder`에서 사용하게 된다면 이 역시 또다른
기반클래스를 하나 생성해 상속받은 후 <span class="tip">UpCasting</span>으로 사용하면 된다.

❗ 상속의 개념은 변수 및 함수를 재사용하기 위해서만 사용하는 것이 아니라, 디자인
관점에서 보듯 *동족끼리 묶을 때*도 많이 사용한다는 점을 기억해라.

### Virtual 가상함수
우리가 위의 *UpCasting* 개념을 배우게 될 시점에는 *상속* 이라는 개념과 같이
배우게 된다. *상속* 개념을 말할 때 가장 많이 따라오는 이야기가 `virtual`함수의
사용법이다.

보통 요즘 흔히 쓰는 Java 혹은 C#에서는 너무 자명한 이야기이지만, Pointer를
사용하는 C++에서는 조금 생각해 볼 필요가 있는 문제이다. 아래의 예시를 보자.

```cpp
#include <iostream>
using namespace std;

class Animal
{
	int age;
public:
	void Cry() { cout << "Animal Cry" << endl; }
};

class Dog : public Animal
{
	int color;
public:
	void Cry() { cout << "Dog Cry" << endl; }
};

int main()
{
	Dog d;
	Animal* p = &d;

	p->Cry();
}
```

위의 코드를 봤을 때, `p->Cry()`가 어디를 호출할 것인가? 흔히 사용하는 Java 혹은
C# 에서는 재정의된 함수인 *Dog 내 Cry()*를 호출할 것이다. 하지만, C++에서는 포인터를
따라가서, 호출하기 때문에, Dog가 아닌 *Animal 의 Cry()*를 호출 할 것이다. (위의
		메모리 그림을 봤듯이, 기반 클래스의 포인터는 기반 클래스로 인식해버린다.. 😱)

위와 같은 문제 즉, 기반 클래스가 포인터로 파생 클래스를 가리킬 때, 파생클래스가
재정의 한 함수를 호출 하려면 반드시 <span class="tip">Virtual (가상함수)</span>로
선언해야한다.

```cpp
class Animal
{
	int age;
public:
	virtual void Cry() { cout << "Animal Cry" << endl; }
};

class Dog : public Animal
{
	int color;
public:
	virtual void Cry() { cout << "Dog Cry" << endl; }
};
```

위와 같이, 선언할 경우 기반클래스가 파생클래스를 가리켜도 파생클래스가 재정의 한 함수를 부르게 된다. (이게 어떻게 가능한지 알고 싶으면, virtual table을 구글에 검색해보자! 🤗)

### Override 키워드
우리가 보통 상속을 받아 사용할 경우 기반 클래스의 함수를 재정의해서 사용한다.
이를 overriding이라고 부른다.

하지만 재정의를 할 경우, 실수로 우리가 인자를 더 넣거나, 반환형을 다르게
만들어도 컴파일러는 해당 문제를 식별하지 못한다. 결국 실행이 됐다가 나중에
프로그래머만 밤새서 이 말도 안되는 에러를 찾는일을 해야한다 ㅠㅠ,, 😫

이를 막기위해 C++11에서는 `override`라는 키워드가 등장했다. 해당 키워드를 사용할
경우 *가독성*도 좋아지고, *실수*도 미리 잡아줘 프로그래머의 생산성을 향상시킬 수
있다. 위의 예시를 통해 어떻게 붙이는지 확인해보자.

```cpp
class Animal
{
	int age;
public:
	virtual void Cry() override { cout << "Animal Cry" << endl; }
};

class Dog : public Animal
{
	int color;
public:
	virtual void Cry() override { cout << "Dog Cry" << endl; }
};
```

가상함수의 마지막 즉, 함수 본문 시작 전 `override`라는 키워드를 적어주면 된다.
파생 클래스에만 보통 붙여주면 되는데, 기반 클래스에도 붙여 습관화 하자.

`override` 키워드는 오픈소스 혹은 큰 프로젝트를 하다보면 많이 만날 수 있다.
당연히 상속을 받고 재정의를 하게 될 경우 사용해야한다. 하지만, 포스팅을 하는
입장에서.. 소스코드가 너무 길어지고 하니 해당 키워드는 "생략" 하도록 하겠다.
(있다고 생각해주길 바란다.. 착한 사람 눈에는 보일 것이다.. 😇)
