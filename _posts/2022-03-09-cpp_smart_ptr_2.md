---
layout: post
author: doodoo
title: "[C++][Modern C++] shared_ptr 스마트포인터 (i)"
subtitle: "shared_ptr 사용방법 및 구조에 대해 알아보자"
date: 2022-03-09
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 스마트포인터 shared_ptr 에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
`Shared_ptr` 설명하기 전, 예시에서 사용할 Class 부분을 먼저 정리하고자 한다.
Class 부분이 소스코드에 들어가있으면, 소스코드가 정말 길어져서 실제 봐야하는
부분을 보기가 어렵다. 따라서, Class 사용 부분은 `header file`로 묶어
인클루딩해서 사용하고자 한다.

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

### Shared_ptr의 기본
#### 초기화 방법
C++에서 초기화 할 수 있는 방법은 *copy initialization* 과 *direct
initialization* 두 가지 방법이 있다.

```cpp
// copy initialization
int a = 0;

// direct initialization
int a(0);
```

두 가지 생성 방법을 활용해 `a` 값을 초기화 한다. 하지만, `shared_ptr` 같은 경우
*copy initialization* 방법으로는 초기화가 불가능하다. 해당 방법을 활용해
초기화를 하게 될 경우 엄청나게 긴 *컴파일 에러*를 마주하게 될 것이다. *copy
initialization* 부분 같은 경우 `explicit` 키워드를 활용해 내부적으로 암묵적
변환을 하지 못하게 구현했을 것이라 예측해볼 수 있는 대목이다.

```cpp
#include <iostream>
#include <memory>
#include "car.h"

using namespace std;

int main() {
  // copy initialization 을 할 경우 에러가 발생함.
  // shared_ptr<Car> p = new Car;
  // explicit 으로 생성자가 정의 되어져있을 것임.
  // 즉 암묵적 형변환 못하도록.
  shared_ptr<Car> p(new Car);
}
```

#### pointer 공유 with Control Block
아래의 코드와 같이, 복사초기화는 불가능하지만 대입연산을 활용해 같은 값을
가리키도록 할 수 있다.

```cpp
#include <iostream>
#include <memory>
#include "car.h"

using namespace std;

int main() {
  shared_ptr<Car> p(new Car);
  shared_ptr<Car> p1 = p;
}
```

위와 같이 같은 같은 객체를 가리킬 경우 제거할 때 문제가 된다. 구체적으로, 같은
대상을 여러개의 포인터가 가리키고 있다면 객체를 함부러 지우면 안된다. 만약
지우게 될 경우 dangling 이라는 문제가 발생하게 되는데 이 부분을 막기위해 `shared_ptr`
객체에서는 *control block*이라는 제어블록을 활용해 참조계수를 관리하도록 한다.

아래의 그림을 통해 제어블록에 대해 알아보자.

![sptr2](/assets/img/sptr2.png)

`share_ptr` 같은경우 같은 객체를 얼마나 가리키고 있는지 혹은 allocater는 뭔지
등에 대한 정보를 갖고 있는 *control block*을 pointer 객체와 같이 생성한다. 위의
그림에서 보이는 것처럼 *control block* 내 *use count*는 현재 몇 개의 포인터가
얼마나 참고하고 있는지를 알려주는 포인터이다.

실제 `use_count`를 출력해보면 현재 몇 개가 참조하는지 알 수 있다. *.* 연산자를
활용하면 `shared_ptr` 내부 객체에 접근이 가능한데, 이 부분은 아래 자세하게
다루도록 한다. 우선 `use_count`를 출력하는 부분에 대해서만 보도록 하자.

```cpp
int main() {
	shared_ptr<Car> p(new Car);
  shared_ptr<Car> p1 = p;

	std::cout << p.use_count() << std::endl;
}
```

스마트포인터에는 다양한 종류의 객체가 있지만, 그 중 *shared_ptr* 같은 경우
control block을 활용해 자원을 공유하기 때문에 이름을 `shared`라고 명명했다.

#### 삭제자 변경
`shared_ptr`에서는 생성 시, 추가 인자를 통해 삭제자 와 생성자를 변경할 수 있다.
위에 나왔던 *control block* 그림에서 제일 아래쪽에 보이는 deleter 와 allocater가
바로 삭제자와 할당자를 나타낸다. 사용자가 추가하지 않을 경우 default로 정의된
삭제자와 할당자를 사용한다.

