---
layout: post
author: doodoo
title: "[Design Pattern][C++] Decorator Pattern"
subtitle: "동적인 변화에 필요한 decorator pattern에 대해 알아보자 ❗"
date: 2021-09-26
cover: /assets/img/default.png
tags: Design_Pattern C++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 디자인 패턴 중 Decorator 패턴에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Decorator 패턴
Decorator 패턴은 언제 사용할까?

*동적인 기능을 추가해야되는 상황*에서 해당 패턴을 사용한다.

어떤 상황에서 사용하는지 예제를 통해 알아보고 패턴을 적용해보자.

### 우주선 게임을 만들자
아래의 그림과 같이, 우주선 게임을 만든다고 생각해보자. 우주선을 가지고 미사일을
쏴 목표물을 맞추는 게임이다.

![space](/assets/img/space.png)

위를 코드로 구현하면 다음과 같다.

```cpp
#include <iostream>
using namespace std;

class Space {
	int color;
	int speed;
public:
	void Shoot() { cout << "Space ---------- target" << endl; }
};

int main() {
	Space s;
	s.Shoot();
}
```

그런데 만약 우주선 게임을 하는 과정에서 레벨업을 했을 때, 왼쪽, 오른쪽 혹은 둘 다를 공격할 수 있는 기술을 터득했다고 가정해보자.

![space_upgrade](/assets/img/upgrade_space.png)

위의 그림과 같이 구현하기 위해서는 어떻게 해야할까?

해당 기능을 구현하기 위해서는 *기존 동작은 수행하고, 새로운 동작이 추가되는
것*이다.

