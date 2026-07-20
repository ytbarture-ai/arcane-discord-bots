FROM node:22-alpine

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm@10.26.1

# Copier les fichiers workspace
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copier les packages nécessaires
COPY lib/ lib/
COPY artifacts/api-server/ artifacts/api-server/

# Installer les dépendances (ignorer le preinstall check)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Build
RUN pnpm --filter @workspace/api-server run build

EXPOSE 8080

CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]
