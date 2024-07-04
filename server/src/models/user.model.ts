import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    role: 'SuperAdmin' | 'User';
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            maxLength: 32,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 32,
            minLength: 6,
            lowercase: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 256,
            match: /^[^\s]{8,}$/
        },
        role: {
            type: String,
            required: true,
            enum: ['SuperAdmin', 'User'],
            default: 'User'
        }
    },
    { versionKey: false, timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre<IUser>('save', async function (next: (err?: Error) => void) {
    const user = this;
    const lowercaseUsername = user.username.toLowerCase();
    user.username = lowercaseUsername;

    if (user.isModified('password') && user.password.length < 257) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
    }
    next();
});

// Post-save hook for error handling
userSchema.post('save', function (error: any, doc: IUser, next: (err?: Error) => void) {
    if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.username) {
            return next(new Error(`A user with the username '${doc.username}' already exists.`));
        } else if (error.keyPattern && error.keyPattern.email) {
            return next(new Error(`A user with the email '${doc.email}' already exists.`));
        }
    }

    if (error.errors) {
        if (error.errors.username) {
            if (error.errors.username.kind === 'required') {
                return next(new Error(`Username is required.`));
            }
            if (error.errors.username.kind === 'maxlength') {
                return next(new Error(`Username cannot be more than 32 characters.`));
            }
        }

        if (error.errors.email) {
            if (error.errors.email.kind === 'required') {
                return next(new Error(`Email is required.`));
            }
            if (error.errors.email.kind === 'maxlength') {
                return next(new Error(`Email cannot be more than 32 characters.`));
            }
            if (error.errors.email.kind === 'minlength') {
                return next(new Error(`Email cannot be less than 6 characters.`));
            }
            if (error.errors.email.kind === 'regexp') {
                return next(new Error(`Email is not valid. Please enter a valid email.`));
            }
        }

        if (error.errors.password) {
            if (error.errors.password.kind === 'required') {
                return next(new Error(`Password is required.`));
            }
            if (error.errors.password.kind === 'maxlength') {
                return next(new Error(`Password cannot be more than 256 characters.`));
            }
            if (error.errors.password.kind === 'minlength') {
                return next(new Error(`Password cannot be less than 8 characters.`));
            }
            if (error.errors.password.kind === 'regexp') {
                return next(new Error(`Password should be minimum 8 characters long, without any whitespace.`));
            }
        }

        if (error.errors.role) {
            if (error.errors.role.kind === 'required') {
                return next(new Error(`Role is required.`));
            }
            if (error.errors.role.kind === 'enum') {
                return next(new Error(`Role can only be assigned as either SuperAdmin or User.`));
            }
        }
    }

    return next(error);
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
