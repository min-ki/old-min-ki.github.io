---
title: 'SQLAlchemy 커넥션 풀'
date: '2021-12-08T00:00:00.000Z'
template: 'post'
draft: false
slug: 'sqlalchemy-connection-pooling'
category: 'sqlalchemy'
tags:
  - 'sqlalchemy'
  - 'connection-pool'
description: 'SQLAlchemy의 커넥션 풀의 공식문서에 대한 정리문서입니다.'
---

# Connection Pooling

커넥션 풀은 효율적으로 재사용을 위해 메모리 상에서 오래 지속되는 연결을 유지하기 위해 사용하는 표준 기술입니다. 또한, 애플리케이션이 동시에 사용할 수 있는 커넥션의 전체 수를 관리할 수 있도록 제공해줍니다.

특히 서버 사이드 웹 어플리케이션 측면에서, 커넥션 풀은 요청들 사이에서 재사용되기 위해 메모리 상에 있는 활성화된 데이터베이스 연결의 풀을 유지하기위한 표준 방안입니다.
SQLAlchemy는 몇가지의 커넥션 풀 구현체 (Engine과 통합하기 위한) 구현체를 포함합니다.

### Connection Pool Configuration

- 대부분의 경우 create_engine()에 의해 반환된 Engine은 사전에 합리적인 기본값으로 설정된 통합된 QueuePool을 가지고 있습니다.
  - pool_size
  - max_overflow
  - pool_recycle
  - pool_timeout

```python
engine = create_engine('postgresql://me@localhost/mydb', pool_size=20, max_overflow=0)
```

테스트 혹은 개발을 목적으로 SQLite를 사용하는 경우에는, SingletonThreadPool 혹은 NullPool이 커넥션풀 구현체로 사용되어집니다.
모든 SQLAlchemy pool 구현체들은 미리 DB Connection Pool을 만들지 않습니다. 모든 구현체들에서 커넥션은 처음 사용 요청이 들어오는 시점에 커넥션이 생성됩니다.
또한, 이때 추가적인 동시 요청이 없으면 추가적인 연결은 생성되지 않습니다.

이러한 이유로, create_engine()은 애플리케이션이 실제로 대기열에 있는 5개의 연결이 필요한지 여부에 관계없이 크기가 5인 큐풀을 사용하는 것이 좋습니다. 이 풀은 애플리케이션이 실제로 5개의 연결을 동시에 사용하는 경우에만 해당 크기로 커집니다. 이 경우 작은 풀의 사용은 완전히 허용됩니다.

### 커넥션 풀 구현체

create_engine() 에서 다른 유형의 커넥션 풀 구현체를 사용하고 싶다면 poolclass argument를 사용하면 됩니다. poolclass argument는 `sqlalchemy.pool` 모듈에서 임포트되어진 커넥션 풀 구현체의 클래스를 인자로 받습니다.

```python
from sqlalchemy.pool import QueuePool

engine = create_engine('sqlite://file.db', poolclass=QueuePool)
```

```python
from sqlalchemy.pool import NullPool

engine = create_engine(
	'postgresql+psycopg2://scott:tiger@localhost/test',
	poolclass=NullPool
)
```

### 커스텀 커넥션 함수 사용

[SQLAlchemy 1.4 Documentation](https://docs.sqlalchemy.org/en/14/core/engines.html#custom-dbapi-args)

### 커넥션 풀의 생성

```python
import sqlalchemy.pool as pool
import psycopg2

def getconn():
	c = psycopg2.connect(user='ed', host='127.0.0.1', dbname='test')
	return c

# 아래와 같이 커넥션 풀을 만들 수 있다.
mypool = pool.QueuePool(getconn, max_overflow=10, pool_size=5)
```

위와 같이 커넥션 풀을 생성한 다음, `pool.connect()` 함수를 사용하여 풀에서 DB API 연결을 가져올 수 있다.

`pool.connect()` 메서드의 반환 값은 Transparent Proxy (Forward Proxy) 방식의 DB API 연결이다.

```python
# 커넥션 획득
conn = mypool.connect()

# 커넥션을 통해 커서를 획득한다.
cursor_obj = conn.cursor()
cursor_obj.execute("select foo")
```

Transparent Proxy의 목적은 DB API 커넥션이 종료되어지는 것 대신에, `close()` 메서드의 호출을 가로채는 것 대신에 풀에 연결을 반환한다. (재사용을 위해서)

```python
# 커넥션 풀을 종료하면 Transparent Proxy가 호출을 가로채 이것을 풀에 반환한다.
conn.close()
```

프록시는 또한 garbage collected 될때 풀에 포함된 DB API 연결을 반환하지만, 파이썬에서는 즉시 발생한다고 단정할 수 없다. 이러한 방식은 권장되지 않으며 특히 비동기식 DB API 드라이버에서는 지원하지 않는다.

### Reset On Return

SQLAlchemy의 커넥션 풀은 "reset on return" 이라 불리는 기능을 포함합니다. 이름에서 유추가 가능하듯이 커넥션을 반환할때 리셋을 하는 기능입니다.

이 기능은 커넥션이 풀로 반환될때 DBAPI 커넥션의 `rollback()` 메서드를 호출합니다. 롤백을 통해서 기존 커넥션에 대한 트랜잭션이 제거되어 커넥션을 재사용 시 기존 상태가 남아 있지 않아있고, 테이블 및 행에 걸린 락이 해제되고 격리된 데이터 스냅샷이 제거되어집니다.

또한 롤백은 커넥션이 풀로 반환되기 직전에 롤백이 호출되었음을 커넥션이 보장할 수 있는 경우를 제외하고는 대부분 Engine Object를 사용할 때도 이 롤백이 발생합니다.
대부분의 DBAPI들에서 `rollback()` 메서드를 호출하는 것은 매우 값싼 동작이고 만약 DBAPI가 벌써 트랜잭션을 완료했다면, 롤백은 수행되지않습니다. 하지만, 커넥션에 상태가 없는 경우에도 `rollback()` 과 관련하여 성능 문제가 발생하는 DBAPI의 경우에는 풀의 **Reset On Return**기능을 비활성화 할 수 있습니다.

reset_on_return은 아래와 같은 조건에서는 실행을 중지해도 안전하다고 공식문서에 명시되어있습니다.

- MyISAM 엔진을 사용하는 MySQL을 사용하는 것과 같이 **데이터베이스가 트랜잭션을 전혀 지원하지 않거나** DBAPI가 **자동 커밋 모드**에서만 사용되는 경우
- NullPool을 사용하는 것과 같이 **커넥션을 유지하지 않는 경우**
- Application이 컨텍스트 관리자 또는 try/finally 스타일을 사용해 명시적으로 모든 연결 개체를 닫는 경우
- 커넥션이 명시적으로 종료되기 전까지는 가비지 컬렉션이 허용되지 않는 경우
- DBAPI Connection 자체가 사용되지 않거나, Application이 커넥션 풀에 반환되기 전에 커넥션에 대해 `rollback()` 이 실행되는 것을 보장하는 경우

"Reset on Return" 단계는 sqlalchemy.pool logger와 함께 `logging.DEBUG` 로그 레벨을 사용해서 로그를 확인하거나 create_engine()에서 `echo_pool='debug'` 를 설정하면 된다.

### Pool Events

SQLAlchemy는 커넥션 풀에서 발생하는 이벤트를 추적하기 위한 인터페이스를 제공합니다.

#### checkin

체크인 이벤트는 커넥션 풀로부터 커넥션을 반환할때 호출되어집니다. 이 이벤트는 두개의 인자를 제공합니다.

- dbapi_connection: DBAPI Connection
- connection_record: DBAPI Connection을 관리하는 \_ConnectionRecord

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'checkin')
def receive_checkin(dbapi_connection, connection_record):
    ...
