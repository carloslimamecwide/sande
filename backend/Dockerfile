# Backend Dockerfile - Produção
FROM node:20-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    npm ci --only=development

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Runner - apenas dependências de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar apenas dependências de produção
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copiar código compilado e Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Executar migrations e arrancar servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
