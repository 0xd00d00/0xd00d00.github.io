---
layout  : wiki-post
author  : 널두
title   : "Qt 공부(2)"
subtitle : 
date    : 2023-06-18 15:52:20 +0900
updated : 2023-06-23 13:49:17 +0900
---
* ToC
{:toc}

## Window #1
* Window GUI 프로그램 개발
  * Module을 추가해야함=> `QT += widgets`

앞서 console 앱을 만들 경우 `QCoreApplication`을 사용했다. GUI 앱을 만들기 위해서는 `QApplication`을 사용하면 됨.

```cpp
#include <QApplication>

int main(int argc, char** argv)
{
    QApplication app(argc, argv);

    return app.exec();
}
```

위 코드와 같이 `QApplication` 헤더를 포함하고, event loop를 만들어야함. 이때 부르는 클래스가 QApplication이라는 점. 해당 클래스는 `QTWidget` 모듈에 있으니 `.pro` 파일에 추가했던 것이다.

* QT 윈도우 계층 구조
  * QObject <|-- Qwidget
  * QObject
    * QT 라이브러리의 최상위 기반 클래스
  * QWidget
    * GUI 관련된 기본 기능을 제공하는 클래스
    * 기본적으로 UI관련된 것들이 들어가 있어서 클래스가 크다
    * 멤버함수도 많고, 멤버변수도 많음.
    * 보통 이를 기반으로 상속을 받음
  * (window 경우) QWidget <|-- QMainWindow
  * (button 경우) QWidget <|-- QAbstractButton <|-- QPushButton
  * QWidget 밑에는 다양한 클래스가 있음.
  * QWidget은 `QPaintDevice` 클래스도 상속받고 있으며 *다중상속*받고 있음.

* QT에서 윈도우를 생성하는 방법
  * `QWidget` or `QMainWindow` 클래스 사용
  * QMainWindow 는 어떤 것들이 추가됨. QWidget의 기능에 *menu* 또는 *ToolBar*등 주 윈도우가 가져야하는 기능을 추가
    * 기본적으로 관리하는 기능이 제공됨.
    ```cpp
    // QWidget으로 대충 만들어보면,
    QWidget win;
    win.show(); // 이러면 window하나 만들어짐.
    ```
    * 아래의 그림과 같이 생성됨.
      * 기본적 버튼 (닫기 최소화 접기)과 사이즈 조절가능한 윈도우 생성
    * ![qt image](/assets/img/QT/qwidget_result.png){: height="300px" width="300px"}

## Window #2
* 프로그램에서 윈도우를 만든 경우
  * 윈도우에서 발생되는 다양한 이벤트 (마우스, 키보드 등)을 처리해야함.
  * 윈오두 위에 다양한 자식 윈도우 (button, slider 등의 컨트롤)을 만들고, 컨트롤에서 나오는 이벤트로 처리하는 코드 작성해야함.
* 일반적 관례
  * `QWidget` `QMainWindow` 를 직접 사용하지말고 파생클래스 만들어서 사용하는 것이 관례
  * 이게 무슨말이야?
  * QObject <-- QWidget <-- window (이게 파생클래스)
    * 모든 기능은 유효한데, 내가 추가도 할 수 있음!
    * 장점은?
      1. 기반 클래스 가상함수 오버라이딩 가능
      2. 생성자에서 자식윈도우 생성
      3. 자식윈도우에서 나오는 이벤트 핸들링 가능
    * 대충 코드는 아래와 같이 작성
    
      ```cpp
      #include <QApplication>
      #include <QWidget>
      #include <QDebug>

      class window : public QWidget
      {
          //여기서 다양한 것들을 추가해서 사용할 수 잇음.
      };

      int main(int argc, char** argv)
      {
          QApplication app(argc, argv);

          QWidget win;
          win.show();

          return app.exec();
      }
      ```
    
    * 이제 수정하면서 꿈을 펼치면 됨.
    * 내가 만든 `window`에 가상함수를 추가하는 방법
      * QT Creator에 *Refactor* 기능을 활용하면 편리하게 추가 가능
      * 내가만든 `window`에서 마우스 오른쪽 클릭하고, 아래와 같이 *Refactor* 버튼 들어가면 됨.
      * ![refactor](/assets/img/QT/qt_refactor.png){: height="150px" width="100%"}
   * 위를 통해 들어가면 내가 원하는 class 재정의 가능
   * 재정의 시, 어떻게 구현부를 만들어줄지 선택해야함
   * mouse press event를 재정의한다고 가정해보자.
     * Insert only declartions
       * 선언부만 만들어줌
       
       ```cpp
       class window : public QWidget
       {
            //여기서 다양한 것들을 추가해서 사용할 수 잇음.
            
            // QWidget interface
        protected:
            void mousePressEvent(QMouseEvent *event);
       }; 
       ```
     * Insert definition inside class
       * 정의도 내부에 만들어짐
       
       ```cpp
       class window : public QWidget
       {
            //여기서 다양한 것들을 추가해서 사용할 수 잇음.
            
            // QWidget interface
        protected: 
            void mousePressEvent(QMouseEvent *event)
            {

            }
       }; 
       ```
     * Insert definition outside class
       * 정의가 외부에 만들어짐
       
       ```cpp
       class window : public QWidget
       {
            //여기서 다양한 것들을 추가해서 사용할 수 잇음.
            
            // QWidget interface
        protected:
            void mousePressEvent(QMouseEvent *event);
       }; 
        
       void window::mousePressEvent(QMouseEvent *event)
       {
       }
       ```
       
### 자식윈도우 만들기(button, slider)

* 멤버데이터를 활용해 자식 윈도우 만들 수 있다.
* delete는 따로 안해도 되나? => QT가 자동으로 해줌

```cpp
class window : public QWidget
{
    //여기서 다양한 것들을 추가해서 사용할 수 잇음.
    QPushButton* btn;
    QSlider *slider;

public:
    window()
    {
        // 내거..
        btn = new QPushButton("OK", this);
        slider = new QSlider(Qt::Vertical, this);

        // btn 위치 지정이 안되있어서 이상하게 나옴.
        btn->setGeometry(10,10 ,100,30);
        slider->setGeometry(50,50, 10, 100);
    }
    // QWidget interface
};
```
