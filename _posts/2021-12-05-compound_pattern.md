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

위의 특징을 기반으로 코드를 작성해보자.

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
```

시뮬레이션을 위한 코드 부분

```java
// 코드가 길어져 일부분은 생략함
// 자세한 코드는 HeadFirst를 참고하자.
public class DuckSimulator {
    public static void main(String[] args) {
        DuckSimulator simulator = new DuckSimulator();
        simulator.simulate();
    }

    void simulate() {
        Quackable mallardDuck = new MallardDuck();
				...

        System.out.println("\nDuck Simulator");
        simulate(mallardDuck);
				...
    }
    void simulate(Quackable duck) {
        duck.quack();
    }
}
```

### 문제1

> 🙋 위의 오리 시뮬레이터는 잘 작동한다. 만약 거위를 추가하려면 어떻게 해야할까? 해당 문제를 해결하기 위해 가장 적절한 패턴은 무엇일지 생각해보자.

해답은 *"어뎁터 패턴"* 이다.
- 한 인터페이스를 다른 인터페이스로 변환하기 위한 용도로 사용 됨.
- 가장 쉽게 떠올려 볼 수 있는 예시는 "여행 갔을 때, 콘센터 어뎁터"를 떠올려 볼 수 있음.

<span class="Tip">Tip </span>여기서 중요한 점은 "해답"이라고 이야기한 점이다. 디자인 패턴은 정답이 존재하지 않는다. 설계의 차이이고, 접근의 관점 차이이기 때문에 당시 시점에 가장 적절한 행위를 가져다 쓰면 된다는 점을 기억하자.

위의 문제를 해결하기 위한 코드를 작성해보자.

*🌱 코드*
아래의 거위 코드가 있다고 가정해보자.

```java
// 거위 추가
// DuckSimulator <--- Adaptor ---> Goose
public class Goose {
    public void honk() {
        System.out.println("Honk");
    }
}
```

위의 거위 코드를 "오리 시뮬레이터"에서 작동하기 위해서는 *Quackable*
인터페이스를 구축하는 Adaptor를 작성해야한다.

```java
public class GooseAdaptor implements Quackable {
    Goose goose;

    public GooseAdaptor(Goose goose) {
        this.goose = goose;
    }

    @Override
    public void quack() {
        goose.honk();
    }
}
```

### 문제2

> 🙋 위의 시뮬레이터를 통해 만들어진 오리들의 구체적 연구를 위해, "꽥꽥"의
> 소리를 기록하고 싶다. \
> 이럴 경우 어떻게 코드를 구성해야되며, 어떤 패턴을 사용해야될까?

해답은 "데코레이터 패턴"을 사용하면 된다.
- 주어진 상황 및 용도에 따라 어떤 객체에 책임을 덧붙이는 패턴으로 기능 확장이
필요할 때 서브클래스 대신 쓸 수 있음
- 쉽게 생각할 수 있는 예시로 "스타벅스 드리즐 추가"를 떠올릴 수 있음.
	- 기존의 커피에 드리즐이라는 데코를 씌우는 상황

*🌱 코드*
오리를 카운팅할 수 있는 코드를 작성해보자.

```java
public class QuackCounter implements Quackable{
    Quackable duck;
    // 모든 오리들을 횟수를 세기 위함. 별개로 세고 싶다면, static 사용 안해도 됨.
    static int numberOfQuacks;

    public QuackCounter( Quackable duck) {
        this.duck = duck;
    }

    @Override
    public void quack() {
        duck.quack();
        numberOfQuacks++;
    }

    // static 으로 반환해야하나?
    public static int getQuacks() {
        return numberOfQuacks;
    }
}
```

작성한 코드를 활용해, simulator에서 데코를 완성해보자.

```java
...

void simulate() {
        // 드리즐 추가를 생각해봅시다.
        Quackable mallardDuck = new QuackCounter(new MallardDuck());
        Quackable redheadDuck = new QuackCounter(new RedheadDuck());
        Quackable duckCall = new QuackCounter(new Duckcall());
        Quackable rubberDuck = new QuackCounter(new RubberDuck());
				...
}

...
```

### 문제3
> 🙋 사용자가 시뮬레이터에 새로운 오리를 추가하다가, 데코하는 부분을 빼먹을수도
> 있습니다. \
> 해당 부분을 수정하기 위해선 어떤 접근을 해야될까요?

해답은 *팩토리패턴*이다.
- 추상팩토리 패턴을 활용해 만들어보자.
- "생성"을 캡슐화 하기 위한 패턴, 공장을 생각하면 쉽게 이해할 수 있음.

*🌱 코드*
Factory를 구축하기 위한 Interface 코드이다.

```java
public abstract class AbstractDuckFactory {
    public abstract Quackable createMallardDuck();
    public abstract Quackable createRedheadDuck();
    public abstract Quackable createDuckCall();
    public abstract Quackable createRubberDuck();
}
```

해당 인터페이스를 갖고 있으면, DuckFactory로 만들 수 있다. 우리는 Counting을
담당하는 Factory와 일반적인 Factory를 두 개 만들고자 한다.

```java
// Counting 담당
public class CountingDuckFactory extends AbstractDuckFactory{
    @Override
    public Quackable createMallardDuck() {
        return new QuackCounter(new MallardDuck());
    }
		...
}
```

일반 Factory 코드이다.

```java
public class DuckFactory extends AbstractDuckFactory{

