# Dockerfile for Rawaa Platform Production Deployment
# Optimized for Saudi hosting environment

FROM node:20-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

# Build stage
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .
RUN npm run build

# Production stage
FROM base AS production
RUN apk add --no-cache curl

COPY --from=build /app /app

EXPOSE 3000
EXPOSE 3001

CMD ["dumb-init", "/bin/sh", "-c", "npm run start:prod"]