FROM nginx:1.25-alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuração customizada
COPY conf.d/app.conf /etc/nginx/conf.d/

# Cria certificado SSL autoassinado (para desenvolvimento)
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/CN=localhost"

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]