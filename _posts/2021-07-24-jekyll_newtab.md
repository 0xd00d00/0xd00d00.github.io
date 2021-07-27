---
layout: post
author: doodoo
title: "[jekyll][blog] 블로그 내 링크 새창으로 열기 만드는 방법"
subtitle: "사용자들에게 편리성을 제공해보자! 😹"
date: 2021-07-24
cover: /assets/img/default.png
tags: jekyll
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 jekyll 블로그 포스팅 내 링크를 새창으로 여는 방법에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제점
해당 [링크](https://0xd00d00.github.io/) 를 클릭해 확인해보자.

당신의 페이지가 블로그 페이지를 링크페이지로 바꾸는건 아닌가? 그렇다면 아래의
방법을 통해 바꿔볼 수 있다. 😓

보통 블로그에 들어가서 *링크*를 클릭할 경우, 새창으로 열리지 않고, 해당 블로그
페이지에서 바로 열리는 문제들이 종종 있다. (문제라고 하긴 그렇지만.. 🤔)
	사용자의 편리성을 위해 *링크*는 항상 새창으로 열 수 있도록 변경해보자.

### 새창으로 여는 방법
우리는 "a tag"를 이용해 *링크*를 추가한다.

*🔌 a tag 속성*

"a tag"의 속성에서 중요한 부분은 3가지이다.

- href : 연결할 주소 지정하기 위한 속성
- target : 링크를 클릭 할 때 창을 어떻게 열지 지정하기 위한 속성
- title : 해당 링크에 마우스 커서를 올릴 경우, 도움말을 지정하기 위한 속성

해당 속성 중 우리는 `target` 속성을 활용해 새창으로 열도록 만들 수 있다.
그렇다면, `target`속성의 값은 어떤값을 활용하여 지정할까?

- \_self : 링크를 클릭한 해당 창에서 열도록 한다 (default 속성)
- \_blank : 링크를 새창으로 열도록 한다 (우리가 추구하는 방향)
- \_parent : 부모 창에서 열도록 한다. (부모 창이 없으면 \_self 속성으로 처리)
- \_top : 전체 브라우저 창에서 가장 상위의 창에서 열도록 한다. (부모 창이 없으면\_self 속성으로 처리)

위의 속성값을 보니, 우리가 원하는 방향의 답이 나온 것 같다. 우리는 기본적으로
지정되어져 있는 `_self`를 `_blank`로 변경하면 된다.

### 소스코드 적용
소스코드를 적용하기 앞서 하나 생각해보자.

<span class="tip">생각해 볼 부분</span>markdown 컴파일러를 통해 a tag는 컴파일되고 posting 화면에
뿌려 지는데, 어떻게 a tag를 변경하지?

여러가지 해답이 있을 수 있다. 본인은 `post-head`에 script를 추가해 window가 load
될 때, a tag의 값들을 다 변경하는 방향으로 문제를 해결했다.

우선 본인의 `post-head` 파일에 가서 아래의 스크립트를 집어넣자.

```js
<script>
	window.onload = function(){
		var anchors = document.getElementsByTagName('a');
		for (var i = 0; i < anchors.length; i++){
			anchors[i].setAttribute('target', '_blank');
		}
	}
</script>
```

해당코드는 간단하게 작성된 script이다. 조금 자세히 보면, `window.onload` 될 때,
	아래의 함수가 시작된다는 의미이고, 아래의 함수는 현재 페이지 내 `a` 테그들을
	찾아 속성값들을 `_self`에서 `_blank`로 변경하는 것이다.

해당 코드를 접어 넣으면, 새창에서 링크가 열릴 것이다!

사용자에게 편리함을 제공해보자! 😎
