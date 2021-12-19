---
layout: post
author: doodoo
title: "[Javascript] 생성자 함수"
subtitle: "new 연산자를 활용한 생성자 함수에 대해 알아보자. 👀"
date: 2021-12-19
cover: /assets/img/default.png
tags: Javascript DeepDive
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 함수 객체 개념에 대해 알아보겠습니다.

해당 내용은 [DeepDive 도서](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=251552545)를 활용해 정리했습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다! 

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Intro.
오늘은 생성자 함수에 대해 알아보고자 한다.

생성자 함수를 알아보기 전에, 알아야할 필수 내용 몇 가지를 정리해보자.

*🌱 함수 정의 방식*

함수 정의란 함수를 호출하기 이전에 인수를 전달받을 매개변수와 실행할 문들 그리고 반환할 값을 지정하는 것을 말한다. 정의된 함수는 JS 엔진에 의해 평가되어 함수 객체가 된다.<br>
함수를 정의하는 방식은 총 4가지이다.

1. 함수 선언문

	```js
	function add(x,y) {
		return x + y;
	}
	```

2. 함수 표현식

	```js
	var add = function(x,y) {
		return x + y;
	}
	```

3. Function 생성자 함수

	```js
	var add = new Function('x', 'y', 'return x + y');
	```

4. 화살표 함수(ES6)

	```js
	var add = (x, y) => x + y;
	```

총 4가지 방법을 통해 함수를 정의할 수 있다. ES6 이전의 함수 정의 방식은 "생성"과 "호출" 두 가지를 모두 담당하고 있다. (해당 내용은 아래에서 더 자세하게 다룬다.)

*🌱 this바인딩*

JS에서는 "this 바인딩" 이라는 중요한 개념이 존재한다. 해당 부분은 추가로 다루기로 하자. 우선, this 바인딩에 대한 핵심 개념만 집고 넘어가보자.

함수 호출 시, this가 가리키는 행위를 우리는 "this 바인딩" 이라고 한다. 호출 시점에 따라 this 바인딩으로 연결된  "가리키는 대상"이 다르다.

1. 일반 함수 호출
	- this는 "전역 객체"를 가리킴.
	- 브라우저 에서 전역객체는 "window" 이다.

2. 메서드 호출
	- 메서드는 "호출한 객체" 를 가리킴.
	- 객체에 존재하는 함수를 우리는 메서드라고 한다.
	- JS에서는 ES6에 나오는 "축약 표현"을 사용하는 함수를 "메서드" 라고 정의 한다.

3. 생성자함수 호출
	- 생성자 함수는 "생성된 인스턴스" 를 가리킴.
	- 생성자 함수는 "new" 연산자와 함께 "객체" 를 만들게 된다. 우리는 해당 객체를 "인스턴스" 라고 정의한다.

### 생성자함수
*생성자 함수란?*

"new" 연산자와 함께 호출하여 "객체"를 생성하는 함수를 말한다. 위에서 잠시 언급한 것과 같이, new "생성자 함수"를 통해 생성된 객체를 우리는 "인스턴스" 라고 부른다.

이와 별개로, 자바스크립트에서는 Object, String, Number, Boolean 등과 같은 별도의 빌트인 생성자 함수를 제공한다. 해당 생성자 함수를 이용해 객체를 만들 수 있다.

```js
const person = new Object();

person.name = 'nerdoo';

person.sayHello() {
	console.log('Hi! My name is ' + this.name);
};

console.log(person);
```

위와 같이, `Object` 라는 빌트인 생성자 함수를 이용해 "빈 객체"를 생성하고, 우리가 원하는 "프로퍼티"를 입력해 객체처럼 사용도 가능하다.

### 생성자 함수 사용이유
생성자 함수의 사용방법은 위를 통해 알게 됐다. 그렇다면 *왜 우리는 생성자 함수를 사용해야되는가?*에 대해 알아보도록 하자.

객체를 생성하는 방법은 2가지이다.

1. 리터럴 표현식

```js
const circle = {
	radius: 5,
	getDiameter() {
		return 2 * this.radius;
	}
};

console.log(circle.getDiameter());
```

위와 같이, 사람이 이해하기 편한 "{}" 를 통해 객체를 생성하는것을 우리는 "리터럴 표현식"이라고 부른다.

2. 생성자 함수 표현식

```js
function Circle(radius) {
	// 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킴
	this.radius = radius;
	this.getDiameter = function () {
		return 2 * this.radius;
	};

	// return {};
};

const circle1 = new Circle(10);
console.log(circle1.getDiameter());
```

위의 방식은 "생성자 함수"를 사용한 객체 생성 방식이다.

언뜻 보면, "리터럴 표현식" 이 "생성자함수" 방식보다 객체 생성하기가 편해보이는데, 왜 생성자 함수를 이용해서 "객체" 를 생성해야될까?

"객체가 많아 질 경우" 를 생각해보면 쉽게 이해할 수 있다.

예를 들어, Circle이라는 객체가 100개가 필요하다고 해보자. 그럴 경우 Literal 객체 같은 경우 함수가 100개가 필요해진다.

