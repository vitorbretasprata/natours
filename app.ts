import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()
);

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    });
});

app.listen(port, () => {
    console.log(`Port is listening on ${port}...`)
})