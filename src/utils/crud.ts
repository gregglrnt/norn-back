import { prisma } from "../../prisma";
import { normalize } from "./normalize";

type CreateEventData = {
    title: string,
    description: string,
    date: string,
    coordinates: number[],
    country: string,
    placeName?: string,
}

export const  createEvent = async (body: CreateEventData) => {
    let date: string;
            const [d, m, y] = body.date.split("/").map((e) => {
                if (e === "x") return undefined;
                return parseInt(e)
            });
            if (y === undefined) {
                throw new RangeError();
            }
            if (d === undefined || m === undefined) {
                date = y.toString();
            } else if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) {
                throw new RangeError();
            } else {
                date = new Date(y, m - 1, d).toISOString()

            }
            const century = Math.ceil(y / 100);
            const created = await prisma.event.create({
                data: {
                    title: body.title,
                    description: body.description,
                    coordinates: body.coordinates.join(","),
                    date: date,
                    placeName: body.placeName || null,
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
            return created;
}