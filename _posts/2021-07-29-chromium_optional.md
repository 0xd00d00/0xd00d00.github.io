---
layout: post
author: doodoo
title: "[Chromium][API] base::Optional 사용방법"
subtitle: "Chromium에서 만든 자체 API를 알아보자 👌"
date: 2021-07-29
cover: /assets/img/default.png
tags: Chromium API
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 Chromium 내 base::Optional 개념에 대해 알아보겠습니다.

포스팅을 위해 [류광님 참고문서](http://occamsrazr.net/tt/317) 와 [Chromium 문서](https://chromium.googlesource.com/chromium/src/+/69.0.3482.0/docs/optional.md) 를 참고하였습니다!

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### base::Optional
base::Optional은 Chromium에서 사용하고 있는 Container이다. 현재는 표준 라이브러리에서 (C++17)기준으로 제공되지만, Chromium은 C++17이전이 나오기 전부터 사용되어졌기 때문에 해당 라이브러리를 구현해 사용하였다. (아마 C++17이 자리를 잡으면 포팅 하지 않을까 싶다.. 🙄) 표준라이브러리와의 차이는 거의없다. 가장 큰 차이점은 대부분의 객체 앞에 std:: 라는 namespace 대신에 base::를 사용한다는 점이다. 또한, optional이라는 형식 대신에 가장 앞 글자가 대문자인 Optional을 이름으로 갖고 있다.

그렇다면, Optioanl은 어떤 경우에 사용하는가 🤔?

### Optional의 사용 시나리오
다음과 같은 프로그래밍 시나리오를 생각해보자.

1. 실패할 수 있는 어떤 연산을 수행하는 함수를 호출한다.
2. 연산이 성공했으면, 함수를 돌려준 결과를 사용하고 실패했으면 다시 시도하거나 오류를 처리한다.

이러한 시나리오를 구현하려면, 함수가 두 가지 결과값을 돌려줘야한다.

하나는 연산의 성공여부이고, 또 다른 하나는 연산의 결과이다. 그런데 우리가 공부해 온(?) C++ 함수에서는 많아야 하나의 값을 돌려줄 수 있다. 하나의 값 이상을 돌려주기 위해서는 여러개의 값을 담을 수 있는 사용자 정의 타입 (객체)를 반환하면 된다. 일례로 `std::pair`를 담아서 돌려주기도 한다.

보통 해당 시나리오를 작성하기 위해선 아래와 같이 작성한다.

구체적 시나리오.
* `create()`를 호출하고, 성공할 경우 100을 담아오고, 실패할 경우 0을 담아 오시오. (성공 유무와 담는 값은 별개로 구별하라)

```cpp
bool create(int& val) {
  if (try()) {
    cout << "ok..";
    val = 100;
    return true;
  } else {
    cout << "not ok..";
    val = 0;
  }

  return false;
}
```

위의 함수와 같이 인자로 담아올 값을 넘겨 구현하는 방식을 추구한다. 또 다른 방법은 아래와 같다.

```cpp
std::pair<bool, int> create() {
  if (try()) {
    ... // 재대로 구현한 것이 아님.. (예시용)
    return make_pair(true, 100);
  } else {
    ...
    return make_pair(false, 0);
  }
}
```

위의 방법 같이, `std::pair`를 이용해 값을 활용해 값을 반환하는 형식으로 해결한다. 앞의 구문은 다소 번잡하고, 뒤(pair사용) 구문은 객체를 생성해야돼 비효율 적이다.

위의 방법을 사용하고자하지 않고 생각해볼 수 있는 방법은 *예외*를 던지는 것인데, 지금처럼 사용자의 실수가 얼마든지 예상되는, 즉 실패가 일상적인 상황에서 예외사용까지는 과하다고 생각이 될 수도 있다.

이런 상황을 해결하기 위해 등장한 함수가 `base::Optional` or `std::optional` 이다.

### base::Optional 사용방법
우리는 Chromium 기반의 Optioanl을 공부하고 있기 때문에, `base::Optional`을 기반으로 작성한다.

API는 아래와 같이 사용하면 된다.

```cpp
base::Optional<int> opt;

opt == true;  // false;

opt.value();  // this is empty

opt == base::nullopt;   // true;
```

위와같이, `base::Optional<T>`는 `T` 값으로 타입을 전달하면 된다. 기본 값으로는 아무 것도 들어가있지 않은 비어있는 상태 즉, empty 상태를 유지한다. `base::Optional<T>`의 empty 상태는 `base::nullopt`와 동일하다.

우리가 만약 값을 담아 전달한다면 `value` 값으로 값을 취할 수 있다.

```cpp
base::Optional<int> opt = 1;  // .value() 를 할 경우 1을 반환해줌.
```

Optional의 가장 큰 장점은 *부울 값을 요구하는 문맥*에서 나타난다. `base::Optional` 객체 자체는 하나의 부울 값 (실제로 자료가 있는지 여부를 나타내는)으로 나타낸다. 즉, if문에 `base::Optional`을 사용할 경우 *부울 값으로 판단* 한다.

우리가 문제로 삼았던 예시를 보자.

```cpp
base::Optional<int> create() {
  if (try()) {
    return 100;
  } else {
    return {};
  }
}

int main()
{
  if (auto tmp = create()) {
    cout << tmp.value();
  }
}
```

위와 같이, optional을 사용하면 간편하게 해결할 수 있다.

추가로, `base::Optional`은 `value_or()`이라는 함수를 제공한다. 해당 함수는 만약 값이 없을 경우 해당 값으로 초기화 해 값을 가져라 라는 의미이다. 보통 초기화 할 때 많이 사용한다.

```cpp
base::Optional<int> opt;
opt.value_or(42);   // 없다면 42를 반환해라.
```

조금 더 자세한 내용들이나 API는 문서를 참고하자. [참고문서](https://chromium.googlesource.com/chromium/src/+/69.0.3482.0/docs/optional.md)

### Chromium에서 Optional 사용 예시
Chromium에서 Optional은 정말 많이 사용된다. 보통 초기화 할 때, 많이 사용되는데 해당 컨테이너가 쓰여지는 부분을 한번 확인해보자. (부분 발췌한다.. 너무 커서. 🤒)

```cpp
base::optional<VideoFrameLayout> VideoFrameLayout::Create(
    VideoPixelFormat format,
    const gfx::Size& coded_size) {
  return CreateWithStrides(format, coded_size,
                           std::vector<int32_t>(NumPlanes(format), 0));
}

scoped_refptr<VideoFrame> VideoFrame::CreateEOSFrame() {
  auto layout = VideoFrameLayout::Create(PIXEL_FORMAT_UNKNOWN, gfx::Size());
  if (!layout) {
    DLOG(ERROR) << "Invalid layout.";
    return nullptr;
  }
  scoped_refptr<VideoFrame> frame =
      new VideoFrame(*layout, STORAGE_UNKNOWN, gfx::Rect(), gfx::Size(),
                     kNoTimestamp, FrameControlType::kEos);
  ...
}
```

<span class=Tip>Tip</span> 최근에는 base::Optional을 absl::Optional로 변경해서 사용하는 것 같다. absl이란 구글에서 만든 API 모음이라고 생각하면 편하다. 완전히 다 변경되는지는 모르겠지만, 기원은 `base::`라는 사실을 기억하자!

위 함수는 `VideoFrameLayout`을 생성하는 함수인데, 해당 함수를 생성할 때, 제대로 되지 않을 경우 에러 핸들링을 한다. 여기서 `Optional`을 사용하고 있는 것을 볼 수 있다. 해당 부분 말고도 굉장히 다양하게 사용하고 있다. (e.g. soket, media etc.)

어떻게 사용하는지 전반적으로 아는 것이 중요하며, 알게 되었다면, 필요할 때 API 문서를 보고 쓰면 된다!
