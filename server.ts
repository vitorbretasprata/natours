const port = process.env.PORT || 3000;
import app from "./app";
import mongoose from "mongoose";

const DB = process.env.CONN_STR.replace(
    "<PASSWORD>",
    process.env.DB_PASS
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(conn => {
    console.log(conn.connection);
});

app.listen(port, () => {
    console.log(`Port is listening on ${port}...`)
});