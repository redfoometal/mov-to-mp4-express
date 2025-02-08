# Проект: Конвертация MOV в MP4

## 📌 Описание

Этот проект представляет собой сервис для конвертации видеофайлов формата `.mov` в `.mp4`, используя `ffmpeg` и `fluent-ffmpeg`.

## 🚀 Запуск проекта

### 1. Убедитесь, что у вас установлен Docker

Если у вас еще не установлен Docker, скачайте и установите его с [официального сайта](https://www.docker.com/).

### 2. Склонируйте репозиторий

```sh
git clone https://github.com/redfoometal/mov-to-mp4-express.git
cd app-mov-to-mp4
```

### 3. Настройка переменных окружения

В корневой директории находится файл `.env.example`, который содержит список необходимых переменных окружения. Вы можете скопировать его и создать свой `.env` файл:

```sh
cp .env.example .env
```

Если `.env` файл отсутствует, по умолчанию будут использованы следующие значения:

```env
PORT=4000
API_URL=http://localhost:4000
```

### 4. Соберите и запустите контейнер

```sh
docker compose up -d
```

### 5. Остановка контейнера

```sh
docker compose down
```

## 📡 Использование API

### 1. Загрузка видео на сервер

**Запрос:**

```sh
curl -X POST http://localhost:4000/upload \
  -F "video=@example.mov"
```

**Ответ (успешно, `200 OK`):**

```json
{
    "download_url": "http://localhost:4000/download/1739008913501.mp4"
}
```

---

### 2. Скачивание конвертированного видео

**Запрос:**

```sh
curl -O http://localhost:4000/download/1739008913501.mp4
```

---

## 📂 Postman Collection

Вы можете импортировать коллекцию в Postman для удобного тестирования API.  
[📥 Скачать коллекцию](mov-to-mp4.postman_collection.json)

### **Импорт в Postman**
1. Откройте Postman.  
2. Нажмите **Import** → **Upload Files**.  
3. Выберите `postman_collection.json`.  
4. Коллекция появится в вашем списке.  

