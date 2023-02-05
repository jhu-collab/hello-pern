import app from "./src/index.js";
import { factory } from "./src/util/debug.js";

const debug = factory(import.meta.url);
const port = process.env.PORT || 5050;

app.listen(port, () => {
  debug(`API listening on port=${port}`);
  if (process.env.NODE_ENV === "local") {
    console.log(`DEMO API: http://localhost:${port}/`)
  }
});