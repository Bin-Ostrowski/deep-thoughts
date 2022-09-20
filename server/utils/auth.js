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

  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
  
    // if no token, return request object as is
    if (!token) {
      return req;
    }
  
    // decode and attach user data to request object
    try {
      //This is where secret becomes important. If secret on jwt.verify() 
      //doesn't match secret used with jwt.sign(), the object won't be decoded.
      // When the JWT verification fails, an error is thrown. We don't want an error 
      //thrown on every request, though. Users with an invalid token should still 
      //be able to request and see all thoughts. 
      //Thus, wrap the verify() method in a try...catch statement to mute the error. 
      //and manually throw an authentication error on the resolver side.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
  
    // return updated request object
    return req;
  }
};
