const mongoose = require('mongoose');
const Tour = require("../../src/model/tour");
const fs = require('fs')

const DB = process.env.CONN_STR.replace('<PASSWORD>', process.env.DB_PASS);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log(conn.connection));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Datta successfully loaded!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Datta successfully deleted!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}
