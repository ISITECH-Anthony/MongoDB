import express from "express";
import cors from "cors";

import { router } from "./routes.js";

import { client, db } from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());

await client.connect();

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});