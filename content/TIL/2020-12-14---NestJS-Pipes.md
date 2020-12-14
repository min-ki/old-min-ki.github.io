---
title: 'NestJS - Pipes'
date: '2020-12-14T22:00:00.000Z'
template: 'post'
draft: false
slug: 'nestjs-pipes'
category: 'TIL'
tags:
  - 'NestJS'
  - 'Framework'
  - 'Pipes'
description: 'NestJS 공식문서 Overview - Pipes를 정리한 내용입니다.'
---

## Pipes (파이프)

파이프는 **@Injectable()** 데코레이터로 annotated된 **클래스이다.** Pipes는 **PipeTransform interface**를 구현한다.

![pipes](/nestjs/Pipe_1.png)

파이프는 전형적으로 두 가지의 사용 사례가 있다.

- **transformation**: 입력데이터를 원하는 형태로 변환한다. (예를들어 문자열을 정수형 타입으로 변환)
- **validation:** 입력데이터를 평가하고 유효하다면, 변경하지않고 통과시키고 데이터가 정확하지 않아 유효하지않다면 에러를 발생시킨다.

위의 두가지 사례에서, 파이프는 컨트롤러의 route handler에 의해 전달되어지고 있는 arguments 위에서 작동한다. **Nest 프레임워크에서는 파이프를 메서드가 호출되기 전에 위치시키고, 파이프는 메서드에 대해 정해진 인수를 받아 그 위에서 작동한다.** 모든 **transformation(변환)** 또는 **validation(유효성 검사)** 작업은 그 시간에 수행되며, 그 후에 (잠재적으로) 변환된 인수와 함께 route handler가 호출된다.

Nest 프레임워크에서는 여러 개의 내장된 파이프들이 있다. 또한, **커스텀한 파이프도 만들 수 있다.**

파이프는 exceptions zone 내부에서 동작한다.

위의 말의 뜻은, 파이프가 예외를 발생시킬 때 예외 계층(글로벌 예외 필터 및 현재 컨텍스트에 적용되는 모든 예외 필터)에 의해 처리 됨을 의미한다. 이러한 사항에 유의해서, **파이프에서 예외가 발생할 때 뒤에 오는 컨트롤러 메서드가 실행되지 않는다는 점을 명확하게 알아야한다**. 이러한 점은 **시스템의 경계에서 외부 소스로부터 애플리케이션으로 들어오는 데이터를 검증**할 수 있는 것에 대해서 최선의 기법을 사용할 수 있다는 것이다.

### Built-in Pipes (내장 파이프)

Nest 프레임워크는 6가지의 내장형 파이프를 제공한다.

- ValidationPipe
- ParseIntPipe (transformation)
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe

⇒ **@nestjs/common** 패키지로부터 exported 되어진다.

### Binding pipes

파이프를 사용하려면, 파이프 클래스의 인스턴스를 적절한 컨텍스트에 바인딩 해야한다.

```tsx
// findOne 메서드가 실행되기 전에 ParseIntPipe가 실행되어진다.
// Parameter 레벨에서 바인딩을 함으로써 참조한다.
// findOne 메서드가 정수형을 받게끔 보장해주거나 에러를 발생시켜준다.
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
	return this.catsService.findOne(id);
}
```

만약, 아래와 같이 요청을 보낸다면 다음 에러를 볼 수 있다.

```tsx
GET localhost:3000/abc
```

```tsx
{
	"statusCode": 400,
	"message": "Validation failed (numeric string is expected)",
	"error": "Bad Request"
}
```

예외는 findOne() 메서드의 로직을 실행하는 것을 막는다. 위의 예제에서, 인스턴스가 아닌 ParseIntPipe라는 파이프 클래스를 전달했다. 이것은 **인스턴스화의 책임을 프레임워크에게 넘기고 의존성 주입을 할 수 있게 하겠다는 것**이다.

파이프 혹은 가드로써, 클래스 대신에 인스턴스를 전달할 수 있다. 만약에 내장된 파이프를 커스텀하게 동작을 시키고 싶다면 다음과 같이 인스턴스를 전달하면된다.

```tsx
@Get(':id')
async findOne(
	@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
	id: number,
) {
	return this.catsService.findOne(id);
}
```

다른 transformation 파이프들 바인딩 하는 것도 (Parse로 시작하는 파이프들) 또한 비슷하게 작동한다.

이러한 모든 파이프들은 유효한 route의 파라미터들의 쿼리 스트링 파라미터들이나 request body values 들의 컨텍스트 내에서 잘 동작한다.

```tsx
// query string parameter example
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
	return this.catsService.findOne(id);
}
```

```tsx
// ParseUUIDPipe -> string 파라미터를 파싱하고 UUID가 유효한지 체크
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
	return this.catsService.findOne(uuid);
}
```

**NOTE**

ParseUUIDPipe()는 기본적으로 UUID Version 3,4,5 를 파싱한다. 하지만 만약에 특정한 버전의 UUID 만 필요하다면 파이프 옵션으로 버전을 전달하면 된다.
