# Node.js production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

# Stage 2
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=5000

USER node

EXPOSE 5000

CMD ["npm", "start"]
