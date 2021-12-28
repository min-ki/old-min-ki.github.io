---
title: 'Kotlin Basic'
date: '2021-12-20T00:00:00.000Z'
template: 'post'
draft: false
category: 'TIL'
tags:
  - 'Kotlin'
  - '코틀린'
description: '코틀린의 기본문법에 대해서 알아보자.'
---

## Basic

- https://kotlinlang.org/docs/basic-syntax.html

### 패키지 정의 및 임포트

패키지 정의는 소스 파일의 최상단에 위치해야한다.

```kotlin
package my.demo

import kotlin.text.*

// ...

```

### 프로그램 진입점

코틀린 애플리케이션의 진입점은 main 함수이다.

```kotlin
fun main() {
    println("Hello world")
}
```

main 함수는 또한 인자를 받을 수 있다.

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

### 표준 출력

`print` 함수는 인자를 표준 출력으로 내보낸다.

```kotlin
print("Hello ")
print("world!")


output: Hello world!
```

`println` 함수는 줄바꿈을 추가하여 표준 출력으로 내보낸다.

```kotlin
println("Hello world!")
println(42)

output: Hello world!
output: 42
```

### 함수

fun 키워드로 함수를 정의한다.

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

함수를 표현식으로 나타낼 수 있다. 리턴타입은 암시되어진다.

```kotlin
fun sum(a: Int, b: Int) = a + b // 표현식으로 나타낼 수 있고 반환값은 추론된다.
```

반환값이 없는 경우 `Unit`키워드를 사용한다. (다른 언어의 void와 동일)

```kotlin
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

output: sum of -1 and 8 is 7
```

`Unit`키워드는 생략할 수 있다.

```kotlin
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

output: sum of -1 and 8 is 7
```