```

#### checkout

체크아웃 이벤트는 커넥션 풀로부터 커넥션을 획득할 때 호출되어진다. 이 이벤트는 다음 세개의 인자를 제공한다.

- dbapi_connection: DBAPI Connection
- connection_record: DBAPI Connection을 관리하는 \_ConnectionRecord
- connection_proxy: Checkout 수명주기를 위한 DBAPI커넥션의 public interface로 관리하는 \_ConnectionFairy 프록시 객체

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'checkout')
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
    "listen for the 'checkin' event"

    # ... (event handling logic) ...
```

#### close

커넥션 풀과 관련된 종료 이벤트로 DBAPI 커넥션이 종료되어 풀에 반환되어질때 호출됩니다. 이 이벤트는 두개의 인자를 제공합니다.
커넥션의 종료는 종종 이미 커넥션이 종료되었기 때문에 실패할 수 있습니다. 그래서, 만약 종료에 대한 동작이 실패한다면 해당 커넥션은 버려집니다.

- dbapi_connection: DBAPI Connection
- connection_record: DBAPI Connection을 관리하는 \_ConnectionRecord

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'close')
def receive_close(dbapi_connection, connection_record):
    ...
```

#### close detached

위의 종료 이벤트는 DBAPI Connection의 종료가 풀로 반환되는 경우를 추적합니다. 하지만, 풀에 반환되는 것이 아닌 풀에서 분리되어 종료되는 커넥션을 추적하기위해서는 `close_detached` 를 사용해야합니다.

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'close_detached')
def receive_close_detached(dbapi_connection, connection_record):
    ...
```

#### connect

DBAPI 커넥션이 Pool을 위해 만들어지는 순간 호출되는 이벤트 리스너입니다.
이 이벤트를 통해서 DBAPI 모듈 수준의 .connect() 메서드가 사용된 지점을 캡처하여 새로운 DBAPI 연결을 생성할 수 있습니다.

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'connect')
def receive_connect(dbapi_connection, connection_record):
    ...
```

#### detach

DBAPI 연결이 커넥션 풀로부터 분리되었을때 호출되는 이벤트 리스너 입니다. 이 이벤트는 연결이 커넥션 풀로부터 분리되어지고 난 후에 발생합니다. 그러므로 인자로 주어진 connection_record (내부적으로 커넥션을 유지하기위해 참조되어지고 있는 객체)는 더이상 주어진 커넥션(dbapi_connection)과는 무관합니다.

```python
from sqlalchemy import event

@event.listens_for(EngineOrPool, 'detach')
def receive_detach(dbapi_connection, connection_record):
    ...
```

<!-- **first_connect**
정확하게 DBAPI 연결이 -->

<!-- **invalidate** -->
<!-- **reset** -->
<!-- **soft_invalidate** -->

#### 참고사항

[**\_ConnectionRecord**](https://docs.sqlalchemy.org/en/14/core/pooling.html#sqlalchemy.pool._ConnectionRecord)는 Pool에 의해 참조되는 각 DBAPI 커넥션을 유지하는 내부 객체

### Reference

- https://docs.sqlalchemy.org/en/14/core/pooling.html
- https://docs.sqlalchemy.org/en/14/core/events.html#sqlalchemy.events.PoolEvents
