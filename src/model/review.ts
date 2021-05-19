import mongoose, { Model, Document } from "mongoose";
import Tour from "./tour";

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
    user: any,
    calcAvgRating: Function
}

export interface ReviewBaseDocument extends IReviews, Document {
    calcAvgRating: Function,
    findOne? : Function,
    r? : any
}

export interface ReviewModel extends Model<ReviewBaseDocument> {
    calcAvgRating: Function
}

reviewSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

reviewSchema.post('save', function (next) {
    this.constructor.calcAvgRating(this.tour);
    next();
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating'}
            }
        }
    ]);

    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
}

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
    await this.r.constructor.calcAvgRating(this.tour);
});

reviewSchema.pre('aggregate', function (next) {
    next({
        name: "",
        message: ""
    });
});

const Review = mongoose.model<ReviewBaseDocument, ReviewModel>("Tour", reviewSchema);

export default Review;