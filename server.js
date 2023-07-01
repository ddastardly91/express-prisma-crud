require("colors");
const express = require("express");
const dotenv = require("dotenv");
const swagger = require("./utils/swagger");

// Middleware imports
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();
const PORT = process.env.PORT || 5000;

// Load env variables
dotenv.config();

// Cors
app.use(
   cors({
      origin: process.env.CORS_CLIENT_URL,
      credentials: true,
   })
);

// Swagger
swagger(app);

// Morgan logger
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Error handler
app.use(errorHandler);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
   console.log(
      `Server listening on port: ${PORT}`.bgYellow.bold
   );
});
