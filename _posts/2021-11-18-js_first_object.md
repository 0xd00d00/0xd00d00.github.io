---
layout: post
author: doodoo
title: "[Javascript] 1급 객체"
subtitle: "JS에서 언급하는 1급 객체에 대해 알아보자🤔"
date: 2021-11-18
cover: /assets/img/default.png
tags: haha
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 *일급객체*에 대해 알아보겠습니다.

보통, 자바스크립트를 공부하다보면, "자바스크립트의 함수는 일급객체이기 때문에~" 라는 문장을 많이 마주칩니다. 도대체 "일급객체"는 무슨 말일까요? 🤔

🖇1 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 1급 시민
우리가 1급 객체를 논할 때, 보통 1급 시민의 개념을 먼저 이야기하곤 한다. 그렇다면, "1급 시민"은 무슨 개념일까?

> 🕵  *1급 시민?* \
  \
  📝 1급 시민은 투표권을 가지고 있음 \
  👮 1급 시민은 군인이 될 수 있음 \
  🎙  1급 시민은 정치를 할 수 있음 \
  \
  19세기 초 영국에서는 남성과 여성을 급으로 나눴다. 2급 시민인 여성은 위의 권한들을 가질 수 없었다. 즉, *1급 시민*이라고 하면 많은 권한을 갖고 있는 시민 (것) 이라고 생각하면 된다.

### 1급 시민 for Programming
프로그래밍에서 "1급 시민"의 기준은 다음과 같다.

1. 변수에 담을 수 있어야 함.
2. 함수의 인자(Parameter)로 전달가능 해야 함.
3. 함수의 반환 값으로 전달할 수 있어야 함.

예시를 통해 알아보자.

```js
// 변수에 담을 수 있어야 함.
const a =  1;

// 함수의 인자로 전달 가능 해야함.
function f1(num) {
  const b = num + 1;

  // 함수의 반환 값으로 전달 할 수 있어야함.
  return b;
 }

console.log(f1(a));
```

위의 예시처럼, number 값은 프로그래밍에서 "1급 시민"으로 취급된다고 볼 수 있다. 그렇다면, 1급 객체는 뭘까?

### 1급 객체
1급 객체란, 1급 시민의 조건을 충족하는 *객체 (Object)*를 말한다.
Javascript에서 객체는 *1급 시민* 조건을 모두 충족하기 때문에 "1급 객체"라고 부른다.

```js
// 객체 생성 및 변수에 담음
const a  = { msg : "hello 1급 객체" }

// 객체를 인자로 전달 가능
function f1 (a) {
  const b = a;
  b.msg2 = "hello 1급 객체..!";

  // 객체를 반환 할 수도 있음.
  return b;
}

console.log(f1(a));
```

Javascript에서 위의 조건을 만족하기 때문에 JS에서 객체는 1급 객체이다.

하지만, JS에서는 특이하게, 함수도 Object로 취급하고 있기 때문에 함수도 1급객체라고 칭한다.
다만, 추가적인 요소가 몇 가지를 살펴보자.

### 1급 함수
위의 1급 객체와 마찬가지로, 1급 시민의 조건을 충족하는 함수를 말한다.

단, 1급 함수는 1급 시민의 조건과 더불어 추가적인 조건이 존재한다.

1. 런타임시 생성가능해야함.
2. 익명 생성이 가능해야한다.

  ```js
  function foo() {
    console.log("foo");
  }

  console.log(foo());

  var boo = function doo() {
    console.log("doo");
  }

  // 익명 생성!
  var boo1 = function() {
    console.log("doo");
  }

  console.log(boo());

  // 얘가 에러나는데 왜 그럴까?
  // console.log(doo());
  console.log(boo1());
  ```

1급 객체의 개념은 이해됐다.. 근데, 도대체 *1급 함수에 집착하는 걸까? 🤔* 즉, 뭐 때문에 1급 객체를 외치는 걸까? 왜 사용할까? 어디에 사용할까?

### 1급 객체가 중요한 이유
> 1급 객체가 왜 중요한 걸까? 🤔

