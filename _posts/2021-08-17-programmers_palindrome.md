---
layout: post
author: doodoo
title: "[프로그래머스][C++][연습문제] 가장 긴 팰린드롬"
subtitle: "level 3 가장 긴 팰린드롬을 풀어보자😎"
date: 2021-08-17
cover: /assets/img/palindrome.png
tags: 프로그래머스 알고리즘 level3
sitemap :
 changefreq : daily
 priority : 1.0
---
안녕하세요! <span class="doodoo">두두코딩</span> 입니다 ✋ <br>
오늘은 프로그래머스 가장 긴 팰린드롬 문제를 풀어보겠습니다.

🖇 소스코드에 마우스를 올리고 <span class="tip">copy</span> 버튼을 누를 경우 더 쉽게 복사할 수 있습니다!

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 문제
해당 문제는 프로그래머스 가장 긴 펠린드롬 문제입니다. 자세한 문제의 내용은 [여기](https://programmers.co.kr/learn/courses/30/lessons/12904#)를 클릭해주시기 바랍니다. (저작권 문제가 있어 부탁드립니다 🙇)

### 풀이
해당 문제는 `문자열 인덱스`를 활용해 풀었다.

### 접근방법
해당 문제는 접근 방법이 되게 간단하다.

![palindrome](/assets/img/palindrome.png)

위의 그림과 같이, 포인터를 움직여가며 `left`와 `right`의 글자가 동일한지 확인한다. 




우선, 해당 문제를 풀기위해선 문자열을 가리키는 포인터 (left, right) 두개가 필요합니다. 핵심은 `left`와 `right` 포인터를 옮겨가면서 해당 문자가 같은지 비교를 하고, 만약 다르다면, 현재까지의 길이를 파악합니다.

