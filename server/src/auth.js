const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const getUser = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1d' }
  );
};

module.exports = {
  getUser,
  generateToken
};

// auth.js

let tokens = []; // In a real-world application, you would use a database or a more secure storage

const logout = (token) => {
  tokens = tokens.filter(t => t !== token);
};

module.exports = {
  getUser,
  generateToken,
  logout
};