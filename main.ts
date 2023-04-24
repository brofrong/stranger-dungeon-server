import { Application } from "https://deno.land/x/oak@v12.2.0/mod.ts";
import { setRouter } from "./src/router.ts";

const app = new Application();
const port = 8080;

setRouter(app);

console.log("Listening at http://localhost:" + port);
await app.listen({ port });
