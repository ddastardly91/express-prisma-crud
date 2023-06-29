const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Load env variables
dotenv.config();

// Morgan logger
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
   console.log(
      `Server listening on port: ${PORT}`.bgYellow.bold
   );
});
