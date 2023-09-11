const { Schema, model, Types } = require('mongoose');

const collection = 'users';

const usersSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            default: 'client',
        },
        phone: {
            type: Number,
            required: true,
        },
        pets: [
            {
                type: Types.ObjectId,
                ref: 'pets',
                _id: false,
            },
        ],
    },
    {
        virtuals: {
            fullName: {
                get() {
                    return this.name.first + ' ' + this.name.last;
                },
            },
        },
    }
);

const User = model(collection, usersSchema);

module.exports = { User };
