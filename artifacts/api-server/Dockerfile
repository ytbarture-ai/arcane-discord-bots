FROM node:22-alpine

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm@10.26.1

# Copier uniquement ce dossier (contexte = artifacts/api-server/)
COPY package.json ./
COPY build.mjs ./

# Installer les dépendances sans scripts (pas de preinstall check workspace)
RUN pnpm install --ignore-scripts

# Copier le reste du code source
COPY . .

# Build avec esbuild
RUN node build.mjs

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
