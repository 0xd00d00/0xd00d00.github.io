---
layout: post
author: doodoo
title: "[C++ Basic] C++ namespace"
subtitle: "C++ 에서 사용중인 namespace에 대해 알아보자 🙃"
date: 2023-01-28
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---

안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ namespace에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
오늘 포스팅에서는 *namespace의 필요성*, *namepsace 요소 접근방법*에 대해
알아보겠습니다.

### namespace 필요성
C++ namespcae은 C언어의 문제점을 해결하기 위해 탄생되었다.

C언어에서는 하나의 실행파일을 만드는데, *동일한 이름*의 함수를 사용할 수 없었다.

예를들어, video와 audio를 수행하는 media 관리 실행파일이 있다고 해보자. video와
audio를 만드는 개발자가 달라, 초기화 하는 이름을 동일하게 `init()`으로 만들고
컴파일 할 경우 아래와 같은 에러를 만날 수 있다.

```c
./audio.h:1:6: error: redefinition of 'init'
void init() {}
     ^
./video.h:1:6: note: previous definition is here
void init() {}
```

이와 같은 문제는 C언어에서 *동일한 이름*의 함수를 사용할 수 없기 때문에
발생한다.

C++에서는 이 문제를 해결하기위해, 기능별로 구별할 수 있는 `namespace` 개념을 추가했다.

```cpp
#include <stdio.h>

// Audio 관련된 일은 여기서.
namespace Audio
{
	void init() {
		printf("Audio init\n");
	}
}

// Video 관련된 일은 여기서.
namespace Video
{
	void init() {
		printf("Video init\n");
	}
}

// namespace 포함되지 않을 경우 전역 space
// global namespace라고도 함.
void init()
{
	printf("System init!\n");
}

int main()
{
	init();
	Audio::init();
	Video::init();
}
```

위와 같이 `namespace`를 활용해 기능단위로 묶어 사용한다면 이름이 동일해도
충돌나지 않고 함수를 호출할 수 있다.

`namespace`의 이름 (e.g. Audio, Video)을 붙여 `init()`을 호출할 경우 특정 기능에 해당되는 함수가
호출되며, `namespace`가 없는경우 *전역 스코프*에 있는 함수를 찾아 호출한다.

#### namespace의 장점
정리해보자면, C++에서 사용하고 있는 namespace의 장점은 2가지이다.

🌱 프로그램의 기능을 연관된 코드로 묶어서 관리함. <br>
🌱 함수 또는 변수 등의 이름충돌을 막을 수 있음.

### namespace 요소 접근방법
namespace 요소 접근 방법은 *Qualified name (완전한 이름)*, *using declaration
(using 선언)*, *using directive (using 지시어)* 를 활용한 3가지 방법이 있다.

아래의 예시를 통해 접근 방법을 알아보도록 하자.

```cpp
// Audio namespace 내 있는 함수를 접근하는 방법을 알아보자.

#include <stdio.h>

namespace Audio
{
	void init() { printf("Audio init\n"); }
	void reset() { printf("Video init\n"); }
}
```

#### Qualified name (완전한 이름)
namespace의 이름을 적고, 함수를 쓰는 방법이다.

```cpp
int main() {
	// 접근 방법 namespae::함수명
	Audio::init();
}
```

가장 안전한 방법으로, 통상 개발할 때 해당 방법을 활용한다.

#### using declaration (using 선언)
namespace 내 있는 특정함수는 namespace 없이 사용하도록 선언하는 것이다.

```cpp
int main() {
	// 특정함수 using 선언!!!
	using Audio::init();

	// Audio 내 init() 호출
	init();

	// 에러..
	// 전역스코프에 선언된 친구도 없음.
	//  using 선언으로 init() 만 선언함.
	reset();
	// Audio::reset(); 이 친구만 호출 가능.
}
```

using 선언의 스코프는 선언한 함수 스코프이다. 함수 밖에서 선언할 경우
전역스코프이다.

#### using directive (using 지시어)
특정함수를 넘어 namespace에서 사용중인 모든 함수를 사용할 수 있도록 지시하는
방법이다.

```cpp
int main() {
	// namespace Audio와 연관된 모든 함수는 해당 스코프에서 사용가능하도록 함.
	using namespace Audio;

	// 둘 다 에러없이 동작함.
	init();
	reset();
}
```

위와 같이 Audio namespace에 모든 함수를 접근할 수 있도록 using 지시어를 활용할
수 있다.

특정함수만 접근할 수 있는 것이 아니기 때문에 `init`, `reset` 모두 호출할 수
있다.

🤔 만약, 전역영역에 동일한 이름을 가진 `init` 함수가 있을 경우 어떻게 될까?

*이름 충돌로 에러가 발생할 것이다*

이를 해결하기 위해서는 아래와 같이 "난 전역의 `init`을 호출할 것이다." 라는
구별표시 `::` 를 꼭 작성 해줘야한다.

```cpp
int main() {
	using namespace Audio;

	// Audio 내 init() 호출
	init();

	// 전역에 있는 init() 호출
	::init();
}
```

우리가 C++을 처음 배울 때, 귀찮으면 `using namespace std` 적고 시작해라. 라는
말을 많이 듣고 볼 수 있다. 그 이유가 위와 같이, std namespace에 있는 함수를 모두
사용할 수 있도록 하는 지시어이기 때문이다.

표준 라이브러리의 namespace는 이후 포스팅에서 자세히 다루고자 한다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해서 확인해주세요!
