---
layout: post
author: doodoo
title: "[Design Pattern] Compound Pattern"
subtitle: "Compound pattern을 만들어보자"
date: 2021-12-05
cover: /assets/img/default.png
tags: Design_Pattern java
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Compound pattern 에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Compound Pattern 이란?
컴파운드 패턴은 일련의 패턴을 함꼐 사용하여, 다양한 디자인 문제를 해결한다. 반복적으로 생길 수 있는 일반적인 문제를 해결하기 위한 용도이다. 쉽게말하면, 다양한 패턴으로 이루어진 패턴이다.

컴파운드 패턴을 쉽게 이해하기 위해, 다양한 패턴을 섞어서 프로그램을 만들어보며 이해해보자.

### 예시
우리가 가장 먼저 다루었던 "오리"예시를 활용해 시뮬레이터를 만들어보자.

> 오리 시뮬레이터 \
🐤 Duck 을 구현해라 \
🐤 Duck의 특징은 "꽥꽥" 소리를 낸다는 점을 기억해라 \
🐤 Duck의 종류는 다양할 수 있다는 점을 고려해 만들어라 \
🐤 종류는 4가지 정도로 만들 것이다. (Mallard, Redhead, DuckCall, Rubber Duck)

위의 특징을 기반으로 코드 및 UML을 작성해보자.

*🌱 UML*



*🌱 코드*

Interface로 "꽥꽥" 소리를 작성하도록 만든 후, 새로 생성되는 오리들은 해당 행위를 무조건 작성하도록 함.

```java
public interface Quackable {
	public void Quack();
}

public class MallardDuck implements Quackable {
	public void quack() { System.out.println("Quack"); }
}

public class DuckCall implements Quackable {
	public void quack() { System.out.println("kwak"); }
}

// 다수의 오리를 위와 같이 추가하면 됨
...

// 시뮬레이터
// 코드가 길어 많은 부분을 생략합니다. (해당 부분은 Head first 책을 보면 잘나와 있음)
private fun simulate(duck: Quackable) {
    duck.quack()
}
```

### 문제 1

> 🙋 위의 오리 시뮬레이터는 잘 작동한다. 만약 거위를 추가하려면 어떻게 해야할까? 해당 문제를 해결하기 위해 가장 적절한 패턴은 무엇일지 생각해보자.

해답은 *"어뎁터 패턴"* 이다.
- 한 인터페이스를 다른 인터페이스로 변환하기 위한 용도로 사용 됨.
- 가장 쉽게 떠올려 볼 수 있는 예시는 "여행 갔을 때, 콘센터 어뎁터"를 떠올려 볼 수 있음.

<span class="Tip">Tip </span>여기서 중요한 점은 "해답"이라고 이야기한 점이다. 디자인 패턴은 정답이 존재하지 않는다. 설계의 차이이고, 접근의 관점 차이이기 때문에 당시 시점에 가장 적절한 행위를 가져다 쓰면 된다는 점을 기억하자.

위의 문제를 해결하기 위한 코드 및 UML을 작성해보자.

*🌱 UML*



*🌱 코드*

