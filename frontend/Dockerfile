# Build stage
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Default backend URL (matches docker-compose service name)
ENV BACKEND_URL="http://backend:8080"

# Create a startup script to dynamically generate the NGINX configuration
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-generate-config.sh && \
    echo 'cat <<EOF > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo 'server {' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '    listen 80;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '    location / {' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        root /usr/share/nginx/html;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        index index.html index.htm;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        try_files \$uri \$uri/ /index.html;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '    }' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '    location /api/ {' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        proxy_pass '"\${BACKEND_URL}"'/api/;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        proxy_set_header Host \$host;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '        proxy_set_header X-Real-IP \$remote_addr;' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '    }' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo '}' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo 'EOF' >> /docker-entrypoint.d/40-generate-config.sh && \
    chmod +x /docker-entrypoint.d/40-generate-config.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
