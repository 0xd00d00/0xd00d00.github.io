---
layout: post
author: doodoo
title: "[jekyll][codepen] jekyll 블로그에 codepen 추가하는 방법"
subtitle: "야 너두 codepen으로 코드 결과 동시에 볼 수 있어 😁 "
date: 2021-07-06
cover: /assets/img/codepen_save.png
tags: jekyll
---

해당 포스팅은 jekyll 블로그에서 codepen을 추가하는 방법에 대해 설명합니다.

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다👍 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### codepen은 무엇인가
codepen은 web developer를 위한 online compiler이다. 웹 개발자를 기준으로 만들어지다 보니 웹언어에 최적화 되어있다고 볼 수 있으며, 가장 좋은 점은 소스코드를 적고 결과를 한번에 볼 수 있다는 장점이있다.

그렇다면, 현재 웹 개발자도 아닌 본인이 왜 codepen을 쓰려고 하는가? OpenGL 쪽을 공부하다보니 WebGL을 보면서 같이 공부하면 이해도가 빠를 것 같아서.. (GL 쪽은 너무 어렵다 😵)
공부한 내용을 블로그에 기술하고자 하는데 마크다운에 존재하는 `<code>` 로 설명하자니 `HTML`, `CSS` 그리고 `JS`를 다 적어야하는 문제가 있었다. 그러다보니 포스팅이 너무 길어지고.. (보통 길어지면 보기 싫다.. 개인적 주관.. 😷) 가장 문제는 결과를 포스팅에 기록하기 위해서 image를 매번 떠야하는데 귀찮은게 가장 큰 이유다..

따라서, codepen의 embed를 이용해 포스팅 시 아래와 같이 코드와 결과를 한번에 보여주는 방법을 택하고자 한다.

{% include codepen.html hash="rNmxVJm" title="graphic"%}

### 블로그에 codepen 추가하는 방법
*jekyll* 기반 블로그에 codepen을 추가하는 방법을 알아보자.

가장 간단하게 하는 방법은 codepen에 로그인 후 pen을 작성한다. 여기서 말하는 pen은 codepn에 들어가면 나오는 `HTML`, `CSS` editor 창을 의미한다. pen 화면 하단에 *embed* 라는 버튼이 있는데, 해당 버튼을 누르고 정보를 복사해 posting에 붙여 주면 된다.

![codepen_default](/assets/img/codepen_default.png)

하지만 매번 embed를 클릭하기 귀찮고 posting이 너무 지저분해지는 게 싫다면 아래의 방법을 참고해보자.

### 개선된 codepen 설정 방법
본인이 참고한 사이트는 [여기](https://ryanjduffy.github.io/blog/2016/01/08/codepen-on-jekyll.html) 이다. 만약 영어가 불편하다면 한국어로 옮긴 블로그도 [여기](https://kijungsong.github.io/2020/04/08/hello-codepen/)있는 듯 하다.

블로그에 codepen을 추가하기 위해서는 *codepen 설정* 과 *jekyll 설정* 두 가지 설정이 필요하다.

*🌱 codepen 설정*

우선 codepen을 추가하기 위해서는 [codepen 사이트](https://codepen.io/) 에 접속해 로그인을 해줘야한다. 로그인 후 my pen 만들기를 들어가보자. 들어간 후 아래와 같이 코드를 작성해보자.

![codepen](/assets/img/codepen_save.png)

작성 후 빨간 표시로 되어있는 저장 버튼을 눌러보자.

![codepen_hash](/assets/img/codepen_hash.png)

그럴경우 아래와 같이 URL 주소가 바뀌게 된다. 빨간색 표시된 부분처럼 *해시* 값을 얻을 수 있는데, 해당 해시 값을 잘 기록해 둘 필요가있다. (해당 해시값은 나중에 posting 작성시 참고해야한다.)

*🌱 jekyll 설정*

그리고 본인의 jekyll 디렉토리에서 `_includes/codepen.html` 파일을 생성하자.

해당 코드 [여기](https://raw.githubusercontent.com/0xd00d00/0xd00d00.github.io/master/_includes/codepen.html) 클릭해 코드를 복사해 붙여넣자. (code 로 작성할 경우 원인을 알 수 없이 코드가 보이지 않아 git raw file로 첨부해 코드를 공유하고자 한다😰)

```html
<p data-height="300" data-theme-id="0" data-slug-hash="{{ include.hash }}" data-default-tab="html,result" data-user="{{ username }}" class='codepen split-output'>
```

참조한 코드를 보면 위의 코드가 들어있을 것이다. 여기서 사용시 필요한 몇가지만 다뤄보자.

- `data-height` : embedding 된 codepen의 높이를 지정하는 속성이다
- `data-theme-id` : 0 은 default이고, 1 은 light, 2 는 dark 인 것 같다. 해당 theme는 code pen을 프로로 변경할 경우 더 많은 theme를 사용할 수 있다고 한다.
- `data-default-tab` : embedding 된 codepen을 어떤 형식으로 나타낼 것인가를 지정하는 부분이다. 해당 부분이 가장 중요하다고 생각한다. 보통 "result" 부분만 나와 있다. 하지만, 코드와 result를 반반 보여주고 싶을 때, 위와 같이 적으면 된다. 만약 사용자가 html 이 아닌 css, js를 보여주고 싶을 경우 html 자리에 css 혹은 js를 넣어주면 된다.

jekyll 설정의 마지막으로 `_config.yml` 코드를 열어 아래의 내용을 추가해주자.

```html
<!-- username 에는 본인의 codepen id를 적어주면 된다 -->
codepen_username: username
```

주석에도 작성해둔 것 처럼 `username` 부분에 본인의 codepen 아이디를 적어주면 된다.

### 개선된 codepen 사용방법
설정이 다 끝났다. 이제 사용을 해보자 🎵

본인이 작성하고 싶은 포스팅을 연다.
이후 아래의 *코드*을 추가해주자. 추가해 줄 때 해시 값은 우리가 앞서 다뤘던 *codepen 설정* 부분에서 기억하라던 *해시 값*이다. (이해가 되지 않을 경우 codepen 설정 부분을 다시한번 보자!)

![codepen](/assets/img/codepen.png)

코드팬에 작성 후, 본인이 원하는 포스팅 위치에 넣어보자. 그럴 경우 아래와 같은 결론을 만날 수 있을 것이다 🎵

{% include codepen.html hash="QWvyPqB" title="hello" %}
