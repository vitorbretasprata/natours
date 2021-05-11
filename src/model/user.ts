import mongoose, { NativeError, Model, Document, HookNextFunction } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUserSchema extends Model<any, any> {
    correctPassword: Function
}

const userSchema = new mongoose.Schema<UserBaseDocument, UserModel>({
    name: {
        type: String,
        required: [true, "Please provide your name."],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal to 40 characters.'],
        minLength: [5, 'A tour name must have more or equal to 5 characters.'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters.']
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }, 
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [8, 'A password must have at least 8 characters.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function(val : Number) {
                return val < this.password;
            },
            message: "The password and the confirmation must be the same."
        },
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

enum Role {
    "user" = 0,
    "guide" = 1,
    "lead-guide" = 2,
    "admin" = 3
}

export interface IUser {
    name: string,
    email: string,
    photo? : string,
    password: string,
    passwordConfirm: string,
    role: Role,
    passwordChangedAt? : Date,
    passwordResetToken? : String,
    passwordResetExpires? : Date
}

export interface UserBaseDocument extends IUser, Document {
    correctPassword(candidatePassword : string, userPassword : string) : string,
    changedPasswordAfter(JWTTimeStamp: string) : boolean,
    createPasswordResetToken() : string
}

export interface UserModel extends Model<UserBaseDocument> {

}

userSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

userSchema.pre('save', async function (this: UserBaseDocument, next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    next();
});

userSchema.pre('save', async function (this: UserBaseDocument, next) {
    if(!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword, 
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (this: UserBaseDocument,
    JWTTimeStamp : string
) {
    if(this.passwordChangedAt) {

        const JWTTS = parseInt(JWTTimeStamp, 10);
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTS < changedTimestamp;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
}

userSchema.pre(/^find/, function (next) {

    next();
});

userSchema.pre('aggregate', function (next) {
    //sd
    next({
        name: "",
        message: ""
    });
});

const User = mongoose.model<UserBaseDocument, UserModel>("Tour", userSchema);

export default User;