---
layout  : wiki-post
author  : 널두
title   : "Qt 공부(3)"
subtitle : 
date    : 2023-06-23 13:14:40 +0900
updated : 2023-06-23 15:04:12 +0900
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

