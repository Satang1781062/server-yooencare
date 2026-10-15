const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sign } = require('../utils/jwt');
const { getOrCreateCard } = require('../services/member.service');

const toDto = (u) => ({ id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role });

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password || password.length < 6)
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ หรือรหัสผ่านสั้นกว่า 6 ตัวอักษร' });

    if (await User.findOne({ where: { email } }))
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });

    const user = await User.create({ fullName, email, phone, password: await bcrypt.hash(password, 10) });
    await getOrCreateCard(user.id);
    res.status(201).json({ token: sign({ id: user.id, role: user.role }), user: toDto(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    res.json({ token: sign({ id: user.id, role: user.role }), user: toDto(user) });
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: toDto(user) });
  } catch (e) { next(e); }
};
