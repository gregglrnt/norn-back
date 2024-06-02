FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY public public
COPY prisma prisma

RUN bun prisma generate

ENV NODE_ENV production
ENV BACK_URL "http://127.0.0.1"

CMD ["bun", "start"]

EXPOSE 3000