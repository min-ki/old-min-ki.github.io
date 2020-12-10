---
title: 'NestJS - Exception filters'
date: '2020-12-10T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-exception-filters'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
  - 'exception-filters'
description: 'NestJS 공식문서 Overview - Exception-filters를 정리한 내용입니다.'
---

## Exception filters

- Nest 프레임워크는 애플리케이션 전체에서 처리되지 않은 모든 예외 처리를 담당하는 내장된 예외 계층이 제공된다.
- 애플리케이션 단에서 코드를 통해 예외처리를 핸들링 하지 않을 경우, **예외 계층(excetions layer)을 통해서** 자동적으로 사용자 친화적인 응답을 보내준다.

![filter-](/nestjs/Filter_1.png)

- 상자 밖에서, 이러한 행동들은 HttpException 혹은 HttpException의 서브클래스 타입의 예외를 처리하는 내장된 **글로벌 예외 필터(global exception filter)**에 의해서 수행된다.
- 예외를 인식할 수 없는 경우(HttpException 이 아니거나 혹은 HttpException 으로부터 상속받은 클래스가 아닌 경우), 내장된 예외 필터는 다음과 같은 기본 JSON 응답을 생성한다.

```ts
{
	"statusCode": 500,
	"message": "Internal server error"
}
```

### Throwing standard exceptions

- Nest 프레임워크는 **@nestjs/common** 패키지로부터 내장된 **HttpException** 클래스를 제공한다.
- 전형적인 HTTP REST/GraphQL API 기반의 애플리케이션들의 경우, 특정 오류 조건이 발생할 때 표준 HTTP 응답 객체를 전송하는 것이 최선의 방법이다.

```ts
// cats.controller.ts

@Get()
async findAll() {
	// HttpStatus enum을 사용 -> @nestjs/common 패키지의 helper enum
	throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

- 위의 경로로 요청을 보낸다면, 다음과 같은 응답을 볼 수 있다.

```ts
{
	"statusCode": 403,
	"message": "Forbidden"
}
```

- HttpException 클래스의 생성자는 응답(response)를 결정하기 위한 두 개의 필수 인자를 취한다.
  - response 인자는 **JSON response body**를 정의한다. (string or object)
  - status 인자는 HTTP **status code**를 정의한다.
- 기본적으로 JSON response body는 두 개의 프로퍼티를 포함한다.
  - statusCode: status 인자에 제공된 HTTP status code를 기본으로 설정
  - message: status에 기초한 HTTP 에러의 짧은 설명
- JSON response body의 메세지 부분을 단지 오버라이딩 하고싶다면 **HttpException("error message", HttpStatus.FORBIDDEN)** 와 같이 첫 번째 인자에 문자열만 넘겨주면 된다.
- 전체 JSON response body를 오버라이딩 하고싶다면, response 객체를 전달해주면 된다.
- Nest는 전달해준 response 객체를 직렬화하고, 이것을 JSON response body로 반환해준다.
- 두 번째 인자인 status는 유효한 HTTP status code가 되야한다.
- Best practice는 **@nestjs/common의 HttpStatus enum**을 사용하는 것이다.

```ts
// cats.controller.ts

@Get()
async findAll() {
	throw new HttpException({
		status: HttpStatus.FORBIDDEN, // HttpStatus enum
		error: 'This is a custom message',
	}, HttpStatus.FORBIDDEN); // HttpStatus enum
}
```

```ts
// 위의 에러는 다음과 같은 response 객체를 반환한다.

{
	"status": 403, // FORBIDDEN
	"error": "This is a custom message"
}

```

### Custom exceptions

우리는 애플리케이션을 작업하면서 많은 경우에 커스텀한 예외를 작성할 필요가 별로 없을 것이다. 그러므로, 우리는 단지 내장된 Nest HTTP exception을 사용하면 된다.

만약에 커스텀한 예외를 만들어야할 필요가 있다면 우리는 HttpException class 로부터 상속받은 커스텀한 예외 계층을 가지면 된다.

이러한 이러한 접근 방식을 통해서, Nest 프레임워크는 커스텀한 예외들을 인식하고, 자동으로 에러 응답 객체를 처리해줄것이다.

```ts
// forbidden.exception.ts

