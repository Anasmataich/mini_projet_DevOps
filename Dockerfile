# Build stage
FROM node:18 AS builder
WORKDIR /app

# نسخ ملفات التعريف
COPY package*.json ./
RUN npm install

# نسخ كامل المشروع (يشمل src, public, index.html, vite.config.ts)
COPY . .

# بناء المشروع
RUN npm run build

# Production NGINX
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]