const joi = require('@hapi/joi');

const authorIdSchema = joi.number();
const authorNameSchema = joi.string().max(80);
const authorCitySchema = joi.string().max(32);

const createAuthorSchema = {
  name: authorNameSchema.required(),
  city: authorCitySchema.required()
};

const updateAuthorSchema = {
  name: authorNameSchema,
  city: authorCitySchema
};

module.exports = {
  authorIdSchema,
  createAuthorSchema,
  updateAuthorSchema
};