우리는 [이전 포스팅](https://0xd00d00.github.io/2021/08/06/design_pattern_4.html)을 통해 새로운 동작이 추가될 경우 고려해야하는 두 가지 방법 *상속*과 *구성*방법에 대해 언급했다.

두 가지 방법을 통해 구현해보고 어떤 방법이 더 효율적인지 알아보자.

### 상속을 통한 우주선 기능 추가
기존 기능을 갖고 새로운 기능을 추가할 때, 가장 먼저 떠올릴 수 있는 방법은*상속*이다.

만약 우리가 상속을 `LeftMissile`을 사용하는 우주선을 만들고 싶다면, `Space`를
상속받아 만들고 `LeftMissile`를 활용해 쏠 경우 기반 클래스의 `Shoot()`를
호출해주고 새로운 미사일을 사용하도록 하면 된다. 아래의 코드를 보자.

```cpp
#include <iostream>
using namespace std;

class Space {
  int color;
  int speed;
public:
  void Shoot() { cout << "Space ---------- target" << endl; }
};

// 왼쪽 미사일
class LeftMissile : public Space
{
public:
  void Shoot()
  {
      Space::Shoot(); // 기존 기능 수행.
      cout << "Left Missile : >>>>>>>>" << endl;
  }
};

int main() {
  Space s;
  s.Shoot();

	LeftMissile lm;
	lm.Shoot();
}
```

위와 같이 구축하면 될 것 같다. 즉, 레벨이 없그레이드 될 경우 `LeftMissile lm;` 객체를 만들어 미사일을 쏘도록 하면 아무 문제없이 동작한다.

그렇다면 해당 코드가 정말 아무 문제가 없을까?

만약 우리가 게임을 하는 중에 *아이템*을 획득하여, 우주선 색을 변경했다고
가정해보자. *아이템*을 획득해 색이 변한 우주선이 레벨업을 해서 왼쪽으로
미사일을 쏘는 기능을 추가해야된다고 한다면, 해당 코드는 어떻게 동작할 것인가?

![space_pic](/assets/img/space_pic.png)

위의 그림과 같이, 레벨을 업그레이드 해서 미사일이 추가될 경우 새로운 객체를
생성해 만들기 때문에 기존의 *속성*값이 유지되지 않는다. 즉, 내가 원하는 파란색
우주선이 왼쪽으로 미사일 쏘는 것이 아니라, 청록색 우주선 즉, 기본적으로
만들어지는 우주선,이 새롭게 만들어져 왼쪽으로 미사일 쏘는 것이다.

정리해보자면, 상속으로 동적인 기능을 추가할 경우 *기존 상태*가 유지 되지
않는다는 점이 있다. 따라서, 우리는 상속이 아닌 다른 방법으로 해당 기능을
구현해야한다.

### Composite (구성 혹은 포함) 방법을 통해 구현
구성을 통한 기능추가를 하는 방법은 *상속*을 통한 방법과 달리, 미사일 내 우주선을
가리키는 포인터를 멤버로 포함하는 방법이다.

```cpp
#include <iostream>
using namespace std;

class Space {
  int color;
  int speed;
public:
  void Shoot() { cout << "Space ---------- target" << endl; }
};

// 왼쪽 미사일
class LeftMissile
{
	// space를 포함해 구성하는 방식
	Space* space;
public:
	// 생성자를 통한 추가
	LeftMissile(Space* s) : space(s) {}

  void Shoot()
  {
    space->Shoot(); // 기존 기능 수행.
    cout << "Left Missile : >>>>>>>>" << endl;
  }
};

int main() {
  Space s;
  s.Shoot();

	LeftMissile lm(&s);
	lm.Shoot();
}
```

위의 방법과 같이, `LeftMissile`을 생성할 때, 기존 space를 넘겨 기능을 추가할 수
있다. 이렇게 구현할 경우, 기존의 객체의 기능은 그대로 수행하고, 새로운 기능을
추가하는 방법으로 구현할 수 있다.

상속과 달리, 우주선의 객체는 하나밖에 없고, 실제 하나의 우주선으로 동작하도록
구현되는 점에서 차이가 있다.

구성을 통한 기능 추가방식은 실행시간에 추가가 가능하기 때문에 효율적으로
사용된다. 보통 상속을 통한 기능 추가하는 방법은 *template method*에서 많이
사용되고, 일반적으로는 상속보다 유연한 구성을 통한 방법을 많이 사용한다.

위와 같은 방법으로 *Right* 미사일도 추가해 사용이 가능하다. Right 미사일을
추가하면 아래와 같다.

```cpp
...

// 오른쪽 미사일
class RightMissile
{
	// space를 포함해 구성하는 방식
	Space* space;
public:
	// 생성자를 통한 추가
	RightMissile(Space* s) : space(s) {}

  void Shoot()
  {
    space->Shoot(); // 기존 기능 수행.
    cout << "Right Missile : >>>>>>>>" << endl;
  }
};

int main() {
  Space s;
  s.Shoot();

	LeftMissile lm(&s);
	lm.Shoot();

	RightMissile rm(&s);
	rm.Shoot();
}
```

위와 같이 코드를 작성하면, *Right* 미사일도 문제없이 동작한다. 그럼 그냥
Composite 패턴으로 사용하면 되지? 왜 *데코레이터 패턴*을 적용해야되는가? 의문을
가질 수 있다. 그리고 *Decorator* 패턴은 배우지도 않는데, 왜 여기서 이걸
설명하는거지? 라고 생각할 수 있다.

*여기서 하나 더 나아가 생각해보자*

만약 우주선의 레벨이 업그레이드 될 때, 왼쪽 미사일을 장착하는 것과 오른쪽
미사일을 장착하는게 동시에 일어나게 만들려면 어떻게 해야하는가?

즉, 위의 코드는 레벨이 올라갈 때 마다 왼쪽, 오른쪽 순차적으로 장착하는게 가능한
코드이다. 만약 *동시에* 장착해야된다고 게임을 구성하면, 해당 코드는 정상적으로
동작할 수 있을까?

불가능하다. 구조를 좀 더 변경해야할 필요가 있다.
