import Joi from "joi";
export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal").required(),
});

export const UpdateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal"),
});


    //     name: { type: String, required: true },
    // phoneNumber: { type: String, required: true },
    // email: { type: String },
    // isFavourite: { type: Boolean, default: false },
    // contactType: { type: String, enum: ["work", "home", "personal"], required: true, default: 'personal'  },