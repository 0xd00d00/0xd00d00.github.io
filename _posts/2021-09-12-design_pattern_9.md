---
layout: post
author: doodoo
title: "[Design Pattern][C++] Observer Pattern"
subtitle: "Observer pattern을 알아보자"
date: 2021-09-12
cover: /assets/img/observer_pattern.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Observer pattern 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Observer Pattern이란?
우리가 Excel을 만든다고 가정해보자. Excel에서는 아래와 같이, Table에 있는
데이터를 그래프로 표현할 수 있는 기능이 있다. 더 나아가 Table의 데이터를
수정하게 될 경우 자동으로 Graph를 변경할 수 있는데, 이 기능을 어떻게 구현해야할
것인가? 고민해보자.

![observer_pattern](/assets/img/observer_pattern.png)

위와 같은 방법을 구현하기 위해선, 2가지 방법을 고해볼 수 있다.

1. Graph 쪽에서 Table 값이 업데이트 됐는지 주기적으로 확인해 봄
2. Table에서 값이 Update 될 경우 각 Graph에 업데이트를 요청해 그래프를
	 변화하도록 함.

어떤 방법이 더 효율적으로 보이는가? 당연히 "2번"을 택할 것이다. 1번 같은 경우
CPU 소모량을 비롯해 엄청난 자원낭비가 생길 것이 분명하기 때문이다. 우리는
자연스럽게 2번을 택하게 될텐데, 2번이 오늘 다룰 주제인 *"관찰자 패턴"* 이다.

우선, 관찰자 패턴의 정의를 알아보자. GoF에 나와있는 관찰자 패턴의 정의는 다음과
같다.

*❗ 객체 사이의 1:N의 종속성을 정의하고 한 객체의 상태가 변하면 종속된 다른객체의 통보가 가고 자동으로 수정이 일어나게 한다.*

아.. 말이 너무 어렵다😱  쉽게 생각해보자. 우리가 처음 보았던 Excel 그림을 생각하면 쉽게 이해가 가능하다. 즉, 테이블과 테이블에 종속된 다른 그래프들이 있다. 이 때, 테이블이 변하게 되면 그래프에게 통보가 가고 수정이 발생하게 된다라는 뜻이다.

그렇다면, Excel을 만들어보면서 `Observer Pattern`을 직접 적용시켜보자.

아래의 코드는 `Observer pattern`이 적용되지 않은 각 분리된 `Table`, `PieGraph`, `BarGraph` 클래스들이다. 아래의 코드에 패턴을 적용시켜보자.

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Table {
	int data_;
public:
	update(int data) {
		data_ = data;
	}
};

class PieGraph {
public:
	void Draw(int n) {
		cout << "PieGraph";

		for(int i = 0 ;i < n; i++)
			cout << "*";
	}
};

class BarGraph {
public:
	void Draw(int n) {
		cout << "BarGraph";

		for(int i = 0; i < n; i++)
			cout << "|";
	}
}

int main(){
}
```

### Observer pattern 적용
Table이 Graph에게 변경된 정보를 전달하기 위해서는 `Graph`들의 정보를 알 수 있는
Pointer를 가지고 있어야한다. 그렇다면 Table에서는 `PieGraph`와 `BarGraph`의
포인터를 가지고 있어야할까? 그렇지 않다. 우리는 앞서 배운 `Upcasting`의 개념을
활용해 아래와 같이 공통된 부분을 묶어 인터페이스로 관리하도록 한다. (만약 해당
개념이 익숙치 않다면 [여기](https://0xd00d00.github.io/2021/07/26/design_pattern_3.html)를 클릭해 알아보자🤗)

![design_pattern upcasting](/assets/img/observer_pattern_upcasting.png)

위의 그림과 같이, Interface를 활용해 Graph들을 묶고 해당 인터페이스를 Table에서
알고 있도록 하면 둘 사이 통신이 가능해진다.

```cpp
...

struct IGraph {
	virtual void Update(int n) = 0;
	virtual ~IGraph();
};

class Table {
	...
	vector<IGraph*> v;
	...
};

class PieGrpah : IGraph {
	void Draw(int n) {
		...
	}
	void Update(int n) {
		Draw(n);
	}
};

class BarGrpah : IGraph {
	void Draw(int n) {
		...
	}
	void Update(int n) {
		Draw(n);
	}
};
```

코드를 보면, `IGraph`라는 인터페이스를 Graph들은 상속받아 구현된다.
`Table`에서는 `vector`통해 Graph들의 정보를 관리하도록 한다. 구현을 조금 더
보도록 하자.

우선, 여기서 필요한 함수가 몇개 더 존재한다.

`Table` 클래스에서 Graph를 등록하고 제거해야되는 함수가 필요하다. 그리고, 각
Graph들에 `Update`를 호출해줄 함수도 필요하다. Table을 조금 더 보완해보자.


```cpp
class Table {
	int data_;
	vector<IGraph*> v;

public:
	void setData(int data) {
		data_ = data;
		notify(data_);
	}

	void attach(IGraph* g) {
		v.push_back(g);
	}

	void detach(IGraph* g) {
		v.erase(std::remove(v.begin(), v.end(), g), v.end());
	}

	void notify(int n) {
		for (auto graph : v)
			graph->Update(n);
	}
};
```

위의 코드와 같이, `attach`, `detach`, `notify` 함수를 통해 우리는 Graph 추가, 삭제, 업데이트 호출등을 구현할 수 있다.

아래의 Appendix 전체적으로 작성된 코드를 직접 코딩해보고, 실제 프로그램을
돌려보자. 돌려볼 경우 Observer의 느낌을 알 수 있을 것이다.

다만, 해당 클래스에서는 좀 더 향상 시킬 수 있는 부분이 남아 있다. 그 부분은
[다음]()포스팅을 통해 알아보도록 하자.

### Appendix
전체적인 소스코드이다. 꼭 직접 돌려보고 확인하고, 작성해보기 바란다.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct IGraph
{
    virtual void Update(int n) = 0;

    virtual ~IGraph() {}
};

class Table {
	int data_;
	vector<IGraph*> v;

public:
	void setData(int data) {
		data_ = data;
		notify(data_);
	}

	void attach(IGraph* g) {
		v.push_back(g);
	}

	void detach(IGraph* g) {
		v.erase(std::remove(v.begin(), v.end(), g), v.end());
	}

	void notify(int n) {
		for (auto graph : v)
			graph->Update(n);
	}
};
class PieGraph : public IGraph
{
public:
    virtual void Update(int n)
    {
        Draw(n);
    }
    void Draw(int n)
    {
        cout << "Pie Graph : ";

        for ( int i = 0; i < n; i++)
            cout << "*";
        cout << endl;
    }
};

class BarGraph : public IGraph
{
public:
    virtual void Update(int n)
    {
        Draw(n);
    }
    void Draw(int n)
    {
        cout << "Bar Graph : ";

        for ( int i = 0; i < n; i++)
            cout << "+";
        cout << endl;
    }
};

int main()
{
    BarGraph bg;
    PieGraph pg;

    Table t;
    t.attach( &bg);
    t.attach( &pg);

    while( 1 )
    {
        int n;
        cin >> n;
				if ( n == 0 ) {
					t.detach(&bg);
					continue;
				}
        t.setData(n);
    }
}
```



