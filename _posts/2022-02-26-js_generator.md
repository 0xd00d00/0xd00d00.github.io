---
layout: post
author: doodoo
title: "[Javascript] 제너레이터와 async/await"
subtitle: "비동기 처리와 yield에 대해 알아보자 🙃"
date: 2022-02-26
cover: /assets/img/default.png
tags: Javascript DeepDive
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 제너레이터와 async/await 개념에 대해 알아보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 제너레이터란?
ES6에서 도입된 제너레이터는 *코드 블록의 실행을 일시 중지 했다가 필요한 시점에 재개*할 수 있는 특수한 함수를 말한다.

> *제너레이터와 일반함수 차이 👻*
<br>
*🌱 제너레이터 함수는 함수 호출자에게 함수 실행의 제어권을 양도할 수 있다.* <br>
일반함수를 호출하면 제어권이 함수에 넘어가고, 함수 코드는 일괄 실행 된다. 반면에 제너레이터 함수는 함수 제어권을 함수가 *독점* 하는 것이 아니라 함수 호출자에게 양도(yield) 할 수 있다.
<br><br>
*🌱 제너레이터 함수는 함수 호출자와 함수의 상태를 주고 받을 수 있다.*
<br>
제너레이터 함수는 함수 호출자에게 상태를 전달하고 함수 호출자로 부터 상태를 전달 받을 수 있다. (제어권 양도가 가능하기 때문)
<br><br>
*🌱 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.*
<br>
일반 함수를 호출하면 함수 코드를 일괄 실행하고 값을 반환한다. 제너레이터 함수를 호출하면 함수 코드를 실행하는 것이 아니라 *이터러블 이면서 동시에 이터레이터인* 제너레이터 객체를 반환한다.

### 제너레이터 함수의 정의
제너레이터 함수를 사용하기 위해서는 `function*` 키워드로 선언해야되며, `yield` 표현식을 *하나 이상* 포함해야된다.

```js
// 제너레이터 함수 선언
function* genDecFunc() {
	yield 1;
}

const genExpFunc = function* () {
	yield 1;
};

const obj = {
	* genObjMethod() {
		yield 1;
	}
};

// 제너레이터 클래스 메서드 선언방법
class MyClass {
	* genClsMethod() {
		yield 1;
	}
};
```

제너레이터 함수를 선언하기 위한 `* (애스터리스크)`의 위치는 `function` 키워드와 함수 이름 사이라면 어디든지 상관없다. 다만, 일관성을 유지하기 위해 `function`키워드 바로 뒤에 붙이는 것을 권장한다.

제너레이터 함수를 사용할 수 없는 경우는 아래와 같다.

```js
// 화살표 함수
const genArrowFucn = * () => {
	yield 1;
};

// new 연산자와 함께 생성자 함수로 호출할 경우
function* genFunc() {
	yield 1;
}

new genFunc();
```

### 제너레이터 객체
제너레이터 함수를 호출하면 일반함수 처럼 함수 코드 블록을 실행하는 것이 아니라 *제너레이터 객체를 생성해 반환*한다. 앞서 이야기 했지만, 제너레이터 함수가 반환한 제너레이터 객체는 *이터러블* 이면서 동시에 *이터레이터*이다.

다시 말해, 제너레이터 객체는 `Symbol.iterator` 메서드를 상속받는 이터러블 이면서 `value`, `done` 프로퍼티를 갖는 이터레이터 리절트 객체를 반환하는 `next` 메서드를 소유하는 이터레이터이다.

제너레이터 객체는 `next` 메서를 가지는 이터레이터 이므로, `Symbol.iterator` 메서드를 호출해 별도로 이터레이터 객체 즉, 이터레이터 프로토콜을 만드려 하지 않아도 된다.

