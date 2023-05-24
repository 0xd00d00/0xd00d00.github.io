// 1. citizen 관리하는 리스트 만들어 출력하는 것 까지 해보도록

#include <string>
#include <iostream>
#include <forward_list>

using namespace std;

struct citizen {
  string name;
  int age;
};

std::ostream& operator<<(std::ostream& os, const citizen &c)
{
  return (os << "[" << c.name << ", " << c.age << "]");
}

int main() {
  forward_list<citizen> citizens = {
    {"kim", 15}, {"park", 19}, {"choi", 20}, {"test", 25}
  };

  // 깊은 복사가 된다는데 왜 그런지 알아보자.
  auto citizens_copy = citizens;

  // 전체 시민 출력
  for (auto a : citizens)
    cout << a << " ";
  cout << endl;

  // 2. 나이정보 이용해 투표권 없는 사람 제거하는 코드 작성 remove_if 활용
  citizens.remove_if([](const citizen &c) {
        return (c.age <= 19);
  });

  // 3. n  , , 

  // 투표권 없는 사람 출력
  for (auto a : citizens)
    cout << a << " ";
  cout << endl;
}

