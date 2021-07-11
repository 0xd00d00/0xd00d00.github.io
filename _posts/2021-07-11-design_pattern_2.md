---
layout: post
author: doodoo
title: "[Design Pattern][C++] Protected 생성자와 소멸자"
subtitle: "Protected 접근권한에 생성자와 소멸자를 만드는 이유를 알아보자👏 "
date: 2021-07-11
cover: /assets/img/default.png
tags: C++ Design_Pattern
---
C++ 디자인 패턴 강의를 듣고 정리하고자 합니다. 자세한 내용은 [여기](https://0xd00d00.github.io/2021/07/11/design_pattern_1.html)를 클릭해주세요.

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### Protected 생성자
우리는 보통 default 생성자 혹은 일반 생성자를 생성할 때, `public` 접근권한에
정의해 구현하곤 한다. 하지만, 오픈 소스를 보면 생성자를 `protected` 접근권한에
두는 경우가 종종 존재한다. 많은 이유가 있겠지만, *Design* 관점에서 해당 
