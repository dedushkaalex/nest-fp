export enum BaseErrorsType {
  NOT_FOUND = 'NOT_FOUND', // 404 - ресурс не найден (user, order и т.д.)
  INCORRECT_DATA = 'INCORRECT_DATA', // 400/422 - некорректные входные данные
  UNKNOWN = 'UNKNOWN', // 500 - непредвиденная серверная ошибка
  ALREADY_DONE = 'ALREADY_DONE', // 409 - операция уже выполнена (user уже существует)
  RETRY_LATER = 'RETRY_LATER', // 429/503 - повторите позже (rate limit, service busy)
  UNAUTHORIZED = 'UNAUTHORIZED', // 401 - не авторизован (нет токена)
  FORBIDDEN = 'FORBIDDEN', // 403 - нет прав доступа
}
