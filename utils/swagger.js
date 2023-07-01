const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Aarons Web Dev Bootcamp API",
         version: "1.0.0",
         description: "API documentation using Swagger UI",
      },
      servers: [
         {
            url: "http://localhost:5000/",
         },
      ],
   },
   apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
   app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs)
   );
};
