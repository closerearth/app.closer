# [Closer](https://closer.earth)

The platform for sovereign communities.

## API

This platform is developed on top of the Closer API.


## Add new project

* Add nginx config to /etc/nginx/MYDOMAIN.ORG
```
server {
  server_name MYDOMAIN.ORG;
  access_log off;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://localhost:PORT;
    proxy_redirect off;
    proxy_http_version 1.1;
  }
}
```
* Reload nginx `service nginx reload`
* Start the pm2 process
```
pm2 start --name "mydomain.co" npm -- start;
pm2 save
```
* Add an SSL cert
```
certbot --nginx -d MYDOMAIN.ORG
```
