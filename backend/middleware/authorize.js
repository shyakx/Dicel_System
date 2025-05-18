function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

function requireDepartment(...departments) {
  return (req, res, next) => {
    if (!req.user || !departments.map(d => d.toLowerCase()).includes((req.user.department || '').toLowerCase())) {
      return res.status(403).json({ message: 'Forbidden: Insufficient department' });
    }
    next();
  };
}

module.exports = { requireRole, requireDepartment }; 