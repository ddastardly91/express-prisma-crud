const joi = require("joi");

const validatePost = (post) => {
   const schema = joi.object({
      title: joi.string().max(70).required(),
      content: joi.string().required(),
      imageURL: joi.string().required(),
   });

   return schema.validate(post);
};

module.exports = validatePost;
