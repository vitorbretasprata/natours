import { Document, Query } from "mongoose";

export default class APIFeatures {
    public query;
    public queryStr;

    constructor(query : Query<Document<any, {}>[], Document<any, {}>, {}>, queryStr : any) {
        this.query = query;
        this.queryStr = queryStr;
    }

    public filter() {
        const queryObj =  { ...this.queryStr }

        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(f => {
            if(queryObj[f]) {
                delete queryObj[f];
            }
        });

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    public sort() {
        if(this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    public limitFields() {
        if(this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }

        return this;
    }

    public paginate() {
        let page, limit;

        if(this.queryStr.page) {
            page = parseInt(this.queryStr.page, 10);
        } else {
            page = 1;
        }

        if(this.queryStr.limit) {
            limit = parseInt(this.queryStr.limit, 10)
        } else {
            limit = 100;
        }

        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}