---
title: 'NestJS - Custom Providers'
date: '2021-01-13T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-custom-providers'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
description: 'Custom Providers'
---

### DI 기초

- 종속성 주입은 IoC (Inversion of Control) 기술로 Nest JS의 IoC 컨테이너에 종속성 인스턴스화를 위임한다.

1. Service 클래스에 @Injectable() 데코레이터를 통해서 Provider 로 정의할 수 있다.

```jsx
// cats.service.ts

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

// @Injectable() 데코레이터를 통해서 해당 클래스를 Provider로 정의
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

2. Nest가 컨트롤러에게 provider를 주입하라 요청할 수 있음

```jsx
// cats.controller.ts

import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {

	// 의존성 주입
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

3. 모듈에 Provider를 Nest IoC 컨테이너에 등록

```jsx
// app.module.ts

import { Module } from '@nestjs/common'
import { CatsController } from './cats/cats.controller'
import { CatsService } from './cats/cats.service'

@Module({
  controllers: [CatsController],
  providers: [CatsService], // providers로 등록한다.
})
export class AppModule {}
```

위의 코드들에서 정확히 어떻게 동작할지 알아본다.

1. cats.service.ts에서 @injectable() 데코레이터는 CatsService클래스가 Nest의 IoC container에 의해 관리되도록 선언한다.
2. cats.controller.ts에서 CatsController는 생성자 주입과 함께 CatsService token으로 의존성을 선언
3. app.module.ts에서 CatsService token이 cats.service.ts로 부터 오는 CatsService 클래스라는 것을 나타낸다.

Nest IoC container가 CatsController를 인스턴스화 할 때, IoC container는 먼저 의존성들을 찾는다. 처음에는 CatsService dependency를 발견할 것이고, IoC Container는 CatsService token을 찾고 CatsService Class를 반환할 것이다.

SINGLETON (싱글톤) 스코프에서 Nest는 CatsService를 생성하고 캐싱하고 반환할 것이다.

만약 이것이 이미 캐시되어있다면 존재하는 인스턴스를 바로 반환할 것이다.

## Standard Providers

```jsx
@Module({
	controllers: [CatsController],
	providers: [CatsService]
})
```

- 데코레이터의 providers 프로퍼티는 providers들의 배열을 취한다.
- 기존까지 보았던 providers들에 클래스 이름의 배열을 주는 것은 shorthand 방식이다.

```jsx
provders: [
  {
    provider: CatsService,
    useClass: CatsService,
  },
]
```

- 위와 같은 구조가 원래의 명시적인 구조
- 이것을 통해서 명확하게 CatsService provider가 CatsService 클래스와 연관있다는것을 알 수 있음
- short-hand는 단지 대부분의 동일한 이름의 클래스가 제공자로 사용되는 use-case에서 간결하게 사용하고 싶어서 사용한것

### **Custom providers**

만약 요구사항이 기존의 표준 공급자의 동작방식에 비해서 부족한경우에는? 다음과 같은 예들을 보자.

- 클래스를 인스턴스화 (캐시된 인스턴스 반환)하는 대신 사용자 지정 인스턴스를 생성하려는 경우
- 두 번째 종속성에서 기존 클래스를 다시 사용하려는 경우
- 테스트용으로 클래스를 목업으로 재정의 하려는 경우

**⇒ Custom Providers를 사용하면 해결 가능!**

### Value providers: useValue

- useValue 문법은 상수를 주입하거나, 외부의 라이브러리를 Nest Container로 주입하거나, mock object로 교체할 목적으로 사용하면 유용하다!

```jsx
import { CatsService } from './cats.service'

const mockCatsService = {
  /* mock implementation
  ...
  */
}

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService, // mock 으로 교체하기 위해서 사용할 수 있다.
    },
  ],
})
export class AppModule {}
```

- 위의 예제에서는 CatsService Token은 Mocking Object로 대채됩니다.
- useValue에는 CatsService 클래스와 동일한 인터페이스를 가진 리터럴 오브젝트가 필요합니다.
- TypeScript의 구조화된 입력으로 인해 리터럴 객체 또는 새로 인스턴스화 된 클래스의 인스턴스를 포함하여 호환되는 모든 객체를 사용할 수 있습니다.

### Non-class based provider tokens

- 지금까지는 provider token을 클래스의 네임으로 사용하였습니다.
- 하지만 가끔은 문자열이나 기호를 DI에 대한 토큰으로 사용할 수 있는 유연성을 원하기도 합니다.

```jsx
import { connection } from './connection'

@Module({
  providers: [
    {
      provide: 'CONNECTION', // 문자열 사용
      useValue: connection, // 외부의 파일로부터 객체를 주입해준다.
    },
  ],
})
export class AppModule {}
```

string을 제공자의 토큰 값으로 사용할 뿐만아니라, Javascripts의 Symbols 도 사용할 수 있고 TypeScript의 Enums도 사용할 수 있다.

- 이전에 우리는 표준 생성자 주입 패턴을 생성자 기반의 주입 패턴을 사용하였다.
- 이 패턴은 클래스 이름과 함께 선언되어야 했다.
- 'CONNECTION' 커스텀 제공자는 문자열 기반의 제공자 토큰을 사용한다.
- 다음은 이러한 커스텀 제공자를 어떻게 주입하는지 알아볼 것이다.

```jsx
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

- @Inject() 데코레이터는 단일 인자로 토큰을 취한다.
- @Inject() 데코레이터는 @nestjs/common 패키지로부터 import
