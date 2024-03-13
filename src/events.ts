import { Elysia, t } from "elysia";
import { prisma } from "../prisma";
import { normalize } from "./utils/normalize";
import { createEvent } from "./utils/crud";

const events = new Elysia().group("events", (app) =>
    app.get("*", async ({ params, set }) => {
        const id = parseInt(params["*"]);
        if (isNaN(id)) {
            set.status = "Bad Request";
            return { error: "Id should be a number between -30 and 21" }
        }
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
    }).post("create", async ({ body, set }) => {
        try {
            const created = await createEvent(body);
            set.status = "Created";
            return created;
        } catch (e) {
            console.error(e);
            if (e instanceof RangeError) {
                set.status = "Bad Request";
                return {
                    error: "Wrong format. Date should be of type d/m/Y, or x/x/Y if only the year is known. Note that d/x/Y will work, but will also display only the year.",
                    example: [
                        "12/10/1995", "x/x/-335"
                    ]
                };
            }
        }
    }, {
        body: t.Object({
            title: t.String(),
            description: t.String(),
            date: t.String(),
            coordinates: t.Array(t.Number()),
            country: t.String(),
        })
    }))

export default events;