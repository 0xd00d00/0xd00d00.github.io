---
layout: post
author: doodoo
title: "[C++] std::map을 value 기준으로 정렬하기"
subtitle: "map 의 key값이 아닌 value값을 기준으로 정렬해보자"
date: 2021-08-22
cover: /assets/img/map_value_sort.png
tags: c++
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 C++ map의 자료구조에서 value 값 정렬에 대해 알아보겠습니다.

해당 내용은 [yoonsung님 블로그](https://unluckyjung.github.io/cpp/2020/05/07/Sort_map_by_value/)과 [여기](https://www.geeksforgeeks.org/sorting-a-map-by-value-in-c-stl/) 참고해 작성되었습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### std::map 정렬
`map`의 자료구조에 대해 미숙한 부분이 있다면 [여기](http://localhost:4000/2021/08/21/cpp_map.html)를 클릭해 먼저 읽어봅시다🐣

`map` 자료구조는 기본적으로 *key 값 기준 오름차순* 기반 정렬을 하고 있다. 기본구조는 다음과 같다.

```cpp
template < class Key,                                     // map::key_type
           class T,                                       // map::mapped_type
           class Compare = less<Key>,                     // map::key_compare
           class Alloc = allocator<pair<const Key,T> >    // map::allocator_type
           > class map;
```

만약, 우리가 *key 값 기준 내림차순*으로 변경하기 위해선 어떻게 해야할까? 바로 "단위 전략 패턴"을 활용해 3번쨰 인자에 `greater<>()`를 넣어주는 것이다. 해당 기법은 [여기](https://0xd00d00.github.io/2021/08/16/cpp_set.html)를 읽으면 이해가 쉬울 수 있다.

```cpp
// 키, 데이터, compare
map<int, string, greater<int>> m;
```

위의 코드와 같이, `map` 자료구조를 선언할 경우 내림차순 기준으로 정렬돼 값들이 저장된다.

위의 값은 키 값을 기준으로 정렬하는것인데.. 만약 value 값을 기준으로 정렬하기 위해서는 어떻게 해야할까? 🤔

### value 값 기반정렬하기
`map`에는 정렬 함수가 따로 없어서, `vector`를 활용해야한다. 구체적으로, `map`은 `tree`형태로 되어져있고, `tree` 형태를 만드는 과정에서 key을 기준으로 정렬을 한다. 완성된 tree를 지지고 볶고 하지는 않기 때문에 `sort()`가 존재하지 않는다.

![value_sort](/assets/img/map_value_sort.png)

위의 그림과 같이, `pair` 기반의 `vector`에 map이 가지고 있는 pair를 모두 넣고 정렬을 하면 value값 기준 정렬이 가능해진다.

차근차근 생각해보자.

*🌱 value 비교 사용자 정의 타입*

```cpp
bool cmp(pair<string, int>& a,
         pair<string, int>& b)
{
    return a.second < b.second;
}
```

위의 코드와 같이, `pair`를 인자로 전달받아, 두번째 값을 비교하는 사용자 정의 함수를 만든다. 해당 함수를 활용해 비교하도록 할 것이다.

*🌱 pair vector에 넣고 value 기준 정렬*

```cpp
void sort(map<string, int>& map) {
	vector<pair<string, int> > vec;

	for (auto& it : map) {
		vec.emplace_back(it);
	}

	// 우리가 위에서 정의한 cmp
	sort(vec.begin(), vec.end(), cmp);

	for (auto& it : vec)
		cout << it.first << " " << it.second << endl;
}
```

위의 코드와 같이, `sort()`를 만들어두면, `value` 값 기준으로 정렬이 가능해진다. 우리가 위에서 그림으로 봤던 것과 같이 동일하게 동작하는데, pair들을 `vector`에 넣고 미리 정의 해둔 *사용자 타입 비교함수*를 활용해 정렬하도록 하는 것이 핵심이다.

<span class="tip">Tip</span> 보통 `#define`을 쓰는 것을 권하지는 않지만, PS 문제에서는 귀차니즘을 줄이기 위해 pair 같은 경우 `#define`으로 정의해 사용한다.

위의 코드들을 종합해 실제 map value기반 정렬해보자.

### map value 기반 정렬 활용
아래의 코드는 todo list를 만들기 위한 코드이다. 내가 해야할일과 중요도 순으로 map이 완성되는데, 중요도 순으로 정렬하기 위해서는 `value 기반 정렬`이 필요하다.

아래의 코드에는 위의 내용들이 들어가있으며, 핵심부분들을 다시한번 복기시켜보자.

```cpp
#include <iostream>
#include <string>
#include <map>
#include <vector>

// 코드 단순화 (귀차니즘..)
#define pp pair<string, int>
#define mm map<string, int>

using namespace std;

// 사용자 정의 비교함수
bool cmp(const pp& a,
         const pp& b)
{
    return a.second < b.second;
}

// sort 담당함수
void sort(const mm& map)
{
    vector<pp> vec;

    for (auto& it : map) {
        vec.push_back(it);
    }

    sort(vec.begin(), vec.end(), cmp);

    for (auto& it : vec) {
        cout << " 할일 " << it.first << " 중요도 : " << it.second << endl;
    }
}

int main ()
{
    mm todo = {
		{"블로깅", 3},
		{"프로그래밍", 1},
		{"운동", 2}
	};
    sort(todo);
}
```
