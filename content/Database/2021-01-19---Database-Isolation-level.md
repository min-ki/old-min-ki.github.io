---
title: '데이터베이스 트랜잭션 격리수준'
date: '2021-01-19T22:00:00.000Z'
template: 'post'
draft: false
slug: 'database-Transaction-isolation-level'
category: 'Database'
tags:
  - 'Database'
  - 'Isolation-level'
  - 'concurrency'
  - 'Transaction'

description: '데이터베이스 트랜잭션의 격리수준'
---

## 개요

SQL 트랜잭션의 격리수준을 정리중입니다.

## 트랜잭션 격리수준이란?

SQL 표준에서는 트랜잭션의 **동시성을 제어하기 위한 방법**으로 네 종류의 트랜잭션 격리 수준을 정의하고 있다.

## 트랜잭션 격리 수준이 필요한 이유는?

데이터베이스에는 ACID라는 트랜잭션이 올바르게 처리되고 데이터가 항상 일관된 상태로 유지할 수 있도록 하는 원칙이 존재한다. 항상 일관된 상태로 데이터를 유지하기 위해서는 멀티 스레드로 돌아가는 데이터베이스의 동시성 작업에서 무조건 락을걸어서 순차적으로 제어를 한다면 데이터베이스의 성능이 낮아질 수 밖에 없다. 이에, 성능을 위해 격리 수준을 제어할 수 있는 방법이 필요하다.

## 트랜잭션 격리수준의 종류

1. Read uncommitted
2. Read committed
3. Repeatable read
4. Serializable

### Read uncommitted

### Read committed

### Repeatable read

### Serializable

가장 높은 수준의 격리수준으로 직렬화가 가능한 스냅숏 격리이다. 이 단계는 여러 세션에 있는 트랜잭션 작업들을 한번에 하나씩 진행하는 것과 같은 결과를 보장한다. 하지만, 그만큼 성능이 느려지게된다.

### Reference

- https://www.postgresql.org/docs/current/transaction-iso.html
- https://joont92.github.io/db/%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98-%EA%B2%A9%EB%A6%AC-%EC%88%98%EC%A4%80-isolation-level/
- https://doooyeon.github.io/2018/09/29/transaction-isolation-level.html
