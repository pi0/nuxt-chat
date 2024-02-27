# Base
FROM oven/bun as base

# Deps
FROM base AS deps
WORKDIR /src
COPY package.json bun.lockb /src/
RUN cd /src && bun install --production --frozen-lockfile --ignore-scripts

# Build
FROM base AS build
WORKDIR /src
COPY --from=deps /src/node_modules node_modules
COPY . .
RUN NODE_ENV=production bun run build

# Production
FROM --platform=arm64 oven/bun:distroless AS production
COPY --from=build /src/.output /app
EXPOSE 3000/tcp
ENV HOST=0.0.0.0
CMD [ "/app/server/index.mjs" ]
