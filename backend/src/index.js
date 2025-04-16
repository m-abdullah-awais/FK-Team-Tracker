import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

import connectDB from "./db/connectDB.js";
import app from "./app.js";

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`Error: ${error}`);
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`\nApp is listening on:\nhttp://localhost:${process.env.PORT}\n`);
        });
    })
    .catch((err) => {
        console.log("Error in connecting to database", err);
    })
