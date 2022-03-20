---
layout: post
author: doodoo
title: "[C++][Modern C++] weak_ptr 사용 및 상호참조"
subtitle: "상호참조 문제해결을 위한 weak_ptr 😌"
date: 2022-03-19
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 상호참조 문제 및 weak_ptr 사용법에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 상호참조 문제
`shared_ptr`를 활용하다 보면 내부적으로 *상호참조* 문제가 발생할 수 있다.

상호참조 문제가 어떤 상황인지 아래의 코드를 통해 알아보자.

```cpp
#include <iostream>
#include <string>
#include <memory>

using namespace std;

struct People
{
	People(string s) : name(s) {}
	~People() { cout << "~people : " << name << endl; }

	string name;
	shared_ptr<People> bf; //best friend
};

int main() {
	shared_ptr<People> p1 (new People("KIM"));
	shared_ptr<People> p2 (new People("LEE"));

	// 자원 누수
	p1->bf = p2;
	p2->bf = p1;
}
```

위 코드는 단순하게 작성된 코드로, `people` 클래스를 활용해 2명의 사람을 만들고,
best friend로 각각을 가리키게 한 클래스이다. 이럴 경우 어떤 문제가 발생할까?

바로 *자원누수*가 발생하게 된다. 그 이유는 아래의 그림과 같이, *상호참조* 문제가
발생하기 때문인데, 상호참조란 내가 가리키는 정보 외 외부에서 참조하는 것을
의미한다.

![sptr9](/assets/img/sptr9.png)

위의 그림을 보면, 좀 더 이해를 쉽게할 수 있다. `Kim`과 `Lee` 대상 객체를 가리키는
스마트 포인터가 존재한다. 스마트포인터가 생성되기 때문에 `control block`의
`use_count`는 "1" 이된다. 하지만 내부적으로 best friend를 가리킬 수 있는
`shared_ptr`이 존재하고, 해당 스마트포인터는 대입연산을 통해 초기화되며
생성된다. 이럴 경우 대상 객체와 기존 `control block`을 참조하게 되며, `use_count`는 "2" 가 되게 된다.

`use_count`가 "2" 이기 때문에 `main()`가 종료됐을 시점에 스마트포인터 특성으로
자원을 해제하려고 할 때, `use_count`를 감소시켜도 아직 "1" 로 유지되기 때문에
지워지지 않는 즉, *자원누수* 문제가 발생한다.

이를 해결할 수 있는 방법은 무엇이 있을까?

가장 쉽게 떠올릴 수 있는 방법은 *raw pointer*의 사용이다.

### Raw pointer 사용 및 문제점
아래의 코드와 같이 *raw pointer*를 사용하면 우리가 고민하는 *상호참조* 문제가
해결된다.

```cpp
#include <iostream>
#include <string>
#include <memory>

using namespace std;

struct People
{
	People(string s) : name(s) {}
	~People() { cout << "~people : " << name << endl; }

	string name;
	People* bf; //best friend
};

int main() {
	shared_ptr<People> p1 (new People("KIM"));
	shared_ptr<People> p2 (new People("LEE"));

	// 자원 누수 해결
	p1->bf = p2.get();
	p2->bf = p1.get();
}
```

