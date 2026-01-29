FROM node:25.5.0-alpine3.23
COPY ./ ./
RUN npm install 
CMD ["npm","start"]
