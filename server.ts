import app from "./app";

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Port is listening on ${process.env.SERVER_PORT}...`)
});