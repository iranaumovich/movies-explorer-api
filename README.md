# Бэкенд проекта Movie Search

В проекте Movie Search используется два бекенда:

`1` MoviesExplorer — сервис поиска фильмов по ключевым словам (все эндпоинты и документация к сервису были предоставлены).

`2` API для аутентификации пользователей и сохранения фильмов. Этот бэкенд был написан самостоятельно.

Для бэкенда проекта использовалось две сущности - пользователи и сохранённые фильмы (users и movies), для которых созданы схемы и модели, а также созданы роутеры и контроллеры, реализована аутентификация и авторизация, настроены файлы для хранения логов. Пароли хранятся в зашифрованнм виде, данные, приходящие в теле и параметрах запроса валидируются, ошибки обрабатываются централизованно.
