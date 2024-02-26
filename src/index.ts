import { Elysia} from "elysia";
import { prisma } from "../prisma";
import cors from "@elysiajs/cors";
import { env } from "bun";

const auth = new Elysia().state('auth', 1).onBeforeHandle(({headers, set}) => {
  const token = headers['authorization'];
  if(token !== env.DEV_TOKEN) {
    set.status = "Unauthorized"
    return "You're not authorized"
  }
});

const radio = new Elysia();

radio.use(cors())

radio.use(auth)

// radio.all("/", ({headers, set}) => {
//   console.log("authenticating user", headers);
//   const token = headers['authorization'];
//   if(token !== env.DEV_TOKEN) {
//       set.status = 'Unauthorized'
//       return 'Ooops';
//     }
// })

radio.get("/", () => "Hello world");

radio.get("century/:year", async ({ params }) => {
  const id = parseInt(params.year);
    if(isNaN(id)) return {error: "Id should be a number between -30 and 21"}
    try { 
    const century = await prisma.event.findMany({
        where: {
            centuryId: id
        }, 
        include: {
          country: true
        }
    })
    return century;
    } catch (err) {
        console.error(err);
    }
});

radio.listen(8000);

console.log(
  `🚀 Server is running at ${radio.server?.hostname}:${radio.server?.port}`
);
