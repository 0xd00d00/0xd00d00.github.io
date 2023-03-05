---
layout: post
author: 널두
title: "[C++ Basic] C++ new"
subtitle: "C++ 동적할당에 대해 알아보자!"
date: 2023-02-13
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 동적할당에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
오늘 포스팅에서는 *동적메모리 할당 이유* 와 *C++ 동적할당 (new / delete)*에 대해 알아보겠습니다.

### 동적메모리 할당 이유
프로그램을 하나 만들어보자.

현재 반에 있는 학생들의 점수표 리스트를 만들고 싶다. 그러면 어떻게 해야되는가?

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  int cnt = 0;

  std::cout << "학생 수 ? >> ";
  std::cin >> cnt;

  int* jumsu = (int*)malloc(sizeof(int)*cnt);

  // 점수표 만드는 작업

  free(jumsu)
}
```

보통 위와 같은 프로그램을 작성하기 위해, 학생 수를 입력받고 각 학생의 점수를 입력받을 수 있는 배열을 만들어 사용한다.

우리는 C언어에서 동적할당을 위해 사용한 함수 `malloc` 사용해 메모리를 할당 받는다.

`malloc`을 보게 되면 동적할당 받은 후 `int*`와 같이 적절한 타입으로 해줘야하는데, 귀찮음을 느낄 수도 있다.

그냥 아래와 같이 배열로 받으면 안되나? 왜 배열이 아닌 동적할당을 활용해야되는건지에 대해 알아보자.

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  int cnt = 0;

  std::cout << "학생 수 ? >> ";
  std::cin >> cnt;

  int jumsu[cnt];

  // 점수표 만드는 작업
}
```

위 코드와 같이, 입력받은 학생 수 기반으로 배열을 만들면 되지 않는지 생각해보자.

위와 같이 입력받은 학생 수로 배열크기를 정하는 코드에는 *컴파일러 의존성*이 존재한다. 즉, C++ 표준에서는 명확하게 배열의 크기를 변수로 받았을 때 어떻게 동작한다고 정희해두지 않았다. 이를 *undefined*라고 하는데, 이 경우 컴파일러사가 구현한 방법대로 동작한다.

즉, 컴파일러사가 만약 해당 동작을 허용할 경우, 정상동작하지만 그렇지 않을 경우 컴파일 에러가 발생한다.

우리가 흔히 사용하는 g++ 컴파일러 같은 경우 "정상동작"을 하지만, Window 사의 vc++ 컴파일러 같은 경우 "컴파일 에러"가 발생하게 된다.

따라서, 의존성이 존재하는 방법보다는 안전한 방법 즉, *동작할당*을 통해 배열의 크기를 할당받는게 좋은 방법이다.

#### 동적할당의 장점
동적할당을 활용하면 2가지 장점이 있다.

1. 실행시간에 입력받은 값의 크기 만큼 메모리를 할당할 수 있음.
2. 자동으로 메모리해제가 아닌, 사용자가 *원하는 시점에 메모리 해제*가 가능함.

장점2 번 같은 경우, 동적할당의 큰 장점이다. 만약 배열로 할당할 경우 시스템에 의존해 메모리가 해제된다. 따라서, 삭제될 때 hooking을 통해 내가 원하는 동작을 추가로 할 수 없다.

### C++ 동적할당 (new / delete)
우리는 위의 내용을 통해, *동적할당을 사용해야되는 시점 및 장점*에 대해 알아봤다.

추가로, C언어의 동적할당이 아닌 C++언어의 동적할당 방법에 대해 알아보자.

C언어의 동적할당의 가장 큰 단점은 *타입에 맞춘 캐스팅 작업*이다.

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  // C style -> 캐스팅 필요
  // 메모리를 열개 할당 받고, p1 포인터에 연결함.
  int* p1 = (int*) malloc (size(int)*10);

  free(p1);
}
```

위의 코드와 같이, 메모리를 할당 받고 해당 포인터로 연결하기 위해 *캐스팅 작업*이 필요하다.

C++ 언어의 동적할당 같은 경우 *캐스팅 작업이 필요 없다*

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  // int 1개 할당 4byte
  int* g2 = new int;

  delete g2;
}
```

위의 코드와 같이 캐스팅은 필요 없고, `new` 뒤에 그냥 타입을 적어주면 된다. new를 활용한 배열할당은 어떻게 할 수 있을까?
"생각보다 간단하다!"

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  int* p3 = new int[10];

  delete[] p3;
}
```

배열할당도 간단하다. `new int[배열크기]`를 사용하면 된다. 원하는 사이즈를 `[  ]` 내 넣어주면 메모리할당을 받고, 접근이 가능해진다.

여기서 주의할 점은 `delete`연산을 할 때, 꼭 `delete[]`를 사용해 메모리를 해제해야한다.

*만약 아래의 코드와 같이  `delete[]` 가 아닌 `delete`를 사용할 경우 어떻게 될까????*

```cpp
#include <iostream>
#include <cstdlib>

int main()
{
  int* p3 = new int[10];

  // 아래와 같이 메모리 제거동작을 배열 표시를 안해주고 한다면?
  delete p3;
  // delete[] p3;
}
```

이 경우는 위에서 언급한것과 같이 *undefined* 동작으로 규정한다.

C++ 표준에서는 아래와 같이 정의한다.

*new를 활용한 [] (배열)을 할당 받을 경우 delete 연산은 [] (배열)을 통해서 하도록 한다* 고만 적혀있다.

즉, 위와 같이 사용했을 경우 "어떻게 동작을 한다" 라는 것이 적혀있지 않다. 이 경우 *컴파일러 제조사*의 재량이다. 따라서, 메모리가 해제가 될수도 있고 안될 수가 있고 혹은 일부만 해제될수도 있다.

이런 사소한 동작이 결국 큰 버그를 유발하기 때문에 꼭 스펙에서 *하라는 대로 하자!!*

#### C++ 동적할당의 특징
핵심 특징을 정리해보자.

1. new와 delet를 활용한다
2. 원하는 타입으로 할당받기 때문에, 캐스팅 동작은 필요없다.
3. 배열로 할당한 경우 delete[]를 활용해 제거하도록 한다.
4. malloc는 생성자를 호출하지 못하지만, new는 생성자를 호출함.
  - 4번의 특징은 *객체지향 파트 부분에서 자세히* 다루도록 한다.

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!