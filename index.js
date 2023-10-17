const http = require("http");
const app = require("./app");
const helmet = require("helmet");

const port = process.env.PORT ?? 3000;

// const loggerMiddleware = (req, res, next) => {
//   const currentTimestamp = new Date().toISOString();
//   console.log(`[${currentTimestamp}] ${req.method} ${req.url}`);
//   next();
// };

app.use(helmet());
app.set("port", port);

const server = http.createServer(app);

server.maxConnections = 100;

server.listen(port, () => {
  console.log("Server is running on port : ", port);
});

console.log(`Maximum connections allowed: ${server.maxConnections}`);
