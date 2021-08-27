---
layout: post
author: doodoo
title: "[C++][자료구조][알고리즘] std::array"
subtitle: "std::array에 대해 알아보자 🤗"
date: 2021-08-26
cover: /assets/img/default.png
tags: C++ 자료구조 알고리즘
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 std::array에 대해 알아보겠습니다.

해당 포스팅은 [코딩테스트를 위한 자료구조와 알고리즘 with C++ 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791165213794)을 참고하여 작성되었습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### C 스타일 배열의 제약사항
C 언어에서도 *배열*을 사용할 수 있으며, *배열*을 활용해 데이터를 선형적으로 관리할 수 있다. 하지만, 실제 프로그램에서는 C 언어 스타일의 *배열*은 많이 사용되지 않는데, 그 이유는 몇 가지 제약사항이 있어서이다.

C언어 스타일의 *배열* 단점
- 메모리 할당과 해제를 수동으로 처리해야한다. 메모리를 해제하지 못하면 *메모리 누수*현상이 발생할 수 있고, 이 경우 해당 메모리 영역을 사용할 수 없게 된다.
- [] 연산자에서 배열 크기보다 큰 원소를 참조하는 것을 검사하지 못한다. 잘못 사용하면 `segmentation fault`를 만나게 된다.
- 배열을 중첩해서 사용할 경우 문법이 너무 복잡해진다.
- 깊은 복사가 기본적으로 동작하지 않는다. 얕은 복사로 인해 데이터 유실이 발생할 수 있다.

C++에서는 위의 단점을 극복하기 위해 새로운 *배열* 관리 클래스 `std::array`를 만들어 두었다.

### std::array

*🌱 array 기본 사용 방법*

`std::array`는 메모리를 자동으로 할당하고 해제한다. 해당 클래스를 사용하기 위해서는 `#include<array>`를 추가해줘야한다.

```cpp
template<
  class T,
  std::size_t N
> struct array;
```

위의 템플릿형태와 같이 `std::array`는 원소의 타입과 배열 크기를 매개변수로 사용하는 클래스이다.

```cpp
#include <array>
#include <iostream>

int main()
{
  // int형 10개의 원소를 가질 수 있는 배열 생성
  std::array<int, 10> arr1;

  arr1[0] = 1;

  std::cout << "arr1 배열의 첫 번째 원소: " << arr1[0] << std::endl;

  // 배열 생성 및 즉시 초기화
  std::array<int, 4> arr2 = { 1, 2, 3, 4 };
  std::cout << "arr2의 모든 원소 : ";

  for(int i = 0; i < arr2.size(); i++)
    std::cout << arr2[i] << " ";
  std::cout << std::endl;
}
```

*🌱 array []연사자 사용 및 at() 사용*

위의 예시코드와 같이, 타입과 인자를 넘겨주고 `array`를 생성하는 것을 볼 수 있다. `[]`연산자를 기존 배열과 동일하게 제공하기 위해 `[]operator` 재정의 해서 사용하고 있으며, 우리는 그냥 배열처럼 사용하면 된다.

`[]operator` 같은 경우 요소에 접근해 값을 가져오도록 하는데, 이 때 전달되는 요소가 배열보다 큰지 작은지를 검사하지 않는다. 즉, 배열보다 큰 요소에 접근하게 될 경우 `segment fault`를 만날 수 있게 된다.

`std::array`에서는 이를 막기위해 `at()`라는 함수가 제공되고, 만약 배열보다 사이즈가 큰 값이 올 경우 `std::out_of_range()`라는 예외를 발생시킨다. 따라서, `at()`는 `[]operator`보다는 느린 편이지만 적절한 예외처리가 가능해지니 상황에 맞게 사용할 수 있다.

```cpp
#include <iostream>
#include <array>

int main()
{
  std::array<int, 4> arr3 = { 1, 2, 3, 4 };

  try {
    std::cout << arr3.at(3) << std::endl;
    std::cout << arr3.at(4) << std::endl; // 예외 발생
  } catch (const std::out_of_range& ex) {
    std::cerr << ex.what() << std::endl;
  }
}
```

*🌱 array 데이터 전달*

`std::array` 객체를 다른 함수에 전달하는 방식은 *기본 데이터 타입*을 전달하는 방식과 유사하다. 값 또는 참조로 전달이 가능하고, `const`로 전달도 가능하다.

우리가 C언어 스타일 배열을 전달할 때 처럼 포인터 연산을 사용한다거나 참조 혹은 역참조 연산을 하지 않아도 된다. 따라서, 다차원 배열을 전달할 때, `std::array`를 사용하는 것이 가독성 측면에서도 더 좋다.

```cpp
#include <iostream>
#include <array>

int main() {
  void print(std::array<int, 5> arr)
  {
    for (auto ele : arr)
      std::cout << ele << ", ";
  }

  std::array<int, 5> arr = { 1, 2, 3, 4, 5 };
  print(arr);
}
```

위의 예시와 같이, `print()`함수를 통해 배열을 넘길 때 일반 타입을 넘기는 것과 동일하게 전달하면 된다. 하지만, 위의 코드 같은 경우 `print`함수에서는 `array` 사이즈가 `5`로 고정되어져있다. 따라서, 다른 사이즈를 넘기게 되면 compile error가 발생할 것이다. 만약 다양한 사이즈 즉, 범용적인 사이즈로 전달하는 코드를 만들고 싶다면 아래와 같이 `template`을 활용해야한다.

```cpp
template <size_t N>
void print(const std::array<int, N> arr);
```

*🌱 range-based for*

배열의 경우 원소를 차례로 접근하는 경우가 빈번하게 발생된다. 이를 위해 `std::array`에서는 `range-based for` 연산을 제공한다.

```cpp
  for (auto ele : arr)
    std::cout << ele << ", ";
```

원소를 차례로 접근하기 위해 `index`를 활용한 for loop를 사용할 수 있지만, 크기를 지정해야한다. 배열의 크기를 정확하게 지정하지 않을 경우 배열이 원하는 만큼 출력되지 않거나 범위를 넘어가는 경우가 생긴다. 이런 자잘한 실수를 `range-based for`를 사용하게 되면 막을 수 있다.

우리가 `range-based for`를 사용할 수 있는 이유는 *반복자*를 활용할 수 있기 때문이다. *반복자*란 일종의 포인터 같은 역할을 한다. `begin()`, `end()`를 통해 요소의 처음과 끝에 접근할 수 있다. *반복자*를 사용하면 `++` 혹은 `+`연산자를 활용해 요소를 이동할 수 있다.

즉, `range-based for`를 사용할 경우 *반복자*를 활용해 `begin()`부터 `++`를 이용해 `end()`까지 도달하도록 구해져있다.

*반복자*는 `std::array` 뿐아니라 다양한 컨테이너 (`std::vector`, `std::list` 등)에서 사용되고 있다. 왠만해서는 `range-based for`를 사용하도록 하자.

### 더 많은 함수 참고
우리는 위의 예시들을 통해 `std::array`를 사용하는 방법에 대해 알아보았다.

실제 데이터를 넣는법, 출력하는 법, 찾는 법 등을 위주로 알아보았다. 하지만, `std::array` 같은 경우 다양한 멤버함수들이 존재한다. 이를테면, `const_iterator`, `rever_iterator` 반복자를 포함해, `front()`, `back()`, `data()`등이 있다.

위와 같은 함수는 필요할 때마다 찾아서 보고 따라하면 된다고 생각한다. 만약 좀 더 자세한 내용을 알고 싶다면 [여기](https://en.cppreference.com/w/cpp/container/array)를 클릭해서 알아보자 😗
