---
layout: post
author: doodoo
title: "[C++][Modern C++] 스마트포인터 원리"
subtitle: "C++ 에서 사용되는 스마트포인터의 원리와 필요성에 대해 이야기해보자 😎"
date: 2022-03-09
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 스마트 포인터 원리에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 일반적인 포인터의 문제점
C++ 언어는 다른 객체지향 언어 (e.g. JAVA, C#)와 달리 Garbage collector가
존재하지 않는다. 따라서, 자원관리를 개발자가 직접해야된다. 개발자가 자원을 직접
관리하게 될 경우 실수가 종종 발생하며, 이로 인해 *메모리 누수*현상이 유발된다.

```cpp
#include <iostream>

using namespace std;

class Car {
  int color;

public:
  ~Car() {
    cout << "~Car()" << endl;
  }

  Go() {
    cout << "Go()" << endl;
  }
};

int main() {
  Car* p = new Car;

  p->Go();
  (*p).Go();

  // 꼭 자원 해제 필요
  //delete p;
}
```

위의 코드와 같이, `Car*`를 생성 후 `delete` 연산을 사용하지 않을 경우
`pointer`에 대한 메모리 공간은 프로그램이 *종료*되는 시점까지 사용할 수 없게
된다. 이를 우리는 *자원누수 현상*이라고 부르며, 프로그램에서는 좋지 않은 영향을
끼치게 된다. 이를 막기 위해서는 꼭 `delete` 연산을 통해 개발자가 직접 자원을
해제하도록 해야한다.

또한, 아래의 코드와 같이 프로그램 끝이 아닌, 중간에 `if` 연산자와 같은 분기문을
통한 프로그램 종료할 때도, 꼭 *자원 해제*를 해줘야한다.

```cpp
int main() {
  Car* p = new Car;

  p->Go();

	if (true) {
		// 해당 부분에서도 꼭 자원해제 필요..!
		// delete p;
		return;
	}

  (*p).Go();

	// 보통 잘 하지 않음
  delete p;
}
```

이와 같이, 사용자가 직접 메모리를 관리 즉, 해제하도록 할 경우 *실수*가 발생할 수
있고, 이로인해 *자원 누수 현상*이 발생할 수 있다. 따라서, modern C++ 에서는
*스마트 포인터*라는 개념을 제공한다

### 스마트포인터 원리
Modern C++에서 제공하는 스마트포인터 같은 경우 `<memory>` 헤더파일 내 존재하며,
해당 헤더파일을 인클루드 해야 사용가능하다.

C++ 에서 제공하고 있는 스마트포인터는 `shared_ptr`, `weak_ptr`, `unique_ptr` 총
3가지 이다.

해당 포스팅에서는 `shared_ptr`를 활용해 스마트포인터에 대한 원리를 다루도록
한다. 이후 포스팅에서 자세하게 각 포인터의 기능들이 왜 나눠져있는지 알아보도록
하자.

사용하는 방법은 아래와 같다.

```cpp
#include <iostream>
#include <memory>

using namespace std;

class Car {
  int color;

public:
  ~Car() {
    cout << "~Car()" << endl;
  }

  Go() {
    cout << "Go()" << endl;
  }
};

int main() {
  // Car* p = new Car;
	shared_ptr<Car> p( new Car );

  p->Go();
  (*p).Go();

  // 꼭 자원 해제 필요
  //delete p;
}
```

`shared_ptr` 포인터를 사용하기 위해서는 `memory` 파일을 인클루드해야한다. 또한,
포인팅할 객체를 *인자*로 전달해야한다. 위와 같이, 코드를 작성할 경우 우리는
스마트 포인터만 선언했는데, 프로그램 종료시 자동으로 `~Car()` 소멸자가 불리는 것을 확인할 수 있다.

아래의 그림을 통해 어떻게 포인터가 내부적으로 *제거* 될 수 있는지를 확인해보자.

![sptr1](/assets/img/sptr1.png)

위의 그림과 같이, 우리는 `shared_ptr`를 생성할 때, `type` 값을 `Car`로 지정하고,
	인자로 `Car` 객체를 전달한다. `shared_ptr` 내부에는 전달된 `type`값에 해당되는
	포인터가 존재하며, 해당 포인터는 전달받은 인자값을 가리키도록 한다.

스마트포인터를 사용하고, 속해있는 함수가 제거될 경우 `shared_ptr`의 소멸자가
불리게 되며, 소멸자 내에서 내부적으로 갖고 있던 포인터를 `delete`연산을 통해
제거하도록 한다.

*그렇다면 일반적인 포인터와 같이 스마트포인터에서는 어떻게 `->` 동작과 `\*` 동작을
사용할 수 있을까? 🤔*

그 이유는 스마트포인터 객체내에서 `operator->()` 연산자와 `operator*()` 연산자를 재정의했기 때문에다. 간단히 생각해보면 아래와 같이 구현되어져 있을 것 같다.

```cpp
class shared_ptr{
	T* type;
	...

public:
		~shared_ptr() {
			delete type;
		}

		T* operator->() {
			return type;
		}

		T operator*() {
			return *type;
		}
		...
};
```

아마 이런 모습으로 재정의 되어 있지 않을까 생각해본다.

간단하게 동작원리를 알아보았는데, 그렇다면 왜 C++에서는 3가지 타입으로
스마트포인터를 나눠서 제공해줄까?

그 이유에 대해서는 다른 포스팅을 통해 알아보자!

### Reference
[C++ 강의](https://www.ecourse.co.kr/)

