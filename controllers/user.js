const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
   validateRegister,
   validateLogin,
} = require("../utils/validateCredentials");

exports.createUser = async (req, res) => {
   const { email, password, username } = req.body;

   // Validate credentials
   const { error } = validateRegister(req.body);

   if (error) {
      return res.status(400).json({
         success: false,
         error: error.details[0].message,
      });
   }

   // Check if user exists
   try {
      const userExists = await prisma.user.findUnique({
         where: {
            email,
         },
      });

      if (userExists) {
         return res.status(400).json({
            success: false,
            message: "Email already in use",
         });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
         password,
         salt
      );

      // Create user
      const user = await prisma.user.create({
         data: {
            username,
            email,
            password: hashedPassword,
         },
      });

      return res.status(201).json({
         success: true,
         data: user,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};

exports.loginUser = async (req, res) => {
   const { email, password } = req.body;

   // Validate credentials
   const { error } = validateLogin(req.body);

   if (error) {
      return res.status(400).json({
         success: false,
         error: error.details[0].message,
      });
   }

   // Check if user exists
   try {
      const user = await prisma.user.findUnique({
         where: {
            email,
         },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            error: "Invalid credentials",
         });
      }

      // Check if password is correct
      const validPassword = await bcrypt.compare(
         password,
         user.password
      );

      if (!validPassword) {
         return res.status(400).json({
            success: false,
            error: "Invalid credentials",
         });
      }

      // Create and assign token
      const token = jwt.sign(
         { id: user.id, email: user.email },
         process.env.JWT_SECRET,
         { expiresIn: "1h" }
      );

      // Set cookie
      res.cookie("token", token, {
         httpOnly: true,
         maxAge: 3600000,
      });

      // Return response
      return res.status(200).json({
         success: true,
         data: {
            id: user.id,
            email: user.email,
         },
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};

exports.getAllUsers = async (req, res) => {
   try {
      const users = await prisma.user.findMany();

      return res.status(200).json({
         success: true,
         count: users.length,
         data: users,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};

exports.deleteUserById = async (req, res) => {
   const { id } = req.params;

   // Check if user.id matches id in params
   if (req.user.id !== id) {
      return res.status(401).json({
         success: false,
         error: "Unauthorized",
      });
   }

   try {
      const user = await prisma.user.findUnique({
         where: {
            id,
         },
      });

      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      await prisma.user.delete({
         where: {
            id: req.user.id,
         },
      });

      // Clear cookie
      res.clearCookie("token");

      return res.status(200).json({
         success: true,
         data: {},
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};

exports.updateUserById = async (req, res) => {
   const { id } = req.params;
   const { email, password, username } = req.body;

   // Check if user.id matches id in params
   if (req.user.id !== id) {
      return res.status(401).json({
         success: false,
         error: "Unauthorized",
      });
   }

   try {
      // Check to see if user exists
      const user = await prisma.user.findUnique({
         where: {
            id,
         },
      });

      // If user doesn't exist, return error
      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      let updatedData = {};

      // Check if email field exists and update data in updateData object
      if (email) {
         updatedData.email = email;
      }

      // Check if password field exists and update data in updateData object
      if (password) {
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(
            password,
            salt
         );

         updatedData.password = hashedPassword;
      }

      // Check if username field exists and update data in updateData object
      if (username) {
         updatedData.username = username;
      }

      // Validate updated data
      const { error } = validateRegister(updatedData);

      if (error) {
         return res.status(400).json({
            success: false,
            error: error.details[0].message,
         });
      }

      // Update user
      const updatedUser = await prisma.user.update({
         where: {
            id: req.user.id,
         },
         data: updatedData,
      });

      // Return success response
      return res.status(200).json({
         success: true,
         data: updatedUser,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: error.message,
      });
   }
};
