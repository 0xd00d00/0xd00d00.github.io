---
layout: post
author: doodoo
title: "[Javascript] 브라우저 렌더링"
subtitle: "Web Engine에서 html, css, js가 어떻게 동작하는지 알아보자 🤔"
date: 2022-02-05
cover: /assets/img/default.png
tags: Javascript DeepDive
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 *브라우저 렌더링*에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 브라우저 렌더링 과정 (간략화)
Javascript 는 구글의 V8 자바스크립트 엔진의 등작으로 웹 브라우저를 벗어나 서버 사이드 애플리케이션 개발에서도 사용할 수 있는 범용 개발 언어가 되었다. 하지만 자바스크립트가 가장 많이 사용되는 분야는 역시 웹 브라우저 환경에서 동작하는 웹페이지/애플리케이션의 클라이언트 사이드이다.

대부분의 프로그래밍 언어는 OS나 VM 위에서 동작한다. 하지만 Web app 같은 경우 브라우저 (Web Engine)에서 동작한다. Web App을 동작시키기 위해 브라우저는 HTML, CSS, JS로 작성된 문서를 파싱하고 렌더링 하는 역할을 한다.

아래의 그림은 브라우저의 렌더링 과정을 간략하게 표현한 것이다.

![browser1](/assets/img/browser/1.png)

> *브라우저 렌더링 과정 간략 설명 🙋*<br>
1. 브라우저는 HTML, CSS, JS, Image, font 등 렌더링에 필요한 리소스를 *서버*에 *요청*해 *응답* 받음
2. 서버로 부터 전달받은 HTML, CSS를 파싱하여 DOM tree와 CSS tree 생성 후 결합해 Redner tree를 만듬
3. 서버로 부터 전달받은 JS는 JS engine에게 전달하여 명령어를 수행해 DOM or CSS tree를 변경해 Render tree에 반영
4. Render tree를 기반으로 Layout을 구축하고 화면에 pating 작업을 수행

{% include toggle.html title="크로미움 렌더링 동작확인" content="
![browser2](/assets/img/browser/2.png)
"
%}

<span class="tip">Tip</span> 파싱과 렌더링에 대해 간략히 알아보자.

*파싱이란?*

프로그래밍 언어의 문법에 맞게 작성된 텍스트 문서를 읽어 실행하기 위해 텍스트 문서의 문자열을 토큰으로 분해하고, 의미와 구조를 반영하여 트리구조의 *parse tree*를 생성하는 과정을 말한다.

*렌더링이란?*

렌더링은 HTML, CSS, JS로 작성된 문서를 파싱하여 브라우저에 *시각적으로 출력*하는 것을 말한다.

### 요청과 응답
브라우저의 핵심 기능은 필요한 리소스를 서버에 요청하고, 서버로 부터 응답 받아 브라우저에 시각적으로 렌더링 하는 것이다.

즉, 브라우저가 렌더링을 하기위해 필요한 리소스는 모두 서버에 존재하므로 필요한 리소스를 서버에 요청을 해서 받아야 한다는 점(응답)이 중요하다.

우리가 사용하는 브라우저에서는 URL창을 제공하며, URL 창에 필요한 서버위치를 적어주게 된다면 해당서버에서 브라우저는 리소스를 얻어온다. 보통 서버위치는 IP 주소로 입력을 해야되지만 우리는 Domain을 통해 서버에 접근이 가능하다. 이는 DNS 서버라는 것을 중간에 두고, Domain을 입력하면 IP로 변환해주는 동작을 수행하기 때문이다.

브라우저에서 서버로 부터 주고 받는 데이터를 확인하고 싶다면 *개발자 도구*의 *Network 패널*을 통해 확인해보자.

![browser3](/assets/img/browser/3.png)

*Network 패널*을 살펴보면 HTML, CSS 뿐아니라 img, font 등도 응답된것을 확인할 수 있을 것이다. 이는 브라우저 렌더링 엔진이 HTML 파싱하는 도중에 외부 리소스를 로드하는 테그 즉, link tag, script tag, img tag, font tag등을 만나게 되면 파싱을 중단하고, 서버에 요청해 응답받고 파싱을 진행하기 때문이다.

### HTTP 1.1 과 HTTP 2.0
*HTTP* 는 웹에서 브라우저와 서버가 통신하기 위한 *프로토콜 규약*이다. 기존 문제점을 개선해 규약이 확장되고 있는데, 현재까지는 HTTP 3.0 까지 나온 것으로 보인다. 우리는 많이 사용하는 HTML 1.1 과 HTML 2.0에 대해 간략히 알아보자.

위 2가지 규악 모두 *TCP 통신* 기반이다.

