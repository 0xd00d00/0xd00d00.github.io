---
layout: post
author: doodoo
title: "[C++][Modern C++] shared_ptr 스마트포인터 (ii)"
subtitle: "shared_ptr에서 발생할 수 있는 문제점 및 해결책에 대해 알아보자 🤓"
date: 2022-03-10
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Shared ptr에서 발생할 수 있는 문제와 해결책에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Shared ptr에서 발생할 수 있는 문제점
`shared_ptr`을 사용하면 메모리 할당이 몇 번 일어날까? *대상객체 할당* 및
*Control block 할당* 총 2번 발생하게 된다.

할당과정에서 2가지 문제점이 발생하게 된다.

*🌱 memory fragmentation*

아래의 그림을 보자. 우리가 `shared_ptr`을 통해 객체를 생성할 경우의 그림이다.

![sptr3](/assets/img/sptr3.png)

위의 그림과 같이, 2개의 객체를 생성하기 때문에 "메모리 단편화" 문제가 발생한다.
즉, 메모리는 존재하는데 단편적으로 존재해 연속적인 메모리를 제공하지 못하는
문제가 발생할 수 있다.


*🌱 컴파일시 에러 시, 자원누수*

컴파일러 별로 코드를 컴파일 순서가 같은수도 있고 다를수도 있다. 컴파일러로 인해
`shared_ptr` 객체에서는 "자원 누수"문제가 발생할 수 있다.

![sptr4](/assets/img/sptr4.png)

위의 그림과 같이, `shared_ptr`를 통해 객체를 포인팅하고 제어객체를 생성하는
과정을 보자.

1. 객체 할당
2. 객체 포인팅
3. Control block 할당
4. Control block 포인팅

4가지 과정으로 볼 수 있는데, 객체 포인팅 이후 "Control block"을 할당하는 과정에서
컴파일 에러가 발생할 경우 해당 객체를 제거할 수 있다.

하지만, 컴파일러 별로 할당할 수 있는 객체를 먼저 할당하고, 이후에 포인팅하는
컴파일러가 있는데 이 경우 *자원누수*가 발생하게 된다.

즉, 대상객체를 먼저할당하고, 컨트롤 블롤 객체를 할당하는 과정에서 *에러가 발생*
했다고 가정해보자. 이 경우 처음에 할당했던 대상객체는 가리키고 있는 포인터가
없기 때문에 시스템 종료시 까지 제거가 불가능하다. 이런 경우를 우리는 *자원누수*가 발생했다고 한다.

위 두가지를 막기 위해, C++에서는 `make_shared` 함수를 제거한다

### 해결사: make_shared
`make_shared` 함수를 활용하면 아래의 그림과 같이 대상객체와 Control block을
연속적인 메모리 공간에 같이 생성하도록 한다.

![sptr5](/assets/img/sptr5.png)

위와 같이 `make_shared`를 사용할 경우 대상객체와 Control block을 같이 생성하기
때문에 메모리 효율적이며, 예외에도 안전하게 자원을 제거할 수 있다.

`make_shared`의 사용법은 아래와 같다.

```cpp
int main() {
	// 왠만해서는 make_shared로 shared ptr를 생성하도록 하자!!
	// 2가지 다 사용가능
	shared_ptr<Car> p = make_shared<Car>();
	shared_ptr<Car> p1(make_shared<Car>());
}
```

최대한 `make_shared`를 활용해 코드를 작성하도록 하자. `shared_ptr`를 사용할 경우
추가적인 문제점이 존재하는데, 아래를 통해 알아보자.

### Raw pointer 초기화 시 문제점
`shared_ptr`에서 raw pointer를 활용해 초기화 할 경우 버그가 발생할 수 있다.
따라서, raw pointer 초기화 하는 부분은 신중해야된다.

아래의 예시 코드를 통해 알아보도록 하자.

```cpp
#include <iostream>
#include <memory>
#include "car.h"

using namespace std;

int main() {
	Car* p = new Car;

	shared_ptr<Car> sp1(p);

	// 제어 블록 공유
	// use_count 2
	shared_ptr<Car> sp2(sp1);

	// 만약 raw pointer로 추가하게 될 경우는
	shared_ptr<Car> sp2(p);
}
```

위의 코드를 보면, `shared_ptr`를 생성하는데 `p`라는 raw pointer를 활용해
초기화를 하고 있다. 첫 번째 `sp1` 초기화 같은 경우 문제 없이 잘 동작한다.

`sp2`를 `sp1`으로 초기화하더라도, 아래의 그림과 같이 제어 블록을 공유하기 때문에
문제 없다. 예를 들어 포인터가 지워지더라도, 제어블럭 내 `use_count`가 0이 아니라
대상 객체가 지워지지 않는다.

![sptr6](/assets/img/sptr6.png)

위의 그림을 참조해보면, `shared_ptr<Car> sp2(sp1)`와 같이 작성할 경우
`shared_ptr`를 통해 control block을 공유하기 때문에 실행 시 문제 없이 동작한다.
하지만 아래의 경우와 같이 raw pointer로 각자 초기화 할 경우 문제가 발생한다.

![sptr7](/assets/img/sptr7.png)

위의 그림과 같이, raw pointer로 초기화 할 경우 각자의 `control block`을 만들게
되는데, 이 때 포인터가 제거 될 경우 `use_count`는 *1*이라 대상객체 자체가
*제거*되 버리는 문제가 된다.

예를들어, `sp1`과 `sp2`가 각각 `p`라는 raw pointer로 초기화 됐을 경우, `sp1`이
제거된다면 대상객체가 파괴된다. 따라서, `sp2`가 가리키는 객체는 사라지게 되고
잘못된 포인터 값 (찾아가도 대상객체 없음)을 갖게 된다.

이를 막기 위해서는 아래와 같이 *RAII (Resource Acquisition Is Initialization)*
즉, 생성하면서 초기화하도록 작성해야한다.

```cpp
#include <iostream>
#include <memory>
#include "car.h"

using namespace std;

int main() {
	// 아래와 같이 생성하고 초기화 하지말자.
	Car* p = new Car;
	shared_ptr<Car> sp1(p);

	// 아래와 같이 생성하면서 초기화 하자!
	shared_ptr<Car> sp2(new Car);

	// 더 나은 방향으로는 make_shared 사용하자
	shared_ptr<Car> sp3 = make_shared<Car>();
}
```

위의 코드와 같이 생성과 초기화를 나누지 말고, 생성하면서 초기화 하도록 하자.
그리고 우리가 위에서 언급했던것과 같이, `make_shared`를 활용해 생성하도록 하자!!

### Next
위와 같이 raw pointer를 활용해서 초기화하게 될 경우 `undefined` 동작이 발생할수
있기 때문에 조심해야된다. 위의 예시와 같이 쉽게 발견되면 충분히 고칠 수 있으나 *threading* 동작을 수행할 때 주의해야된다. 그
부분은 [다음 포스팅]()을 통해 다뤄보도록 한다.

### Reference
[C++ 강의](https://www.ecourse.co.kr/)
