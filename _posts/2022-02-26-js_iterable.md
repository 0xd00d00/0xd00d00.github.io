---
layout: post
author: doodoo
title: "[Javascript] 이터러블"
subtitle: "ES6 에서 도입된 이터러블에 대해 알아보자 🤓"
date: 2022-02-26
cover: /assets/img/default.png
tags: Javascript DeepDive
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 JS 이터러블 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 이터레이션 프로토콜
ES6 에서 도입된 이터레이션 프로토콜은 순회 가능한 데이터 컬렉션을 만들기 위해 ECMAScript에서 정의하여 미리 약속한 규칙이다.

ES6 이전의 순회 가능한 데이터 컬렉션 (e.g. 배열, 문자열, 유사배열 객체 등)들은 통일된 규약없이 순회하는 구조 *for문*, *for ... in 문*, *forEach* 등과 같은 방법으로 순회할 수 있었다.

ES6 부터는 순회 가능한 데이터 컬렉션은 *이터레이션 프로토콜*을 준수하는 *이터러블*로 통일하여 순회하는 구조를 *for ... of 문*으로 통일했다. 추가적으로, 이터레이션 프로토콜을 준수하는 데이터 컬렉션은 *스프레드 문법* 과 *배열 디스트럭처링 할당*을 사용할 수 있도록 일원화 했다.

이터레이션 프로토콜은 *이터러블 프로토콜*  과 *이터레이터 프로토콜* 2 규약을 만족하는 프로토콜을 말한다.

#### 이터러블 프로토콜
`Symbol.iterator`를 프로터피 키로 사용한 메서드를 직접 구현하거나 프로토 타입 체인을 통해 상속 받아 `iterator`를 호출할 경우 *이터레이터*를 반환하도록 하는 규약이다.

이터러블 프로토콜을 준수한 객체를 우리는 *이터러블*이라고 부른다. *이터러블*은 앞서 이야기 한 것과 같이 *for ... of 문*으로 순회 가능하며, 스프레드 문법 과 배열 디스트럭처링 할당 등을 사용할 수 있다.

#### 이터레이션 프로토콜
*이터러블*을 통해 반환 받는 객체인 *이터레이터*란 *이터레이션 프로토콜*을 준수하는 객체를 말한다.

*이터레이터*가 되는 조건 즉, 이터레이션 프로토콜 규약은 `next` 메서드가 존재하고, 해당 메서드를 호출 할경우 `value`, `done` 프로퍼티를 갖는 *이터레이터 리절트 객체*를 반환 받도록 하는 것이다.

*이터레이터*는 이터러블 요소를 탐색하기 위한 "포인터 역할" 을 담당한다.

아래의 그림을 통해 *이터레이션 프로토콜*의 구조를 이해해보자.

![js_iterable](/assets/img/js_iterable.png)

#### 이터러블 예시
*이터러블*은 *이터러블 프로토콜*을 만족한다는 뜻이고, `Symbol.iterator`의 반환값으로 *이터레이션 프로토콜*을 만족하는 *이터레이터*를 반환받는다는 뜻이다.

ES6 부터 Array 같은 경우 이터러블 하도록 구현됐다. `Array.prototype`의 `Symbol.iteraotr` 메서드를 상속받기 때문에 *이터러블* 하다고 할 수 있다.

따라서, `for .. of 문`으로 순회가 가능하며, 반환받는 *이터레이터 객체*도 활용할 수 있다.

```js
const array = [1, 2, 3];

// true
console.log(Symbol.iterator in array);

for (const item of array) {
	// iterator 객체의 value 값을 item에 담아줌
	// for ... of 설명을 참고하도록 하자.
	console.log(item);
}

// Symbol.iterator 메서드는 이터레이터 반환
const iterator = array[Symbol.terator]();

// next 메서드를 호출하면 이터레이터 리절트 객체를 반환
// 이터레이터 리절트 객체의 구조
//  { value, done }
//  value - 값
//  done - 순회할 대상이 남았는지 확인.. 마지막 값만 true
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 이터레이션 프로토콜의 필요성
위에서 본 것과 같이, 이터레이션 프로토콜  활용하는 방법은 알 것 같다. 근데 왜 우리가 사용을 해야되는가에 대해 자세히 알아보자.

ES6 이전의 순회가능한 데이터 컬렉션 (e.g. 배열, 문자열, 유사배열 객체)은 통일된 규약 없이 각자 나름의 구조를 가지고 순회하는 방법 (e.g. for문, for .. in 문, forEach문) 들을 만들었다.

각자 나름의 구조를 갖고 만든 순회 방법을 사용하는데는 무리가 없다. 하지만 실제 순회라는 API를 사용하는 *데이터 소비자* 입장에서 생각해보자.

*데이터 소비자*가 데이터 컬렉션을 순회하기 위해 `for문`을 사용했었다. 훗날 새로운 데이터 컬렉션 API가 새롭게 등장했는데, `for .. in문` 을 이용해야지 순회가 가능하다고 할 경우 *데이터 소비자* 입장에서는 "기존에 순회하는 방법은 `for문`을 사용했는데?" 라는 혼란이 올 수 있다. 또 훗날 새로운 데이터 컬렉션 API가 새롭게 등장했는데 이번에는 `forEach 문`을 활용해야만 순회가 가능하다고 할 때 *데이터 소비자* 입장에서는 또 혼란이 발생한다.

이런 혼란들을 막기 위해 Javascript는 순회에 대한 API 통일성을 부여하고자 규칙을 만들었다. 그 규칙이 바로 *이터레이션 프로토콜* 이다.

따라서, 새로운 데이터 컬렉션을 만들 때 순회는 *이터레이션 프로토콜*을 따라서 만들도록 하며, *데이터 소비자*는 순회는 `for .. of 문`을 통해 하도록 유도할 수 있다.

### for ... of 문
`for .. of` 문은 이터러블을 순회하면서 이터러블 요소를 변수에 할당한다. `for ... of` 문법에 대해 자세히 알아보자.

```js
for (변수선언문 of 이터러블) { ... }

