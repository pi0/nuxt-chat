# Base
FROM oven/bun:1 as base

# Deps
FROM base AS deps
WORKDIR /src
COPY package.json bun.lockb /src/
RUN cd /src && bun install --frozen-lockfile

# Build
FROM base AS build
WORKDIR /src
COPY --from=deps /src/node_modules node_modules
COPY . .
RUN NODE_ENV=production bun run build

# Production
FROM base AS production
COPY --from=build /src/.output /app
USER bun
EXPOSE 3000/tcp
ENV HOST=0.0.0.0
ENTRYPOINT [ "bun", "run", "/app/server/index.mjs" ]