#### HTTP 1.1
HTTP/1.1 은 기본적으로 커넥션 하나의 요청과 응답만 처리한다. 즉, 여러개의 요청을 한번에 전송할 수 없고 응답 또한 마찬가지다. 모든 리소스가 개별적 요청하기 때문에 리소스 개수가 많아 질수록 응답 시간도 길어지는 단점이 존재한다. 이를 보완하고자 만든 것이 HTTP 2.0이다.

아래의 그림은 HTTP 1.1의 기본 동작 그림이다.

![browser4](/assets/img/browser/4.png){: height="500px" width="350px"}

#### HTTP 2.0
HTTP 1.1과 달리, 개별적 요청이 아닌 커넥션당 여러개의 요청과 응답을 받을 수 있다. 따라서, HTTP 1.1 보다 약 50% 빠르게 통신을 할 수 있다.

아래의 그림은 HTTP 2.0의 기본 동작 그림이다.

![browser5](/assets/img/browser/5.png){: height="500px" width="350px"}

### HTML 파싱과 DOM 생성
브라우저 요청에 의해 서버가 응답한 HTML 문서는 *문자열로 이루어진 순수한 텍스트*이다. 해당 Text를 바탕으로 시각적인 pixel로 렌더링 하기 위해서는 HTML 문서를 브라우저가 이해할 수 있는 자료구조로 변환하는 과정이 필요하다.

예를 들어 아래와 같은 *index.html* 파일이 요청되었다고 해보자.

```html
<! DOCTYPE html >
<html>
<head>
<meta charset="UTF-8">
<link rel ="stylesheet" href="style.css" >
</head>
<body>
	<ul>
		<li id="apple">Apple</li>
		<li id="banana">Banana</li>
		<li id="orange">Orange</li>
	</ul>
<script src="app.js" ></script>
</body>
</html>
```

브라우저는 아래와 같은 동작을 통해 DOM 트리를 구축한다.

> *브라우저 DOM 구축 과정 😸* <br>
1. 서버에 존재하는 HTML 파일을 응답받아 메모리에 저장함.
2. 브라우저는 전달받은 HTML 파일을 *meta tag*에 있는 인코딩 방식으로 변환한다. 보통 UTF-8이 기본으로 적혀져있음.
3. 문자열로 변환된 HTML문서를 읽어드려 *문법적 의미*를 갖는 토큰 형식으로 분해함
4. 각 토큰을 객체로 변환하여 *노드*를 생성함.
5. 토큰 내용에 따라 문서 노드, 요소 노드, 어트리뷰트 노드 등이 생성됨. (DOM 을 구축하는 기본 요소)
6. Node간의 관계를 표현할 수 있는 *Tree* 자료구조로 Node들을 구축한다. 해당 자료구조를 *DOM Tree*라고 부름.

### CSS와 CSSOM
서버로 부터 CSS 파일이 응답되면 렌더링 엔진은 HTML과 동일한 해석과정을 거쳐 *CSSOM*을 생성함.

CSS의 중요한 점은 Case Cading이 존재한다는 점이다. 즉, 부모가 가진 요소를 자식들에게도 반영해준다는 점이다. 아래의 예시와 그림을 통해 CSSOM의 결과 값을 확인해보자.

```css
body {
	font-size: 18px;
}

ul {
	list-style-type: none;
}
```
![browser6](/assets/img/browser/6.png)

위의 그림과 같이 *<ul>* 밑에 존재하는 *<li>* 들은 전부 동일한 style의 속성을 적용받아 가지고 있다는 점이 중요하다.

### 렌더트리 생성
렌더링 엔진은 서버로 부터 응답된 HTML, CSS를 DOM과 CSSOM으로 변환하고, 결합해 Render tree를 구축한다. 이때 중요한점은 브라우저 화면에 렌더링 되지 않는 노드*(예: meta 테그, script 테그 등)*와 CSS에 의해 비표시*(예: display:none)되는 노드* 들은 렌더트리에 포함되지 않는다는 점이다. 즉, 화면에 보여주는 부분만 *렌더트리*로 구축된다.

아래의 그림은 렌더트리를 나타낸 것이다.

![browser7](/assets/img/browser/7.png)

렌더 트리를 구축하고 난 이후 브라우저는 화면에 구성을 담당하는 layout과정을 수행하고 실제 화면에 표시하는 Painting 작업을 통해 화면에 보여준다.

![browser8](/assets/img/browser/8.png)

아래와 같은 경우 *레이아웃 계산과 페인팅*이 재차 실행된다는 점을 기억하자.

1. 자바스크립트에 의한 노드 추가 또는 삭제
2. 브라우저 차으이 리사이징에 의한 viewport 변경
3. HTML 요소의 레이아웃에 변경 발생 (예: top/left/right 등의 스타일 변경)

