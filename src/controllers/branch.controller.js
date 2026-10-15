const { Branch } = require('../models');

exports.list = async (req, res, next) => {
  try {
    res.json({ data: await Branch.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }) });
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const b = await Branch.findByPk(req.params.id);
    if (!b) return res.status(404).json({ message: 'Branch not found' });
    res.json({ data: b });
  } catch (e) { next(e); }
};
