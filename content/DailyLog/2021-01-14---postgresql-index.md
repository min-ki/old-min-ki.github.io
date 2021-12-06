---
title: 'PostgreSQL INDEX 정리'
date: '2021-01-14T22:00:00.000Z'
template: 'post'
draft: false
slug: 'postgresql-index'
category: 'Daily-Log'
tags:
  - 'PostgreSQL'
  - 'Index'
description: 'PostgreSQL의 인덱스에 대해서 정리해보았습니다.'
---

## PostgreSQL 인덱스 유형

Postgres는 B-Tree, Hash, GiST, SP-GiST, GIN과 같은 여러 유형의 인덱스를 제공합니다. 각 인덱스 유형은 서로 다른 유형의 쿼리에 적합한 각자의 알고리즘을 사용합니다. 기본적으로 PostgreSQL에서 CREATE INDEX 명령은 가장 일반적인 상황에 적합한 B-Tree 자료구조 형태의 인덱스를 생성합니다.

### B-Tree 인덱스

B-Tree는 데이터의 삽입과 삭제에 대해서도 항상 균형 트리를 유지하는 자료구조입니다. B-Tree 인덱스는 데이터가 정렬되어 저장되는 형태로 데이터의 동등성 및 범위 쿼리를 처리할 수 있습니다. 특히, PostgreSQL Query Planner는 인덱스가 생성된 열이 다음 연산자 중 하나를 사용하여 비교에 포함될 때마다 B-Tree 인덱스 사용을 고려합니다.

- <, <=, =, >=, >

### Hash 인덱스

Hash 인덱스는 단순히 같음 비교만 처리할 수 있는 인덱스 입니다. 쿼리 플래너에서는 인덱싱된 열이 = 연산자를 사용하여 비교에 포함될 때마다 Hash 인덱스 사용을 고려합니다.

```SQL
CREATE INDEX name ON table USING hash (column);
```

### GIN (Generalized Inverted Index) 인덱스

GIN 인덱스는 색인화 될 컬럼이 복합 값이고 색인에서 처리 할 쿼리가 복합 항목 내에 나타나는 요소 값을 검색해야 하는 경우를 처리하도록 설계되어있다고 공식문서에 나와있다.
ElasticSearch 등을 사용하지 않는 상황에서 단순 값이 아닌 다양한 Like 쿼리를 사용할 때 사용하면 좋을 것 같다.

### Reference

- https://www.postgresql.org/docs/13/indexes-types.html
- https://www.postgresql.org/docs/13/gin-intro.html
