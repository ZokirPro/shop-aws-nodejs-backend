import Joi from "joi";
export default {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;

export const ImportProductSchema = Joi.string().required()