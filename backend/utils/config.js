require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;
let MONGODB_URI = process.env.MONGODB_URI;

if (NODE_ENV === "production") {
  MONGODB_URI = process.env.PROD_MONGODB_URI;
}
if (NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

const SECRET = process.env.SECRET;

module.exports = { PORT, MONGODB_URI, SECRET, NODE_ENV };
