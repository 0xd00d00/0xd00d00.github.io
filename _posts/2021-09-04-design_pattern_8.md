---
layout: post
author: doodoo
title: "[Design Pattern][C++] Editbox 만들기 (3)"
subtitle: "변하지 않는 것과 변하는 것을 분리해야하는 개념을 배우자 🙊"
date: 2021-09-04
cover: /assets/img/editbox_design_pattern_temp_strate.png
tags: C++ Design_Pattern
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Strategy 패턴에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Validator 만들기
우리는 앞서, 아래와 같은 *Interface*인 `Ivalidator` 구축해두었다.

```cpp
struct IValidator
{
  virtual bool validate(string s, char c) = 0;
  virtual bool iscomplete(string s) { return true; }

  virtual ~IValidator() {}
};
```

우리는 위의 Interface 기반으로 파생클래스들을 구축해 사용해야한다. 변하는 클래스
같은 경우 약한 결합을 위해  *인터페이스 기반 통신*을 해야하기 때문에 interface로 구축한다는 사실을
다시한번 기억하도록 하자. 만약 해당 내용이 이해되지 않는다면 [여기](http://localhost:4000/2021/07/26/design_pattern_3.html) 를 통해 알아보자.

```cpp
class LimitDigitValidator : public IValidator
{
    int value;
public:
    LimitDigitValidator(int n) : value(n) {}

    virtual bool validate( string s, char c )
    {
        return s.size() < value && isdigit(c);
    }

    virtual bool iscomplete( string s)
    {
        return s.size() == value;
    }
};
```

위의 코드와 같이, `IValidator`를 상속받아 `LimitDigitValidator` 라는 구현체를
담당하는 클래스를 만들자. 해당 클래스에서 하는 역할은 `validate()`를 통해 유효성
검사하는 일을 한다. 그리고, `iscomplete()`를 통해 Validator 내 존재하는 글자가
내가 원하는 만큼 완성되었는지를 확인하는 동작을 갖고 있다. (이해가 되지 않는다면 주민번호를 입력 받아야하는 [이전포스팅](http://localhost:4000/2021/09/02/design_pattern_7.html)을 생각해보자.)

위의 코드를 구축한 후 우리는 아래의 코드와 같이, `setValidator` 함수로 내가
구현한 validator를 전달하게 되면, 원하는 동작을 하는 Editbox를 만들 수 있다.

```cpp
int main()
{
    Edit edit;
		// 내가 만든 Validator
		// 13 자리 까지만 입력받을 수 있다.
		// 또한 13자리가 아닐 경우 확인 버튼을 누를 수 없다.
    LimitDigitValidator v(13);

		// setter를 활용해 내가 만든 validator를 넘겨준다.
    edit.setValidator(&v);

    while(1)
    {
        string s = edit.getData();
        cout << s << endl;
    }
}
```

이렇게 Interface로 분리하고, 세부 함수를 Interface를 상속받아 구현해 setter
넘기는 방식을 *Strategy Pattern*이라고 한다. 이렇게 정의할 경우 내가 필요한
Validator가 문자를 제한 하는 것이든, 숫자를 제한하는 것이든 혹은 특수문자를 제한
하는 것이든 관계없이, Edit 이라는 클래스에 `setValidator()`를 통해 넘겨주면
된다.

위와 같이 넘겨주는 행위는 "실행 중에 validator"가 교체가 가능하다는 의미로,
	굉장히 유연하게 접근이 가능하다는 의미이다.

우리는 이전 포스팅에서 지금까지 2가지 패턴을 학습했다. 구체적으로, 변하지 않는
(전체)에서 변하는 부분(일부분)을 분리해야 한다는 개념에서 추상함수로 분리하는
방법인 *Template Method Pattern"* 방법과 인터페이스로 분리하는 *Strategy
Pattern* 2가지를 배웠다.

두 가지 패턴 중 어느 것이 더 좋아보이는가?

보통 후자를 많이 택하는데, 그렇다면 왜 후자가 더 좋다고 생각하는가 생각해보자.

### Template Method pattern 과 Strategy pattern의 차이
아래의 그림은 *Template Method Pattern* 과 *Strategy Pattern* 두 개의 class
	diagram을 나타낸 것이다.

![디자인패턴비교](/assets/img/editbox_design_pattern_temp_strate.png)

*🌱 Template Method Pattern 특징*

Template Method 패턴의 특징은 변하는 부분을 가상함수로 추출한다. 이후 필요한
validation이 있을 경우, 가상함수를 포함하고있는 클래스를 할당받아 validation
기능을 재정의해 사용하면된다.

해당 패턴 같은 경우 상속을 기반으로 하기 때문에 "실행 중에 변경이 불가능" 하다.
즉, 선언 후 선언된 클래스를 활용해 접근해야한다.

여기서 중요한 점은 *상속받는 패턴은 유연하지 못하다* 라는 점이다.

*🌱 Strategy Pattern 특징*

Strategy 패턴은 변하는 부분을 *클래스*로 추출한다. *클래스*를 `Edit` 클래스에서
직접 가지고 있을 경우 강한결합이 되기 때문에 *약한결합*을 위해 *Interface*를
정의해 구현한다.

*Interface*로 구현할 경우 내가 필요할 때마다 상속받아 구현하면 된다. 상속받아
구현한 객체는 `setter`를 통해 전달해 validation을 확인하도록 하면 된다.

해당 패턴은 *Interface* 기반으로 하기 때문에 "실행 중에 변경이 가능"하다.
유연하며, 다양한 클래스를 전달받을 수 있다. 그리고, *Interface* 기반으로 만들어
둔 파생 클래스들은 `Edit` 클래스 외에 다른 클래스에서도 사용이 가능해진다.
(코드의 재사용 측면에서도 좋다)

그렇다면 *Strategy Pattern*이 더 좋은 것 아닌가? 생각할 수 있다.

하지만, 그렇지 않다. Template Method Pattern 같은 경우, 유연하게 운영될 필요
없는 함수일 경우 많이 사용한다. 예를들면 `Camera` 클래스 같은 경우 `take()` 함수
즉, 카메라를 가지고 찍는 행위는 굳이 Interface로 빼는 것이 아니라, 가상함수로
구현하는 것이 더 효율적이다. (해당 패턴은 뒷 부분에서 좀 더 다루겠다.)

### Appendix
*Strategy pattern*으로 구축된 Editbox의 전체 코드이다. 해당 코드 같은 경우
이전에 너무 길어 부분적으로 설명을 했다.

전체적인 소스코드를 보면 이해가 훨씬 쉬울 것이다.

만약 모르겠다면 과감히 댓글을 남기자!

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

struct IValidator
{
  virtual bool validate(string s, char c) = 0;
  virtual bool iscomplete(string s) { return true; }

  virtual ~IValidator() {}
};

class LimitDigitValidator : public IValidator
{
    int value;
public:
    LimitDigitValidator(int n) : value(n) {}

    virtual bool validate( string s, char c )
    {
        return s.size() < value && isdigit(c);
    }

    virtual bool iscomplete( string s)
    {
        return s.size() == value;
    }
};

class Edit
{
  string data;

  // IValidator를 가리키는 포인터
  IValidator* pVal = 0;
public:
  // Setter를 활용해 유효성 검사가 필요하다면 IValidator를 갱신함.
  void setValidator(IValidator* p) { pVal = p; }

  string getData()
  {
    // 기존 데이터가 있다면, 지우고.
    data.clear();

    while(1) {
      //한 글자씩 읽음
      char c = getch();

      // Enter를 입력하면 종료
      if (c == 10 &&
          (pVal == 0 || pVal->iscomplete(data))) break;

      if (pVal == 0 || pVal->validate(data, c)) {
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
		// 내가 만든 Validator
		// 13 자리 까지만 입력받을 수 있다.
		// 또한 13자리가 아닐 경우 확인 버튼을 누를 수 없다.
    LimitDigitValidator v(13);

		// setter를 활용해 내가 만든 validator를 넘겨준다.
    edit.setValidator(&v);

    while(1)
    {
        string s = edit.getData();
        cout << s << endl;
    }
}
```
