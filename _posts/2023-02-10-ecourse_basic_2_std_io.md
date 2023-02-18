---
layout: post
author: doodoo
title: "[C++ Basic] C와 C++의 표준 입출력"
subtitle: "C++ 에서는 어떤 표준 입출력을 사용할까? 🧐"
date: 2023-02-10
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 표준입출력에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
이번 포스팅에서는 *C 언어와 C++언어의 Standard IO 차이*에 대해 알아보겠습니다.

### Standard IO 차이
우리가 프로그래밍 언어를 배울 때, 기본적으로 작성하는 프로그램은 단순한 입출력
프로그램이다. *숫자를 입력 받아 출력하는 프로그램*을 만들어 보자.

이 프로그램을 통해 C언어와 C++언어의 Standard IO 문법 차이를 알아보도록 하자.

```c
#include <stdio.h>

int main()
{
	int n = 0;
	scanf("%d", &n);

	printf("value: %d\n", n);
}
```

우리가 C언어에서 입력을 장치로 부터 받기위해서 `scanf`라는 함수를 사용했다.
그리고 모니터에 출력하기 위해 `printf` 함수를 활용해 출력하도록 했다.

C++ 언어는 어떻게 사용할까?

물론 [앞서 배운 내용](https://0xd00d00.github.io/2023/02/05/ecourse_basic_cpp_std_namespace.html)을 통해 충분히 C++ 언어에서도 C언어를 자유롭게 출력할 수 있다는 점 즉, stdio.h 를 ctdio로 활용할 수 있다.

하지만, C++에서 만든 입/출력 함수가 존재하며, 해당 문법에 대해서 익히도록 하자.

```cpp
#include <iostream>

int main()
{
	int n = 0;
	// cin은 정수 인지 실수 인지 구별 할 필요 없음.
	std::cin >> n;

	// C++ 전용 개행을 사용할 땐, \n -> std::endl이다.
	std::cout << "value : " << n << std::endl;
}
```

위 코드를 보면 몇 가지 특징있다.

1. `cin` 함수를 활용해 입력을 받을 경우 서식을 지정할 필요가 없다.

2. C 언어와 달리, 주소값을 보내지 않고 변수명만 보내도 입력받은 값을 변수에 담을
   수 있다.

*[1]* 특징 같은 경우, 불필요하게 정수 혹은 실수를 구별할 필요 없이 그냥 편하게
변수를 적어주면 알아서 입력을 받을 수 있다.

*[2]* 특징 같은 경우, Call by pointer가 아닌 Call by value 로 넘기는데.. 이게
어떻게 값을 받아올 수 있는지.. 차후 10장 포스팅을 통해 자세하게 알아보도록 하자.
우선, 주소값을 전달하지 않아도 되기 때문에 함수 인자가 간결하고, 실수를 줄일 수
있다.

추후 뒷 포스팅들을 통해 어떤 방식으로 구성되고, `std::cout` 과 `std::endl`를
만들어 보면서 어떤 특징을 가지고 있는지 알아보도록 한다.

지금은 문법을 이렇게 사용하는 구나 정도로 이해하면 좋을 것 같다.

### C++ 출력의 몇 가지 특징
우리는 출력을 할 때, 어떤 형태 (e.g. 2진수 or 6진수 출력, 10자리 공백 포함 출력
등)을 지정해 사용하기도 한다.

C언어에는 서식 문자 (e.g. %d, %f) 혹은 이스케이프 시퀀스 (\t, \r 등)을 통해
형태를 만들어 출력한다.

반면, C++에서는 출력의 형태를 위한 몇가지 함수들이 있는데 이를 활용하는 예시를
보도록 하자.

*실제 출력 결과는 컴파일을 통해 해보도록 하자* 설명은 주석으로 대체한다.

```cpp
#include <iostream>
#include <iomanip>

int main() {
	int n = 10;
	// default 출력은 10진수
	std::cout << n << std::endl;

	// 16진수 출력을 위함.
	std::cout << std::hex << n << std::endl;

	// 이후 n의 출력 값은? => 16진수로 지정됨.
	std::cout << n << std::endl;

	// 이를 10진수화 하고 싶다면 아래와 같이 변환해줘야함.
	std::cout << std::dec << n << std::endl;

	// 10자리를 맞춰 출력하고 싶다면, -> <iomanip> 헤더필요
	std::cout << std::setw(10) << "hello"<<  std::endl;

	// 공백을 '#'으로 채우고 싶을 때.
    std::cout << std::setw(10) << std::setfill('#') << "hello" << std::endl;

	// 값을 왼쪽에서 부터 출력하고 싶을 때, 현재는 'hello'가 오른쪽에 맞춰
	// 출력됨. 이를 왼쪽에 맞춰 출력시키고 싶을 경우
    std::cout << std::setw(10) << std::setfill('#') << std::left << "hello" << std::endl;
}
```

위와 같이, 입출력을 변경하기 위해서 사용하는 함수를 입출력 조정자 함수라고
부른다. `std::hex` , `std::left` 와 같은 함수가 아닌 형태를 *입출력 조정자*라고
칭한다.

이외 다양한 조정자들이 있는데, 이를 자세하게 알고 싶은 분들은 [여기](https://cplusplus.com/reference/iomanip/)를 클릭해 알아보도록 하자.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!

