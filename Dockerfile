FROM node:6

MAINTAINER Soichi Hayashi <hayashis@iu.edu>

RUN apt-get update && apt install -y vim 

RUN npm install http-server -g && \
    npm install pm2 -g && \
    pm2 install pm2-logrotate

COPY . /app
RUN cd /app && npm install --production 
#RUN cd /app/ui && npm install && npm run build

#EXPOSE 80
EXPOSE 8080

CMD [ "/app/docker/start.sh" ]
