import dotenv from "dotenv";
import mongoose from "mongoose";

process.on('uncaughtException', (err : any) => {
    console.log("UNCAUGHT REJECTION! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

const port = process.env.PORT || 3000;
import app from "./app";

const DB = process.env.CONN_STR.replace(
    "<PASSWORD>",
    process.env.DB_PASS
);

dotenv.config();

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(conn => {
    console.log(conn.connection);
});

const server = app.listen(port, () => {
    console.log(`Port is listening on ${port}...`)
});

process.on('unhandledRejection', (err : any) => {
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

