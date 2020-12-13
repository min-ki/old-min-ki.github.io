---
title: 'NestJS - Middleware'
date: '2020-12-08T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-middleware'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
  - 'Middleware'
description: 'NestJS 공식문서 Overview - Middleware를 정리한 내용입니다.'
---

## middleware

- 미들웨어란 route handler 앞에서 호출되는 함수이다.
- 미들웨어 함수는 애플리케이션의 요청-응답 주기 안에서 `request` 와 `response` 객체에 접근할 수 있고, `next()` 미들웨어 함수에 접근 가능하다.
- next 미들웨어 함수는 흔히 `next` 라는 변수 이름으로 나타낸다.

![middleware_1.png](/nestjs/Middlewares_1.png)

- Nest 미들웨어는 기본적으로 express의 미들웨어와 동등하다.
- 미들웨어는 어떠한 코드도 실행할 수 있다.
- 미들웨어는 요청과 응답 객체를 변경할 수 있다.
- 스택에서 다음 미들웨어 함수를 호출한다.
- 만약 현재 미들웨어 함수가 요청 응답 사이클의 끝이아니라면, 이 미들웨어 함수는 `next()` 함수를 호출하여 다음 미들웨어 함수에게 제어를 전달한다.

- Nest 에서 커스텀 미들웨어를 구현하기 위해서는 함수로 작성할 수 있고, `@Injectable()` 데코레이터로 장식한 클래스로 구현할 수 있다.
- 클래스로 구현하는 경우, 해당 클래스는 `NestMiddleware` 인터페이스의 구현체가 된다.
- 함수의 경우에는 어떠한 요구조건이 없다.

### Class 형 미들웨어

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}
```

### Dependency injection

- Nest의 미들웨어는 의존성 주입을 지원한다.
- providers와 controllers와 같이, 미들웨어들은 의존성 주입되어질 수 있고 같은 모듈에서 사용가능하다.
- 미들웨어의 주입은 보통 생성자를 통해 수행되어진다.

### Applying middleware

- `@Module()` 데코레이터에는 미들웨어가 위치할 곳이 없다.
- 대신에, 모듈 클래스의 `configure()` 라는 함수를 사용해서 설정한다.
- 미들웨어를 사용하려는 모듈은 반드시 **NestModule 인터페이스를 구현해야한다.**

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  // Middleware를 포함하려면 NestModule 인터페이스를 구현
  // configure 함수를 사용해 미들웨어를 적용
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

- 위의 예제는 설정한 LoggerMiddleware가 /cats 라우팅 경로에 설정되었다.
- 또한, 특정한 HTTP 메소드만 수행되도록 route의 path와 method를 `forRoutes()` 메서드에 설정함으로써 미들웨어의 동작을 제한할 수 있다.

```ts
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET }); // GET 요청으로만 제한
  }
}
```

- `configure()` 함수는 async/await 을 사용하여 비동기처리를 할 수 있다.

### Route wildcards

- 위의 forRoutes()는 패턴 기반 경로 또한 지원한다.
- 예를들어, \* (asterisk) 를 어떠한 문자들의 조합으로 매칭하기위해서 와일드 카드로써 사용 가능하다.

```ts
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

- 위의 경로는 abcd, ab_cd, abecd, 등과 매칭이 될 것이다.
- ?, +, \*, () 문자들을 사용할 수 있으며, 정규 표현식의 부분집합이 될 수 있다.
- 하이픈 (-) 과 점(.)은 문자 그대로 문자열 기반 경로로 해석이 된다.

### Middleware consumer

- MiddlewareConsumer란 **helper class** 이다.
- MiddlewareConsumer 클래스는 미들웨어를 관리하기 위한 몇 가지의 내장 함수를 제공한다.
- 이러한 내장 함수들은 전부 간단하게 **fluent style** 안에서 연결될 수 있다.
- forRoutes() 함수는 single string, multiple strings, RouteInfo 객체, controller class, multiple controller classes (여러 개의 컨트롤러 클래스) 를 취할 수 있다.
- 대부분의 경우에, 우리는 콤마로 구분된 컨트롤러들의 리스트를 인자로 전달할 것이다.
- apply() 메서드 또한 단일 미들웨어 또는 다수의 미들웨어를 인자로 전달할 수 있다.

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller.ts';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController); // 컨트롤러 or [컨트롤러, 컨트롤러] 등 사용가능
  }
}
```

### Excluding routes

- 때때로, 우리는 미들웨어가 적용되는 특정 경로를 제외하기를 원할 때가 있다.
- exclude() 메서드를 사용하면 쉽게 특정 경로를 제외할 수 있다.
- 이 메서드 또한 단일 문자열, 여러개의 문자열, 제외되어질 경로를 나타내는 RouteInfo 객체 가 올 수 있다.

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET }, // 이게 RouteInfo 객체
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)' // 패턴이 올 수도 있음
  )
  .forRoutes(CatsController);
```

### Functional middleware

- class 형태의 미들웨어 뿐만아니라 functional 미들웨어도 작성 가능하다.
- 미들웨어가 어떠한 의존성도 없을 경우에 functional 미들웨어를 사용하는 것을 고려해보라고 힌트가 적혀있다.

```ts
// logger.middleware.ts

import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: Function) {
  console.log('Request...');
  next();
}
```

```ts
// app.module.ts

consumer.apply(logger).forRoutes(CatsController);
```

### Multiple middleware

- 우리가 기대하는 순서대로, 여러개의 미들웨어를 바인딩 하기위해서는 콤마로 구분된 리스트를 apply() 메서드 안에 나열하면 된다.

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### Global middleware

- 만약 모든 경로에 미들웨어를 한번에 등록하고 싶다면, INestApplication 인스턴스에 의해 제공되는 **use()** 메서드를 사용하여 미들웨어를 등록하면 된다.

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

### Reference

[Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/middleware)
