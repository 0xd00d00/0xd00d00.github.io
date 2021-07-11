---
layout: post
author: doodoo
title: "[프로그래머스][C++][고득점 Kit] 가장 먼 노드"
subtitle: "고득점 kit의 가장 먼 노드 문제를 풀어보자. 🔥"
date: 2021-07-10
cover: /assets/img/graph_distance.png
tags: 프로그래머스 알고리즘 Graph BFS
---

해당 문제는 고득점 kit의 가장 먼 노드 문제입니다. 문제는 [여기](https://programmers.co.kr/learn/courses/30/lessons/49189) 클릭해서 확인해주세요! (문제 저작권 보호차원 링크로 공유드립니다😟)

궁금한 점, 보안점 남겨주시면 성실히 답변하겠습니다. 😁 <br>
\+ 감상평 댓글로 남겨주시면 힘이됩니다. 🙇

### 풀이
해당 문제는 가장 멀리 떨어진 노드에 도달하는 *최단 경로의 개수* 를 구하는
문제이다.

본인은 해당 문제를 `Graph` 와 `BFS`를 통해 해결하였다. 해당 문제에서 중요한 점은
Graph를 만들 수 있는지, 최단 경로를 구할 수 있는지이다. 최단 경로를 구하는
방식은 DFS / BFS 두 가지가 존재한다. 하지만, 
