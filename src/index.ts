import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static"
import { prisma } from "../prisma";
import cors from "@elysiajs/cors";
import { env } from "bun";
import country from "./country";
import events from "./events";

const radio = new Elysia();

radio.use(cors())

radio.use(staticPlugin({prefix: ""}))

radio.get("/", () => { return { "You're now listening to : ": "Radio norn" } });

radio.guard({
  beforeHandle({ set, headers }) {
    const token = headers['authorization'];
    if (token !== env.DEV_TOKEN) {
      set.status = "Unauthorized"
      return "You're not authorized"
    }
  }
}, (app) => app.use(country).use(events))


radio.listen(8000);

console.log(
  `🚀 Server is running at ${radio.server?.hostname}:${radio.server?.port}`
);
