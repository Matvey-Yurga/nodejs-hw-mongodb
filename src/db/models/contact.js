import { Schema, model } from 'mongoose';
const studentsSchema = new Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    photo: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ["work", "home", "personal"], required: true, default: 'personal' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },

},
    {
        timestamps: true,
        versionKey: false, 
    });
 export const StudentsCollection = model('contacts', studentsSchema);