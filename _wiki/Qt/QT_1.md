---
layout  : wiki-post
author  : 널두
title   : "Qt 공부"
subtitle : 
date    : 2023-06-18 15:05:29 +0900
updated : 2023-06-18 15:46:47 +0900
---
* ToC
{:toc}

## Qt의 기초
### .pro 파일
* Qt prject를 관리하는 파일
* 헤더파일 추가 혹은 제거할 때마다 갱신됨
  * `#`을 활용해 주석으로 처리함
* Qt에서만 사용하는 header파일 들이 있음.
  * `<QString>`
  * `<QTcpSocket>`
    * 그냥 넣으면 에러남 왜?
      * Qt는 다용한 종류의 클래스를 "모듈" 단위로 분리해서 관리
      * Qt에서 특정 모듈을 사용하려면 .pro 파일에 추가
      ```cpp
      QT += 모듈이름
      ```
    * 그럼 왜 QString은 되는데?
      * QtCore / QtGUI 모델은 자동으로 .pro에 디폴트로 지정됨
      * QtString이 `QtCore` 모듈에 들어있음
    * 보통 모델은 윗부분에 추가함.
* .pro 파일에서 사용되는 문법들이 많이 있음. -> 차차 살펴볼 예정

### QDebug
* 화면 출력을 위해 QT가 제공하는 클래스
* 현재 시간을 관리하기 위해 QTime 헤더를 추가하면 됨.

```cpp
QTime time = QTime::currentTime;

std::cout << time; // invaild operator.!!!

return 0;
```

위 코드는 에러가 발생함. QTime이 std::cout과 호환이 되지 않는다. 만약출력해보고 싶으면 타입별로 추가하면 됨.

예를들면, 시 분 초로 따로따로 출력됨. 귀찮다!!!

* `qDebug`를 사용하면 `std::cout` 과 같이 한번에 출력됨
* `qDebug`를 사용하기 위해서는 `<QDebug>` 헤더 제공해야됨.
* 다양한 QT클래스를 편하게 출력가능
* `qDebug()`를 호출하면 qDebug라는 객체가 반환됨. 해당 객체에 대해 `operator<<`를 구현해둠.
* 사용법이 두가지임.
  * printf 스타일
    * 서식화된 표현에 좋음.
    
    ```cpp
    qDebug("a = %d f = %f", 10, 3.4);
    ```
    
  * cout 스타일
    * 객체 출력할 때 편리함.
    
      ```cpp
      qDebug() << 10 << 3.4 << endl;
      ```

### QTimer
* 시간간격에 따라 반복되거나, 특정 시간에 이벤트가 발생하도록 하는 클래스

```cpp
#include <QDebug>
#include <QTimer>

int main()
{
  qDebug("start main");
  
  QTimer timer;
  
  timer.callOnTimeout( []() { qDebug("tick"); } );
  timer.start(1000); // 1초마다 타이머 발생
  
  return 0;
}
```
타이머 이벤트가 있는데, 어플리케이션이 죽으면 안됨. 따라서, 빌드 시 경고 문구가 제공됨.

종료되지 않고, 발생되는 이벤트 처리하기 위해서는 반드시 *event loop*를 사용해야됨.
* Timer, Network, GUI 관련 코드 작성 시, 반드시 이벤트 루프 필요.
* QT는 GUI를 만들기 위해 많이 사용함.

QT에서는 event loop를 위해 몇 가지 클래스를 제공함.
* 상속관계로 이루어짐.
* QObject
  * Qt의 최상위 클래스 -> 이벤트 루프를 가지는 않음.
  * 대부분 QT 클래스가 가져야하는 기본 기능
* QCoreApplication
  * GUI 사용하지 않는 프로그램을 위한 event loop 제공
* QGuiApplication
  * GUI 사용 하는 프로그램을 위한 event loop 제공
* QApplication
  * QWidget을 사용하는 프로그램을 위한 event loop제공

각각의 용도에 맞는 클래스를 활용하면 됨.

GUI를 활용하면 대부분 Widget을 사용하게 됨. 그래서 보통 `QApplication`을 사용함.

### QCoreApplication
* 콘솔로 만들 경우 해당 클래스 사용하면 됨.
* event loop를 가진 non-GUI 프로그램의 전형적인 main함수
  ```cpp
  #include <QCoreApplication>
  int main(int argc, char** argv) {
    // 인자로 전달하는 것 잘 봐야함.
    QCoreApplication app(argc, argv);
    // ...
  
    return app.exec();
  }
  ```
* 관례적으로 `app` 이라는 이름을 많이 씀.
* event loop를 돌면서 주기적으로 잘 나옴.
* 프로그램은 종료되지 않고 event loop를 수행하면서 계속 나올 것임.
* QCoreApplication이 가지고 있는 exit() 호출하면 꺼지도록 할 수 있음.

### Qt help & Document
QT 클래스에 어떤 정보가 있고, 어떤 멤버가 있으며 어떻게 사용하는지 알고 싶으면 어떻게 해야되나?

* (.) 을 통해 해당 값을 보면서 예측하면 됨.
* 공식 도움말
  * QT Creator의 내장 도움말
    * 위쪽 toolbak help 혹은 왼편에 help 클릭해서 보면 됨.
  * [qt.io](http://qt.io) 사이트 접속
    * QT document가 있음.
    * 되도록 Document를 클릭해서 볼 때, *계층도*를 항상 살펴 볼 것
      * QPushButton -> QAbstractButton -> ... -> QObject
      * 위와 같이 상속관계를 확인해볼 것.
* 내부 소스코드 (오른쪽 메뉴 클릭해서 활용)
  * Follow Symbol Under Cursor(F2) 메뉴 선택
  * Show Preprocessed Source를 선택하면 *메크로 제거된 후* 코드 확인 가능
