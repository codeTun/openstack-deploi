ARG NODE_VERSION=20.16.0
ARG PNPM_VERSION=10.10.0

# Base image
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm@${PNPM_VERSION}

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS build
COPY . .

# Generate Prisma Client (IMPORTANT)
RUN pnpm prisma generate

# Build Next.js
RUN pnpm run build

# Final lightweight image
FROM base AS final
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/prisma ./prisma

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Generate Prisma Client in production image
RUN pnpm prisma generate

# Fix permissions for node_modules (Prisma needs to write)
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

# Use entrypoint script to run migrations before starting
ENTRYPOINT ["./docker-entrypoint.sh"]
