---
layout: post
author: doodoo
title: "[C++ Basic] 표준 라이브러리, std namespace"
subtitle: "std namespace 내부는 어떻게?? 🧐"
date: 2023-02-05
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 std namespace에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
오늘 포스팅에서는 *namespace 충돌방지*, *namespace 재사용*, *std namespace
내부*에 대해 알아봅니다.

### namespace 충돌방지
namespace 지시어를 활용해, 지시된 namespace 내 모든 함수를 접근할 수 있게 할
경우 의도하지 않은 충돌상황이 발생한다.

일례로, 우리가 처음 C++을 배울 때, 편리함을 위해 `std` namespace를 전체적으로 열어두고 사용하도록 예시를 작성한다.

`std` namespace를 열어두고 작성하는 습관을 갖고 프로그래밍을 할 경우 의도하지
않은 문제가 발생하게 된다.

*for loop를 활용해 배열 내 들어있는 값 중 가장 큰 값을 뽑아보자.*
(C++ 유틸리티 max 함수를 활용할 것, 해당 함수는 algorithm에 들어있다.)

```cpp
#include <iostream>
// 유틸리티를 사용할 수 있는 헤더파일
#include <algorithm>

// 편리함을 위해 열어둠.
using namespace std;

int count = 0;
int main() {
	int arr[5] = {3,2,13,4,5};

	for (int i = 1; i < 5; i++) {
		count = max(count, arr[i]);
	}

	cout << "count " << count << endl;
}
```

위와 같이 작성할 경우, 논리적으로는 문제가 없다. 하지만, 아래와 같은 에러를
만나게된다.

```cpp
error: reference to 'count' is ambiguous
count = max(count, arr[i]);
```

에러를 참고해보면, `count`가 모호하다고 나온다. 즉, 어딘가에서 동일한 이름으로
사용하고 있다는 말인데, 내 코드에서는 `count`를 따로 만들어 사용하고 있는게
없다.

`count` 같은 경우 utility 중 `count()`라는 이름으로 사용되고 있다. 해당 함수는
`std` 네임스페이스 안에 존재하는데, 우리가 지금 *using 지시어*를 통해 `std`
네임스페이스 내 모든 함수를 사용할 수 있도록 했기 때문에 local `count` 와 이름
충돌이 발생하게 된다.

즉, 이와 같이 의도하지 않은 이름충돌이 발생할수도 있기 때문에 namespace를
여는것은 굉장히 조심스러워야 한다.

보통 프로젝트 개발을 할 때, 이런 문제를 해결하기 위해 *Qualified name (완전한
이름)* 방법을 활용해 사용한다.

```cpp
#include <iostream>
// 유틸리티를 사용할 수 있는 헤더파일
#include <algorithm>

// !! using 지시어 제거한다!!!!
// using namespace std;

int count = 0;
int main() {
	int arr[5] = {3,2,13,4,5};

	for (int i = 1; i < 5; i++) {
		// !! std namespace를 완전히 적어줘야함.
		count = std::max(count, arr[i]);
	}

	// !! std namespace를 완전히 적어줘야함.
	std::cout << "count " << count << std::endl;
}
```
### namespace 재사용
아래의 코드를 통해 namespace의 재사용이 가능한지 알아보자.

```cpp
#include <iostream>

void turnOn() {
	std::cout << "turn on the music stream!" << std::endl;
}

namespace Audio {
	void init() {}
}

int main() {
	Audio::init();
	turnOn();

	// 아래와 같이 호출이 가능할까?
	Audio::turnOn();
}
```

위의 코드 주석과 같이, `Audio::turnOn` 함수는 호출할 수 있을까? 코드를
빌드해보면 컴파일 에러가 발생할 것이다.

Audio namespace 내 `turnOn` 함수가 존재하지 않기 때문이다.

외부 혹은 다른 namespace에 사용중인 함수는 재사용이 불가능할까?

가능하게 하기 위해서는 이름을 만들어 동일한 문장을 복사해야하는건가??

결론적으로는, *재사용이 가능하다.* 아래의 코드를 통해 확인해보자.

```cpp
#include <iostream>

void turnOn() {
	std::cout << "turn on the music stream!" << std::endl;
}

namespace Audio {

	// 아래와 같이 사용을 원하는 함수를 using 선언 하면 된다.
	using ::turnOn;
	void init() {}
}

int main() {
	Audio::init();
	turnOn();

	// 아래와 같이 호출이 가능할까?
	Audio::turnOn();
}
```

위와 같이, `using` 선언을 통해 특정 함수를 선언해주게 될 경우 *재사용*이
가능하다. 위 코드는 전역에 있는 함수를 재사용하고 싶기 때문에 `using ::turnOn;`
이라고 선언을 했다.

만약, 다른 namespace 내 들어있다면 `using anotherNameSpace::turnOn;` 과 같이
선언하면 재사용이 가능하다.

### std namespace 내부
우리가 위에서 언급한 것과 같이 namespace는 재사용이 가능하다. C++에서는 이를
어떻게 활용했을까?

C++은 C 언어를 모두 포함해 만들어진 언어이다. 따라서, C언어에서 사용중인 모든
것들이 C++에서 사용가능해야된다. 예를들면, C library 들 모두 사용이
가능해야된다.

```cpp
// c++ 파일이라도 아래의 코드가 돌아가야한다.

#include <stdio.h>

int main() {
	printf("hello world!\n");
}
```

위 코드를 수행해보면, 잘 돌아가는 것을 확인할 수 있다.

위와 같이 작성할 경우, C언어의 이해도가 낮은 개발자가 C언어 라이브러리를 몰라
`printf` 라는 출력 함수를 만들경우 이름 충돌이 발생할수도 있다. (사실 printf는
인자로 전달되는 값이 있어서 이름 충돌나기는 어렵다.. 예시라 생각하자 🤫)

C++ 진영에서는 `printf`와 같은 C에서 제공하는 함수들이 혹시나 이름 충돌이
발생하지 않을까 생각해 이를 `std namespace`에 넣고자 했다.

이를 넣기 위해선 어떻게 해야될까?

아마 아래코드와 같이 되어있지 않을까?

```cpp
namespace std
{
	// 전역에 있는 printf는 std로 가져올거에요!
	using ::printf;
}
```

위의 코드와 같이 기존에 사용하던 C library는 namespace 개념이 없어 모두 전역에
선언되어져 있는 점을 활용해 `using ::FunctionName` 으로 *namespace 재사용*을
했을 것이다.

이후 C에서 만든 stdio.h 파일이다 해 `cstdio`라는 헤더파일이름을 만들었을 것이라
생각한다.

우리가 C++에서 C library를 쓰고 싶다면 대부분은 `.h`을 때고 접두어로 `c`를
붙이면 된다 (e.g. cstdio, cstring, cmath 등)

자세한 내용은 [여기](https://cplusplus.com/reference/clibrary/)를 참조해보자.

끝으로, cstdio 헤더파일 내 들어있는 printf를 아래와 같이 `std` namespace를 적어 사용해 "이름충돌" 을 피하도록 하자!

```cpp
#include <cstdio>

int main() {
	std::printf("hello world!\n");
}
```

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
