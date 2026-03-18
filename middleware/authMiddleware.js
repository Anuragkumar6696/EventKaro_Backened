const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {

    let token;

    // ⭐ Check Authorization Header Exists
    if (req.headers.authorization) {

      // ⭐ If Bearer Token
      if (req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } 
      // ⭐ If Direct Token
      else {
        token = req.headers.authorization;
      }

    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // ⭐ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or Expired Token"
    });
  }
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden Access"
      });
    }

    next();
  };
};