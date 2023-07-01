const prisma = require("../prisma/prisma");
const slugify = require("slugify");
const validatePost = require("../utils/validatePost");

exports.createPost = async (req, res) => {
   const { title, content, imageURL } = req.body;

   // Get the user id from the request
   const { userId } = req.user;

   // Validate the request body
   const { error } = validatePost(req.body);

   if (error)
      return res.status(400).send(error.details[0].message);

   // Create a slug from the title
   const slug = slugify(title, { lower: true });

   // Create the post
   try {
      const post = await prisma.post.create({
         data: {
            title,
            content,
            imageURL,
            slug,
            author: { connect: { id: userId } },
         },
      });

      return res.status(201).json({
         success: true,
         data: post,
      });
   } catch (error) {
      return res.status(500).send(error.message);
   }
};
