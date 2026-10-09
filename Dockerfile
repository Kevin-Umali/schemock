FROM oven/bun:1.4.2 AS bun-runtime

# Node is used by Vite, ESLint, and Vitest; Bun installs and bundles the API.
FROM node:24-bookworm-slim AS build
COPY --from=bun-runtime /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY client/package.json client/bun.lock ./client/
RUN cd client && bun install --frozen-lockfile
COPY . .
RUN bun run check && bun run build

FROM bun-runtime AS release
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --from=build --chown=bun:bun /app/client/dist ./client/dist
COPY --from=build --chown=bun:bun /app/package.json ./package.json
USER bun
EXPOSE 3000
CMD ["bun", "dist/index.js"]
