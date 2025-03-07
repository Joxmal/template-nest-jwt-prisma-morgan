# Install dependencies only when needed
FROM node:20.14.0-alpine3.19 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install 

# Build the app with cache dependencies
FROM node:20.14.0-alpine3.19 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM node:20.14.0-alpine3.19 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

        # RUN npx prisma generate
        # RUN npx prisma migrate deploy
RUN npm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000
CMD [  "npm", "run", "start:migrate:prod" ]
