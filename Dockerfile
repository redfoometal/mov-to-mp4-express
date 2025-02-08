FROM node:23.6.0-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# ---- Production image ----
FROM node:23.6.0-alpine AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем ffmpeg
RUN apk add --no-cache ffmpeg

# Копируем скомпилированные файлы из builder-а
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Запускаем приложение
CMD ["node", "dist/index.js"]
