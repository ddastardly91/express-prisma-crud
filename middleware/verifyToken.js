const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
   const token = req.cookies.token;

   if (!token) {
      res.clearCookie("token");

      return res.status(401).json({
         success: false,
         message: "Access denied",
      });
   }

   try {
      const verified = jwt.verify(
         token,
         process.env.JWT_SECRET
      );
      req.user = verified;

      next();
   } catch (error) {
      res.clearCookie("token");

      return res.status(401).json({
         success: false,
         message: "Invalid token",
      });
   }
};

module.exports = verifyToken;
