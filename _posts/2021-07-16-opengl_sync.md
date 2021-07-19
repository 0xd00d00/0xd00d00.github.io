---
layout: post
author: doodoo
title: "[OpenGL][GPU] OpenGL Synchronization"
subtitle: "OpenGL 동기화 개념에 대해 알아보자🕵"
date: 2021-07-15
cover: /assets/img/sync_function.png
tags: OpenGL GPU
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 OpenGL *자원공유* 와 *동기화* 개념에 대해 알아보겠습니다.

해당 포스팅은 [블로그](https://keyou.github.io/blog/2020/06/12/opengl-sync/) 를 참고해 정리했습니다.

🖇 소스코드에 마우스를 올리고 <span class=tip>copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### OpenGL의 API 명령어 처리 방법
일반적으로 OpenGL API 명령어들은 비동기적으로 처리된다. 우리는 일반적으로 프로그램을 설계하면서 동기적으로 동작해야 되는 경우를 종종 만나게된다. (뒷 부분에서 예시로 다루도록 하겠다.) 만약 OpenGL 명령어들이 동기적으로 다뤄졌다면, driver cache 등과 같은 것들은 필요 없을 것이다. 비동기적으로 다뤄지기 때문에 해당 명령어들을 driver cache라는 곳에 저장했다가 어느 시점이 되면 한번에 GPU로 전달하게 된다.

driver cache에 저장했다가 한번에 내리는 이유는 driver에서 실제 GPU HW에 명령어를 전달하는 기능은 Application이 아닌 Kernel에서 수행하게 된다. 그럴 경우 *mode switch* 라는 것이 발생하게 되는데, 이 *mode switch*가 시스템 성능을 좌지우지 한다.

만약 buffering 개념 없이 사용하게 될경우 엄청난 성능 하락이 발생할 것이다. 따라서, 성능을 개선하기 위해 driver cache라는 곳에 OpenGL API 명령어들을 일정부분 모은 후 한번에 HW에 전달하는 buffering 기법을 보통 사용한다.

조금 더 자세하게 들어가보자.

*mode switch* 후 GPU에 전달하는 OpenGL API Commands (이하 GL 명령어)들은 바로 GPU에서 실행되지 않는다. GPU HW 내 command buffer에 GL 명령어들을 buffering 했다가 일정 시점이 되면 GPU 에서 하나씩 읽어 수행한다. 즉, 2중 버퍼링을 하고 있는 것이다.

구체적으로, 우리는 Application에서 GL 명령어를 수행해주세요 하고 요청한다. 그럴 경우 GPU driver에 Application이 요청한 GL명령어 들이 쌓인다. 이후 일정 시점이 되면 GPU driver에서 GPU로 GL 명령어들을 수행해달라고 요청한다. 그럼 쌓여있던 GL 명령어들이 GPU에 전달되게 되고, GPU HW 내 command buffer에 다시 쌓이게 된다. 이후 일정 시점이 되면 GPU가 해당 명령어들이 추출해 실행하게 된다.

2 중 caching 구조라 부르며, OpenGL에는 해당 caching을 처리할 수 있는 특별한 함수들도 제공한다.

![sync_funtion](/assets/img/sync_function.png)

*glFinish*

해당 함수가 호출 될 경우 GPU driver와 GPU HW 내 commands buffer들을 모두 비운다. 즉, 모든 명령어를 GPU에 강제로 투입해 실행시킨다. 해당 명령어를 사용하는 것은 주의가 필요하다. 왜냐하면 해당 명령어들을 모두 처리할 동안 GPU driver를 비롯해 모든 것들이 block 되기 때문에 시스템 성능이 하락될 수 있다.

*glFlush*

해당 명령어를 사용하면 GPU driver내 존재하는 GL 명령어들을 GPU HW까지 보낼 수 있다. 오직 GPU driver cache만 처리하는 것이다. glFinish 보단 퍼포먼스 적으로 괜찮지만, 실제 GPU HW까지 명령어가 수행되지 않기 때문에 *Consistency*를 보장하지 않는다.

해당 GL 명령어들은 Application 단에서 사용가능하다.

### OpenGL에서 제공되는 GL 동기화 메커니즘
일반적인 상황에서 cache내 명령어들이 실행 됐는지 안됐는지 Application에서 알지도 못하고, 알 필요도 없다. 하지만, Application에서 GL명령어들의 결과를 보고 어떤 동작행해야 할 경우 동기화 메커니즘을 활용해야한다.

쉽게 쉽게 예시를 생각해보자.🙆

우리가 rendering한 결과를 bitmap화 해 메모리로 읽어 드리는 경우를 생각해보자. 이 경우 bitmap 값을 읽기 전 모든 GL 커맨드들이 모두 저장되어져 있어야한다. 즉, 우리가 어떤 데이터를 읽기 전 모든 데이터가 다 쓰여져있어야 한다는 이야기를 많이 들어 봤을 것이다. 해당 경우를 Read / Write 직렬화 혹은 동기화 라고 많이들 부른다.

이 경우 데이터를 읽기 전 쓰기가 먼저 이루어지고 읽어야 하는 동기화 과정이 필요한데, 해당 과정은 OpenGL 내부에서 자체적으로 제공하고 있다. 이런 동기화 메커니즘을 *암시적 동기화*라고 부른다. Application에서 직접 다룰 필요 없이, OpenGL 내에서 암묵적으로 동기화를 진행하는 것을 말한다.

해당 케이스는 단일 Context 즉, 하나의 프로세스에서 단일 thread가 Context를 만들어 읽고 쓰고 하는 경우에만 해당된다.

그렇다면, 단일이 아닌 다수의 Context 즉, 다수의 thread가 다수의 Context를 만들어 동기화하는 경우는 어떻게 처리해야 할까?

다수의 GL context가 존재하는 경우 조금 다르게 처리해야한다. 만약 하나의 프로세스에서 두 개의 GL Context가 존재한다고 가정해보자. 하나는 ContextA라고 부르고 texture를 사용하기 전 생성하는 일을 한다고 생각해보고, 또 다른 하나는 ContextB라 부르고 texture를 사용해 screen에 뿌리는 역할을 한다고 생각해보자.

![sync](/assets/img/gl_sync.png)

위의 그림을 참조해서 아래의 사진을 확인해보자.

우리는 ContextB를 사용해 화면에 보여주기 전에 ContextA가 이미지를 만들어 texture를 생성해야 제대로 된 화면을 볼 수 있다. 즉, ContextA가 완성된 이후 ContextB를 수행해야 정상 화면을 볼 수 있다는 말이다. 해당 경우에는 동기화 과정이 필요하다. 이런 경우에는 Application이 직접 제어 해야하는데 이때 사용하는 동기화 메커니즘을 *명시적 동기화*라고 부른다.

우리가 앞서 Application 단에사 사용가능한 제어 함수 `glFlush` 혹은 `glFinish` 2가지를 배웠다. 하지만, 해당 함수들은 버퍼 자체를 비워버리기 때문에 내가 원하는 ContextA, ContextB동작 뿐아니라 다른 동작의 GL 명령어들도 한번에 비워버린다.

좀 더 세밀하게 다루기 위해선 아래의 메커니즘(함수)를 활용해야한다.

OpenGL에서 Context를 동기화 할 수 있도록 도와주는 메커니즘의 함수들
- glFenceSync
- glClientWaitSync
- glServerWaitSync

해당 함수들에 대해서는 Chromium 동기화를 설명할 때 자세히 다루도록 하겠다 :)

