# Статус реализации (Январь 2026)

На данный момент реализована и отлажена базовая функциональность модуля IAM.

**Готовые функции:**

- ✅ **Архитектура**: Заложена основа с использованием NestJS и `fp-ts` для надежной обработки ошибок через `TaskEither` и `EitherInterceptor`.
- ✅ **Регистрация (`signUp`)**: Создание пользователя с хешированием пароля (argon2).
- ✅ **Вход (`signIn`)**: Аутентификация по email/паролю.
- ✅ **Генерация токенов**: Создание JWT `access` и `refresh` токенов.
- ✅ **Передача токенов**: Установка токенов в `secure`, `httpOnly` куки с помощью `ApplyTokensInterceptor`.
- ✅ **Защита маршрутов**: Базовый `AuthGuard` для проверки `access` токена и защиты эндпоинтов.
- ✅ **Типизация**: Внедрена строгая типизация для `payload` токена и объекта `request`.
- ✅ **Конфигурация**: Настроено управление переменными окружения через `@nestjs/config`.
- ✅ **Интеграция с Redis**: Настроено подключение и сервис (`RefreshTokenIdsStorage`) для хранения `jti` токенов.
- ✅ **Ротация Refresh-токенов**: Реализована полная логика обновления токенов с ротацией и защитой от повторного использования.

**Функции, задокументированные, но еще не реализованные:**

- Выход из системы (`signOut`).
- Авторизация на основе ролей (`RolesGuard`).
- Специализированные декораторы (`@Auth`, `@ActiveUser`).

---

# Модуль управления доступом и идентификацией (IAM)

Этот модуль предоставляет комплексное решение для аутентификации и авторизации в приложениях NestJS. Он использует JWT (JSON Web Tokens) для безопасной аутентификации, реализует механизм ротации refresh-токенов и позволяет управлять доступом на основе ролей.

## Основные возможности

- Регистрация (`signUp`)
- Вход в систему (`signIn`)
- Выход из системы (`signOut`)
- Обновление токенов (`refreshToken`) с использованием ротации
- Защита маршрутов с помощью Guards
- Управление доступом на основе ролей
- Получение данных аутентифицированного пользователя через декоратор `@ActiveUser`

## Архитектура

Модуль спроектирован с использованием принципов функционального программирования, в частности библиотеки `fp-ts`. Это обеспечивает надежную обработку ошибок и композицию асинхронных операций.

```
     ********                   ▐ Сервер
     *      *   access token    ▐
     *      * <───────────────── ▐      Access token (короткоживущий)
     * Пользователь * ─────────────────> ▐ (Необходимо использовать метод `refreshToken` для получения нового)
     *      *                   ▐
     *      * ─────────────────> ▐
     *      * <───────────────── ▐
     ********   refresh token   ▐      Ротация refresh-токенов
                                ▐ (Возвращает новую пару access/refresh токенов)
```

## Установка и конфигурация

1.  **Импортируйте `IamModule`** в корневой модуль вашего feature-модуля (например `UsersModule`). `IamModule` является динамическим, что позволяет гибко его настраивать.

    ```typescript
    // Пример: user.module.ts
    import { Module } from '@nestjs/common';
    import { IamModule } from '@api/features/iam';
    import { User } from './user.entity';
    import { UsersController } from './users.controller';
    import { UsersService } from './users.service';

    @Module({
      imports: [
        IamModule.forRoot({
          entity: User,
          key: 'user', // Уникальный ключ для этой роли
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    })
    export class UsersModule {}
    ```

2.  **Настройте переменные окружения.** Модуль использует следующие переменные, которые должны быть определены в вашем `.env` файле:
    - `JWT_SECRET`: Секретный ключ для подписи JWT.
    - `JWT_ACCESS_TOKEN_TTL`: Время жизни access-токена (в секундах).
    - `JWT_REFRESH_TOKEN_TTL`: Время жизни refresh-токена (в секундах).
    - `JWT_AUDIENCE`: Аудитория токена.
    - `JWT_ISSUER`: Издатель токена.
    - `REDIS_URL`: URL для подключения к Redis (используется для хранения идентификаторов refresh-токенов).

## Аутентификация

Сервис `AuthenticationService` предоставляет основные методы для управления аутентификацией.

- `signUp(signUpDto: SignUpDto)`: Создает нового пользователя, хеширует пароль и возвращает пару токенов.
- `signIn(signInDto: SignInDto)`: Проверяет учетные данные, и в случае успеха возвращает пару токенов.
- `signOut(signOutDto: SignOutDto)`: Инвалидирует refresh-токен пользователя, делая невозможным его повторное использование.
- `refreshToken(refreshTokenDto: RefreshTokenDto)`: Принимает валидный refresh-токен, инвалидирует его и возвращает новую пару access/refresh токенов.

## Авторизация

### Защита маршрутов

Для защиты маршрутов используются два основных гарда: `AccessTokenGuard` и `AuthenticationGuard`.

- **`AccessTokenGuard`**: Проверяет наличие и валидность `access-token` в заголовке запроса. Должен применяться ко всем маршрутам, требующим аутентификации.

- **`AuthenticationGuard`**: Комбинированный гард, который можно настроить для определенного типа аутентификации.

Пример использования в контроллере:

```typescript
import { Auth } from './authentication/authentication.decorator';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.Bearer) // Указываем, что используется Bearer-аутентификация
@Controller('profile')
export class ProfileController {
  // ...
}
```

### Декоратор `@ActiveUser`

Используйте декоратор `@ActiveUser()` для получения данных о текущем аутентифицированном пользователе прямо в обработчике маршрута.

```typescript
import { Get } from '@nestjs/common';
import { ActiveUser } from '@api/features/iam';
import { IActiveUserData } from '@api/features/iam';

@Get()
getProfile(@ActiveUser() user: IActiveUserData) {
  return user;
}
```

### Управление ролями

Модуль поддерживает авторизацию на основе ролей.

1.  **Укажите роли** с помощью декоратора `@Role()` для контроллера или отдельного маршрута.
2.  **Примените `RolesGuard`** после гарда аутентификации.

```typescript
import { Role } from './authorization/decorators/role.decorator';
import { RolesGuard } from './authorization/guards/role.guard';
import { Auth } from './authentication/authentication.decorator';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Role('admin') // Доступ только для пользователей с ролью 'admin'
@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  // ...
}
```

## Ключевые компоненты

- **Guards**:
  - `AccessTokenGuard`: Валидирует JWT access token.
  - `AuthenticationGuard`: Обеспечивает аутентификацию на основе указанного типа.
  - `RolesGuard`: Проверяет, соответствует ли роль пользователя требуемой.
- **Services**:
  - `AuthenticationService`: Содержит основную логику аутентификации.
  - `RefreshTokenIdsStorage`: Сервис для управления хранилищем идентификаторов refresh-токенов в Redis.
- **Decorators**:
  - `@Auth()`: Применяет гарды аутентификации к маршруту.
  - `@ActiveUser()`: Инжектирует данные пользователя в обработчик маршрута.
  - `@Role()`: Задает требуемую роль для доступа к маршруту.
- **Interceptors**:
  - `ApplyTokensInterceptor`: Добавляет токены в куки ответа.
  - `RemoveTokensInterceptor`: Удаляет токены из куки ответа (например, при выходе).