레이아웃이 자주 발생하게 되면 비용이 많이 발생하게 된다.

#### reflow와 repaint
reflow는 layout이라고 생각하면 편한다.
해당 부분은 내용이 방대해 포스팅을 추가해 자세하게 다루도록 한다.

여기서는 간단하게 언급하고 넘어가도록 한다.

reflow를 발생하면 layout을 다시 구성해야돼 비용적 측면이 많이 발생한다. 따라서 동일한 동작이라면 repaint 동작을 수행하는 것을 추천한다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <style>
    .a { height: 100px; width: 100px; background-color: #d00d00;}
    .b { top:10px; height: 100px; width: 100px; background-color: blue;}
    </style>

    <!-- repaint GPU 단에서 위치만 조정하면 됨-->
    <div class="a" style="transform: translateX(200px)"></div>

    <!-- reflow (layout)-->
    <div class="b" style="position:relative;left:200px"></div>
</body>
</html>
```

위의 예시는 동일한 결과를 낸다. 하지만, *a 클래스*는 *repaint* 동작을 수행하고, *b class*는 *reflow (layout)*동작을 수행한다. Browser 내부에서 transform 키워드는 행렬을 활용해 GPU로 바로 동작하도록 한다. 따라서 layout과정이 필요없고, 행렬 값을 바꿔줘 OpenGL로 수행하면 되기 떄문에 성능적 측면에서 훨씬 좋다고 볼 수 있다.

### 자바스크립트 파싱과 실행
HTML 문서를 파싱한 결과물로서 생성된 DOM은 HTML 문서의 구조와 정보 뿐아니라 요소와 스타일을 변경할 수 있는 *DOM API*를 제공한다. DOM API를 활용하면 DOM을 동적으로 제어가 가능하다. JS는 이를 활용해 DOM을 동적으로 제어한다.

HTML에서 *<script>*를 만나게 되면 *src*에 정의된 자바스크립트 파일을 서버에 요청하여 *로드*하고 코드를 파싱하기 위해 *JS 엔진*으로 제어권을 넘겨 JS를 수행한다.

JS 내부에서는 아래의 그림과 같은 동작들이 발생한다.

![browser9](/assets/img/browser/9.png)

> *JS 내부 동작 간단 설명 🗣* <br>
1. *토크나이징*을 통해 자바스크립트 소스코드를 분석하고 최소단위인 토큰으로 분해함.
2. *파싱* 을 통해 AST(추상적 구문 트리)를 생성한다. AST는 토큰에 문법적 의미와 구조를 반영한 트리이다.
3. 파싱 결과물로서 생성된 AST를 인터프리터가 실행할 수 있는 *바이트코드 생성 및 인터프리터 실행*을 통해 JS는 동작함.

#### 자바스크립트 파싱에 의한 HTML 파싱 중단
렌더링 엔진 같은경우 병렬적으로 파싱을 진행하지 않고 아래와 같이 *직렬적*으로 파싱을 수행한다.

![browser10](/assets/img/browser/10.png){: height="450px" width="670px"}

따라서, JS를 만날 경우 아래와 같이 blocking될 수 있다. 위와 같이 blocking 될 경우 2가지 문제가 존재한다.

1. DOM 완성되지 않은 상태에서 JS가 DOM을 조작할 경우 에러 발생
2. HTML 렌더링 도중 JS에게 제어권이 넘어가기 때문에 page loading이 느려짐. (화면 보여주는 속도가 느려짐)

이를 막기 위해서는 *JS를 가장 마지막으로 배치하는 것이 좋다*

#### asyc / defer 어트리뷰트
JS를 수행할 때 가장 큰 bottleneck 부분은 "load" 되는 부분이다. 해당 부분을 개선하기 위해 HTML5에서는 async / defer 키워드를 제공한다.

```js
// 사용방법은 아래와 같다.
<script async src="extern.js"></ script>
<script defer src="extern.js" ></ script>
```

*async 어트리뷰트*

HTML 파싱과 외부 자바스크립트 파일의 로드가 비동기적으로 동시에 진행할 수 있도록 한다. 자바스크립트 파일의 로드가 완료된 직후 진행됨. 따라서 HTML 파싱 중간에 개입가능성이 있다.

![browser11](/assets/img/browser/11.png)

*defer 어트리뷰트*

async와 마찬가지로 비동기적으로 파일 로드가 일어난다. HTML 파싱이 완료된 후 JS를 바로 실행할 수 있도록 한다.

![browser12](/assets/img/browser/12.png)

### Reference
- [모던 자바스크립트 DeepDive](http://www.yes24.com/Product/Goods/92742567)
- [Life of a pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.ga884fe665f_64_6)
