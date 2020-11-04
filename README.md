<h1 align="center">math-o-matic</h1>
<p align="center"><a href="https://logico-philosophical.github.io/math-o-matic/docs/build/index.html">docs</a> &middot; <a href="https://logico-philosophical.github.io/math-o-matic/web/index.html">main page</a></p>

[![npm](https://img.shields.io/npm/v/math-o-matic)](https://www.npmjs.com/package/math-o-matic)
[![GitHub](https://img.shields.io/github/license/logico-philosophical/math-o-matic)](https://github.com/logico-philosophical/math-o-matic/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/logico-philosophical/math-o-matic.svg?branch=master)](https://travis-ci.com/logico-philosophical/math-o-matic)
[![CodeFactor](https://www.codefactor.io/repository/github/logico-philosophical/math-o-matic/badge/master)](https://www.codefactor.io/repository/github/logico-philosophical/math-o-matic/overview/master)
[![LGTM Alerts](https://img.shields.io/lgtm/alerts/github/logico-philosophical/math-o-matic)](https://lgtm.com/projects/g/logico-philosophical/math-o-matic/alerts/)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/logico-philosophical/math-o-matic)](https://lgtm.com/projects/g/logico-philosophical/math-o-matic/context:javascript)

math-o-matic은 공리계(axiomatic system)를 만들고, 그 공리계 상에서의 정리(theorem)들을 증명할 수 있도록 하는 컴퓨터 프로그램입니다. 엄밀한 증명을 읽고 쓰기 쉽게 하는 것을 목표로 합니다. [메인 페이지](https://logico-philosophical.github.io/math-o-matic/web/index.html)에서 페이지 하단 버튼 중 하나를 눌러 현재의 공리계를 볼 수 있습니다.

증명되지 못한 수많은 규칙들이 증명을 필요로 합니다. 규칙을 증명해서 pull request를 해 주세요.

## 예시

```
"[$1+1=2]이다."
schema one_plus_one_is_two() {
    omega_add_one(ord_one())[
        successor_in_omega[zero_in_omega()][as in(ord_one(), omega())]
    ][as eq(omega_add(ord_one(), ord_one()), ord_two())]
}
```

위와 같은 코드를 작성하면&hellip;

<p align="center"><img src="https://i.imgur.com/RvQeHtO.png" width="500px"><br>
<code>1 + 1 = 2</code>의 증명</p>

위와 같이 `1 + 1 = 2`를 증명할 수 있습니다. 증명은 math-o-matic 프로그램에 의해 검증되며, 증명이 잘 되었다면 이름이 초록색으로 표시됩니다. 또 증명탐색기가 사람이 읽을 수 있도록 증명과정을 표시하는데, 초록색인 것은 이미 증명된 정리들이며 파란색인 것은 이미 정의된 개념들입니다.

## 더 보기

* 더 많은 math-o-matic 코드는 [/math](/math)에서 볼 수 있습니다.
* 증명의 작성 방법에 관하여는 [설명서](https://logico-philosophical.github.io/math-o-matic/docs/build/index.html)를 참조하세요.
* [메인 페이지](https://logico-philosophical.github.io/math-o-matic/web/index.html)에서 위 증명의 색깔 있는 부분을 클릭해 보세요.
* Visual Studio Code와 Sublime Text 3에 대한 math-o-matic 문법 지원은 [/tools](/tools)에서 찾을 수 있습니다.
