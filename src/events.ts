import { Elysia, t } from "elysia";
import { prisma } from "../prisma";
import { normalize } from "./utils/normalize";

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
            const [d, m, y] = body.date.split("/").map((e) => parseInt(e));
            if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) {
                throw new RangeError();
            }
            const date = new Date(y, m - 1, d).toISOString()
            
            const century = Math.ceil(y / 100);
            const created = await prisma.event.create({
                data: {
                    title: body.title,
                    description: body.description,
                    coordinates: body.coordinates.join(","),
                    date: date,
                    century: {
                        connectOrCreate: {
                            create: {
                                id: century,
                            },
                            where: {
                                id: century,
                            },
                        }
                    },
                    country: {
                        connectOrCreate: {
                            create: {
                                name: normalize(body.country ?? ""),
                                label: body.country ?? ""
                            }, where: {
                                name: normalize(body.country ?? ""),
                            }
                        }
                    }
                }
            })
            set.status = "Created";
            return created;
        } catch (e) {
            console.error(e);
            if (e instanceof RangeError) {
                set.status = "Bad Request";
                return "Wrong format. Date should be of type d/m/Y";
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