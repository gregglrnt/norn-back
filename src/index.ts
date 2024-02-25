import { Elysia} from "elysia";
import { prisma } from "../prisma";
import cors from "@elysiajs/cors";

const app = new Elysia();

app.use(cors())

app.get("/", () => "Hello world");

app.get("century/:year", async ({ params }) => {
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

app.listen(8000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
