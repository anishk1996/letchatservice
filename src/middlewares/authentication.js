const jwt = require("jsonwebtoken");

async function generateAccessToken(username) {
    console.log('Generating token for user '+ username.username);
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

//jwt verification
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        // return res.json({ statusCode: 403, message: err.message });
        // return res.sendStatus(403);
        return res.status(403).send({ message: err.message })
      }
      req.user = user;
      next();
    });
  }

module.exports = {
    generateAccessToken,
    authenticateToken
}