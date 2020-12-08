---
title: 'NestJS - Controllers'
date: '2020-12-04T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-controllers'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
  - 'Controller'
description: 'NestJS 공식문서 Overview - Controller를 정리한 내용입니다.'
---

## Controller

- 클라이언트에서 보내는 요청을 처리하고 클라이언트에게 요청을 반환하는 책임을 가진 역할을 담당하는 것
- 컨트롤러의 목적은 **애플리케이션을 위한 특정한 요청을 받기 위한 것**
- 라우팅 메커니즘은 컨트롤러가 어떠한 요청을 처리할 지 제어하는 것
- 각 컨트롤러는 하나 이상의 경로를 가지는 경우가 많고, 각기 다른 경로(라우터)들은 다른 액션(비지니스 로직)을 수행함
- NestJS에서 컨트롤러를 생성하기 위해서는, **클래스**와 **데코레이터**를 사용한다.
- 데코레이터는 클래스에 필요한 메타 데이터들을 연결하기 위해서 사용하고, Nest가 routing map을 생성하도록 한다. (request에 부합하는 컨트롤러와 묶기 위해서)

## Routing

- 컨트롤러를 정의하기 위해서 `@Controller()` 데코레이터 사용
- `@Controller('cats')` 와 같이 라우트 경로의 prefix를 optional하게 지정할 수 있음
- path prefix를 사용하면 연관이 있는 라우터들을 쉽게 그룹으로 묶을 수 있고, 중복되는 코드를 줄일 수 있음

```tsx
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

`$ nest g controller cats` 와 같이 CLI를 통해서 쉽게 controller를 생성할 수 있음

- `@Get()` HTTP Request 메서드 데코레이터는 Nest 프레임워크에게 HTTP 요청을 위한 특정한 엔드포인트를 처리하는 핸들러를 생성 해준다.
- 엔드포인트는 HTTP 요청 메서드와 라우트 경로와 일치하게 된다.
- 여기서 라우트 경로란 컨트롤러에서 선언된 prefix와 결합되어 결정된 경로이다.
- 위의 코드에서는 findAll의 메서드는 GET /cats 의 라우팅 경로를 가지게 된다.
- Nest 프레임워크는 `@Controller()` 와 `@Get()` 을 통해서 요청을 해당 핸들러와 자동으로 맵핑시켜준다.
- `@Controller()` 와 `@Get()` 의 path 설정은 둘 다 optional 하다.
- Nest에서는 위의 코드를 실행하면 200 status code를 반환한다. 그 이유는 Nest 에서는 두개의 다른 Response를 조작하는 옵션을 제공하는 개념이 존재

  1. **Standard (recommended)**

     위와 같은 데코레이터 내장 메서드를 사용해 요청을 처리하는 핸들러가 자바스크립트 오브젝트 혹은 배열을 반환할 때, 이것은 자동적으로 JSON으로 직렬화 된다.

     그러나, 자바스크립트의 원시 타입을 반환할 때는 Nest 프레임워크는 자동적으로 직렬화를 하지 않고 보낸다.

     이러한 점은 응답의 처리를 간결하게 만들어준다. 단지 우리는 값을 반환하고, Nest 프레임워크가 나머지 부분을 담당해준다.

     더욱이, 응답 코드는 POST 요청에서 201 응답 코드를 사용하는 것을 제외하고, 항상 200을 기본 값으로 가진다.

     우리는 이러한 프레임워크의 행동을 `@HttpCode(...)` 데코레이터를 핸들러 레벨에서 추가함으로써 쉽게 변경할 수 있다.

  2. **Library-specific**

     우리는 express와 같은 라이브러리에서 사용하는 응답 객체 (response object)를 `@Res()` 라는 데코레이터에 의해 핸들러 메서드에 주입된 응답 객체를 대신하여 사용할 수 있다.

     이러한 접근 방식은, 각 라이브러리의 Native한 방식을 사용하여 처리할 수 있다.

     예를 들어 express에서는 `response.status(200).send()` 와 같이 사용할 수 있다.

  > **Warning**

  Nest는 핸들러가 library-specific 한 방식을 사용하는 것을 나타내는 `@Res()` 혹은 `@Next()` 사용하는 것을 감지할 수 있다.
  만약 동시에 standard와 library specific한 방식을 사용할 경우 standard 접근 방식은 자동으로 disabled 되고 생각하는 대로 더이상 동작하지 않는다.
  두개의 방식을 동시에 사용하고 싶다면, `@Res({ passthrough: true })` 같이 반드시 옵션을 설정해야 한다.

## Request object

---

핸들러들은 종종 클라이언트 요청에 대한 상세한 정보에 접근할 필요가 있다. Nest 프레임워크는 플랫폼 아래서 **request object**에 접근하는 방법을 제공한다. Nest 프레임워크에서는 `@Req()` 데코레이터를 핸들러 메서드의 시그니쳐에 추가함으로써 요청 객체를 Nest 프레임워크가 주입 할 수 있도록 지시할 수 있다.

```tsx
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

