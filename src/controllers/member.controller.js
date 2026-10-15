const { PointTransaction } = require('../models');
const { getOrCreateCard, toDto } = require('../services/member.service');

exports.card = async (req, res, next) => {
  try {
    const card = await getOrCreateCard(req.user.id); // สร้างให้อัตโนมัติสำหรับ user เดิมที่ยังไม่มีบัตร
    res.json({ data: toDto(card) });
  } catch (e) { next(e); }
};

exports.transactions = async (req, res, next) => {
  try {
    const data = await PointTransaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json({ data });
  } catch (e) { next(e); }
};
