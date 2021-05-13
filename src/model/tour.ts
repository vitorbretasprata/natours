import mongoose, { Model, Document } from "mongoose";
import User from "./user";

const tourSchema = new mongoose.Schema<TourBaseDocument, TourModel>({
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
    tourImages: {
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
    ],
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

enum Difficulty {
    "easy" = 0,
    "medium" = 1,
    "difficult" = 2,
}

export interface ILocations {
    type: string,
    coordinates? : Array<number>,
    address? : string,
    description? : string,
    day? : number
}

export interface ITours {
    name: string,
    duration: number,
    maxGroupSize : number,
    priceDiscount: number,
    passwordConfirm: string,
    difficulty? : Difficulty,
    ratingAverage? : Date,
    ratingQuantity? : String,
    slug? : Date,
    price : number,
    summery : string,
    description? : string,
    imageCover : string,
    tourImages? : Array<string>,
    createdAt: Date,
    startDates: Array<Date>,
    startLocation: {
        type: string,
        coordinates: Array<number>,
        address? : string,
        description? : string
    },
    locations: Array<ILocations>,
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}

export interface TourBaseDocument extends ITours, Document {
    
}

export interface TourModel extends Model<TourBaseDocument> {

}

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

tourSchema.pre('save', function (next) {
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path : 'guides',
        select: '-__v -passwordChangedAt'
    })
    next();
});

tourSchema.pre('aggregate', function (next) {
    next({
        name: "",
        message: ""
    });
});

const Tour = mongoose.model<TourBaseDocument, TourModel>("Tour", tourSchema);

export default Tour;