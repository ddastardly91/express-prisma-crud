const errorHandler = (err, req, res, next) => {
   console.error(err.stack);

   res.status(500).json({
      success: false,
      error: "Internal server error",
   });

   next();
};

module.exports = errorHandler;