우리가 만든 삭제자를 추가하는 방법을 아래의 예시를 통해 알아보도록 하자.
삭제자를 만드는 방법은 여러가지가 있다. 아래의 예시에서는 일반함수와 람다를 통해
삭제자를 변경하는 방법을 보도록 하자.

```cpp
#include <iostream>
#include <memory>
#include "car.h"
using namespace std;

// 로깅을 추가한 삭제자
void foo( Car* p) {
	cout << "Delete Car!!!" << endl;
	delete p;
}

int main() {
	// 일반함수 즉, 삭제자를 만들어 추가하는 방법
	shared_ptr<Car> p(new Car, foo);

	// 람다를 활용하는 방법
	shared_ptr<Car> p(new Car, [](Car* p) { delete p; });
}
```

#### shared_ptr에서의 배열
만약 우리가 `shared_ptr`로 배열을 가리키도록 할 경우 어떻게 해야할까? -> 버전
별로 다르다. 구체적으로 C++17 이전과 이후 버전으로 나뉘게 된다.

*🌱 C++17 이전*

`shared_ptr`을 활용한 배열을 사용할 경우 배열을 삭제할 수 있는 *삭제자*를 생성해
추가해줘야한다. 아래의 예시를 통해 *배열을 제거*하는 삭제자를 추가한 코드를
참고하자.

```cpp
int main() {
	shared_ptr<Car> p(new Car[10], [](Car* p) { delete[] p; });

	// 아래의 방법 사용불가.. []연산자 미정의.
	// p[0].Go();
}
```

`shared_ptr`에서 배열 연산자 (*[]*)를 통한 접근이 불가능하다. 이는 객체 내에서
`operator[]`를 만들어두지 않았기 때문이다.

 그 이유는 배열을 위한 자원관리 스마트포인터를 사용하지 않는 것을 권장했기
 때문이다. 이미 만들어진 *자원관리 컨테이너* `vector`, `array`등을 사용하는 것이 좋기때문에 굳이 추가하지 않았다고 볼 수 있다.

 *🌱 C++ 17이후*

 C++17 이후에서는 스마트포인터를 활용한 배열관리가 가능해졌다. 특히,
 `[]`연산자가 사용가능하기 때문에 편하게 사용하면된다. 아래의 코드를 통해
 사용방법을 알아보자.

```cpp
int main() {
	// 넘기는 타입 뒤에 "[]"를 추가하면 된다.
	shared_ptr<Car[]> p(new Car[10]);
	p[0].Go();
}
```

### Shared_ptr 기본 함수
우리가 흔히 대상에 접근하는 방법으로 *-> 연산* 과 *. 연산*을 활용한다.
`shared_ptr`에서 대상을 접근할 때 *-> 연산*을 활용하는 것을 많이 봤을 것이다.
그렇다면 *. 연산*을 활용하면 어떻게 될까?

```cpp
int main() {
	shared_ptr<Car> p(new Car);
	p->Go();

	p. // 어떻게 될까?
}
```

바로, `shared_ptr` 객체 자체 내에 있는 내부 함수에 접근이 가능해진다. 내부
함수는 어떤 것들이 있을까?

`shared_ptr` 내부에 있는 주요 4가지 함수에 대해 알아보자.

1. get - 가리키는 대상체 포인터 반환 (raw pointer)
2. use_count - 참조 계수 반환
3. reset - 대상체 변경
3. swap - 대상체 교환

예시를 통해 알아보자.

```cpp
int main() {
	shared_ptr<Car> p(new Car);
	p->Go();

	// get 함수
	Car* raw_pointer = p.get();

	// use_count 함수
	shared_ptr<Car> p1 = p;
	cout << p1.use_count << endl; // 2 출력

	// 아래의 코드는 에러 발생
	// 대상체 직접 변경 불가능
 	// p1 = new Car;

	// reset 함수
	p1.reset(new Car);

	// 가지고 있는 대상체 제거
	p1.reset();

	// swap 함수
	p1.swap(p);
}
```

### Next
이번 포스팅을 통해 `shared_ptr` 사용방법에 대해 알아보았다. [다음 포스팅]()통해
`shared_ptr`에서 발생할 수 있는 *문제점* 과 *해결책*에 대해 알아보도록 하자 🤓.

### Reference
[C++ 강의](https://www.ecourse.co.kr/)