<span class="tip">Tip</span> 혹시 이터레이터를 잘 모르겠다면 [여기](https://0xd00d00.github.io/2022/02/26/js_iterable.html)를 클릭해 알아보자.

```js
function* genFunc() {
	yield 1;
	yield 2;
	yield 3;
}

// 제너레이터 함수를 호출하면 제너레이터 객체 반환
// 제너레이터 객체는 -> 이터러블 + 이터레이터
const generator = genFunc();

// true
console.log(Symbol.iterator in generator);

// true
// 이터레이터 이기 때문에 next 메서드를 가짐
console.log('next' in generator);
```

제너레이터 객체는 `next` 메서드를 갖는 이터레이터이지만 이터레이터에는 없는 `return`, `throw` 메서드도 갖고 있다는 점을 기억하자.

*🌱 이터레이터 return 예시*

`return` 메서드를 호출하면 인수로 전달받은 값을 `value`프로퍼티 값으로 전달하고, `done` 프로퍼티 값을 `true`로 변경해 이터레이터 동작을 종료한다.

```js
function* getFunc() {
	try {
		yield 1;
		yield 2;
		yield 3;
	} catch(e) {
		console.log(e);
	}
}

const generator = getFunc();

console.log(generator.next());
// {value: 'End!', done: true}
console.log(generator.return('End!'));
```

*🌱 이터레이터 throw 예시*

`throw` 메서드를 호출하면 인수로 전달받은 *에러를 발생*시키고 `value` 값으로 `undefined`를 `done` 값으로 `true`를 주어 이터레이터 동작을 종료한다.

```js
function* getFunc() {
	try {
		yield 1;
		yield 2;
		yield 3;
	} catch(e) {
		console.log(e);
	}
}

const generator = getFunc();

console.log(generator.next());
// {value: 'undefined', done: true}
console.log(generator.throw('Error!'));
```

### 제너레이터의 일시 중지와 재개
제너레이터는 `yield` 키워드와 `next()` 메서드로 실행을 일시정지 했다가 재개할 수 있다. 일반 함수는 호출 이후 제어권을 *함수가 독점*하지만 제너레이터 함수는 함수 호출자에게 제어권을 양도하여 필요한 시점에 함수 실행을 제어할 수 있다.

제너레이트 함수의 큰 특징은 `yield` 표현식까지만 실행한다. `yield` 키워드는 제너레이터 함수의 실행을 일시 중지시키거나 `yield` 키워드 뒤에 오는 표현식의 평과 결과를 제너레이터 *함수 호출자 에게 반환*한다.

```js
function* genFunc() {
	yield 1;
	yield 2;
	yield 3;
}

const generator = getFunc();

// { value: 1, done: false }
// done이 false라는 것은 아직 진행할 것이 남았다는 것.
// value 는 yield 하기 전 값을 담아 넘겨 줌.
console.log(generator.next());
// { value: 2, done: false }
console.log(generator.next());
// { value: 3, done: false }
console.log(generator.next());
// { value: undefined, done: true }
console.log(generator.next());
```

위의 코드를 보면 이터레이터에서 했던 것 처럼 `next` 메서드로 이터러블을 얻어오는 것과 같다. 다만, 제너레이터 함수는 `yield`라는 키워드 기반으로 움직이기 때문에 `next` 메서드를 요청하면 함수의 제어권이 함수로 넘어가 `yield`가 있을 때 까지 수행 된다.

아래와 같이 일시 중지와 재개를 반복적으로 수행한다.
> generator.next() -> yield -> generator.next() -> yield -> generator.next() -> yield -> return

이때, `next` 값으로 함수에 *인자 값을 전달*할 수 있다.

```js
function* genFunc() {
	// 여기에 10이 들어옴.
	const x = yield 1;
	yield2;
}

const generator = genFunc(0);

// 처음 호출하는 next 메서드에는 인수를 전달하지 않음.
// 만약 전달해도 무의미함.
let res = generator.next();
console.log(res); // { value: 1, done: false }

// next 에 10이라는 인자 전달.
res = generator.next(10);
console.log(res);

...

```

#### 제너레이터 활용
제너레이터 함수를 사용하면 이터레이션 프로토콜을 준수해 이터러블을 생성하는 방식보다 간단히 이터러블을 구현할 수 있다.

이터레이션 프로토콜을 준수하여 무한 피보나치 수열을 생성하는 함수를 구현해보자.

```js
const infiniteFibonacci = (function() {
	let [pre, cur] = [ 0, 1 ];

	return {
		[Symbol.iterator]() { return this; },
		next() {
			[pre, cur] = [cur, pre + cur];
			// done 을 넣지 않음으로 무한 이터러블 가능
			return { value: cur };
		}
	};
}());

for (const num of infiniteFibonacci) {
	if (num > 10000) return;
	console.log(num);
}
```

아래의 코드는 제너레이터를 활용한 코드이다. 훨씬 쉽게 구현이 가능하다.

```js
const infiniteFibonacci = (function* () {
	let [pre, cur] = [0, 1];

	while(true) {
		[pre, cur] = [cur, pre + cur];
		yield cur;
	}
}());

for (const num of infiniteFibonacci) {
	if (num > 10000) return;
	console.log(num);
}
```

### async/await
ES8에서는 가독성 좋게 비동기 처리를 동기처럼 구현할 수 있는 `async/await`가 도입되었다.

`async/await`는 프로미스를 기반으로 동작한다. `async/await`를 사용하면 프로미스의 `then/catch/finally` 후속 처리 메서드에 콜백 함수를 전달해서 비동기 처리 결과를 후속처리할 필요 없이 마치 동기처럼 프로미스를 사용할 수 있다.

#### async 함수
`await` 키워드는 반드시 `async` 함수 내부에서 사용해야한다. `async` 함수는 `async` 키워드를 사용해 정의하며 언제나 프로미스를 반환한다. `async` 함수가 명시적으로 프로미스를 반환하지 않아도 `async`함수는 암묵적으로 반환값을 resolve하는 프로미스를 반환한다. 아래의 예시를 통해 보도록 하자.

```js
async function foo(n) { return n; }
foo(1).then(v => console.log(v)); // 1
```

위의 코드와 같이 `promise`를 정의하지 않았음에도, promise의 `then`키워드를 통해 후속처리를 하는 것을 볼 수 있다.

`async`메서드 중 주의해달 점이 `constructor` 즉, 생성자 메서드는 `async`메서드가 될 수 없다. 생성자 같은 경우 인스턴스를 반환해야 하지만 `async`함수는 언제나 프로미스를 반환해야한다.

```js
class MyClass {
	async construtor() {
		// SyntaxError...
	}
}

const myClass = new MyClass();
```

#### await 키워드
`await` 키워드는 프로미스가 `settled`상태 즉, 비동기 처리가 수행이 된 상태까지 *대기*하다가 `settled` 상태가 되면 resolve한 처리 결과를 반환한다. `await` 키워드는 반드시 프로미스 앞에서 사용해야한다.

```js
async function foo() {
	const a = await new Promise(resolve => setTimeout(() => resolve(1),3000));
	const b = await new Promise(resolve => setTimeout(() => resolve(2),2000));
	const c = await new Promise(resolve => setTimeout(() => resolve(3),1000));

	// [1, 2, 3]
	console.log([a, b, c]);
}

// 약 6초 소요됨
foo();
```

위의 코드를 수행할 경우 약 6초 후에 결과 값을 모두 볼 수 있다. `await`를 사용하게 되면 비동기 처리가 완료될때 까지 기다리기 때문에 모든 시간이 다 완료 된 후 `console.log`가 출력되는 것을 알 수 있다.

그런데 `foo` 함수가 수행하는 3개의 비동기 처리는 서로 연관이 없기 때문에 개별적으로 수행되는 비동기 처리이므로 앞선 비동기 처리가 완료 될때까지 기다릴 필요가 없다. 그럴 경우는 아래와 같이 사용한다.

```js
async function foo() {
	const res = await Promise.all([
		new Promise(resolve => setTimeout(() => resolve(1), 3000)),
		new Promise(resolve => setTimeout(() => resolve(1), 2000)),
		new Promise(resolve => setTimeout(() => resolve(1), 1000)),
	]);

	console.log(res);
}

// 약 3초 소요됨.
foo();
```

다 같이 수행하지만, 모두가 끝날 떄까지 걸리는 시간이 3초이다.

### Reference
[DeepDive](http://www.yes24.com/Product/Goods/92742567)
