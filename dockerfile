FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist

RUN yarn install --only=production
EXPOSE 3000
CMD ["node", "dist/main.js"]