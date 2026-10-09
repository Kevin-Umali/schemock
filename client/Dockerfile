FROM oven/bun:1.4.2 AS bun-runtime

FROM node:24.21.0-bookworm-slim AS build
COPY --from=bun-runtime /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app/client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile

COPY client/ ./

ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN bun run lint && bun run build

FROM nginxinc/nginx-unprivileged:stable-alpine3.24@sha256:15c994d10d6d78658721c3bcafff14cb281fba2a4bdf9d5ba92c416a472516e3 AS release
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 8080
