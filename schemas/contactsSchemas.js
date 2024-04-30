import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "gmail"] } })
    .required(),
  phone: Joi.string().min(10).max(13).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "gmail"] },
  }),
  phone: Joi.string().min(10).max(13),
}).or("name", "email", "phone");
