---
title: "NestJS - Proviers"
date: "2020-12-05T22:00:00.000Z"
template: "post"
draft: false
slug: "nestjs-providers"
category: "TIL"
tags:
  - "NestJS"
  - "Framework"
  - "Proviers"
description: "NestJS Proviers"
---

## Providers

- Providers(공급자)는 Nest 프레임워크에서 기본적인 개념이다.
- Service, Repository, Factory, Helper 등 대부분의 class들이 providers가 될 수 있다.
- Provider 라는 주요 아이디어는 provider를 통해서 **의존성 주입**을 할 수 있다는 것이다.
- 즉, 개체는 서로 다양한 관계를 만들 수 있으며 개체의 인스턴스를 연결하는 기능은 대부분 Nest 프레임워크의 런타임 시스템에 위임 될 수 있다.
- Proviers는 단순히 `@Injectable()` 데코레이터로 주석이 달린 클래스이다.
- Nest 프레임워크를 사용하면 OO-way 한 방법으로 의존성을 조직하고 디자인할 수 있으므로, SOLID 원칙을 따르는 것을 추천한다.

### Service

```ts
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

- CLI를 통해서 다음과 같이 `$nest g service 서비스이름` 명령을 통해서 서비스를 생성할 수 있다.
- `@Injectable()` 데코레이터는 메타데이터를 추가함으로써, 데코레이터를 추가한 클래스가 Nest의 Provider 인 것을 나타냅니다.

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
	constructor(private catsService: CatsService) {}

	@Post()
	async create(@Body() createCatDto:: CreateCatDto) {
		this.catsService.create(createCatDto);
	}

	@Get()
	async findAll(): Promise<Cat[]> {
		return this.catsService.findAll();
	}
}
```

- 위의 코드 상에서 CatsService는 클래스 생성자를 통해서 주입되어진다.
- CatsService를 주입하는 곳을 잘 보면은 private 문법을 사용한 것을 볼 수 있는데 이러한 shorthand 기법은 같은 위치에서 catsService member에 대한 선언과 초기화를 동시에 할 수 있도록 해준다.

### Dependency Injection

- Nest 프레임워크는 Dependency injection(의존성 주입) 이라는 강력한 디자인 패턴을 기반으로 만들어진다.
- Nest 프레임워크는 타입스크립트 덕분에, 단지 타입을 통해서 손쉽게 의존성을 관리할 수 있다.
- 의존성 주입을 통해 제공되는 인스턴스는 처음에 없다면 생성이 되고, 만약 이미 존재한다면 반환 해준다 (싱글톤)

```ts
constructor(private catsService: CatsService) {}
```

### Scopes

- Providers는 어플리케이션의 라이프사이클과 동기화된 라이프타임을 가지고 있다.
- 어플리케이션이 시작된다면, 모든 providers들은 인스턴스화 되어야 한다.
- 그리고, 어플리케이션이 종료되면은 모든 providers이 사라진다.
- 하지만, 요청 별로 인스턴스를 만들 수 도 있다. ([https://docs.nestjs.com/fundamentals/injection-scopes](https://docs.nestjs.com/fundamentals/injection-scopes))

### Custom Providers

- Nest는 providers를 간의 relationships를 처리하기 위해서 내부적으로 IoC(Inversion of Control)을 내장하고 있다.
- `@Injectable()` 데코레이터가 Providers를 사용하기 위한 유일한 방법은 아니다.
- 더 자세한 정보는 여기서.. ([https://docs.nestjs.com/fundamentals/custom-providers](https://docs.nestjs.com/fundamentals/custom-providers))

### Optional Providers

- 때때론, 필수적으로 resolve 되지 않아도 되는 의존성들도 존재한다. 이때는 optional providers를 사용한다.
- optional providers는 종속성이 전달되지 않은 경우에 기본값을 사용한다.
- providers가 optinal하다는 것을 나타내려면 `@Optinal()` 데코레이터를 사용한다.

```ts
import { Injectable, Optional, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
  constructor(@Optinal() @Inject("HTTP_OPTIONS") private httpClient: T) {}
}
```

### Property-based injection

- 지금까지 의존성 주입은 생성자에 기반한 주입을 사용했지만, 몇가지 특정한 경우 **property-based injection** 이 유용할수도 있다.
- 예를들어, 최상위 클래스가 한개 혹은 여러개의 providers에 의존한다면, 그것들을 사용하기위해서 서브클래스의 생성자로부터 매번 super() 메서드를 호출해야 하는데, 이것을 피하기위해서 property level에서 `@Inject()` 데코레이터를 사용할 수 있다.

```ts
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
  @Inject("HTTP_OPTIONS")
  private readonly httpClient: T;
}
```

- 만약 클래스가 다른 provider를 상속하지 않는다면, 항상 constructor-based injection을 사용하도록 하는 것이 좋다.

### ⭐️ Provider registration ⭐️

- Provider를 정의했다면, 우리는 컨트롤러 단에서 서비스를 사용을 하고자 할 것이다. 컨트롤러에서 서비스를 사용하기에 앞서서, 작성한 Provider를 먼저 등록을 해줘야 Nest에서 주입을 수행할 수 있다.
- 등록은 x.module.ts 에서 `@Module()` 데코레이터에 providers에 배열로 서비스를 추가하면 된다.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
	controllers: [CatsController],
	providers: [CatsService],
})
```

### Manual instantiation

- 특정 상황에서, 내장된 의존성 주입 시스템의 밖에서 사용해야하는 경우가 있는데 공식문서에서는 두 가지의 방법에 대해서 논의하고 있다.

1. 기존에 존재하는 instances를 얻거나 동적으로 providers를 초기화하기 위해서, **Module reference** 를 사용하는 방법
2. Standalone applications 방법
