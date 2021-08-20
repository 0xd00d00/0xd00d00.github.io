---
layout: post
author: doodoo
title: "[jekyll] 블로그 내 아이콘 및 포스팅 개수 추가하기"
subtitle: "이쁜 아이콘과 현재 내가 기록한 포스팅 갯수를 파악해보자😗"
date: 2021-08-20
cover: /assets/img/font_awesome_2.png
tags: jekyll
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 jekyll 블로그 꾸미기에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### icon 추가하기
아래의 그림과 같이, 이쁜 아이콘을 추가하는 방법에 대해 알아보자.

![jekyll_icon](/assets/img/jekyll_icon.png){: height="340px" width="240px"}

위의 아이콘은 `font-awesome` 이라는 플랫폼을 이용해 사용한다. [여기](https://fontawesome.com/v5.15/icons?d=gallery&p=1)를 클릭하면 `font-awesome`의 아이콘 겔러리가 나온다. 겔러리에서 원하는 아이콘을 찾아면된다.

해당 사이트는 외국에서 만들었으며, *영어*로 검색해야한다. 예를들어 `tag`라고 검색하면 위의 모양을 찾을 수 있다.

그렇다면 어떻게 적용해야하는가?

[여기](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/hosting-font-awesome-yourself) 사이트를 클릭하면 css들을 다운 받을 수 있다. 본인이 font를 적용하고 싶다면 css, 그게 아닐 경우 all.js를 받으면 되는데, 잘 모르겠으면 all.css 와 all.js를 본인의 /assets/css 위치에 넣어두자.

예를들어, `all.js`를 헤더에 넣고 사용한다고 가정해보자.

```html
<head>
  <script defer src="/your-path-to-fontawesome/js/all.js"></script> <!--load all styles -->
</head><head>
  <script defer src="/your-path-to-fontawesome/js/all.js"></script> <!--load all styles -->
</head>
```

위의 코드와 같이, 본인의 header에 js를 추가해주면 된다. (만약 모르겠다면, all.css 와 all.js를 둘다 추가하자 😎)

적용을 하고난 경우부터는 icon이 사용가능해진다.

이제 icon을 검색하고 원하는 위치에 가져다 넣으면 되는데, 아래의 그림을보자.

![font_awesome](/assets/img/font_awesome_1.png)

위의 그림과 같이, 본인이 원하는 keyword로 icon을 찾자

![font_awesome](/assets/img/font_awesome_2.png)

위의 그림과 같이, 빨간색으로 표시한 부분을 클릭할 경우 복사가 된다. 복사된 부분을 본이이 넣고 싶은 부분에다가 가져다 붙여 넣으면 아이콘이 사용될 것이다.

### Positing 개수 파악하기
jekyll에서는 포스팅 개수를 파악할 수 있는 문법이 존재한다.

```js
{% raw %}{{ site.posts.size  }}{% endraw %}
```

위의 수식을 이용하면 포스팅 개수를 구할 수 있다. 해당 포스팅 개수를 적절한 위치에 배치한 후 스타일을 꾸며 추가해보자. 본인이 추가한 위치는 아래의 사진과 같다.

![posting](/assets/img/numOfPosting.png){: height="340px" width="240px"}

위의 사진과 같이 꾸밀 수 있는데, 본인이 적용한 코드를 보고 따라해보자. 본인은 css를 날것으로 추가하면서 꾸몄다.

```html
<div class="search-card">
	<div style="margin-top:16px; padding : 0; border:1px solid #e7eaf1; border-radius : 3px; box-sizing: border-box; box-shadow: 0 1px 3px rgb(0 37 55 / 6%); position : relative; padding : 10px 44px 10px 16px; margin: 0; width: 100%; background-color:#fff; outline:0; z-index:1;">
		<i class="fas fa-edit"></i>
		<text style="font-family:NotoSans-Regular; color: #656565; font-size: 15px"> number of posts : </text><text style="font-family:NotoSans-Bold; color:#43738F; font-size:17px">{% raw %}{{ site.posts.size }}{% endraw %}</text>
	</div>
</div>
```

