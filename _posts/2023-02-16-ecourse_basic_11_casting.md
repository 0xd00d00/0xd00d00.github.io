---
layout: post
author: 널두
title: "[C++ Basic] C++ 캐스팅"
subtitle: "C언어의 캐스팅 문제점과 해결방법을 알아보자! ✋"
date: 2023-02-16
cover: /assets/img/default.png
tags: C++ Cpp_Basic
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! 두두코딩 <span class="doodoo">널두 🥸</span> 입니다 ✋ <br>
오늘은 C++ 캐스팅에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇 <br>
### Intro.
이번 포스팅에서는 *C언어의 casting 문제점* / *C++언어의 casting* 에 대해 알아보겠습니다.

### C언어의 casting 문제점
C 언어에서 메모리를 할당 받을 때, 우리는 자연스럽게 casting을 사용해왔다.

```cpp
#include <cstdlib>

int main()
{
  int* p = (int*)malloc(100);
}
```

`malloc`은 `void*`타입이라 메모리 타입을 적절하게 맞춰 casting을 해야된다. casting을 자주 사용하다보니 위험성을 인지하지 못하고 사용하는 경우가 발생한다. casting 같은 경우 버그를 유발할 수 있기 때문에 최대한 절제해서 사용해야한다. 특히, C언어의 casting은 *만능*으로 취급하기 때문에 더욱 더 조심해야된다.

casting 동작으로 발생할 수 있는 2가지 문제점을 보도록 하자.

*1. 대상체의 크기가 다를경우*

```cpp
int main()
{
  int n = 3;

  // 아래와 같이 다른 타입을 포인팅 하려고 할 때 에러가 발생한다.
  // 위와 같이 *컴파일이 암시적 형변환*을 거부한다.
  double* p = &n;

  // 만약 아래와 같이 명시적으로 형변환을 할 경우 어떻게 될까?
  double* p = (double*)&n;
  // 문제 없이 컴파일이 된다.
}
```

위와 같이 `double*` 캐스팅을 통해 기존에 되지 않던 내용을 *명시적*으로 casting을 통해 되도록 변경할 수 있다.

```cpp
// double형 포인터로 암시적 형변환 된 int 타입
// double을 가리키겠지 하고, 정수 타입에 실수 값을 넣음.
*p = 3.4;
```

![casting1](/assets/img/cpp_prime/11_casting/casting1.png)

이때 가장 큰 문제는, 그림과 같이 `int`타입에 `double`값을 보낼 수 있다고 보내는 케이스이다. 위와 같이 캐스팅 할 경우, dobule은 본인의 영역이 8byte라고 생각하기 때문에 데이터를 덮어쓰는 현상 즉, 데이터 손실이 발생할 수 있다.

위와 같은 코드는 컴파일 부터 되면 안된다.

*대상체의 크기가 다르*기 때문에 포인터로 casting 되는 건 너무 위험하다. 하지만 *C언어에서는 이를 허용하고 있다ㅠ*

*2. const 대상체를 비 const 대상체로 캐스팅*

```cpp
int main()
{
  const int c = 10;

  // int* p = &c; -> 에러발생
  int* p = (int*)&c;

  *p = 20;
}
```

![casting2](/assets/img/cpp_prime/11_casting/casting2.png)

위의 코드와 그림을 함께 보자. C에서 상수로 만들어둔 값을 포인터로 가리킬 수 있다는 건 변경할 수 있음을 의미한다.
컴파일러 입장에서는 가능한 일이라, 애당초 상수 값을 비상수에 담지 못하도록 해야되는데, *casting은 이런 기묘한 동작*을 수행한다. 엄청 강력하다;;

위의 2가지 문제점을 참고해보면, casting 동작은 엄청 강력한 동작으로 잘못사용하면 큰 버그를 초래할 수 있다.

C++에서는 이를 막기위해 4가지 casting 동작으로 세분화 해 적재적소에 사용해 버그를 줄이고자 노력했다.

### C++ casting
위에서 언급한 것과 같이 C언어의 casting 동작은 *unreasonable*하다고 볼 수 있다. 버그의 가능성이 있어도, casting을 해버리는 경우가 있기 떄문이다.

C++ casting 같은 경우 용도를 4가지로 나눠 사용한다.

1. static_cast : 컴파일 시간 적용 <br>
2. dynamic_cast : 실행 시간 적용 <br>
3. reinterpret_cast : 컴파일 시간 적용 <br>
4. const_cast : 컴파일 시간 적용

#### static_cast
*static_cast* 같은 경우 *위험성을 포함한 경우 casting 불가능*이라는 규칙을 철저히 수행한다.

왠만한 위험한 casting은 거부되지만, `malloc`과 같은 `void*`를 `다른타입*`로 변경해야될 경우는 연관된 타입에 한해서 허용해준다.

```cpp
#include <cstdlib>

int main()
{
  int* p1 = (int*)malloc(100);
../assets/img/cpp_prime
  // 위와 동일한 표현
  int* p2 = static_cast<int*>(malloc(100));

  // 앞서 나온 예시
  int n = 3;
  // 2가지 모두 에러 발생..
  // double* p3 = &n;
  // double* p4 = static_cast<double*>(&n);
}
```

