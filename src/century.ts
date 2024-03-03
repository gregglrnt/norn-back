import { Elysia } from "elysia";
import { prisma } from "../prisma";

const century = new Elysia().group("century", (app) =>
    app.get("*", async ({ params }) => {
        const id = parseInt(params["*"]);
        if (isNaN(id)) return { error: "Id should be a number between -30 and 21" }
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
    }))

export default century;