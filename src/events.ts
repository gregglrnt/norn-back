import { Elysia, t } from "elysia";
import { prisma } from "./prisma";
import { createEvent } from "./utils/crud";
import { CSVEvent } from "./types/events";
import { parse } from "csv-parse";
import { Event } from "@prisma/client";

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
                },
            })
            set.headers = {
                "Cache-Control": "max-age=3600"
            }
            return century;
        } catch (err) {
            console.error(err);
        }
    }).post("/create", async ({ body, set }) => {
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
            placeName: t.Optional(t.String())
        })
    }).post("/upload", async ({ body }) => {
        const created: Event[] = []
        const parser = parse(await body.source.text(), { delimiter: ",", columns: true });
        try {
            parser.on('readable', async () => {
                let line: CSVEvent;
                while ((line = parser.read()) !== null) {
                    const exists = await prisma.event.findFirst({
                        where: {
                            title: line.title
                        }
                    })
                    if (exists) continue;
                    const coordinates = line.coordinates.split(",").map(l => parseInt(l));
                    const newItem = await createEvent({ ...line, coordinates: coordinates })
                    created.push(newItem);
                }
            })
            return { status: "Success", "uploaded": created }
        } catch (e) {
            console.error(e);
        }
    }, {
        body: t.Object({
            source: t.File()
        })
    }))

export default events;