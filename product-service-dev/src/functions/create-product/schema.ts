import Joi from "joi";

export const CreateProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().positive().required(),
  count: Joi.number().min(1),
})

export default {
  type: "object",
  properties: {
    title: "string",
    description: "string",
    price: "number",
    count: "number",
  },
} as const