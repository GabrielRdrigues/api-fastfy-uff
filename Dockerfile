FROM node:24-alpine AS dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate

FROM dependencies AS builder
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm run build

FROM dependencies AS migrator
CMD ["npx", "prisma", "migrate", "deploy"]

FROM node:24-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=dependencies /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/dist ./dist
USER node
EXPOSE 3333
CMD ["node", "dist/src/main/server.js"]
