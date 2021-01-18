---
title: 'Javascript Symbol 정리'
date: '2021-01-15T22:00:00.000Z'
template: 'post'
draft: false
slug: 'javascript-symbol'
category: 'DailyLog'
tags:
  - 'JS'
  - 'Symbol'
description: 'Javascript의 Symbol에 대해서 정리해보았습니다.'
---

# Symbol

- ES6에 추가 된 **Primitive data type**
- Symbol() 함수는 symbol 타입의 값을 반환합니다.
- 심볼은 유일성이 보장되는 자료형 (설명이 동일한 심볼을 여러 개 만들어도 각 심볼값은 다르다.)

## 심볼은 언제 사용할까?

- 심볼은 유일한 식별자를 만들고 싶을 때 사용합니다.
- Symbol()을 사용하면 심볼값을 만들 수 있다.

```js
let id = Symbol()
```

## 숨김 프로퍼티

- 심볼을 이용하면 숨김 프로퍼티들 만들 수 있다.
- 숨김 프로퍼티는 외부 코드에서 접근이 불가능하고 값도 덮어쓸 수 없는 프로퍼티입니다.

## 예제

```js
let sym1 = Symbol()
let sym2 = Symbol('foo')
let sym3 = Symbol('foo') // sym2와 sym3는 description이 같지만 다른 심볼이다.
```

```js
Symbol('foo') === Symbol('foo') // false
```

```js
let sym = new Symbol() // new 연산자를 사용하면 타입에러가 발생 (TypeError)
```

## Reference

- https://ko.javascript.info/symbol
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

```

```
