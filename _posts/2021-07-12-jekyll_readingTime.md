---
layout: post
author: doodoo
title: "[jekyll] 블로그 posting read time 추가하는 방법"
subtitle: "posting을 읽을 때 몇 분정도 소요되는지 구해보자. 🤓"
date: 2021-07-12
cover: /assets/img/reading_time.png
tags: jekyll
sitemap :
  changefreq : daily
  priority : 1.0
---
jekyll blog에서 medium에서 사용중인 read time을 구현해봅시다.<br>
아래와 같은 결과를 얻을 수 있습니다!

![reading_time](/assets/img/reading_time.png)

🖇 소스코드에 마우스를 올리고 `copy` 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Read time
보통 posting을 읽을 때 몇 분 걸릴까?

[wiki](https://en.wikipedia.org/wiki/Words_per_minute)에 따르면 1분당 180자를 읽을 수 있다고 한다. 그렇다면, 해당 포스팅을 읽을 때 몇 분 걸리는지 구할 수 있지 않을까?

해당기능을 우리는 posting read time이라고 정의한다.

마침, plugin 없이 read time을 구할 수 있는 [블로그](https://carlosbecker.com/posts/jekyll-reading-time-without-plugins/)가 있어 참고해 포스팅 하고자 한다.

해당 기능은 medium 이라는 블로그에서 제공하고 있다. 하지만, jekyll 블로그에서는 따로 제공하고 있지않으며, 만약 사용하고 싶다면, plugin을 설치하거나 소스코드를 구현해야한다.

우리는 따로 plugin을 설치하지 않고 소스코드를 만들어 추가하는 방식을 알아보자.

### 소스코드
아래의 소스코드를 본인의 블로그 `_include/read_time.html` 이라는 파일을 만들어 붙여넣자. (본인 이 원하는 파일명으로 변경해도 된다. 꼭 read_time이 아니여도 됨.)
```html
<span title="Estimated read time">
  {% raw %}{% assign words = page.content | number_of_words %}
  {% if words < 360 %}
    1 min
  {% else %}
    {{ words | divided_by:180 }} mins read
  {% endif %} {% endraw %}
</span>
```
<span class="tip">Tip</span> liquid 코드를 code block에 붙여 넣기 위해서는 `raw`와 `endraw` 사이에 liquid 코드를 묶어줘야 한다 🤗 자세한 내용은 [여기](https://shopify.github.io/liquid/tags/template/) 를 참고하자.

우선, liquid에서는 페이지의 단어수를 파악 할 수 있는 문법을 제공한다.

```html
{% raw %} {% assign words = page.content | number_of_words %} {% endraw %}
```

위의 문법을 뜯어보면, `assign` 은 변수 할당을 의미하는 것이고, 뒤의 내용은 liquid에서 제공하는 단어를 구하는 문법이다. 자세한 내용은 [여기](https://jekyllrb.com/docs/liquid/filters/)를 참고하자.

우리는 180분을 1분이라 가정하고, 360분을 넘지 않는 부분을 모두 1분 정도 걸린다라고 가정하고 구현했다. 반면에 360이 넘어가는 시간에 대해서는 180분을 나눠 분을 구했다.

해당 코드를 사용하기 위해서는 read time을 넣을 적절한 위치를 선정해야한다.

본인은 포스팅 상단에 날짜 표기하는 옆에 지정하도록 했다.

```html
{% raw %}{% include read_time.html %}{% endraw %}
```

위의 코드를 본인이 원하는 위치에다가 넣어주면 되고, 해당 코드를 보고 jekyll은 read_time의 소스코드 내용을 그대로 붙여준다. 이후 코드를 해석해 시간을 표기하게 된다.
