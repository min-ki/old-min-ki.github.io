---
title: 'AWS Application LoadBalancer 정리'
date: '2021-01-15T22:00:00.000Z'
template: 'post'
draft: false
slug: 'aws-application-load-balancer'
category: 'Daily-Log'
tags:
  - 'AWS'
  - 'LoadBalancer'
  - 'ALB'
description: 'aws의 로드밸런서 중 Application Load Balancer에 대해서 정리해보았습니다.'
---

## AWS Application Load Balancer

Application Load Balancer(ALB)는 EC2 인스턴스, 컨테이너, 아이피 주소 등 가용 영역에서 앞에 말한 다양한 타겟들로 트래픽을 자동으로 분산하는 역할을 합니다. ALB는 자동으로 등록된 대상에 대해 health check를 하고 건강한 대상들에게만 요청을 보냅니다. ALB는 많은 트래픽이 들어올 경우 자동으로 스케일 업을 해줍니다.

### ALB의 구성 요소

- 로드밸런서: 단일 연결 지점 역할
- 리스너
  - 설정된 프로토콜 및 포트를 사용하는 클라이언트의 연결 요청에 대한 구성을 검사하는 역할을 합니다.
  - 예를들어, https 프로토콜을 사용하고 443 포트에 대한 리스너 구성이 존재할 수 있습니다.
  - 여러 개의 리스너를 설정할 수 있음
- 대상그룹: 대상 그룹은 요청을 하나 혹은 여러 개의 등록된 타겟들 (EC2 인스턴스)에 대한 경로입니다.

### ALB의 동작 알고리즘

ALB의 알고리즘은 두 가지 유형이 존재합니다.

- RR (Round Robin) 알고리즘
- LOR (Least Outstanding Algorithm) 알고리즘

기본적으로 ALB의 동작방식은 라운드 로빈 알고리즘을 사용하여 들어오는 트래픽을 순서대로 서버에 분배를 해주고있습니다.

### RR 알고리즘의 문제점

그렇다면 이 방식의 문제점은 무엇일까요? 바로, 특정 서버에 오래 걸리는 요청이 있거나 할 경우 대상 그룹에서 특정 인스턴스만 과도하게 사용하거나 혹은 적게 사용되는 경우가 발생합니다.

다시말해, 자원의 사용에 따라 분배를 하는 것이 아니라 무조건 순서대로 수신 요청을 보내기 때문에 처리 능력이 부족하더라도 계속해서 요청을 받게되어 과부하가 걸리거나 처리 능력이 좋은데 적당한 요청만 와서 놀고있는 경우가 발생합니다. 그로인해서 LOR 알고리즘을 지원하게 되었고 LOR 알고리즘은 시간이 오래 걸리는 요청을 처리 중이거나 처리 능력이 다소 낮은 대상은 요청이 추가로 할당되지 않으며 부하가 대상 간에 고르게 분산됩니다.

### Reference

- [AWS Official Docs- What is an Application Load Balancer?
  ](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
- [해리의 유목코딩 - [AWS] 로드밸런싱 알아보기](https://medium.com/harrythegreat/aws-%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%8B%B1-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-9fd0955f859e)
