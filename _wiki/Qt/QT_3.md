---
layout  : wiki-post
author  : 널두
title   : "Qt 공부(3)"
subtitle : 
date    : 2023-06-23 13:14:40 +0900
updated : 2023-06-24 20:40:03 +0900
---
* ToC
{:toc}

## signal & slot
Qt의 핵심기술 중 하나 => signal & slot

우리가 앞서 만든 button에 어떤 일을 할 수 있게 하는것.

버튼 객체가 click할 때, window 멤버함수를 호출하는 행위
* clicked라는 signal을 호출한다고 함.
* Window 객체의 button slot을 연결한다.
* 즉, 발생되는 이벤트 => signal
* 받는 함수 -> slot

따라하기식 코드 만들기
* 일단 사용법을 익히고, 어떤 원리인지.

Signal & Slot 코드 만들기
1. Q_OBJECT 메크로 추가 (마우스 오른쪽 가져가면 어떤건지 볼 수 있음.)
2. signal과 연결할 slot 함수 작성.
  1. 접근지정자와 함께 `slots`이라는 키워드를 적어줘야함.
  2. 분명, C++에는 없다.
  3. QT에서 사용하기 위해 만든 메크로
3. signal과 슬롯을 연결

```cpp
QObject::connect(/* 해당 객체 */, /* Signal */, /* slot을 가진 객체 */, /* SLOT 정보 */);
```

4. QT의 핵심기능을 사용하기 위해서는 Header file을 별도로 만들어야함.
* 클래스 선언은 항상 Header에 선언!!! signal 사용하기 위해서!

혹시 소스코드에 이상이 없는데 compile error 나면 => build clean 해봐라.

*QPushButton의 signal*

* 시그널 `toggled`
  * 토글 버튼 만들 경우
* 시그널 `pressed`
  * 버튼 누를 때 발생
* 시그널 `released`
  * 버튼을 벗어날 경우
* 시그널 `clicked`
  * 버튼을 눌렀다가 땔 경우

위와 같이 4개의 signal이 존재함. 근데 이렇게 class마다 어떤 버튼 signal이 있는지 어떻게 아니? => *공식문서를 참조* 해봐야함.

QWidget <-- QAbstractButton <-- QPushButton

저런 시그널을 어떻게 만들지? => 이것도 가능함.

*slot*

public 에 있는 멤버함수에 불가함. 사용자가 직접 부를 수 있다. QT Signal&Slot 개념으로 연결도 가능한 것임.

QWidget의 `close()`함수가 있다. 이 함수는 window를 닫을 때 사용함. 해당 함수는 slot으로 구현되어져있음. 따라서, 직접부르는 것도 가능하지만 slot을 활용하기도 함.

```cpp
QObject::connect( btn, SIGNAL(clicked()), this, SLOT(close()));
```

다이얼로그로 닫겠다하면 위와 같이 사용하면 됨.

### Signal slot 직접구현
임의 클래스가 signal slot을 사용하려면
1. 클래스 선언은 *헤더 파일*로 작성
2. QObject로 부터 상속 받아야함.
3. 클래스 선언 가장 앞에 `Q_OBJECT` 메크로 추가.

시그널 슬롯은 *GUI가 아니라도* 가능하다.

Slot을 만들기 위해서는 *멤버함수 접근지정자 뒤*에 `slots`를 적어주면 됨.

*Signal을 만드는 방법*

1. `Signals:` 키워드를 적어주고, *선언만 작성!* (구현부는 작성하면 안됨)
2. signal을 언제 보내줄지 적어주면됨.
  1. `emit` 키워드를 활용하면 된다.
3. slot과 signal을 연결하면 됨.

### using signal slot
Signal slot을 연결하는 방법은 2가지가 있다.
1. SIGNAL(), SLOT() 메크로를 활용
* slot함수만 연결가능.
2. 멤버 함수 포인터 사용.
* slot 아니어도 연결가능. (람다도 가능)
* modern c++이 등장하면서 지원을 위해 등장.

하나의 시그널에 *여러개의 slot을 붙여서 사용가능함*

## MOS (Meta Object System)
QT는 C++과 긴밀한 관계가 있다.
* C++ 언어의 탄생 => 1983
* 1차 공식표준화 => 1998
* 새로운 C++ 표준화 => C++11/14/17 3년마다 다양하고 강력한 문법과 라이브러리 추가됨

