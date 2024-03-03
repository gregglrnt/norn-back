import { Elysia, t } from "elysia";
import { prisma } from "../prisma";
import { normalize } from "./utils/normalize";
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
        .put("/update/:name", async ({body, params}) => {
            try {
                const normalizedCountry = normalize(params.name);
                const url = `${import.meta.resolveSync(`../public/flags/${normalizedCountry}.jpg`)}`;
                await Bun.write(url, body.flag);
                const updated= await prisma.country.update({
                    where: {
                        name: params.name
                    },
                    data: {
                        flag: `${env.BACK_URL}/public/flags/${normalizedCountry}.jpg`
                    }
                })
                return updated;
            }
            catch (error) {
                console.error(error)
            }
        }, {
            body: t.Object({
                flag: t.File()
            })
        })
)

export default country;