const {
   createUser,
   loginUser,
   getAllUsers,
   deleteUserById,
   updateUserById,
} = require("../controllers/user");

const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.delete("/:id", verifyToken, deleteUserById);
router.patch("/:id", verifyToken, updateUserById);

module.exports = router;