Javascript 같은 경우 "명령형", "함수형", "프로토타입 기반 객체지향형" 이라는 다수개의 패러다임을 갖고 있는 멀티 패러다임 언이이다. 여기서 *함수형*에 중점을 놓고 생각해보자. 함수형에서 꽃이라고 불리는 >부분은 *Callback* 개념과 *고차함수* 개념이다.

위 개념들을 사용하기 위해서는 변수할당, 함수간 인자 전달 및 반환이 가능해야되는데, 이를 보장해주는 것이 *1급 객체* 개념이다.

따라서, 함수지향 언어가 되기 위해서는 *1급 객체* 즉, 1급 함수 개념을 만족해야되며, JS에서는 이를 보장하기 때문에 함수형 패러다임을 갖춘 언어라 볼 수 있다.

JS에서 사용하는 함수형 패러다임의 맛을 보도록 하자.
(빨간 맛은 아니니 너무 긴장할 필요 없다. 😏)

*🌱 함수를 인자로 전달*

1급 함수의 특징 중 함수를 인자로 전달했을 때, 어떤 부분이 가능한지 알아보자.

```js
function sayHello() {
  return "Hello, ";
}

function greeting(helloMessage, name) {
  console.log(helloMessage() + name);
}

// sayHello 를 greeting 함수에 인자로 전달
greeting(sayHello, "Javascript");
```

이렇게 함수를 인자로 전달하게 되면, 전달받은 쪽에서 "함수"를 본인에 시간에 맞춰 호출하도록 한다. 이를 우리는 *콜백 함수*라고 칭한다. 보통 전달받은 함수에서 처리될 일이 끝나고 호출하도록 한다. (Device driver 에서 많이 사용)

해당 기법을 활용하면, *"타이밍을 전달받은 쪽에서 정할 수 있음"*

*🌱 함수를 반환*

1급 함수의 특징 중 함수를 반환 받았을 때, 어떤 부분이 가능한지 알아보자.

```js
// 고차함수 사용
function sayHello() {
   return function() {
      console.log("Hello!");
   }
}

// 호출 하는 방법
// 1. 변수 활용

// 함수를 호출하면, 반환 받는 함수를 myFunc에 저장함
const myFunc = sayHello();
myFunc();

// 이중괄호 사용
sayHello()();
```

### 고차함수와 콜백의 활용
JS 내부에서는 콜백과 고차함수를 활용해 built-in 객체를 만들어 뒀다. 해당 built-in 객체를 활용해 소스를 직관적으로 짧게 작성할 수 있다.

JS에서 사용하는 고차함수는 많이 있지만, 해당 포스팅에서는 *Array.prototype.map*을 기준으로 보도록 하자.

해당 예시를 고차함수를 통해 변경하면 어떻게 코드가 변경될까?

> *Example#1 🐾* \
  우리가 숫자가 들어있는 배열을 가지고 있고 각각의 숫자 값이 2배가 된 배열을 만들길 원한다고 해봅시다. 고차 함수(Higher-Order function)가 없을 때와 있을 때, 각각 우리가 문제를 어떻게 해결할 수 있는지 >봅시다.

- 일반함수로 작성할 경우

  ```js
  const arr1 = [1, 2, 3];
  const arr2 = [];

  for(let i=0; i<arr1.length; i++) {
    arr2.push(arr1[i] * 2);
  }

  // prints [2, 4, 6]
  console.log(arr2);
  ```

- 고차함수로 작성할 경우

  ```js
  const arr1 = [1, 2, 3];

  const arr2 = arr1.map(function(item) {
    return item * 2;
  });

  console.log(arr2);
  ```

- 화살표 함수를 활용한 고차함수

  ```js
  const arr1 = [1, 2, 3];
  const arr2 = arr1.map(item => item * 2);
  console.log(arr2);
  ```

### Refs.
[solmii velog](https://velog.io/@solmii/Function-expression-%ED%95%A8%EC%88%98-%ED%91%9C%ED%98%84%EC%8B%9D) <br>
[MDN 일급객체](https://developer.mozilla.org/ko/docs/Glossary/First-class_Function)

