---
layout  : wiki-post
author  : 널두
title   : "Chapter1. 리스트 스택 큐"
subtitle : 
date    : 2023-05-20 11:06:18 +0900
updated : 2023-06-04 08:29:07 +0900
---
* ToC
{:toc}

## std::Vector
- std::array 단점
  - 컴파일 시간에 결정되는 상수
  - 크기 고정으로 *실행시간 변경 불가*
  - 항상 스택 메모리 사용
  - 대부분 응용 프로그램은 실행시간 변경 가능해야함 => 인원관리 프로그램

- std::vector는 array의 고정크기 문제 해결함.
- 초기화 예시
  ```cpp
  std::vector<int> vec; // size 0
  
  std::vector<int> vec = { 1, 2, 3, 4, 5 }; // size 5

  std::vector<int> vec(100);
  
  // size가 10이고, 5로 모두 초기화된.
  std::vector<int> vec(10, 5);
  ```
  - 위와 같이 명시적으로 지정하지 않고 할 경우 *컴파일러가 지정한 capa를 가짐*

- 삽입 시, `push_back` `insert` 함수 활용함.
  - `push_back` 함수의 특징
    - `push_back` 함수는 굉장히 빠르게 동작하는데, 가장 빠를 경우 `O(1)`의 속도를 가짐.
    - pseudocode 를 통해 구현을 대충 알아보자.
      ```cpp
      push_back(val):
        if size < capacity
          - 마지막 원소 다음에 val 저장
          - 백터 사이즈 1증가
          - return
          // O(1)
          
        if vector is already full
          - 사이즈 2배증가
          - 데이터 모두 복사
          - 포인터 주소지정
          - 마지막 원소에 값넣고 백터 크기 증가
          // O(n)
      ``` 
    - 위와같이, O(n)의 시간을 보장함.
  - `insert` 함수의 특징
    - 반복자 전달받아 그 지점에 넣어줌.
    - `push_front`는 없어서 가장 첫번째 요소에 넣으려면 `insert` 활용해야함.
    - `begin()` 사용해서 첫번째 반복자 받고, 해당 값 넘겨서 isnert 하면 됨.
    - 특정 영역에 넣고 싶다? => `find()` 활용

- 제거 시, `pop_back`, `erase` 사용
  - pop_back은 O(1)의 시간을 냄. 제일 마지막 원소 지움. => push_back이랑 비슷
  - erase는 특정 요소 지움 => insert랑 비슷

- 임시객체 생성하지 않는 방법 -> `emplace`, `emplace_back`

### std::forward_list
- 우리가 흔히 알고 있는 연결리스트
- std::array, std::vector는 연속적 메모리를 가지고 있음.
- 삽입 삭제가 어려움.

- 연결리스트 구현
  - 어렵지는 않지만, 자칫하면 에러 발생ㅠ
  - linked list의 wrapper class라 생각하면 쉬움.

- 연결리스트 특징
  - 래퍼클래스로 성능은 유지하면 추가적 기능 제공
  - 성능 유지를 위해, *전체크기 확인* 과 *나머지 원소 접근* 불가
  - `front()` 함수로 가장 처음 함수만 꺼낼 수 있음. `back()` 없다.
  - 원소의 삽입, 삭제, 뒤집기, 분할 위한 기능은 제공함.
  
* 재밌는 remove / remove_if
  * 연속적으로 있거나 일반적으로 사용되는 remove_if 같은 경우 값을 제거하고, 남은 메모리 공간을 채워주는 동작을 함.
  * 반면에 forward_list의 remove 같은 경우 실제 erase 역할을 하는데, remove 연산을 하면 요소를 그냥 지워버림.
    * 데이터를 채우는 것이 아니라, 요소를 삭제하는 것이 차이가 있다.
    
    ```cpp
    forward_list<int> t = { 1, 2, 3, 4 };
    
    t.remove(1);
    remove(begin(t), end(t));
    ```
    
    * 임시코드를 작성한 것이다. 위와 같이, forward_list에 있는 `remove`를 사용하는 것과 일반정의된 `remove`를 사용하는 결과는 차이가 있다는 점을 기억하자.

## Singly linked list 만들기
* 생각보다 쉽지 않음.
* 우선 API명과 어떻게 받아야할지 고민하는 시간이 많이걸림.
* 무-> 유는 내가 마음대로 정의하지 못한다면, 그냥 API명은 적어주자.
* 문제를 정의하는게 나을 듯. 그리고 비워두고 만들어라 정도?
* 이 정도로 만들면 좀 쉽게 재밌게 할 수 있을 듯.

### 만들면서 알게된 부족한 점
* friend 함수 사용이유
* rbegin, rend 코드 사용이유
* 선행, 후행연산자 만들기 
