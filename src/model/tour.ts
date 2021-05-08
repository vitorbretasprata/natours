import mongoose, { NativeError } from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: Number,
        required: [true, "A tour must have a difficulty"]
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    slug: String,
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    summery: {
        type: String,
        trim: true,
        require: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, "A tour must have a cover image"]
    },
    images: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

tourSchema.pre('save', function (next) {
    //this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {

    next();
});

tourSchema.pre('aggregate', function (next) {
    //sd
    next({
        name: "",
        message: ""
    });
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;