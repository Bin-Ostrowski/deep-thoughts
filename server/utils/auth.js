const jwt = require("jsonwebtoken");

// Optionally, tokens can be given an expiration date and secret 
// Note the secret has nothing to do withcencoding. The secret merely enables 
// the server to verify whether it recognizes this token.
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
    // expects a user object and will add that user's username, 
    //email, and _id properties to the token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
