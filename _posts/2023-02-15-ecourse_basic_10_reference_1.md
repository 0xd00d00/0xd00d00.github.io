---
layout: post
author: 널두
title: "[C++ Basic] C++ reference"
subtitle: "Call by Reference 개념을 알아보자"
date: 2023-02-15
cover: /assets/img/default.png
tags: haha
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ Reference에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *call by value* / *call by pointer* / *call by reference*에 대해 알아보겠습니다.

### C++ Reference의 등장
아래의 코드를 통해 메모리 할당이 어떻게 이뤄지는지 생각해보자.

```cpp
int main()
{
  int n = 10;
  int* p = &n;
}
```

아래의 그림과 같이 `n` 같은 경우 메모리를 하나 잡고, 값을 10으로 넣는다. `p` 같은 경우 `n`의 주소값을 넣어두고, `p`의 값으로 `n`의 메모리에 저장된 값을 읽고 쓰고 한다. 우리는 이를 pointer라고 부른다.

![call by pointer](/assets/img/cpp_prime/10_reference/callby1.png){: height="300px" width="800px"}

C++ 에서는 위와 같이 메모리를 할당하고, 접근하는 방식 중 하나가 더 추가 됐다. 바로 *Reference* 라는 개념이다.

```cpp
int& r = n;
```

`r`은 `n`의 할당된 메모리에 *또다른 이름*을 부여하는 것이다. 즉, 그림과 같이 `r`을 활용해 `n`의 값에 직접적으로 접근이 가능하도록 한다.

![call by refernce](/assets/img/cpp_prime/10_reference/callby2.png){: height="300px" width="800px"}

`r`이 `n`의 또다른 이름이라고??? 의심하는 사람을 위해 아래의 코드와 같이 직접 주소값을 `std::cout`을 통해 출력해보자.

```cpp
#include <iostream>

int main()
{
  int n = 10;

  // 또 다른 이름 부여..
  int& r = n;

  std::cout << &n << std::endl;
  std::cout << &r << std::endl;
}
```

위의 코드와 같이 `& 연산자` 를 활용해 주소값을 출력해보면, 동일한 주소값을 출력한다는 것을 알 수 있다.

또다른 이름으로 활용돼, *Reference*를 사용할 때 주의점은 *초기 값이 무조건 있어야* 한다는 점이다.

```cpp
// 초기값 없이 단독으로 적을 경우 에러 발생
int& r2;
```

#### 메모리할당 없는 Reference?
Reference 개념은 또다른 이름부여라고 했다. 그렇다면 정말 이름만 부여하고, 메모리할당은 따로 하지 않는 것인가?

보통 Reference라는 키워드가 추가될 경우, 컴파일러에서는 *심볼테이블*에 테이블 내 값을 참조하도록 했다.

메모리할당 유무에 관한 동작 또한 *undefined*로 정의되어져 있기 때문에 *컴파일러 제작사* 마다 다르게 동작한다.

보통은 2가지로 구현한다.

1. 단순한 경우 메모리 사용하지 않고, 심볼테이블에 추가하는 방식으로 처리함
2. 복잡한 경우 (함수 인자로 사용되거나 할 때), 상황에 따라 내부적으로 포인터를 활용하도록 한다. 즉, 메모리를 할당받아 처리하도록 함.

### Call by ~
Reference가 함수 인자로 전달될 경우 어떻게 처리될 것인지에 대해 알아보자.

```cpp
#include <iostream>

void inc1(int n) { ++n; }
void inc2(int* p) { ++(*p); }
void inc3(int& r) { ++r; }

int main() {
  int a = 10, b = 10, c = 10;

  inc1(a);

  inc2(&b);

  inc3 (c);

  // 아래의 값은 어떻게 변화할까?
  std::cout << a << std::endl;
  std::cout << b << std::endl;
  std::cout << c << std::endl;
}
```

