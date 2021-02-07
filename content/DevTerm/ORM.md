---
title: 'ORM - Object Relation Mapping'
date: '2021-01-15T22:00:00.000Z'
template: 'post'
draft: true
slug: 'object-relation-mapping'
category: 'DevTerm'
tags:
  - 'ORM'
description: 'ORM이라는 용어에 대해서 정리해보았습니다.'
---

## ORM이란 무엇인가?

ORM이란 **Object Relational Mapping**의 약자로 한국어로 번역하면 **객체 관계 매핑**이라고 부른다. 객체와 관계를 매핑한다는 것은 객체 지향 프로그래밍에서의 객체와 관계형 데이터베이스 간의 데이터를 매핑해준다는 것을 말한다.

## ORM에 대해서 더 깊게 생각해보기

그렇다면, ORM이라는 기술이 생겨난 이유에 대해서 생각을해보자. ORM이라는 기술은 어떠한 문제를 해결하기 위해 고안된 기법일까?
ORM이란 객체지향언어의 객체와 데이터베이스에 저장된 데이터의 구조가 달라서

다양한 데이터베이스가 존재하고 각 데이터베이스마다
ORM은 호환되지 않는 타입 시스템과 객체지향언어로 된 객체 간의 데이터 변환에서 흔히 발생하는 문제를 해결하기 위한 기법이다.

컴퓨터 과학의 객체 관계형 매핑 ( ORM , O / RM 및 O / R 매핑 도구 !)은 객체 지향 프로그래밍 언어를 사용하여 호환되지 않는 유형 시스템 간에 데이터를 변환 하는 프로그래밍 기술입니다 . 이는 사실상 프로그래밍 언어 내에서 사용할 수 있는 "가상 개체 데이터베이스 "를 생성합니다. 일부 프로그래머는 자체 ORM 도구를 구성하기로 선택하지만 개체 관계형 매핑을 수행하는 무료 및 상용 패키지를 모두 사용할 수 있습니다.

두 개념이 널리 사용되며 특히 함께 사용되기 때문에 Object Relational Mapping 도구는 OOP 언어와 RDBMS 사이의 경계를 약간 모호하게하고 애플리케이션이 양쪽을 최대한 활용할 수 있도록합니다.

ORM이란 OOP 언어와 RDBMS 사이의 경계를

## ORM을 사용하는 이유와 장점은 무엇일까?

ORM을 사용하는 가장 중요한 이유는 풍부한 객체 지향 비즈니스 모델을 보유하면서도이를 저장하고 관계형 데이터베이스에 대해 효과적인 쿼리를 빠르게 작성할 수 있도록하기위한 것입니다. 제 관점에서는 작성할 수있는 고급 쿼리 유형 외에 다른 생성 된 DAL과 비교할 때 좋은 ORM이 제공하는 실질적인 이점이 없습니다.

- 추상화가 잘 되어있어 다른 데이터베이스로 코드의 수정 없이 쉽게 전환할 수 있습니다.
- 각 데이터베이스마다 다른 SQL을 작성하는 방법을 알지 못해도 ORM이 대신 변환해주므로

## ORM을 사용하면서 주의해야할점은 무엇인가?

또는 ORM을 사용하기 위해 좋은 SQL을 작성하는 방법을 알 필요가 없다고 생각한다면 동의하지 않습니다. 단일 쿼리를 작성하는 관점에서 ORM에 의존하는 것이 더 쉽다는 것은 사실 일 수 있습니다. 그러나 ORM을 사용하면 개발자가 쿼리가 ORM과 변환되는 SQL과 함께 작동하는 방식을 이해하지 못할 때 성능이 떨어지는 루틴을 만드는 것이 너무 쉽습니다.

데이터 액세스를보다 추상적이고 이식 가능하게 만듭니다. ORM 구현 클래스는 공급 업체별 SQL을 작성하는 방법을 알고 있으므로 그럴 필요가 없습니다.

### Reference

- https://dev.to/tinazhouhui/introduction-to-object-relational-mapping-the-what-why-when-and-how-of-orm-nb2

* https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping
* https://stackoverflow.com/questions/46611370/what-design-pattern-is-used-in-a-orm
* https://kimsoungryoul.tistory.com/7