위의 코드와 같이 특별하게 필요한 `malloc` 같은 케이스가 아니라면 위험이 내포된 케이스는 모두 거부된다.

만약 `double* p4 = static_cast<double*>(&n);` 해당 문법을 꼭 사용해야된다면 어떻게 해야될까?

`double*`로 `int`를 가리킬 수 있도록 변경하려면, C++에서 제공하는 casting 문법을 쓰자.

#### reinterpret_cast
해당 casting은 불가피하게 타입을 변경해서 사용해야되는 경우 쓰는 casting이다.

위의 예시에서 나온것과 같이 `int`타입이지만 `double*`로 가리켜야할 경우 사용할 수 있다.

```cpp
int main()
{
  int n = 3;
  // 2가지 모두 에러 발생..
  // double* p3 = &n;
  // double* p4 = static_cast<double*>(&n);

  // 에러 없이 활용가능
  double*p5 = reinterpret_cast<double*>(&n);
}
```

위와 같이 `reinterpret_cast` 사용할 경우 타입변환을 에러없이 할 수 있다.

만약 역참조를 통해 값을 바꿀 수 있는데.. 그럴경우 값을 덮어쓰거나 에러발생하는 것 아닌가? 하는 생각이 들 수 있다.

물론 *버그가 유발*될 수 있다. 하지만, 해당 casting을 사용한다는 것은 *그 위험을 감수하겠다* 라는 개발자의 의지가 담겨있다고 보고 허용을 해준다.

보통 해당 캐스팅은 *일반적 개발*을 할때보다 *Library 개발*을 할 때 많이 사용한다.

### const_cast
우리가 C언어 2번째 문제로 제시한 const 문제같은 경우도 `static_cast`를 활용하면 컴파일러에서 에러를 나타낸다.

```cpp
int main()
{
  // 앞서 나온 2번 예시
  const int c = 10;

  // int* p = &c; -> 에러발생
  int* p = (int*)&c;
  *p = 20;

  // 만약 C++ 일반적인 static_cast 사용할 경우 에러발생.!!!
  int* p1 = static_cast<int*>(&c);

  // 이를 가능하게 하기위해서는?
  int* p2 = const_cast<int*>(&c);
}
```

위의 예시에 나온것과 같이 일반적으로 *비상수 포인터로 상수 값을 가리킬 수 없다*

다만, C언어에서는 casting을 통해 가능하지만, 이를 C++ 기본 casting `static_cast`를 사용하면 가리킬 수 없도록 *컴파일 에러*를 발생시킨다.

위에서 나온 `reinterpret_cast`와 같이, 만약 불가피하게 `const`를 제거해 사용해야된다면 어떻게 해야될까???

그럴 경우 *const_cast*라는 캐스팅을 활용하면 된다.

*const_cast* 같은 경우도 개발자가 *위험을 인지하고* 사용하는 것이기 때문에 발생하는 버그에 대해서는 본인이 감수하겠다라는 의지를 담고있다.

컴파일러 같은 경우 해당 casting을 사용하면 잘못사용인지 알 수 없기 때문에 *개발자가 버그를* 꼭 핸들링해야한다!

#### dynamic_cast
해당 casting 같은 경우 *실행시간*에 일어나는 casting이구나 정도만 이해하고 넘어가자.

뒷 부분에서 *상속*을 포스팅할 때 해당 캐스팅을 이야기하도록 한다.

위와 같이 C++에서는 *casting*의 위험성을 알고 최대한 절제해서 사용할 수 있도록 구축해뒀다.

### C++ 캐스팅 활용
C++ casting을 사용하면 C언어에서 발생할 수 있는 버그를 *미연에 방지*할 수 있다.

```cpp
int main() {
  const int c = 10;

  // 암시적으로는 불가능하지만, 명시적으로 가능하다.
  double* p = (double*)(&c);

  // C++에서는 어떻게 해야될까?
  // double* p = static_cast<double*> (&c); // 타입 달라서 실패
  // double* p = reinterpret_cast<double*> (&c); // 상수성 제거 불가능해 에러 발생.
  // double* p = const_cast<double*> (&c); // 상수성 제거는 가능한데, 타입이 달라
}
```

위의 코드와 같이, 우리가 배웠던 casting으로 `double* p = (double*)(&c);` 문법을 대체할 수 있을까?

순서만 잘 지켜서 하면 가능하다.

1. 상수성 먼저 제거
2. 타입 변경

```cpp
double* p = reinterpret_cast<double*>(
    const_cast<int*>(&c));
```

순서가 바뀌게 되면 안된다. const_cast는 같은타입의 const만 제거할 수 있기 때문이다.

위와 같이, C로는 간편했지만, C++ 매우 복잡하다. 이는 *일반적 경우*는 캐스팅을 절제해서 사용하라는 의미가아닐까 생각이든다.

위와같은 복잡한 casting이 필요해? 라는 생각이 들 수 있는데, Library 개발에서는 해당 케이스가 종종 등장한다. *idiom 내용*을 보면 그런 케이스가 있다.

우선 casting의 문법정도만 알아두도록하자!

### Outtro.
해당 포스팅은 Ecourse의 C++ Basic 강의를 참고해 작성되었습니다.

강의를 참고하실 분은 [여기](https://www.ecourse.co.kr/course/cppbasic_v2/)를 클릭해 확인해주세요!
