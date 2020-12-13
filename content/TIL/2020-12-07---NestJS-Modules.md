---
title: 'NestJS - Modules'
date: '2020-12-07T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-modules'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
  - 'Modules'
description: 'NestJS 공식문서 Overview - Modules를 정리한 내용입니다.'
---

## Modules

- Module은 `@Module` 데코레이터로 annotated된 클래스이다.
- `@Module()` 데코레이터는 애플리케이션 구조를 구성할 수 있도록, 메타 데이터를 제공하는 역할을 한다.
- 각 애플리케이션은 **root module** 이라는 최소한 하나 이상의 모듈을 가지고 있다.
- root module은 Nest 프레임워크가 애플리케이션의 모듈과 공급자(providers)들과의 관계나 의존성에 대한 지도를 만드는데 사용이 된다.
- 모듈은 컴포넌트를 구조화 하는데 효과적인 방법이라고 공식문서에서 나타내고 있다.
- 대부분의 애플리케이션에서, 최종적인 아키텍쳐는 여러개의 모듈로 구성되어있고, 각각의 모듈은 연관된 비즈니스 로직의 집합들로 캡슐화 되어 있다.

![modules](/nestjs/Modules_1.png)

### @Module decorator

- `@Module` decorator는 다음과 같은 속성을 가지는 단일 객체를 취한다.
  - providers: Nest injector에 의해서 인스턴스화 되어진다. 그리고 최소한 소속된 모듈에서 공유되어질 수 있다.
  - controllers: 모듈에서 정의된 인스턴스화 되어야하는 컨트롤러들의 집합
  - imports: 모듈에서 필요로 하는 모듈의 목록
  - exports: 이 모듈에서 제공되어지고 **다른 모듈에서도 사용가능해야하는** providers 의 하위 집합
- 모듈은 기본적으로 providers를 캡슐화한다. 즉, 현재 모듈에서 import 되지 않고 다른 모듈에서 export 되지 않은 providers를 사용하는 것은 불가능하다는 것이다. 따라서, 모듈에서 exported 되어진 providers 들은 모듈의 public interface 또는 API로 간주할 수 있다.

### Feature modules

- feature module이란 특정 기능에 관련된 코드를 구조화하고 명확한 경계를 나타낸다.
- feature module은 애플리케이션 혹은 팀의 규모가 커질 때, SOLID 원칙을 통해서 복잡성을 관리하고 개발하는데 도움이 된다.

```ts
// cats/cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
```

CLI를 통해 모듈을 만들기 위해서는, `$ nest g module cats` 명령어를 수행하면 된다.

- 위의 예제는 `cats.module.ts` 파일에 `CatsModule` 을 정의하고 `cats` 폴더에 연관된 모든 것을 위치시켰다.
- 마지막으로 해야할 것은, `app.module.ts` 파일에 정의된 `AppModule` 의 root module 에 `CatsModule` 을 import 하면 된다.

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule {}
```

- 위의 예제는 이제 다음과 같은 폴더 구조를 가진다.

![folder_structure](/nestjs/folder_structure.png)

### Shared modules

- Nest에서 modules는 기본적으로 싱글톤이다. 이는, 다양한 모듈들 사이에서 어느 provider에 대한 동일한 인스턴스를 쉽게 공유할 수 있다는 것이다.
- 모든 모듈은 자동적으로 shared module이 된다. 일단 한번 생성이 되면, 어느 모듈에서든지 재사용이 되어진다.

![Shared_Module_1.png](/nestjs/Shared_Module_1.png)

- 특정 모듈에 속한 providers를 공유하기 위해서는 먼저 `@Module()` 데코레이터의 exports 속성에 해당하는 provider를 배열로 추가해줘야 한다. 아래의 예제를 살펴보자.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/controller';
import { CatsService } from './cats/service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService] // 이와같이 서비스를 다른 모듈에 공유하려면 exports에 배열로 추가
})
export class CatsModule {}
```

- 위와 같이 exports를 하면 다른 어떤 모듈에서 `CatsModule` 을 imports 하게 된다면 `CatsService` 에 접근할 수 있게 된다. 그리고 동일한 CatsService instance를 공유하게된다.

