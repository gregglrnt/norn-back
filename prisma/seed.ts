import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import events from "./preview.json";
import { createEvent } from "../src/utils/crud";

try {
  for (let i in events) {
    const coordinates = events[i].coordinates.split(",").map((l) => parseFloat(l));
    await createEvent({...events[i], coordinates, country: events[i].country || ""})
  }
} catch (e) {
  if(e instanceof PrismaClientKnownRequestError) console.error("error", e.meta, e.message);
}