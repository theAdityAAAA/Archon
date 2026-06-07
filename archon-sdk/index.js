const axios = require("axios");

function plexusMiddleware() {
  return (req, res, next) => {

    const start = Date.now();

    res.on("finish", async () => {

      if (req.originalUrl === "/favicon.ico") {
        return;
      }

      try {

        const normalizedEndpoint =
          req.originalUrl.replace(
            /[a-f0-9]{24}/g,
            ":id"
          );

        await axios.post(
          "http://localhost:5000/trace",
          {
            traceId: Date.now().toString(),

            service:
              "diagram-to-deployment",

            endpoint:
              normalizedEndpoint,

            method:
              req.method,

            duration:
              Date.now() - start,

            status:
              res.statusCode
          }
        );

      } catch (err) {

        console.log(
          "Plexus Trace Error",
          err.message
        );

      }

    });

    next();

  };
}

module.exports = {
  plexusMiddleware
};