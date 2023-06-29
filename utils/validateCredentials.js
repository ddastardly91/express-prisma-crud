const joi = require("joi");

const validateRegister = (credentials) => {
   const schema = joi.object({
      username: joi.string().min(3).required(),
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required(),
   });

   return schema.validate(credentials);
};

const validateLogin = (credentials) => {
   const schema = joi.object({
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required(),
   });

   return schema.validate(credentials);
};

module.exports = { validateRegister, validateLogin };
