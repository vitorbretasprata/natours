import mongoose, { NativeError } from "mongoose";
import validator from "validator";

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal to 40 characters.'],
        minLength: [5, 'A tour name must have more or equal to 5 characters.'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters.']
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    }, 
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    priceDiscount: {
        type: Number,
        required: [true, "A tour must have a price"],
        validate: {
            validator: function(val : Number) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below the regular price.'
        }
    },
    difficulty: {
        type: Number,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult.'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be less or equal to 5']
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
    startDates: [Date],
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ]
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