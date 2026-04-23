FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --silent
COPY . .
EXPOSE 3000
ENV HOST=0.0.0.0
ENV BROWSER=none
CMD ["npm", "start"]