위의 함수들을 적절하게 잘 활용해서 동기화 과정을 진행하기 바란다.

### OpenGL 자원 공유하는 방법 (Resource Sharing)
Application에서는 다수의 thread를 활용해 일들을 처리할 수 있다. 개별 thread는 필요에 의해 GL Context를 여러개 만들 수 있다. 일례로, 2개의 thread가 있을 경우 하나의 thread는 resource를 생성하고 또다른 하나의 thread는 해당 resource를 사용하도록 만들어 성능을 향상 시킬 수 있다. 이런 방식을 우리는 *자원 공유 (Resource sharing)* 이라고 부른다.

OpenGL에서는 각기 다른 thread가 사용하고 있는 context사이에 자원을 공유하는 방법으로 *share group*이라는 개념이 존재한다. *share group* 내 존재하는 resource들은 다른 thread사이에서도 사용가능하다.

Share group 생성하기 위해서는 EGL API를 활용해야한다.

<span class="tip">Tip</span> *EGL*이란 EGL을 지원하는 플랫폼에서 OpenGL을 사용하고자 할 때, EGL을 바탕에 두고 OpenGL을 사용할때 사용하는 윈도우 시스템 인터페이스이다. 구체적으로, OpenGL은 3D 렌더링을 위해 GPU에게 내릴 명령들, 진행 순서 혹은 상태들을 조작하는 방법들을 정의한다. 구체적으로 특정 플랫폼하에서 어떻게 GUI로 구성해 Window에 보여줘야하는지 정의하지 않는다. OpenGL 명령어를 받아 실제 GUI (플랫폼)로 어떻게 보여줘야 할지 결정하는 인터페이스를 *EGL* 이라고 정의한다. (보충 설명은 [블로그](https://brunch.co.kr/@sixzone11/14#comment)를 참조하자.. 😏)

```cpp
EGLContext eglCreateContext(EGLDisplay display,
  EGLConfig config,
  EGLContext share_context, // resource group을 사용하기 위함.
  EGLint const * attrib_list);
```

*EGL*을 활용하여 *share group*을 생성하기 위해서는 `eglCreateContext()`라는 함수를 사용해야한다.

```cpp
// A thread 가 contextA 생성
contextA = eglCreateContext(display, config, NULL, attrib_list);

// B thread 가 contextB 생성
contextB = eglCreateContext(display, config, contextA, attrib_list);

// C thread 가 contextC 생성
contextC = eglCreateContext(display, config, contextA, attrib_list);
```

위의 코드를 보면, 3개의 thread가 각기 다른 context를 생성한다. 첫 번째 `contextA` 같은 경우 `shared_context`가 NULL이다. 왜냐하면, 처음에 참조할 context가 없기 때문에 NULL로 초기화 한다. 나머지 두 개의 context들은 `contextA`를 넘겨 생성한다. 그 결과 3개의 context들은 하나의 shared group이 되고 자원 공유가 가능해진다.

*shared group*내에 있기 때문에 자원은 공유가 능하지만, 자원이 서로 다른 A, B, C thread (다른 context)에 있기 때문에, 자원에 대한 접근은 우리가 위에서 배웠던 *동기화 제어*를 활용해 자원을 사용해야한다.

### Appendix
🌱 위의 내용 중 OpenGL은 context간 resource들을 공유하는 방법에 대해 규정하지 않는다. 자원 공유에 관한 처리는 EGL/WGL과 같은 API native interface에서 처리하도록 한다.

🌱 *자원 공유 (Resource sharing)* 하는 sharing method는 `eglCreateContext()`로 한정되어져 있는 것이 아니다. 그리고 플랫폼 별로 *자원 공유*를 하기 위한 group이름이 다르다. 즉, 플랫폼 별로 다르게 사용해야한다. 일례로 WGL은 *share group* 이아니라 *wglShareList* 라고 부른다.

🌱 일반적으로 *자원 공유*는 동일한 프로세스에서 다수의 context들 간에 수행되는 개념을 말한다. 프로세스간의 *자원 공유*는 GPU에서 메모리로 자원을 읽은 후 다음 다른 process로 전달하고 자원을 GPU에 다시 업로드 해야하는 순서로 진행된다.

즉, *GPU -> Memory -> GPU* 방법으로 진행된다. 따라서, 최대한 해당 방법을 피해야한다. Android에서는 플랫폼 OES_EGL_imageextension과 같은 프로세스간 자원을 공유하는 메커니즘을 제공한다

🌱 하나의 thread에서 다수의 context들이 만들어질 수 있지만, 해당 context 자동적으로 shared group으로 묶이거나 동기화가 자동적으로 될지에 대한 것들은 정의 되어 있지 않다. 일부 구현에서는 thread당 대기열을 갖고 있거나 context대한 명령 대기열을 갖고 있다. 정형화된 spec으로 하나의 thread에서 다수의 cotnext를 처리하는 방법이 나와있지 않다는 점을 기억해라.
