import { Elysia, t } from "elysia";
import { prisma } from "../prisma";
import { normalize } from "./utils/normalize";
import { Prisma } from "@prisma/client";
import { env } from "bun";

const country = new Elysia().group("country", (app) =>
    app.get("/all", () => {
        try {
            const all = prisma.country.findMany();
            return all;
        }
        catch (error) {
            console.error(error)
        }
    })
        .put("/update/:name", async ({body, params, set}) => {
            try {
                const {name} = params;
                const extension = body.flag.name.split(".").pop() || ".jpg";
                const normalizedCountry = name;
                await Bun.write(`./public/flags/${normalizedCountry}.${extension}`, body.flag);
                const updated= await prisma.country.update({
                    where: {
                        name: name
                    },
                    data: {
                        flag: `${env.BACK_URL}/flags/${name}.${extension}`
                    }
                })
                return updated;
            }
            catch (e) {
                if(e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === "P2025") {
                        set.status = 400
                        return `Not acceptable, country ${params.name} does not exist. Create it beforehand`;
                    }
                }
            }
        }, {
            body: t.Object({
                flag: t.File()
            })
        })
)

export default country;