```js
const circle1 = {
	radius: 5,
	getDiameter() {
		return 2 * this.radius;
	}
};

console.log(circle1.getDiameter());

const circle2 = {
	radius: 10,
	getDiameter() {
		return 2 * this.radius;
	}
};

console.log(circle2.getDiameter());

...

const circle100 = {
	radius: 525,
	getDiameter() {
		return 2 * this.radius;
	}
};

console.log(circle100.getDiameter());
```

위의 코드를 보자. 100개의 객체를 만들 경우 `radius` 값을 제외한 `getDiameter()` 함수는 "중복" 되고 있다는 사실을 알 수 있다. 즉, 불필요한 중복으로 인해 객체를 생성할 떄마다 "함수" 를 추가로 만들게 되고, 메모리 낭비가 극심하게 발생하는 것을 볼 수 있다.

그렇다면 `radius`를 제외한 함수는 매번 만들 필요 없이 객체를 생성할 방법이 없을까?

그래서 나온 방법이 *생성자 함수*를 활용한 객체 생성 방법이다.

```js
function Circle(radius) {
	// 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킴
	this.radius = radius;
	this.getDiameter = function () {
		return 2 * this.radius;
	};

	// return {};
};

const circle1 = new Circle(10);
console.log(circle1.getDiameter());

const circle2 = new Circle(25);
console.log(circle1.getDiameter());

...

const circle100 = new Circle(525);
console.log(circle1.getDiameter());
```

위 코드를 보면, 함수를 중복적으로 생성하지 않고 상태 값만 전달하여 객체를 생성하는 것을 볼 수 있다.

### 생성자 함수의 인스턴스 생성과정
생성자 함수는 내부적으로 어떻게 객체화 될까?

1. 생성과 this 바인딩
- `new` 연산자와 함꼐 호출
- 암묵적으로 "빈 객체 (Empty)" 생성
- `this`를 해당 객체에 *바인딩*

2. 인스턴스 초기화
- 생성자 함수에 정의 된 코드를 통해 초기화 됨.
- 인자를 전달받아 값을 초기화 할수도 있음.

3. 인스턴스 반환
- 모든 처리가 끝나면 암묵적으로 this가 반환됨.
	- return this;
- 만약 빈 객체라면 `{}` 키워드를 통해 반환됨.
	- return {};

### 일반함수와 생성자함수를 어떻게 구별할까?
자바스크립트는 어떻게 내부적으로 일반함수와 생성자함수를 구별할까?

ECMAScript에서는 구별하기 위해 "내부 슬롯"을 가지고 있다.

ES6 이전에는 일반함수와 생성자함수를 구별할 수 없었다. 즉, 함수를 생성하면 "생성 및 호출" 둘 다 가능했다. 이와 같이 구성될 경우 예상치 못한 문제가 발생하는데, 객체 내 메소드를 "생성" 하는 기이한 현상이 발생하게 된다.

추가로, this 바인딩이 문제가 되는데, 해당 문제는 추후 다루도록 하자.

이를 막고자 ES6 부터는 "호출만 가능" 하도록 하는 함수들을 추가했다.
따라서, 아래의 그림과 같이, ES6 이후부터는 "호출만 가능한 함수"와 "생성 호출 둘 다 가능한 함수"로 나눠서 정의할 수 있다.

![js_constructor](/assets/img/js_constructor.png)

*생성 및 호출 둘 다가능한 함수*

- 함수 선언문
- 함수 표현식

우리가 일반적으로 사용했던 함수 및 생성자 함수 같은 경우 "생성 과 호출" 둘 다 가능하다.

*호출만 가능한 함수*

- ES6 화살표함수
- 메서드
	- ES6에서 새롭게 추가된 "축약표현"을 사용한 객체 내 함수를 의미함.

구별되는건 알겠다. 그렇다면 내부적으로는 어떻게 구별하고 있을까?

```cpp
bool v8::Object::IsCallable() {
  auto self = Utils::OpenHandle(this);
  return self->IsCallable();
}

bool v8::Object::IsConstructor() {
  auto self = Utils::OpenHandle(this);
  return self->IsConstructor();
}


...

MaybeHandle<Object> Object::GetMethod(Handle<JSReceiver> receiver,
                                      Handle<Name> name) {
  Handle<Object> func;
  Isolate* isolate = receiver->GetIsolate();
  ASSIGN_RETURN_ON_EXCEPTION(
      isolate, func, JSReceiver::GetProperty(isolate, receiver, name), Object);
  if (func->IsNullOrUndefined(isolate)) {
    return isolate->factory()->undefined_value();
  }
  if (!func->IsCallable()) {
    THROW_NEW_ERROR(isolate,
                    NewTypeError(MessageTemplate::kPropertyNotFunction, func,
                                 name, receiver),
                    Object);
  }
  return func;
}
```

V8 내부 엔진을 보면, `IsConstructor` 와 `IsCallable` 이라는 함수가 존재한다. 해당 함수를 이용해서 생성 및 호출을 확인한다. 일례로, Object 내 `GetMethod()` 에서 해당 함수가 `IsCallable` 즉, 호출되지 않을 수가 없기 때문에 해당 값이 `false`일 경우 "에러 처리" 하는 것을 확인할 수 있다.

