const { error } = require('../utils/responseHandler');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 'Access denied: insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authorizeRoles };