    @Override
    public Quackable createMallardDuck() {
        return new MallardDuck();
    }
		...
}
```

시뮬레이터도 아래와 같이 바뀌게 된다. 즉, 시뮬레이터에서 데코할 필요 없이,
	팩토리만 불러주면 자동으로 Counting 될 수 있는 코드가 만들어지며, 좀 더
	신뢰성이 올라가게 된다.

```java
public class DuckSimulator {
    public static void main(String[] args) {
        DuckSimulator simulator = new DuckSimulator();
				// 원하는 팩토리 생성
        AbstractDuckFactory duckFactory = new CountingDuckFactory();

        simulator.simulate(duckFactory);
    }

    void simulate(AbstractDuckFactory duckFactory) {
        // 드리즐 추가를 생각해봅시다.
        Quackable mallardDuck = duckFactory.createMallardDuck();
        Quackable redheadDuck = duckFactory.createRedheadDuck();
				...
		}
		...
}
```

### 문제4
> 🙋 여러 오리들에 대해 한꺼번에 묶어서 작업할 수 있는 방법이 있을까요?
> 예를들면, 특정오리만 빼서 연구하고 싶을때가 있는데요.. \
> 해당 부분을 만들기 위해서는 어떤 접근을 해야될까요?

해답은 *컴포지트 패턴*이다.
- 부분에서 일부부만 빼내는 기법.

*🌱 코드*
`ArrayList`를 활용해 오리떼를 묶을 수 있도록 한 코드이다.

```java
public class Flock implements Quackable{
    ArrayList quackers = new ArrayList();

    public void add(Quackable quacker) {
        quackers.add(quacker);
    }
    @Override
    public void quack() {
        Iterator iterator = quackers.iterator();
        while (iterator.hasNext()) {
            Quackable quacker = (Quackable) iterator.next();
            quacker.quack();
        }
    }
}
```

시뮬레이터 코드이다.
```java
void simulate(AbstractDuckFactory duckFactory) {
        // 드리즐 추가를 생각해봅시다.
        Quackable redheadDuck = duckFactory.createRedheadDuck();
        Quackable duckCall = duckFactory.createDuckCall();
        Quackable rubberDuck = duckFactory.createRubberDuck();

        // Adaptor!!!
        Quackable gooseDuck = new GooseAdaptor(new Goose());

        System.out.println("\nDuck Simulator");

        Flock flockOfDucks = new Flock();

        flockOfDucks.add(redheadDuck);
        flockOfDucks.add(duckCall);
        flockOfDucks.add(rubberDuck);
        flockOfDucks.add(gooseDuck);
				...
}
```

### 문제5
> 마지막이다. 오리가 "꽥꽥" 호출할 때마다 연구원에게 알려줄 수 있는 방법이
> 있을까?

해답은 *옵저버패턴*을 활용하면 된다.
- 엑셀을 떠올리면 쉽다.
- 옵저버는 변화가 있을 경우 변화에 대해 알려주기 위해 사용함.

옵저버 되는 대상

```java
public interface QuackObserverable {
    public void registerObserver (Observer observer);
    public void notifyObservers ();
}

public class Observerable implements QuackObserverable{
    ArrayList observers = new ArrayList();
    QuackObserverable duck;

    public Observerable(QuackObserverable duck) {
        this.duck = duck;
    }

    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void notifyObservers() {
        Iterator iterator = observers.iterator();
        while (iterator.hasNext()) {
            Observer observer = (Observer) iterator.next();
            observer.update(duck);
        }
    }
}
```

위의 코드를 오리 내 구현하면 됨

```java
public class MallardDuck implements Quackable {
    Observerable observerable;
    public MallardDuck() {
        observerable = new Observerable(this);
    }
    @Override
    public void quack() {
        notifyObservers();
    }

    @Override
    public void registerObserver(Observer observer) {
        observerable.registerObserver(observer);
    }

    @Override
    public void notifyObservers() {
        observerable.notifyObservers();
    }
}
```

### 대표적인 컴파운드 패턴
우리가 흔히 사용하는 것중에 가장 대표적으로 쓰이는 Compound Pattern은 MVC
모델이다.

MVC 패턴
- Model
	- 어플리케이션 데이터, 자료를 의미함.
- View
	- 사용자에게 보여지는 부분, UI
- Controller
	- Model 과 View 사이를 이어주는 역할

적용된 패턴
- Strategy Pattern
	- View, Controller
	- Controller를 인터페이스화 하고, View를 구성으로 구축함.

- Composite Pattern
	- View를 구성하는 컴포넌트들이 계층구조를 이루도록 함.

- Observer Pattern
	- Model의 상태가 변경되었을 경우, View에게 해당 내용을 알려줌.

