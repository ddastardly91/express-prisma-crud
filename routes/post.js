const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

const { createPost } = require("../controllers/post");

router.post("/", verifyToken, createPost);

module.exports = router;
