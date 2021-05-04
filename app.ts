import fs from "fs";
import dotenv from "dotenv";
import express from "express";


const app = express();
dotenv.config();

app.use(express.json());
app.use((req, res, next) => {

});

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

app.get("/api/v1/tours/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    const tour = tours.find((t : any) => t.id === id);

    if(!tour) {
        res.status(404).json({
            status: 'Not Found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), 
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        });
});

app.patch("/api/v1/tours/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(id > tours.length) {
        res.status(500).json({
            status: 'Failed',
            message: "Invalid ID"
        });
    }

    const tour = tours.find((t : any) => t.id === id);

    if(!tour) {
        res.status(404).json({
            status: 'Not Found'
        });
    }

    res.status(201).json({
        status: 'success',
        data: {
            tour: tour
        }
    });

});

app.delete("/api/v1/tours/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(id > tours.length) {
        res.status(500).json({
            status: 'Failed',
            message: "Invalid ID"
        });
    }

    const tour = tours.find((t : any) => t.id === id);

    if(!tour) {
        res.status(404).json({
            status: 'Not Found'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Port is listening on ${process.env.SERVER_PORT}...`)
})