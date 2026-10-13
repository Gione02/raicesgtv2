# Etapa 1: compila el CSS de Tailwind y genera data/productos.json para la app móvil
FROM node:20-alpine AS css

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY tailwind.config.js ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY public/ ./public/
RUN npm run build

# Etapa 2: sirve el sitio estático con nginx
FROM nginx:alpine

COPY public/ /usr/share/nginx/html/
COPY --from=css /build/public/css/styles.css /usr/share/nginx/html/css/styles.css
COPY --from=css /build/public/data/ /usr/share/nginx/html/data/
