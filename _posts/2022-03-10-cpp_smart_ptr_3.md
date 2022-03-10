---
layout: post
author: doodoo
title: "[C++][Modern C++] shared_ptr 스마트포인터 (ii)"
subtitle: "shared_ptr에서 발생할 수 있는 문제점 및 해결책에 대해 알아보자 🤓"
date: 2022-03-10
cover: /assets/img/default.png
tags: C++ Modern C++
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
