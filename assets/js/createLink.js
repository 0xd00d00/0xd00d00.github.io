;(function(){
  let post = document.querySelector('article.markdown-body');

  // post가 없으면 wiki-index를 찾도록 해
  if (post === null)
    post = document.querySelector('div.wiki-body-content');

  // p, ul, h1~h6, table 중 link로 변환해야되는걸 변환하는 동작.
  // article 부터 순회하는거임.
  
  ;(function iterate_node(test) {
    if (/^(?:p|ul|h\d|table)$/i.test(test.tagName)) {
        const pattern = /\[\[/g;
        if (pattern.test(test.innerHTML)) {
          test.innerHTML = link(test.innerHTML);
        }
    } else {
        for (var i = 0; i < test.childNodes.length; i++) {
             iterate_node(test.childNodes[i]);
        }
    }
  })(post);

  // 일단 테이블을 잘안씀.
  // 좀 더 쉽게.
  // 주석 처리 및 링크처리정도만 하자.
  // /기준으로
  function link(content) {
      content = content.replace(/\\\[\[(.+?)\]\]/g, '\\[\\[$1\\]\\]');
      // ? 는 1개 or 0개
      // /g 는 모든 문자 다 바꿔줘라.
      // { } 하나의 그룹.
      content = content.replace(/\[\[\/?([^\[\]]+?)\s*\]\]\{([^\{\}]+?)\}/g,
                '<a id="wiki" href="/wiki/$1">$2</a>');

      content = content.replace(/\[\[\/?(.+?)\s*\]\]/g,
          '<a id="wiki" href="/wiki/$1">$1</a>');

      content = content.replace(/\\\[\\\[(.+?)\\\]\\\]/g, '[[$1]]');

      return content;
  }
})();