위의 코드를 통해 어떤 변화가 일어나는지 아래의 그림을 참고해보자.

![call by~](/assets/img/cpp_prime/10_reference/callby3.png){: height="400px" width="800px"}

*🌱 a의 값은 변하지 않는다.*

우리는 a의 값을 inc1에 전달했다. 전달하는 방식은 *값*만 전달하는 방식을 택했다. 이를 *Call by Value*라고 부른다.

위와 같은 방법으로 값만 전달할 경우 전달된 값에는 영향을 주지 않는다. 따라서, 내부적으로 어떤 작업을 해도 전달된 값에는 변화가 없다. 따라서 `a` 값은 10으로 유지된다.

*🌱 b의 값은 증가한다.*

b의 값은 inc2에 전달했다. 전달하는 방식은 *pointer*를 활용해야되기 때문에 주소값을 전달했다. 이를 *Call by Pointer*라고 부른다.

이름에 대해서는 이야기가 많다 누구는 *Call by Address*, *Call by Reference* 등을 부르기도 하지만, Pointer를 전달받는다는 입장에서 해당 포스팅에서는 *Call by Pointer*라고 명명한다.

위와 같은 방법으로 전달할 경우 주소값을 전달 받은 Pointer 입장에서는 *메모리에 접근이 가능*하다. 직접 메모리 내 값에 접근해 해당 값을 바꿀 경우 전달된 값이 변경된다. 따라서, `b` 값은 11로 증가한다.

*🌱 c의 값은 증가한다.*

c의 값은 inc3에 전달했다. 전달하는 방식은 *Reference*로 전달받기 때문에 그냥 변수를 전달하면 된다. 이를 *Call by Reference*라고 부른다.

전달받은 변수 값에 또다른 이름을 부여하고, 같은 메모리를 사용하기 때문에 값이 변경된다.

즉, 위와 같은 Reference 방식을 사용할 경우 값이 변경된다. 따라서, `c` 값은 11로 변경된다.

### scanf 와 cin의 차이
C언어에서 어떤 값을 입력받을 때 우리는 scanf를 사용해왔다. `scanf`를 사용할 경우, `&`연산자를 활용해서 주소값을 넘겨야하는데 이유를 고민해보지 않고 그냥 쓰는구나 하고 사용하기도 한다.

윗 내용을 보고 좀 생각해보면, C언어 인자 값을 전달받아 바꿀 수 있는 방법이 *call by pointer* 방법 밖에 없었다. 따라서, 우리는 인자로 `&`연산자를 활용한 주소값을 넘겨야하고 받는 쪽에서는 pointer로 받아 입력받은 값을 넣어서 돌려주는 구조이다.

```cpp
// 대충 그려보면, scanf 동작구조는 아래와 같을 것이다.

// 물론 타입에 따라 다르게 동작할 것이다.
// 우리는 그 타입을 알려주기위해, %d, %c 등과 같은 방법을 활용한다.
void scanf(int* n) {
  // 어떤 값을 input으로 입력받고 그 값을 담아줄 것이다.
  // for문을 활용할수도 있고, 이건 구현하기 나름.
  // 중요 포인트는 "call by pointer"를 통해 인자를 전달받는다는 점~!
  n = input
}

int main()
{
  int n = ;
  // 주소 값 전달
  scanf("%d", &n);
}
```

C++에서 제공하는 입력함수 `cin` 같은 경우, 아마 내부적으로 *call by reference*를 활용해 전달받을 것이다. 따라서, 전달된 값을 주소가 아닌 그냥 변수를 전달해도 값을 넣어 돌려줄 수 있다.

내부적 구조는 *연산자 재정의*를 배워야 좀 더 이해할 수 있으니, 그건 뒷부분으로 미루도록 하자.

우선, `cin`같은 경우 *call by reference*로 값을 받기 때문에 `&`연산자를 적어주는 불필요한 문법이 필요없다는 점을 기억하자!

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
