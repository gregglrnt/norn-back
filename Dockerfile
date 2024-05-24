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
ENV POSTGRES_PRISMA_URL "postgres://postgres.lnbyxvvmjrltgdrjwicf:k2@URPF!&4WQvCJ*45@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
ENV BACK_URL "http://127.0.0.1"
ENV DEV_TOKEN "RJAX8Bfu2ny8PbUFaeZFbydeiSAAb2TWgBtAf"

CMD ["bun", "start"]

EXPOSE 3000