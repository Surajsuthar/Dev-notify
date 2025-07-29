FROM node:20-alpine
ARG DATABASE_URL

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./
# Install dependencies first (better Docker layer caching)
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application with DATABASE_URL available
RUN DATABASE_URL="$DATABASE_URL" pnpm run build

EXPOSE 3000

# At runtime: migrate DB then start app
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm run start"]