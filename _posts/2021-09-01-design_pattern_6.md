---
layout: post
author: doodoo
title: "[Design Pattern][C++] Editbox 만들기 (1)"
subtitle: "변하는 것과 변하지 않는 것을 분리해야하는 개념을 배우자 🙊"
date: 2021-09-01
cover: /assets/img/design_editbox.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Editbox를 만들면서 추출할 수 있는 디자인 패턴에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### EditBox Widget
우리는 보통 GUI (Graphic User Interface)로 구현된 프로그램을 많이 사용한다. GUI 환경에서는 사용자 입력을 받기 위해, 아래와 같이 Editbox 라는것을 많이 사용한다. 이번 Design pattern 시간에서는 Editbox를 만들어보고, Editbox를 만드는 과정에서 어떤 Design pattern을 유추할 수 있는지 알아보자.

![editbox](/assets/img/design_editbox.png)

실제 GUI코드를 이용해서 Editbox를 만드는 것이 아니라, GUI라 가정하고 Console 환경에서 Editbox를 만들어보자.

```cpp
#include <iostream>
#include <string>

using namespace std;

class Edit
{
  string data;
public:
  string getData()
  {
    cin >> data;
  }
  return data;
};

int main()
{
  Edit edit;

  while(1)
  {
    string s = edit.getData();
    cout << s;
  }
}
```

위의 코드를 보자.

간단하게 `Edit`라는 클래스를 만들었으며, 사용법은 다음과 같다.

우리는 `Edit`이라는 객체를 생성하면 위의 그림과 같이 GUI 프로그램으로 구축된다고 상상의 나래를 펼쳐보자 (착한 사람 눈에만 GUI가 보인다 😇)

그리고, `Editbox`를 통해 데이터를 입력받고, 입력 받은 데이터를 console에 뿌려준다. 아주 간단한 프로그램이다. 여기서 `Edit`라는 클래스를 좀 더 향상시켜보자.

우리는 위의 Editbox 그림과 같이 "이름", "나이", "주소"를 입력받아야한다. "이름"이야 그냥 cin으로 `string` 타입을 입력받으면 되는데.. "나이"는 모든 문자가 아닌 *숫자*만 입력받도록 해야한다.

우리는 여기서 설계에 대해 고민할 수 있다. 그냥 문자를 모두 입력받고, *숫자*가 아니면 *숫자가 아닙니다.* 라고 출력을 해줄 것인가? 아니면 애당초 *숫자*만 입력받도록 만들 것인가?

조금 더 나은 설계는 입력받을 때부터 *숫자*만 입력받도록 하는 것이다. 이런 행위를 우리는 *validation* 이라고 정의한다. 즉, 입력 받을 때 유효성 검사를 통해 *숫자*만 입력받도록 하는 것이다.

### 향상된 Editbox with validation
위에서 언급한것과 같이, *validation*을 추가해 숫자만 입력받도록 해보자.

<span class="tip">Tip</span> *validation*을 검사하기 위해서는 문자를 하나씩 입력받아야한다. 본인의 환경이 window 플랫폼이라면 `#include <conio.h>`를 추가하여 `getch()`를 사용하면된다.

<span class="tip">Tip</span> 만약 본인의 환경이 linux 플랫폼이라면, `#include<conio.h>`를 추가할 수 없는데 이럴 경우 직접 만들어 사용하거나, `#include<curses.h>`를 추가하여 `getch()`를 사용한다. 자세한 내용은 [여기](https://linux.die.net/man/3/getch)를 클릭해보자.

본인은 `getch()`를 만들어 사용하도록 한다. 만드는 방법은 구글 검색해서 찾아서 추가하도록 하자.

```cpp
#include <iostream>
#include <string>
#include <termio.h> // getch()를 위해 추가

using namespace std;

// keyboard로 한글자씩 입력받는 함수
char getch(){
    char ch;
    struct termios buf, save;
    tcgetattr(0,&save);
    buf = save;
    buf.c_lflag &= ~(ICANON|ECHO);
    buf.c_cc[VMIN] = 1;
    buf.c_cc[VTIME] = 0;
    tcsetattr(0, TCSAFLUSH, &buf);
    ch = getchar();
    tcsetattr(0, TCSAFLUSH, &save);
    return ch;
}

class Edit
{
  string data;
public:
  string getData()
  {
    // 기존 데이터가 있다면, 지우고.
    data.clear();

    while(1) {
      //한 글자씩 읽음
      char c = getch();

      // Enter를 입력하면 종료
      if (c == 10) break;

      if (isdigit(c)) {
        data.emplace_back(c);
        cout << c;
      }
    }
    cout << endl;
  }
  return data;
};

int main()
{
  Edit edit;

  while(1)
  {
    string s = edit.getData();
    cout << s;
  }
}
```

위의 예시코드와 같이, `getData()` 함수를 변경해 숫자만 입력받도록 해보자. 무한루프를 돌면서 `getch()`로 한글자씩 입력받는다. 만약 사용자가 `Enter key`를 입력하면 종료하고, `isdigit`를 활용해 현재 값이 숫자인지 확인한다. 숫자라면, `data`값에 추가하고 아니라면 다음 문자를 입력받는다.

위와 같이, 구축하면 우리는 Editbox의 두 번째 입력 값인 *나이*를 오직 숫자로만 입력받을 수 있다.

우리는 Editbox 다음 값인 주소를 입력받아야한다. 주소는 *문자와 숫자의 합의 결과*이다. 이럴 경우 숫자만 받으면 되지 않기 때문에 `validation`검사 부분을 수정해야한다.

생각해보면, 우리는 `validation`을 숫자 유효성 검사하기 위해 넣었다. Input 값의 형태 즉, 숫자가 아닌 문자를 받아야하는 경우가 들어오게 된다면 또 다시 `validation`을 다시 바꿔야하는 것인가? 그럴 수 없다.어짜피 *나이*를 또 입력 받아야하는 경우가 오기 때문이다.

우리는 어떻게 이 문제를 해결해야할까?

Editbox를 좀 더 향상시켜보자.

### Validation의 문제를 향상시킨 Editbox
Editbox를 좀 더 향상시키기 전에 생각해보자.

실제로, 우리는 GUI 환경을 구성하기 전 Editbox를 사용하기 위한 Library를 include해 사용한다. 만약 Editbox 내에서 Validation을 구축하게 될 경우 우리가 사용하는 Library를 변경해야된다. 일반적으로 프로그래밍을 하다보면 많이 느낄 수 있지만, Library는 가져다 쓰는 존재이기 때문이 우리가 수정할 수 없다.

이런 문제를 해결하기 위해서는 Editbox에서 `validation` 검사하는 부분을 사용자가 수정할 수 있게 해주어야한다. 즉, Editbox를 *만드는 사람이 사용자가 수정할 수 있도록 열어줘야 한다는 이야기*이다.

사용자가 수정할 수 있도록 하는 Editbox로 향상시키기 위해선 2가지 방법이 존재한다.

*1. 가상함수를 활용하는 방법* <br>
*2. Composition을 활용하는 방법*

이제부터 위의 두 가지 방법을 활용해 Editbox를 향상시켜보자.

포스팅이 길어졌으니 한숨돌리고, [여기]()를 클릭해 향상시키는 방법을 알아보자.