기존에 `shared_ptr`를 활용해 best friend를 관리했다면, 이제는 `People*` 라는 raw
pointer를 활용해 `People` 클래스를 구성했다. [이전포스팅](https://0xd00d00.github.io/2022/03/09/cpp_smart_ptr_2.html)에서 다뤘던과 같이 raw pointer는 `shared_ptr`과
호환되지 않기 때문에 내부의 `get()` 함수를 활용해 raw pointer를 얻어야한다는
점을 상기시켜보자.

위와 같이 구성할 경우 *상호참조* 문제를 해결할 수 있기 때문에 모두가 행복한
상태인것 같다.

하지만, 아래와 같이 코드를 살짝 바꿔보자 👀

```cpp
int main() {
	shared_ptr<People> p1 (new People("KIM"));
	{
		shared_ptr<People> p2 (new People("LEE"));

		// 자원 누수 해결
		p1->bf = p2.get();
		p2->bf = p1.get();
	}

	if (p1->bf != 0)
		cout << "나의 베프는 살아있어!! " << endl;
}
```

위와 같이 `main()`의 코드를 살짝 바꿔서 생각해보자. `Lee`를 가리키는 포인터는
*특정 block scope*를 갖는다. 이 경우 스마트 포인터 특성상  *block scope*를 벗어날 경우 자원이
파괴된다.

분명 우리는 `lee` 라는 객체를 파괴했는데 `if문`을 보면 아직 살아있다고 판단하고
아래의 동작을 수행한다. 이 경우에는 `undefined`동작이 수행되기 때문에 *정말
위험하다*

C++ 에서는 이 문제를 해결하기 위해 `weak_ptr`이라는 포인터를 추가로 두었다.

### weak_ptr의 등장
`weak_ptr`이라는 스마트 포인터 객체를 사용하면 *상호참조*문제 없이, 대상 객체를
가리킬 수 있다. 큰 특징은 2가지라고 볼 수 있다. 비교를 통해 알아보자.

🌱 `shared_ptr`과 `weak_ptr`의 가장 큰 차이는 *use_count*를 올리지 않고, *대상
객체*를 가리킬 수 있다는 점이다.

🌱 *raw pointer*와 `weak_ptr`의 가장 큰 차이는 실제 대상객체가 파괴되었는지
구별가능하다는 점이다.

`weak_ptr`를 사용해 위의 코드를 변경해보자.

```cpp
#include <iostream>
#include <string>
#include <memory>

using namespace std;

struct People
{
	People(string s) : name(s) {}
	~People() { cout << "~people : " << name << endl; }

	string name;
	weak_ptr<People>bf; //best friend
};

int main() {
	shared_ptr<People> p1 (new People("KIM"));
	{
		shared_ptr<People> p2 (new People("LEE"));

		// 자원 누수 해결
		// shared_ptr과 weak_ptr는 호환됨.
		p1->bf = p2;
		p2->bf = p1;

		// p1 use count is 1
		cout << "p1 use count is " << p1.use_count() << endl;
	}

	if (p1->bf.expired())
		cout << "이 객체는 파괴됨..";
	else
		cout << "이 객체는 파괴되지 않음..";
}
```

위의 코드를 보면 우리가 상위에서 만났던 문제들을 모두 해결한 것을 볼 수 있다.

우선 코드를 수행해보면, 상호참조 문제가 없어 내부적으로 대상객체를 `shared_ptr`의 `use_count`가 "1" 임을 확인할 수 있다.
`weak_ptr` 내 `expired()`를 활용하면 실제 대상객체가 파괴되었는지를 확인해볼 수
있다.

파괴되었을 경우 사용하지 못하도록해 *raw pointer*로 발생하는 문제 즉, undefined
동작을 미연에 방지가 가능하다.

#### weak_ptr의 대상객체 사용
`weak_ptr` 같은 경우 `use_count`를 올리지 않고 대상객체만 가리킨다. 그렇다면
가리키는 객체를 사용할 수 있을까?

*weak_ptr 같은 경우, 일반적인 "->" 를 활용해 대상객체 내부로 접근이 불가능하다.*

생각해보면 *사용하지 못하는게 당연*하다. 내가 현재 사용하고 있다는 `use_count`를
증가시키지 않는데, 사용하다가 누군가에 의해 대상객체가 파괴될 경우 `undefined` 동작이
발생하게 된다.

이를 막기 위해서 `weak_ptr` 같은 경우 대상내부에 접근자체가 불가능하다. 그렇다면
`weak_ptr`를 사용할 경우 대상객체를 가리킬려면 어떻게 해야될까?

`shared_ptr`를 활용해 `use_count`를 올리고 사용해야된다.

```cpp
int main() {
	shared_ptr<People> p1 (new People("KIM"));
	shared_ptr<People> p2 (new People("LEE"));

	// 자원 누수 해결
	// shared_ptr과 weak_ptr는 호환됨.
	p1->bf = p2;
	p2->bf = p1;

	// p1 use count is 1
	cout << "p1 use count is " << p1.use_count() << endl;

	if (p1->bf.expired())
		cout << "이 객체는 파괴됨..";
	else {
		// 에러 발생.
		// 접근 불가능...
		// cout << p1->bf->name;

		shared_ptr<People> tmp_p = p1->bf.lock();
		cout << "best friend " << tmp_p->name << endl;
	}
}
```

위 코드와 같이 구현한다면, `weak_ptr`를 `shared_ptr`로 변환해 내부적 대상 객체의
코드를 사용할 수 있다.

`weak_ptr`에서는 `lock()`라는 함수가 존재한다. 해당 함수는 객체 내 `shared_ptr`가
있다면 잠시 사용을 멈추도록 막는 함수이다. 그리고, `weak_ptr`를 `shared_ptr`로
변환해준다.

위와 같이 사용하면 안전하게 대상에 접근이 가능하며, 상호참조 문제도 없앨 수
있다.

### Reference
[C++ 강의](https://www.ecourse.co.kr/)



