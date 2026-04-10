# Auth Service Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
ARG DATABASE_URL="postgresql://admin:secret@postgres:5432/products_db"
ARG DIRECT_URL="postgresql://admin:secret@postgres:5432/products_db"
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
RUN npx prisma generate

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY src ./src
COPY package*.json ./
EXPOSE 3003
CMD ["node", "src/index.js"]
