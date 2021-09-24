---
layout: post
author: doodoo
title: "[Design Pattern][C++] Observer Pattern (2)"
subtitle: "Observer pattern을 알아보자 😀"
date: 2021-09-24
cover: /assets/img/obser_cover.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Observer Pattern의 pull 개념에 대해 알아보겠습니다.

[이전 포스팅](https://0xd00d00.github.io/2021/09/12/design_pattern_9.html)을 읽고 해당 포스팅을 읽는다면 더 이해가 쉽습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 데이터 타입이 복잡해지면?
기존에 우리가 만들었던 `Table` 클래스에 대해 생각해보자.

```cpp
...

class Table {
	vector<IGraph*> v;
	int data_;
public:
	void attach(IGraph* p) { ... }
	void detach(IGraph* p) { ... }
	void update(int data) {
		data_ = data;
		nofify(data);
	}
};

...
```

위의 `Table`클래스에서는 `int` 타입의 데이터를 처리하도록 구현했다. 훗날 우리가
*Excel*을 잘 사용하게 되어, 3D 데이터를 처리하기 위한 `int[]` 타입의 데이터를
처리해야된다고 가정해보자. 그렇다면, 기존 `Table` 클래스로는 해당 데이터를
처리할 수 없어 새로운 `Table3D`라는 테이블을 제공해야한다.

```cpp
...

class Table {
	vector<IGraph*> v;
	int data[10];
public:
	void attach(IGraph* p) { ... }
	void detach(IGraph* p) { ... }
	void update(int data) {
		... // 데이터 처리 부분
		nofify(data);
	}
};

...
```

위와 같이, `Table3D` 클래스는 내부적으로 데이터를 `data[]` 타입으로 다루고
있다. `Table`과 비교해봤을 때, `Table3D` 클래스와 *데이터* 와 *데이터
처리*부분을 제외하고 나머지 부분은 모두 중복되는 것을 알 수 있다. 보통 우리는
중복이 될 경우 하나의 기반 클래스형태로 묶어 중복을 피하도록 구현한다. 여기서
중복되는 것은 어떤 것일까?

```cpp
class Subject
{
	vector<IGrpah*> v;
public:
	void attach(IGraph* p) { v.push_back(p); }
	void detach(IGraph* p) {  }
	void notify(int data)
	{
		for ( auto p : v )
			p->update(data);
	}
};
```

위의 코드는 `Subject`라는 클래스로 기반 클래스를 만들어, 중복되는 코드를 하나로
묶은 클래스이다. 중복되는 부분은 `IGraph의 vector`, `attch()`, `detach()`,
	`notify()`이다. 우리는 Table을 사용할 때, 이제 해당 `Subject` 클래스를
	상속받아 사용하면 된다.

```cpp
class Table : public Subject
{
	int data_;
public:
	void update(int d) {
		data = d;
		notify(data);
	}
};

...


class Table3D : public Subject
{
	int data[10];
public:
	void update(int d) {
		data[0] = d;
		notify(data);
	}
};
```

위의 코드와 같이 사용할 경우 중복을 제거하고 사용할 수 있다.

### Push 방식 Obeserver Pattern
지금까지 우리가 만들어온 Observer Pattern을 class diagram으로 나타내보자.

![push](/assets/img/obser_push.png)

위의 diagram은 일반적인 모형이다. 구체적으로, 우리가 만들었던 클래스를 대입시켜
생각해보자.

1. `ConcreteSubject`에 해당 하는 클래스는 `Table`, `Table3D` 클래스 들이다.

2. `Observer`에 해당 하는 클래스는 `IGraph` 클래스이다.

3. `ConcreteObserver`에 해당하는 클래스들은 `PieGraph`, `BarGraph`들이다.

위 다이어그램을 보면, `Interface`끼리 notify를 통해 호출하는 것을 볼 수 있다.
이런 그림을 우리는 *인터페이스 통신*한다라고 말한다.

그리고 우리는 `Table`에서 업데이트 할 경우 데이터를 전달해 각 그래프들에 업데이
된 데이터와 정보를 알려준다. 해당 그래프들은 데이터를 전달 받아 그래프를
그리도록 구현되어있다. 이런 방식을 *Push 방식* 즉, 데이터를 밀어 넣어 주는
방식이라고 이야기한다.

하지만, 위 Push 방식은 업데이트 알림과 동시에 데이터를 전달해야한다. 데이터를
전달하는 방법은 *인자로 넘기는 방법*이 존재하는데, 데이터가 여러개를 업데이트 할
경우 *문제*가 발생할 수 있다. (인자 전달 순서가 밀려 일부 데이터 값들을 잘못
		넘기는 경우 등 😱)

이런 문제를 해결하기 위해서는 어떻게 해야할까?

### 데이터를 가져오는 Pull 방식
위에서 잠시 언급했지만, *Push* 방식의 문제는 명확하다. 데이터가 많아 질 경우
전달해야되는 데이터 값이 늘어나기 때문에, 인자로 전달했을 때 문제가 발생할 수
있다는 것이다.

이 문제를 해결 하기 위해서는 *Pull 방식*을 활용해야한다.

*Pull 방식 이란?*

*Subject*는 *Observer*에게 update되었다 즉, 현재 변경이 일어났다는 사실만
알리고, 데이터는 *Observer*가 직접 접근해 가져오는 방식이다.

이 방법을 사용하기 위해서는 두 가지 변화가 필요하다.

*1. Update할 경우 현재 `Subject`의 주소값을 전달해야한다.*

```cpp
...

struct IGraph
{
	// Subject의 주소를 전달받자.
	virtual void update(Subject*) = 0;

	virtual ~IGraph() {}
};

...

class Subject {
	vector<IGraph*> v;

public:
	void attach(IGraph* p) { v.push_back(p); }
	void detach(IGraph* p) {  }

	void notify()
	{
		for (auto p : v)
			// 현재 Subject의 주소를 전달함.
			p->update(this);
	}
};

...
```

위의 코드와 같이, 기존에 데이터를 전달하던 부분을 `Subject`의 주소가 넘어가도록
변경해야한다. 주소를 알아야 해당 Subject에 접근해 데이터를 직접 가져올 수 있기
때문이다.


*2. type casting을 통한 `ConcreteSubject`의 값을 가져오는 방식을
구현해야한다.*

아래의 코드와 같이, 전달받은 `Subject` 주소를 가지고, 원하는 `Table` 즉, *ConcreteSubject*에 접근해 데이터를 가져오도록 해야한다. 하지만, 우리는 `Subject` 주소를 넘기기 때문에 실존하는 클래스 (Table)을 가져오기 위해서는 *타입캐스팅*을 활용해 접근해야한다.

```cpp
...

class Table : public Subject
{
	int data;
	...

public:
	// 데이터를 가져올 수 있는 getter
	int GetData() { return data; }
	...
};

...

class BarGraph : public IGraph
{
public:
	virtual void update(Subject *p) {
		int n = static_cast<Table*>(p)->GetData();
		Draw(n);
	}
	...
};

...

class PieGraph : public IGraph
{
public:
	virtual void update(Subject *p) {
		int n = static_cast<Table*>(p)->GetData();
		Draw(n);
	}
	...
};

...
```

*pull* 방식을 활용하면, 데이터의 용량에 상관없이 getter로 모든 데이터를 얻어올
수 있기 때문에 현업에서 많이 사용되고 있다. 끝으로, pull 방식을 포함한 class
diagram을 보고 observer pattern 포스팅을 마무리 한다.

*Observer pattern pull 방식 다이어그램*

혹, 이해가 되지 않는 사람은 아래의 다이어그램을 확인하고, 위의 코드를 보도록하자.

![obser_pull](/assets/img/obser_pull.png)
