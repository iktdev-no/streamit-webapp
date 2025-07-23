FROM nginx:alpine

# Bygget må ligge i 'dist/' (pakkes ut i workflow)
COPY dist/ /usr/share/nginx/html

# Nginx-konfig som støtter SPA (React routing)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
