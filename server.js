const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("colors");

const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/user");

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

app.listen(PORT, () => {
   console.log(
      `Server listening on port: ${PORT}`.bgYellow.bold
   );
});
