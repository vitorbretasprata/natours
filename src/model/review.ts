import mongoose, { Model, Document } from "mongoose";
import User from "./user";

const reviewSchema = new mongoose.Schema<ReviewBaseDocument, ReviewModel>({
    review: {
        type: String,
        required: [true, "A review can`t be empty"],
        unique: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "A tour must have a duration"]
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user.']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export interface IReviews {
    review: string,
    rating: number,
    createdAt : number,
    tour: any,
    user: any
}

export interface ReviewBaseDocument extends IReviews, Document {
    
}

export interface ReviewModel extends Model<ReviewBaseDocument> {

}

reviewSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

reviewSchema.pre('save', function (next) {
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    });

    next();
});

reviewSchema.pre('aggregate', function (next) {
    next({
        name: "",
        message: ""
    });
});

const Review = mongoose.model<ReviewBaseDocument, ReviewModel>("Tour", reviewSchema);

export default Review;