---
layout: post
author: doodoo
title: "[Design Pattern][C++] Editbox 만들기 (2)"
subtitle: "변하지 않는 것과 변하는 것을 분리해야하는 개념을 배우자 🙊"
date: 2021-09-02
cover: /assets/img/design_edit_2.png
tags: haha
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Editbox 만들기 2번째 이야기에 대해 다루겠습니다. 처음 접하신 분들은 [이전포스팅](https://0xd00d00.github.io/2021/09/01/design_pattern_6.html)을 먼저 읽기 바랍니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Validation을 변경할 수 있는 Editbox
우리는 [이전 포스팅](https://0xd00d00.github.io/2021/09/01/design_pattern_6.html)을 통해 Editbox의 뼈대를 만드는 방법에 대해 알아보았다. 아래의 코드를 보자.

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
```

해당 코드는 이전의 작성한 부분을 복사해 온 것이다. 여기서 중요한 부분은 `getData()`인데 이 부분을 바꿔보도록 하자.

`getData()`를 보면, 기존의 데이터를 지우고 무한루프를 돌면서 사용자의 입력을 하나 받는다. 혹시 사용자가 Enter를 입력하면 종료하고, 그렇지 않을 경우 `isdigit()`를 활용해 숫자인지 검사한다. 숫자일 경우 `data`의 끝에 추가하는 루틴으로 알고리즘이 동작한다.

하지만, 해당 알고리즘에서는 전체적인 흐름은 괜찮은데 `isdigit()` 즉, 유효성 검사하는 부분만 변경하고 싶은 경우가 존재한다. (만약 이해가 되지 않는다면 [이전 포스팅](https://0xd00d00.github.io/2021/09/01/design_pattern_6.html)을 꼭 읽고 다시보자.)

여기서 아주 중요한 *디자인 정책*이 등장하는데 꼭 기억하자.

*❗ 변하지 않는 (전체적인 흐름) 부분에 변해야하는 (부분적인 흐름)이 있다면 분리하자*

즉, 위의 예시 코드와 같이 `getData()`의 전체적인 부분은 놔두고, 변해야하는 validation 부분 `isdigit()`부분은 따로 분리해 다루도록 하자는 방법이다. C++에서 분리하는 방법은 2가지가 존재한다.

*1. 가상함수를 통한 분리* <br>
*2. Compostion을 통한 분리*

### 가상함수를 통한 분리
변해야하는 부분을 별도의 가상함수로 만들자.

```cpp
... // 코드가 길어서 중복되는 코드는 생략하도록 한다.

class Edit
{
  string data;
public:
  // 가상함수로 변화되는 부분을 추출하자.
  virtual bool validate(char c)
  {
    return isdigit(c);
  }

  //---------------------------
  string getData()
  {
    // 기존 데이터가 있다면, 지우고.
    data.clear();

    while(1) {
      //한 글자씩 읽음
      char c = getch();

      // Enter를 입력하면 종료
      if (c == 10) break;

      // isdigit()를 분리하자
      if (validate(c)) {
        data.emplace_back(c);
        cout << c;
      }
    }
    cout << endl;
  }
  return data;
};

...
```

위의 코드를 보면 `isdigit()` 사용하는 부분을 `virtual`을 활용한 `validate()`로 분리했다. 그리고 유효성 검사하는 부분을 `validate()`는 함수를 호출해 숫자인지 검사하도록 했다.

뭐야? 그냥 함수로 추출한것 뿐인데.. 별 다른 게 없잖아? 라고 생각할 수 있다.

하지만, 이 코드의 진가는 validation을 변경하고 싶을 때 들어난다. 우리가 만약 주소를 위한 validation을 적용하고 싶다고 가정해보자. 그럴 경우 아래와 같이 `AddressEdit`이라는 클래스를 하나 생성하고 기존의 `Edit`을 상속받으면 된다.

```cpp
... // 위의 코드와 동일함.

class AddressEdit : public Edit
{
public:
  virtual bool validate(char c)
  {
    return ture;
  }
};

int main()
{
  AddressEdit edit;

  while(1)
  {
    string s = edit.getData();
    cout << s << endl;
  }
}
```

위의 코드와 같이, `AddressEdit`이라는 클래스를 만들고, `Edit` 클래스를 상속받으면 된다. 주소를 받기 위해선 문자든 숫자든 모두 다 받아야하기 때문에 `return true`로 설정하자. 이렇게 코드를 짜고 수행해보면 AddressEdit 클래스를 통해 모든 주소를 입력 받는 것을 확인할 수 있다.

### Composition을 통한 분리방법
우리는 앞서 *변하지 않는 코드 안에 변해야하는 부분은 분리하는 것이 좋다* 라는 방법 중 첫 번째 방법에 대해 배웠다. 이제 두 번째 방법에 대해 알아보자.

가상함수를 사용하지 않고 분리하는 방법은 *변하는 것을 다른 클래스로 추출하는 것*이다.

이 때, 주의할 점이 *변하는 부분* 은 어짜피 클래스 내 *변화*를 가져온다. OCP 정책을 위반하지 않기 위해 우리는 `Interface`로 구축해 *약한 결합*을 만들어야한다. 즉, 인터페이스 기반 통신을 해야한다. 이 부분이 이해가 가지 않는 분은 [여기](https://0xd00d00.github.io/2021/08/06/design_pattern_5.html)를 참고해 약한결합에 대해 알아보자.

우리는 `Validation`을 위한 `IValidtor`라는 인터페이스를 설계해보자. 보통 인페이스를 설계하기 전에 어떤 기능을 구축할 것인가를 고민하는데, 아래의 그림과 같은 Editbox를 만들어보자.

![editbox2](/assets/img/design_edit_2.png)

위의 Editbox는 주민번호를 입력받는 Editbox이다. 주민번호를 입력받으면서 해당 값이 숫자인지 확인하는 코드가 필요하다. 주민번호 같은 경우 추가적인 설계가 더 필요한데, 주민번호의 13자리를 다 입력해야 입력 버튼을 누를 수 있는 기능이 필요하다. 이런 기능들을 가지고 있는 인터페이스를 설계해보자.

```cpp
struct IValidator
{
  virtual bool validate(string s, char c) = 0;
  virtual bool iscomplete(string s) { return true; }

  virtual ~IValidator() {}
};
```

<span class="tip">Tip</span> C++에서는 `virtual ~IValidator()` 같은 경우 메모리 보호를 위해 사용한다. 이부분 이해가 가지 않는다면 [여기](https://0xd00d00.github.io/2021/08/05/effective_12.html)를 클릭해 알아보자.

위의 코드를 보자. `validate`라는 함수를 활용해 주민번호를 한글자씩 입력받으면서 확인하도록 한다. 이렇게 기존 문자에 한글자씩 입력받으면서 유효성 검사를 해야되는 이유는 생일의 유효성 검사를 위해서이다. 예를들어 주민번호 801107- 의 앞 6자리가 있다고 가정해보자. 여기서 801을 입력받고, 그다음으로 들어온 1이 주민번호에 들어가 조화를 이룰 수 있는지 판단해야한다.

만약 1일 경우 11월로 판단하면되고, 3일 경우 13월이 없기 때문에 유효성 검사에서 에러를 발생시켜야한다. 추가로, 해당 함수 같은 경우 *순수 가상 함수*로 파생클래스에서 무조건 정의하도록 한다. *정책*의 결정을 사용자에게 정할 수 있도록 하는 코드이다.

`iscomplete()`는 주민번호 같은 경우 13자리가 다 입력되야한다. 따라서, 입력 유무를 확인할 수 있는 함수이다. 다만, 해당 함수는 "나이", "이름"과 같이 제약 없는 경우가 많기 때문에 모든 파생클래스에서 구현하도록 하는 것이 아니라, 원하는 사람만 *재구현* 가능하도록 한다.

그렇다면 `Ivalidate`를 적용했을 때 `getData()`는 어떻게 바꿀 것인가?

```cpp

... // 코드가 길어서 중복되는 코드는 생략하도록 한다.

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

```

위의 코드를 보자. 위의 코드는 `validate`를 담당하는 부분을 외부에서 전달받아 내부에서 사용하는 코드이다. 유효성 검사하는 부분을 보면, 만약 유효성을 검사할 대상 즉, `pVal`이 아무것도 가리키지 않는다면 모든 것을 입력받고 만약 유효성 검사하는 부분이 있다면 검사하도록 한다.

<span class="tip">Tip</span> C++에서 if문을 사용할 때, `||` 연산을 넣으면 `||` 연산 앞에 있는 케이스가 성공할 경우 뒤의 케이스는 보지않고 `true`로 판단해 if 내부를 수행하도록 한다.

Enter key를 입력하는 부분도 변경되었는데, 마찬가지로, Enterkey를 쳤을 때, 완료에 대한 유효성을 검사하는 부분 `iscomplete()`가 존재한다면 해당 부분의 유효성 검사를 통해 `break` 유무를 결정하도록 한다.

그렇다면 이제 마지막으로 남은 `validation`을 담당하는 클래스를 어떻게 구현하는지 알아보자.

해당부분은 [다음 포스팅]()을 통해 알아보자. (벌써 읽는 시간이 5분이 넘었다😱)