express 요청 객체에 대한 타입 지원이 필요하다면 `@types/express` 패키지를 설치하면 된다.

request object는 HTTP 요청을 나타내고, query string, parameters, headers, body 등과 같은 프로퍼티들을 가진다.

NestJS에서는 이러한 프로퍼티들을 직접 수동으로 사용하지 않고, 데코레이터를 통해서 사용할 수 있다.

Nest 프레임워크는 HTTP 플랫폼들 (Express와 Fastify 등)간의 타입 호환성을 위해서 `@Res()` 와 `@Response()` 데코레이터들을 제공한다.

`@Res()` 는 단순히 `@Response()` 의 별칭이다. 이 두개의 데코레이터들은 네이티브 플랫폼의 response 객체의 인터페이스에 직접적으로 관련이 있다.

위의 데코레이터들 사용할 때에는 각 플랫폼에 해당하는 타입 정의를 import 하여 사용하면 된다.

`@Res()` or `@Response()` 를 메서드 핸들러에서 주입을 할 땐, Nest 프레임워크에서 해당 핸들러를 Library-specific mode로 인식하는 것을 기억하고 사용할 때에는 response를 잘 관리하도록 주의를 기울여야한다.

## Resources

---

Nest 프레임워크는 모든 표준 HTTP 메서드를 데코레이터들을 통해서 제공한다.

- `@Get()`
- `@Post()`
- `@Put()`
- `@Delete()`
- `@Patch()`
- `@Options()`
- `@Head()`
- `@All()` : 모든 요청을 처리하는 엔드포인트를 정의

## Route Wildcards

---

Nest 프레임워크는 패턴 기반의 라우팅 또한 지원한다. 예를들어, 와일드 카드(asterisk) 를 사용하여 어떠한 문자열의 조합을 매칭할 수도 있다.

- ?, +, \*, () 를 라우트 경로로 사용하고, 정규 표현식으로 사용 가능
- 하이픈(-) 과 점 (.) 은 문자열 기반 경로로 문자 그대로 해석된다.

```ts
@Get('ab*cd')
findAll() {
	return 'THis route uses a wildcard';
}
```

## Status Code (상태 코드)

---

Status Code는 POST 요청 (201 status code) 를 제외하고 항상 기본적으로 200 이다.

핸들러 레벨에서 `@HttpCode(...)` 데코레이터를 추가하여 동작을 쉽게 변경할 수 있다.

`@HttpCode()` 데코레이터는 `@nestjs/common` 로부터 가져온다.

```ts
@Post()
@HttpCode(204)
create() {
	return 'This action adds a new cat';
}
```

## Header (헤더)

---

사용자 지정 응답 헤더를 사용하려면 `@Header()` 데코레이터를 사용하거나 라이브러리 별 응답 객체를 사용하고 `res.header()` 를 직접 호출 할 수도 있다.

`@Header()` 데코레이터는 `@nestjs/common` 으로 부터 가져온다.

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
	return 'This action adds a new cat';
}
```

## Redirection

---

응답을 특정 URL로 redirection 하려면 `@Redirect()` 데코레이터 혹은 `res.redirect()` 를 사용하면 된다.

`@Redirect()` 데코레이터는 필수적으로 url을 입력받고 선택적으로 status Code를 입력받는다. 입력을 생략한다면 디폴트로 302 를 사용한다.

```ts
@Get()
@Redirect('https://nestjs.com', 301)
```

가끔은 동적으로 redirect URL 혹은 HTTP Status code를 반환하기를 원할 때는 핸들러 메서드로 부터 다음과 같은 모양의 오브젝트를 반환하면 된다.

```ts
{
	"url": string,
	"statusCode": number
}
```

위의 반환되는 값들은 `@Redirect()` 데코레이터로 입력되는 값들을 오버라이드한다.

```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
	if (version && verion === '5') {
		return { url: 'https://docs.nestjs.com/v5/ };
	}
}
```
