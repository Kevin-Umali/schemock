# Use the official Bun image
FROM oven/bun:1.1.17 AS base
WORKDIR /usr/src/app

# Install dependencies into a temporary directory
FROM base AS install
USER root
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from the temporary directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Run tests & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run build

# Copy production dependencies and source code into the final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist dist
COPY --from=prerelease /usr/src/app/package.json .

# Set up a non-root user
# RUN addgroup --system bun && adduser --system --ingroup bun bun
USER bun

# Expose the application port
EXPOSE 3000/tcp

# Run the app
ENTRYPOINT [ "bun", "run", "dist/index.js" ]
