# שלב 1: בניית הקבצים הסטטיים של React
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# שלב 2: הגשת הקבצים באמצעות Nginx
FROM nginx:alpine
# אם הפרויקט נבנה ב-Vite הקבצים נשמרים ב-dist, אם ב-Create React App אז ב-build
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]