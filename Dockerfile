# PROD-STEG: nginx-server for ferdig bygget app
FROM nginx:stable-alpine AS frontend

# Bygget må ligge i 'dist/' (pakkes ut i workflow)
COPY dist/ /usr/share/nginx/html

# Nginx-konfig som støtter SPA (React routing)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
