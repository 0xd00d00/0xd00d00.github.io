---
layout: post
author: doodoo
title: "[C++][Modern C++] weak_ptr 내부 구조"
subtitle: "weak pointer의 내부구조를 알아보자 🙄"
date: 2022-03-20
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 weak pointer 내부구조에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
이전 포스팅부터 함께 사용해 온 `car.h` 헤더파일을 공유한다. 이 header file의 근원을 보고 싶다면, [여기](https://0xd00d00.github.io/2022/03/09/cpp_smart_ptr_2.html)를 클릭해서 알아보자.

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

아래코드에서는 해당 파일을 header file `car.h`로 추가해 사용하고자 한다.

### weak_ptr 동작원리
`weak_ptr`를 활용하면, 대상 객체가 파괴되었는지를 알 수 있는 `expired()`를
사용할 수 있다. 스마트 포인터가 가리키는 대상 객체가 파괴되었는데, 어떻게 스마트
포인터로 대상 객체에 대한 정보를 알 수 있을까?

비밀은 바로 *Control block* 에 존재한다.

아래의 코드를 통해 이야기해보자.

```cpp
#include <iostream>
#include <memory>
#include "car.h"

using namespace std;

int main() {
	weak_ptr<Car> wp;
	{
		shared_ptr<Car> sp = make_shared<Car>();

		cout << sp.use_count() << endl;
		wp = sp;
	}

	if (wp.expired())
		cout << "대상 객체는 파괴됨..";

}
```

위의 코드 처럼, `{ ... }` 내부를 벗어나게 되면 `shared_ptr`이 가리키고 있는 대상
객체는 파괴 된다. `weak_ptr` 또한 대상객체가 파괴되는데 어떻게 대상
객체에 대한 정보를 계속해서 유지할 수 있는지에 대해 알아보자.

아래의 그램을 보자.

![sptr10](/assets/img/sptr10.png)

`Shared_ptr`를 만들게 되면 대상객체와 Control block을 만드는 것을 주구장창 [이전
포스팅](https://0xd00d00.github.io/2022/03/09/cpp_smart_ptr_2.html)을 통해서 들어왔을 것이다.

Scope를 벗어나면 `shared_ptr`은 대상객체를 파괴한다. 또한 Control block을
파괴하는데, 파괴되는 조건이 *use_count* 가 "0" 인지 확인한다. 또한 *weak count*
라는 weak_ptr의 reference 정보도 "0" 인지를 같이 확인한다.

만약 `weak_ptr`이 가리키고 있어 weak count가 "0"이 아니면 *Control block* 은
파괴하지 않고 유지한다. 이후 `expired()`를 통해 내부 pointer를 활용해 null인지를
판단하고, bool 값으로 반환해준다.

그림에서 보이는 Control block의 정보 중 weak counter와 ptr은 이럴 경우를 대비해
사용하는 것이라는 것을 기억할 필요가 있다.

### Reference
[C++ 강의](http://www.ecourse.co.kr)
