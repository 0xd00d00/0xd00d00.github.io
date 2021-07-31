---
layout: post
author: doodoo
title: "[C++][Modern C++] C++ default 연산"
subtitle: "C++11 에서 추가된 default 연산에 대해 알아보자😎"
date: 2021-07-30
cover: /assets/img/default.png
tags: C++ Modern_C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 C++11 에서 추가된 default 연산에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### C++ default 키워드
C++11 에서 새롭게 등장한 `default` 키워드에 대해 알아보자. C++11 이전에는 기본적으로 컴파일러가 생성자, 소멸자, 복사생성자, 복사 대입 연산자를 생성해주었다. (사용자가 만들지 않는다는 전제하에.. 🙄) C++11 부터는 해당 기본 멤버함수들을 `default` 키워드를 이용해 명시적으로 호출이 가능해졌다.

일례로 기본 생성자를 `default`화 하는 예시를 함께 알아보자.

```cpp
#include <iostream>

using namespace std;

struct Point
{
  int x, y;

  Point (int a, int b) : x(a), y(b) {}
};

int main()
{
  Point p1;
}
```

우리가 위와 같이 코드를 작성했을 때, 정상적으로 컴파일이 될 것 인가? 돌려보면 알겠지만, 컴파일 에러가 날 것이다. 왜냐하면, `main()`에서 `Point 객체`를 하나 생성하는데, 인자가 없는 객체를 생성한다. 하지만, `Point`클래스를 보면, 인자 두 개를 전달받는 생성자가 만들어져있다. 따라서, `기본 생성자`가 컴파일러에 의해 만들어지지 않는다. 만약 이 부분이 이해가 되지 않는다면, [여기](https://0xd00d00.github.io/2021/07/29/effective_10.html)를 클릭해서 확인해보자.

해당 코드에서 컴파일 에러를 피하기 위해서는 `Point` 클래스에 아래와 같이 `기본 생성자`를 사용자가 직접 만들어 줘야한다.

```cpp
struct Point
{
  int x, y;

  Point() {}

  Point (int a, int b) : x(a), y(b) {}
};
```

우리는 보통 인자가 없는 "빈 생성자"를 만들기 위해 위와 같이 많이 사용했다. 하지만, 해당 생성자가 정말 빈 생성자 일까? 고민해보자. 컴파일러 입장에서는 해당 기본 생성자가 "빈 생성자"라고 생각하지 않는다. 현재는 정의와 선언부를 같이 가지고 있지만, 만약 선언부만 적어두고 정의부는 이후 다른 파일에서 적어 둘 경우 컴파일러는 알지 못한다.

따라서, 해당 경우는 "빈 생성자"로 취급하지 않는다.

그렇다면 이런 경우에서 어떻게 해야 `빈 기본 생성자`를 만들 수 있을까? 이때 사용하는 것이 <span class="tip">default 키워드</span>이다. `default` 키워드를 사용해 생성자를 만들 경우, 기본 컴파일러가 만들어 주는 생성자와 동일하게 아무것도 없는 빈 생성자를 만들 수 있다.

```cpp
struct Point
{
  int x, y;

  Point() = default;

  Point (int a, int b) : x(a), y(b) {}
};
```

그럼 혹자는 왜 `Point() {}` 해도 대충 빈 생성자라고 생각하고 사용하는데 굳이 `default`를 가져와서 써야하지? 라고 생각할 수 있다.

`default` 키워드를 굳이 써야하는 이유가 뭘까?

### default 키워드 사용이유
`default`의 사용이유는 너무 명확하다. 기본적으로 "빈" 즉, 아무것도 없는 정말 기본 멤버 함수들을 선언하고, 사용해야할 때, 필요하다. 그렇다면 이런 경우가 언제일까? 🤔

바로 <span class="tip">trival</span>을 검사할 때 이다. `trivial`함을 유지하기 위해서는 사용자가 기본 멤버함수를 만들면 안된다는 의미이다. `trivial`도 C++11에서 나온 개념으로, 프로그램의 성능을 향상 시켜주기 위해 사용한다.

일례로 복사 생성자를 만든다고 했을 때, 객체를 복사한다고 해보자. 만약 Deep copy를 굳이 해야될 상황이 아니라면 복사 생성자를 만들 필요가 없다. 반면에 Deep copy를 해야한다면 복사생성자를 만들어 처리를 해줘야한다. 이럴 경우 복사 생성자의 유무를 판단해 만약 Deep copy가 아니라면 `memcpy`로 성능을 향상 시키는 처리를 할 수도 있다. 좀 더 자세한 내용은 trival 관련 자료를 찾아보도록 하자!

❗ 중요한 점은 `default`를 활용해 기본 멤버함수를 구성하자는 거다.

### Appendix
기본 생성자를 만들 때와 사용자 정의 빈 생성자를 만들 때, `trivial`함을 비교해보자.

```cpp
#include <iostream>
#include <type_traits>

using namespace std;

struct Point
{
  int x, y;

//  Point() {}       // 0을 출력함
  Point() = default; // 1을 출력함

  Point (int a, int b) : x(a), y(b) {}
};

int main()
{
  Point p1;
  cout << is_trivially_constructible<Point>::value << endl;
}
```
위의 코드를 직접 돌려서 확인해보기 바란다. `type_traits`중 생성자가 `trivial` 한지 유무를 판단할 수 있는 traits를 사용해 확인하는 코드이다. 사용자가 만든 빈 생성자 클래스 같은 경우 "0" 을 출력하고, `default` 키워드로 만든 생성자는 "1" 을 출력하는 것을 확인할 수 있을 것이다.
