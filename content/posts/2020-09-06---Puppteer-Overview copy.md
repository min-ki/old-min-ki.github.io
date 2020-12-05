---
title: "[TIL] Puppeteer 공식문서 Overview"
date: "2020-09-06T17:00:00.000Z"
template: "post"
draft: false
slug: "puppeteer-overview"
category: "TIL"
tags:
  - "Crawling"
  - "Web"
description: "Puppeteer는 DevTools Protocol을 통해 Chromium이나 Chrome을 조작하기위한 고수준의 API를 제공하는 Node 라이브러리이다."
socialImage: "static/media/puppeteer.png"
---

## Puppeteer 개요

![puppeteer.png](/media/puppeteer.png)

- Puppeteer는 DevTools Protocol을 통해 Chromium이나 Chrome을 조작하기위한 고수준의 API를 제공하는 Node 라이브러리이다.
- Puppeteer API는 계층형 구조이고, 브라우저 모델의 구조를 그대로 가져왔다.

### Puppeteer Structure

![puppeteer_structure.png](/media/puppeteer_structure.png)

- `Puppeteer`는 DevTools Protocol을 통해서 브라우저와 통신한다.
- `Browser` 인스턴스는 여러 개의 브라우저 컨텍스트를 가질 수 있다.
- `BrowserContext` 인스턴스는 브라우저 세션을 정의하고 여러개의 페이지들을 가진다.
- `Frame`은 최소 하나의 실행 컨텍스트를 가진다.
  - default execution context: 프레임의 자바스크립트가 실행되어지는 곳
  - 프레임은 추가적으로 extensions와 관련된 추가의 실행 컨텍스트를 가질 수 있다.
- `Worker`는 단일 실행 컨텍스트를 가지고, 웹 워커와의 상호작용을 한다.

### Reference

- [Puppeteer 공식문서: Overview](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-overview)
