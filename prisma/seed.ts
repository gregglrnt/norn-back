import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from ".";
import events from "./preview.json";
import { normalize } from "../src/utils/normalize";

try {
  for (let i in events) {
    const [day, month, year] = events[i].date.split("/");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
    const century = Math.ceil(parseInt(year) / 100);

    const created = await prisma.event.create({
      data: {
        title: events[i].title,
        description: events[i].description,
        coordinates: events[i].coordinates,
        date: date,
        century: {
          connectOrCreate: {
            create: {
              id: century,
            },
            where: {
              id: century,
            },
          },
        },
        country: {
          connectOrCreate: {
            create: {
              name: normalize(events[i].country ?? ""),
              label: events[i].country ?? ""
            },
            where: {
              name: normalize(events[i].country ?? ""),
              label: events[i].country ?? ""
            },
          },
        },
      },
    });
    console.log("crated", created)
  }
} catch (e) {
  if(e instanceof PrismaClientKnownRequestError) console.error("error", e.meta, e.message);
}