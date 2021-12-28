---
title: '2021-12-11-TIL'
date: '2021-12-11T00:00:00.000Z'
template: 'post'
draft: true
category: 'TIL'
tags:
  - 'Kubernetes'
description: ''
---

#### Kubernetes Drain

- Drain은 해당 노드의 파드를 전부 다른 곳으로 이동시키는 방법
- 실제로 이동을 시키는 것이 아닌 파드를 삭제하고 다시 파드를 생성하는 것
- 데몬셋은 각 노드에 1개만 존재하는 파드라서 drain으로 삭제할 수 없다.
- 데몬셋을 무시하고 삭제하는 방법은 아래와 같다.
  ```shell
  $ kubectl drain node --ignore-daemonsets // DaemonSet을 무시하고 진행
  ```

#### 파드 업데이트

- yaml 파일에서 컨테이너 이미지의 버전을 올리고 apply 명령을 실행한다.
- 이때 --record 옵션을 붙이면 히스토리를 남길 수 있다.
  ```shell
  $ kubectl apply -f xxxx.yaml --record // record를 통해서 힛스토리를 기록
  ```

kubectl의 공식문서에는 아래와 같이 나와있다.

Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.
