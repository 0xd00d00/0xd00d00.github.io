---
layout: post
author: doodoo
title: "[C++][stream] sstream (istringstream & ostringstream)"
subtitle: "C++ 에서 사용하는 sstream에 대해 알아보자😎"
date: 2021-08-21
cover: /assets/img/default.png
tags: C++ Stream
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 sstream에 대해 알아보겠습니다.

해당 자료는 [강의](https://www.ecourse.co.kr/course/cpp_stl_programming/)를 참고해 작성되었음을 알려드립니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 많이 사용되는 stream
stream은 일련의 문자열로 C++에서 데이터의 입출력사이의 중계역할 담당하는 객체이다. 우리는 stream을 많이 사용하고 있는데, 대표적인 예시가 `iostream` 과 `fstream`이다.

```cpp
#include <iostream> // 표준 입출력 스트림
#include <fstream>	// 표준 파일 스트림
#include <string>

using namespace std;

int main() {
	// 입출력 스트림을 활용
	string s;
	cin >> s;
	cout << s;

	// 파일 스트림 활용
	string fs;
	ifstream fin("stream.cpp");
	fin >> fs;

	ofstream fout("output.txt");
	fout << fs;
}
```

우리는 위의 코드와 같이, 표준 입출력과 파일입출력을 많이 사용한다. 여기서 새로운 사실은.. C++에서 제공하는 stream은 총 3가지 이라는 것이다.

*<center>🔰 C++에서 제공하는 stream</center>*

| 템플릿 원형 | 특징 | 헤더 파일|
| ------------------------|
| basic_istream<> | 표준 입력| iostream |
| basic_ostream<> | 표준 출력| iostream |
| basic_ifstream<> | 표준 파일 입력 | fstream |
| basic_ofstream<> | 표준 파일 출력 | fstream |
| basic_istringstream<> | 표준 메모리 (string) 입력 | sstream|
| basic_ostringstream<> | 표준 메모리 (string) 출력 | sstream|

위의 표와 같이 총 3가지 `stream`을 C++에서는 제공한다. `stream`의 형태는 비슷비슷하다. 우리가 잘 모르고 있을 수 있는 `sstream`에 대해 알아보자.

### sstream
`sstream`은 `string stream`이라고 불리며, 메모리 버퍼에 문자열을 저장해두고 필요할 때 사용할 수 있는 유용한 library이다. 보통 문자열 파싱 또는 다양한 타입을 받아 문자열로 변환할 때 사용한다.

`sstream`에는 입력을 담당하는 `istringstream` 객체와 출력을 담당하는 `ostringstream` 객체가 존재한다. 각각의 예시를 통해 어떻게 입력을 받고, 출력을 하는지 알아보자.

### istringstream
위에서 언급한 것과 같이, `istringstream`은 문자열 입력을 담당한다. 아래의 예시를 보자.

```cpp
#include <iostream>
#include <sstream>
#include <string>

using namespace std;

int main()
{
	string s;
	istringstream iss("I am a boy");

	// 메모리 버퍼에 저장된 부분에서 문자열을 입력 받는다.
	iss >> s;

	// 입력받은 하나의 문자열을 출력하면 I가 출력됨.
	cout << s;
}
```

`istreamstring`을 활용해 `>>` 연산자를 사용하게 될 경우 *한 단어*를 메모리로 부터 입력 받아온다.

<span class="tip">Tip</span> 여기서 *한 단어*라고 하면, 공백유무를 가지고 판단한다. 문자열 시작점 부터 공백을 만날 때까지가 한단어이다. 추가로, `sstream`에서는 공백은 무시한다.

`istreamstring`객체의 특징 중 하나는 `>>` 연산자에서 출력할 문자열이 있다면 `true` 마지막이라 아무것도 출력할게 없다면 `false`를 반환한다. 이 특징을 활용하면 "단어 추출"하는 프로그램을 만들어 볼 수 있다.

```cpp
#include <iostream>
#include <sstream>
#include <string>

using namespace std;

int main()
{
	string s;
	istringstream iss("I am a boy");

	// 출력할 문자가 있다면 true
	// 없다면 false
	while( iss >> s )
		cout << s;
}
```

위의 코드의 결과를 보면 `I`, `am`, `a`, `boy`가 각각 출력되는 것을 확인할 수 있다.

### ostringstream
위에서 언급한 것과 같이, `ostringstream`은 문자열 입력을 담당한다. 아래의 예시를 보자.

```cpp
#include <iostream>
#include <sstream>
#include <string>

using namespace std;

int main()
{
	ostringstream oss;
	oss << "hello";

	string s = oss.str();
	cout << s << endl;
}
```

위의 코드를 보기에 앞서, `ostringstream` 객체 내부에는 문자열을 저장하기 위한 *메모리 버퍼*가 있다는 것을 알아야한다.

코드를 보면, `ostringstream`객체에 `<<` 연산자를 활용하여 "hello"라는 문자열을 저장하는 것을 볼 수 있다. 우리는 저장된 문자열을 꺼내기 위해 `str()`를 사용하면 된다.

그렇다면 굳이 `ostringstream`객체를 받아서 문자열을 저장했다가 꺼내써야되는 이유가 있을까? 그냥 `string` 변수 받아서 사용하면되지 왜 이렇게 하는거야.. 라고 할 수 있다.

### ostringstream 객체를 사용하는 이유
우리는 보통 숫자를 입력받아 문자열과 합쳐서 많이 사용한다.

일례로, "이 제품의 가격은 36000원 입니다." 라는 제품가격을 표기해주는 시스템을 떠올려 볼 수 있다. `36000` 이라는 숫자 데이터를 입력받아 문자열을 합치기 위해 사용한다.

흔히 C 언어에서 부터 문자열과 숫자를 합치기 위해 `sprintf`와 같은 함수를 활용해 많이 사용하곤 했다.

```cpp
#include <iostrema>
#include <sstream>
#include <string>

using namespace std;

int main()
{
	int n = 10;

	char buf[20];
	sprintf(buf, "이 제품의 가격은 %d 입니다.", n);

	// buf 출력
}
```

위의 코드를 많이 사용해 문자열과 숫자를 합치도록 했다. 하지만, 해당 코드의 문제는 제품의 가격이 너무 비싸게 되면 `buf`의 사이즈를 넘어 버릴 수 있는 케이스 즉, *버퍼 오버플로우*가 발생할 수 있다는 것이다. 따라서, C에서는 이런 경우를 막기위해 `snprintf`라는 함수를 만들어 길이를 전달하도록 변경하였다.

C++에서는 문자열과 숫자를 합치는데 `snprintf`를 사용할 필요없이 `ostringstream` 객체로 수월하게 만들 수 있다.

```cpp
#include <iostrema>
#include <sstream>
#include <string>

using namespace std;

int main()
{
	int n = 10;

	ostringstream oss;
	oss << "이 제품의 가격은 " << n << " 입니다.";

	string s = oss.str();
	cout << s;
}
```

위의 코드와 같이 아주 수월하게 *메모리 크기*에 대해 고려할 필요 없이, 문자열을 사용하듯이 사용하면 된다.

<span class="tip">Tip</span> 그렇다면 `ostringstream`의 메모리 크기는 얼마야? 라고 생각할 수 있다. 사실 `ostringstream`은 `string`을 wrapping해 만들어졌기 때문에 `string` max 사이즈를 갖고 있다. (string의 max size는 64bit 기준 9223372036854775807 이다.) 자세한 사이즈는 [여기](https://en.cppreference.com/w/cpp/string/basic_string/max_size)를 참조해 알아보자.





