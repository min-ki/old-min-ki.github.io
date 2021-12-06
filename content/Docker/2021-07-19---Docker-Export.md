---
title: 'Docker 명령어 - export'
date: '2021-07-19T23:24:00.000Z'
template: 'post'
draft: false
slug: 'docker-command-export'
category: 'Docker'
tags:
  - 'Docker'
  - 'export'
description: 'Docker 명령어인 export에 대해서 알아봅니다.'
---

### 설명

- 컨테이너의 파일 시스템을 tar 파일로 내보낸다.
- export 명령어는 컨테이너와 연결된 볼륨의 내용은 내보내지 않는다.

### 사용 예시

공식문서에 따르면 두가지 방법으로 사용할 수 있다.

```shell
$ docker export container_name > latest.tar
```

```shell
$ docker export --output="latest.tar" container_name
```

### Reference

- https://docs.docker.com/engine/reference/commandline/export/
