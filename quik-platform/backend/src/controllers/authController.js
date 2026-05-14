const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { JWT_SECRET } = require('../config/env');
const { success, error } = require('../utils/responseHandler');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return error(res, 'Name, email, and password are required', 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return error(res, 'Email already registered', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'RETAILER' ? 'RETAILER' : 'CUSTOMER';

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Signup successful', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (err) {
    return error(res, err.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { signup, login, getMe };