### Module re-exporting

- 위에서 본 것 같이, 모듈은 내부의 providers들을 export 할 수 있다.
- re-exporting이라는 것은 어떤 특정 모듈이 다른 모듈을 imports 해서 사용하고 있는데 이를 다시 exports 함으로써 어떤 특정 모듈을 imports 하기만 하면 내부에 imports 되어있는 모듈을 사용할 수 있다는 것이다.

```ts
// 다른 모듈에서 CoreModule을 imports 한다면 CommonModule도 같이 imports 되어진다는 것

@Module({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class CoreModule {}
```

### Dependency injection

- module 클래스또한 providers를 환경 설정등의 목적으로 의존성을 주입할 수 있다.
- 하지만, **circular dependency** 때문에 모듈 클래스 스스로 providers 로써 주입될 수 없다.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {
  constructor(private catsService: CatsService) {} // 선언과 초기화를 동시에
}
```

### Global modules

- Nest 프레임워크는 모듈 범위 내에서 제공자를 캡슐화 한다. (앵귤러는 한번 import 하면 전역에 등록된다.)
- Nest에서는 모듈을 가져오지 않고서는 해당하는 모듈의 provider를 사용할 수 없다.
- 하지만, 앵귤러와같이 전역 스코프에 모듈을 등록하고 사용하고싶다면 `@Global()` 데코레이터를 사용하면 모듈을 전역으로 만들어준다.
- `@Global()` 데코레이터를 사용한 모듈은 일반적으로 루트 또는 코어 모듈에 의해 한번만 등록되어야 한다.

```ts
import { Module, Global } from '@nestj/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global() // 모듈을 전역 스코프로 만들어준다.
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

### Dynamic modules

- Nest의 모듈 시스템은 dynamic modules라 불리는 강력한 기능을 내포하고있다.
- 이 기능은 동적으로 providers를 설정하고 등록할 수 있는 커스터마이징 가능한 모듈을 쉽게 만들 수 있도록 해준다.
- `forRoot()` 메서드는 동기적 혹은 비동기적으로 dynamic module을 리턴할 수 있다.

```ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection]
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers
    };
  }
}
```

- 이 모듈은 기본적으로 연결 제공자를 정의하지만(@Module() 장식자 메타데이터) forRoot() 방법으로 전달되는 엔티티 및 옵션에 따라 제공자의 컬렉션을 노출한다(예: 리포지토리). 다이내믹 모듈에서 반환되는 속성은 @Module() 장식기에 정의된 기본 모듈 메타데이터를 오버라이드하지 않고 확장한다는 점에 유의하십시오. 그렇게 정적으로 선언된 접속 제공자와 동적으로 생성된 리포지토리 제공자 모두를 모듈에서 내보내는 것이다.
- 위의 모듈은 `Connection` provider를 정의하지만, `forRoot()` 메서드로 전달되는 `entities` 와 `options` 에 따라 providers의 collection을 노출한다. (ex. repository)
- dynamic module에서 반환되는 속성은 `@Module()` 데코레이터에 **정의된 모듈의 메타데이터를 오버라이드 하는 것이 아니라 확장하는 것**에 유의!
- 확장하는 방식으로 동작하기 때문에, 정적으로 선언한 provider와 동적으로 생성된 provider를 볼 수 있는 것이다.

- 만약 global scope(전역 스코프)에 dynamic module을 등록하고싶다면, global propert를 true로 설정하면 된다.

```ts
{
	global: true,
	module: DatabaseModule,
	providers: providers,
	exports: providers
}
```

> WARNING
>
> 모든 것을 전역 범위(global scope)로 만드는 것은 좋은 디자인이 아니다.

- 위의 `DatabaseModule` 다음과 같은 방식으로 설정되고 import 될 수 있다.

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
	imports: [DatabaseModule.forRoot([User]),
})
export class AppModule {}
```

- dynamic module 을 다시 내보내고 싶다면 exports의 배열에 `forRoot()` 메서드를 생략하면된다.

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
	imports: [DatabaseModule.forRoot([User]),
	exports: [DatabaseModule], // 이 처럼 forRoot를 생략하면된다.
})
export class AppModule{}
```

[Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/modules)
