# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/tsconfig.json ./apps/backend/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source files
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/tsconfig.build.json ./apps/backend/

# Build the application
RUN pnpm --filter @app/backend build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY apps/backend/package.json ./apps/backend/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /usr/src/app/apps/backend/dist ./apps/backend/dist

EXPOSE 3010

# Start the application
CMD ["node", "apps/backend/dist/main"]
