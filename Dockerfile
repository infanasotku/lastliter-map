FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.29.6-alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/dist ./

RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080
STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
