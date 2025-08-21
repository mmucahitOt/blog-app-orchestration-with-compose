const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const decodeToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET);

  return decodedToken;
};

const extractUserIdFromRequest = (request) => {
  const decodedToken = decodeToken(request.token);
  return decodedToken.id;
};

module.exports = { decodeToken, extractUserIdFromRequest };