export class ForbiddenException extends HttpExcetion {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

위의 HttpException으로부터 확장된 ForbiddenException 예외 클래스는 내장된 예외 핸들러와 잘 작동하므로 findAll() 메서드 내부에서 사용이 가능하다.

```ts
// cats.controller.ts

@Get()
async findAll() {
	throw new ForbiddenException();
}
```

BuddenException은 기본 HttpException을 확장하므로 내장된 예외 핸들러와 원활하게 작동하므로 findAll() 방식 내에서 사용할 수 있다.

### Built-in HTTP exceptions

Nest 프레임워크는 HttpException로부터 상속받은 표준 예외 들의 집합을 제공한다. 이것들은 @nestjs/common 패키지를 통해 사용 가능하며, 대부분의 공통 HTTP 예외들을 나타낸다.

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

### Exception filters

내장된 예외 필터는 자동적으로 대부분의 케이스들을 처리할 수 있다. 하지만 가끔은 예외 계층에 대한 완전한 제어를 하고 싶을 경우가 있다. 예를들어, 로깅을 추가하거나 외부 요인에 기반한 다른 JSON 스키마를 사용하고싶을 수 있다. 이를 위해서, 예외 필터(exception filter)는 위의 예시를 든 경우들을 위한 목적으로 디자인 되었다.

```ts
// http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Request, Resposne } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
```

HttpException 클래스의 인스턴스인 예외를 캐치하고 이에 대한 사용자 정의 응답 로직을 구현하는 것을 담당하는 예외 필터를 만들기 위해서는 기본 플랫폼 요청 및 응답 객체에 접근 해야 한다.

- 모든 예외 필터들은 **ExceptionFilter<T>** 인터페이스의 제네릭으로 구현되어야한다.
- 위를 위해서 catch(exception: T, host: ArgumentsHost) 메소드를 구현해야한다.
- T는 예외의 타입을 나타낸다.

**@Catch(HttpException)** 데코레이터는 Nest 프레임워크에게 구현하고자 하는 예외 필터가 HttpException 유형의 예외를 찾고 있다는 것을 알려, 예외 필터에 필요한 메타데이터를 바인딩한다.

@Catch() 데코레이터는 단일 매개변수 또는 쉼표로 구분된 목록을 사용할 수 있다. 이를 통해 여러 유형의 예외에 대한 필터를 동시에 설정할 수 있다. ex) @Catch(Exception1, Exception2)

### Arguments host

- catch() 메소드의 파라미터들에 대해서 알아본다.
- exception 매개변수는 현재 통과되어지고 있는 예외 객체이다.
- host 매개변수는 ArgumentsHost 객체이다.
- ArgumentsHost는 강력한 유틸리티 객체이다. (더 자세한 내용은 execution context chapter 에서 알아본다.)

### Binding filters

Controller에 예외 필터를 적용하기 위해서는 @nestjs/common 패키지의 **@UseFilters()** 데코레이터를 사용하면 된다.

@Catch() 데코레이터와 유사하게, @UseFilters() 데코레이터는 하나의 필터 인스턴스를 인자로 취한다.

아래의 코드에서는 HttpExceptionFilter의 인스턴스를 생성해서 전달하였다.

```ts
// cats.controller.ts

@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
	throw new ForbiddenException();
}
```

또한, 인스턴스 대신에 클래스를 전달함으로써 의존성 주입을 활성화 할 수 있다.

```ts
// cats.controller.ts

@Post()
@UseFilters(HttpExceptionFilter) // 클래스를 전달
async create(@Body() createCatDto: CreateCatDto) {
	throw new ForbiddenException();
}
```

가능하다면 인스턴스 대신에 클래스를 전달함으로써 필터를 적용하는 방식을 사용하는 것이 좋다. 왜냐하면, Nest에서 전체 모듈에서 **동일한 클래스에 대해서 하나의 인스턴스만 사용하므로** **메모리 사용을 줄일 수 있다**.

위의 예제에서, HttpExceptionFilter는 오직 method-scoped로써 create() 라우트 핸들러에만 적용되었다.

예외필터(Exception filters)들은 다른 레벨의 범위(scope)를 가질 수 있다.

- method-scoped
- controller-scoped
- global-scoped

ex) controller scoped

아래의 코드는 CatsController 내부의 모든 라우트 핸들러에 HttpExceptionFilter를 적용하는 코드이다.

```ts
// cats.controller.ts

@UseFillters(new HttpExceptionFilter())
export class CatsController {}
```

ex) global-scoped

- useGlobalFilters() 메서드는 게이트웨이 혹은 하이브리드 애플리케이션에 대한 필터를 설정하지 않는다.
- global-scoped filters는 모든 컨트롤러와 모든 라우트 핸들러 전체 애플리케이션에서 사용된다.

```ts
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

boostrap();
```

- 의존성 주입의 관점에서, 어떠한 모듈 외부에서 등록한 글로벌 필터는 어떠한 모듈의 컨텍스트 외부에서 수행되기 때문에 의존성을 주입할 수 없다.
- 이러한 의존성 주입 문제를 해결하기 위해 다음과 같은 방법을 사용하여 어떤 모듈에서든 직접 전역 범위 필터를 등록할 수 있다.

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
```