for (변수선언문 in 객체) { ... }
```

`for ... of`문 과 `for ... in`문은 생김새가 매우 비슷하다. 하지만 두 문법의 동작 원리는 무척 다르다.

*for ... in 문*

`for ... in`문은 객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중 `[[Enumerable]]` 값이 `true`인 친구를 모두 열거하도록 한다. 이떄 프로퍼티 키가 `Symbol`인 친구들은 제외한다.

*for ... of 문*

앞서 이야기한 것과 같이 *이터레이션 프로토콜*을 준수하는 데이터 컬렉션에 대해서만 순회가 가능하다.

구체적으로, `for ... of` 내부적으로는 이터레이터를 반환받고, `next` 메서드를 호출해 이터러블을 순회한다. `next` 메서드가 반환한 *이터레이터 리절트 객체*의 `value` 값을 `for ... of`문의 변수값에 할당한다.

*이터레이터 리절트 객체*의 `done` 프로퍼티 값이 `false`이면 이터러블을 계속 순회하고, `true`이면 이터러블 순회를 중단한다.

```js
for (const item of [ 1, 2, 3 ]) {
	// item 에 next() 호출해 value 값을 담아준다.
	console.log(item)
}
```

위의 예시를 `for`문을 활용해서 표현해보면 아래와 같다.

```js
// for ... of 동일한 동작
const iterable = [ 1, 2, 3 ];

const iterator = iterable[Symbol.iterator]();

for (;;) {
	const res = iterator.next();

	// done 이 true일 경우 순회 종료
	if (res.done) break;

	const item = res.value;
	console.log(item);
}
```

### 사용자 정의 이터러블
아래의 예시를 보자.

```js
const obj = { a: 1, b: 2 };

// false..
// 이터레이션 프로토콜 준수 x
console.log(Symbol.iterator in obj);

// for ... of 사용 불가능
for (const item of obj) { // TypeError..
	console.log(item);
}
```

일반 객체같은 경우 이터레이션 프로토콜을 준수하지 않는다. 일반 객체를 이터러블 하게 만들 수 있을까?

Javascript에서는 일반 객체도 이터레이션 프로토콜을 정의하여 이터러블하게 만들 수 있으며 이를 *사용자 정의 이터러블*이라고 한다.

`fibonacci` 수열을 *사용자 정의 이터러블* 하게 만들어보자.

```js
const fibonacci = {
	[Symbol.iterator]() {
		let [pre, cur] = [0 , 1];
		const max = 10;

		return {
			next() {
				[pre, cur] = [cur, pre + cur];

				return { value: cur, done: cur >= max };
			}
		};
	}
};

for (const num of fibonacci) {
	// 1 2 3 5 8
	console.log(num);
}
```

사용자 정의 이터러블 구현은 이터레이션 프로토콜을 준수하도록 하면 되기 때문에 간단하다.

*이터레이션 프로토콜*
- `Symbol.iterator` 메서드 구현
- `iterator` 반환 (next 메서드 존재, 이터레이터 리절트 객체 반환)

### 이터러블 지연평가
일반적으로 사용하는 데이터 컬렉션 (e.g. 배열, 문자열)등은 모든 데이터를 메모리에 미리 확보한 다음 데이터를 공급한다. 하지만 *이터러블* 같은 경우 *지연평가 (lazy evaluation)*을 통해 데이터가 생성된다.

*지연평가 (lazy evaluation)*란 데이터가 필요한 시점 이전까지는 미리 데이터를 생성하지 않다가 데이터가 필요한 시점에 생성하는 기법이다. 즉, 평가가 될 때까지 최대한 미루는 기법이다.

예를들어, 이터러블을 활용해 `for .. of`문을 수행할 경우 내부에서 `next()`를 통해 메서드를 호출할 시점까지 데이터를 준비하지 않고 있다가 호출 할 경우 그 시점에 평가 즉, 데이터를 생성한다.

이터러블은 *지연평가 (lazy evaluation)*을 사용하기 때문에 불필요한 데이터를 미리 생성하지 않고 필요한 데이터를 필요한 순간에 생성하므로 *바른 실행 속도*를 기대할 수 있고 *불필요한 메모리 소비*도 하지 않는다는 장점이 있다.

다만, `next()`수행 시 동작이 오래 걸릴 경우 전체적인 성능이 떨어질 수 있다.