QT의 탄생
* C++ 언어가 공식 표준화 되기 전인 1995년 탄생
* 1차 표준화도 나오기 전..
* C++ 언어 자체의 능력이 많이 부족한 시절
* 부족함을 해결하기 위해 *Meta Object System* 개념 도입
  * 당시에는 최신의 문법을 사용할 수 없었음..

* 컴파일 순서
사용자가 만든 C++ 코드 => MOC (Meta Object Compiler) 먼저 컴파일 => 두 개 합친 결과물. => C++ 컴파일 => 실행파일

MOC가 컴파일하는 코드들은 아래와 같다.
* signal & slot
* RTTI
* dynamic property

위와 같이 동작하는 걸 *MOS (Meta Object System)* 이라고 부른다.

MOS를 사용하려면 지켜야하는 규칙이 있다.
1. 클래스 선언은 헤더파일에 작성
2. QObject로 부터 상속 받아야함
3. 클래스 선언 제일 위쪽에 Q_OBJECT 메크로를 넣어줌

편하게 추가하기 위해서는 => *Add clas*를 하면 더 편하게 추가할 수 있음.
멤버함수 추가도 *Refactor*를 하면 더 편하게 할 수 있음.

### RTTI
실행시간에 객체 타입을 조사하는 기술

C++ 표준 문법이 제공하지만, QT도 자체기술로 제공한다.

```cpp
Sample sam;

const QMetaObject* mo = sam.metaObject();
// 메타 오브젝트 안에 다양한 결과들이 있음.

qDebug() << mp->className();
```

MOS를 돌리게 되면, Q_OBJECT와 같은 메크로가 변환되는데, 해당 값은 선언만 존재함. 이 구현을 누군가는 해야되는건데.. 그걸 MOC가 해줌.

Q_OBJECT를 가장 위에 놓는 이유 => 내부적으로 `private`를 마지막에 포함하기 때문에.. -> public위에 놓아라!! 전처리해보면 알 수 있음.

## Layout
자식 윈도우를 만든 경우 위치 / 크기를 적절하게 배치해야한다.
* 방법1. 픽셀 좌표를 직접 지정하는 방법
  * QWidget::setGeometry() 멤버함수 사용
  * Window 크기가 고정되어있고, 항상 동일한 환경이면 나쁘지 않다.
  * 만약.. 사이즈가 조정되는 window라면 *재배치*를 해야함.
  * 또, 다양한 환경(스마트폰, 티비, 데스크탑 등)에서 사용되면 적절하게 나와야한다.
* 방법2. Layout 클래스 사용
  * QT 다양한 정책을 가진 layout 클래스 제공
  * QBoxLayout이 가장 기본.
    * 등록된 Widget들을 가로 또는 세로로 차례로 배치하는 Layout!
    * 생성할 때 *방향을 지정*해줘야함.
      * `QBoxLayout::LeftToRight`
      * `QBoxLayout::RightToLeft`
      * `QBoxLayout::TopToBottom`
      * `QBoxLayout::LeftToRight`
    * layout->addWidget()를 활용해 widget을 등록해주면 됨.
    * 마지막으로 widnow->setLayout으로 layout를 붙여주면 됨.
  * BoxLayout은 아래에 VBox / HBox로 나뉘어짐.
* 각 Widget은 `setSizePolicy` 라는 정책을 가지고 있음.
* 이를 변경하려면 아래와 같이 사용하면 됨.

```cpp
btn->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expandig);
// QSizePolicy::fixed; 이것을 사용하면 사이즈가 고정됨.
```

* 중첩된 layout 
* Layout은 다른 layout을 포함할 수 있다.

### QGridLayout / QFormLayout
`QGridLayout`은 자식 widget을 Row, col 형식 즉, 격자형식으로 배치하는 것을 말함.

`QFormLayout`은 `addRow()` 함수를 사용해서 줄단위 항목 추가 가능한 layout.

### Menu 붙이기
QObject <- QWidget <- QMainWindow
* QObject - QT에서 필요한 기능 `RTTI`, `Signal&Slot` 갖고 있음.
* QWidget - UI를 그릴 수 있는 공통된 기능
* QMainWidnow - 윈도우가 가져야하는 공통된 기능 => menu toolbar 등

QMainWindow로 그리면 menu 같은 것들이 붙어있어서 좀 더 편하게 Window를 그릴 수 있음.

QWidget은 UI공통 사항이라 window 관련된 것을 붙여서 사용해야함.

* Window창이 있을 때 흔히 보이는것 -> menubar
* 항목들을 menu라고 함
* 하위 메뉴 -> action
