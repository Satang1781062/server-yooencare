const { Appointment, Branch, sequelize } = require('../models');
const { awardPoints } = require('../services/member.service');
const { Op, fn } = require('sequelize');

const DEFAULT_VISIT_POINTS = 10; // ไม่ระบุยอดเงิน = ได้แต้มคงที่ต่อการมาใช้บริการ
const BAHT_PER_POINT = 100;      // ระบุยอดเงิน = ทุก 100 บาท ได้ 1 แต้ม
const { SLOTS, MAX_PER_SLOT } = require('../config/booking');

exports.create = async (req, res, next) => {
  try {
    const { branchId, treatment, appointmentDate, timeSlot, note } = req.body;
    if (!branchId || !treatment || !appointmentDate || !timeSlot)
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });

    if (!SLOTS.includes(timeSlot)) return res.status(400).json({ message: 'ช่วงเวลาไม่ถูกต้อง' });

    const branch = await Branch.findByPk(branchId);
    if (!branch || !branch.isActive) return res.status(404).json({ message: 'ไม่พบสาขา' });

    const taken = await Appointment.count({
      where: { branchId, appointmentDate, timeSlot, status: { [Op.in]: ['pending', 'confirmed'] } },
    });
    if (taken >= MAX_PER_SLOT) return res.status(409).json({ message: 'ช่วงเวลานี้เต็มแล้ว' });

    const appt = await Appointment.create({
      userId: req.user.id, branchId, treatment, appointmentDate, timeSlot, note,
    });
    res.status(201).json({ data: appt });
  } catch (e) { next(e); }
};

exports.mine = async (req, res, next) => {
  try {
    const data = await Appointment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Branch, as: 'branch', attributes: ['id', 'name', 'address'] }],
      order: [['appointmentDate', 'DESC'], ['timeSlot', 'DESC']],
    });
    res.json({ data });
  } catch (e) { next(e); }
};

exports.cancel = async (req, res, next) => {
  try {
    const appt = await Appointment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!appt) return res.status(404).json({ message: 'ไม่พบการจอง' });
    appt.status = 'cancelled';
    await appt.save();
    res.json({ data: appt });
  } catch (e) { next(e); }
};

// admin เท่านั้น: ปิดงานคิว + ให้แต้มสะสม
exports.complete = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const appt = await Appointment.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!appt) { await t.rollback(); return res.status(404).json({ message: 'ไม่พบการจอง' }); }
    if (['completed', 'cancelled'].includes(appt.status)) {
      await t.rollback();
      return res.status(409).json({ message: `การจองนี้อยู่ในสถานะ ${appt.status} แล้ว` });
    }

    const amount = Number(req.body.amount || 0);
    const points = amount > 0 ? Math.floor(amount / BAHT_PER_POINT) : DEFAULT_VISIT_POINTS;

    appt.status = 'completed';
    await appt.save({ transaction: t });
    if (points > 0) {
      await awardPoints({
        userId: appt.userId, points, appointmentId: appt.id,
        description: `รับบริการ: ${appt.treatment}`,
      }, t);
    }
    await t.commit();
    res.json({ data: appt, pointsAwarded: points });
  } catch (e) { await t.rollback(); next(e); }
};

// ช่วงเวลาที่ว่างของสาขาในวันที่ระบุ
exports.availability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ message: 'date ต้องเป็นรูปแบบ YYYY-MM-DD' });

    const rows = await Appointment.findAll({
      attributes: ['timeSlot', [fn('COUNT', '*'), 'cnt']],
      where: { branchId: req.params.id, appointmentDate: date, status: { [Op.in]: ['pending', 'confirmed'] } },
      group: ['timeSlot'],
      raw: true,
    });
    const taken = {};
    rows.forEach((r) => { taken[r.timeSlot] = Number(r.cnt); });
    res.json({ data: SLOTS.map((time) => ({ time, available: (taken[time] || 0) < MAX_PER_SLOT })) });
  } catch (e) { next(e); }
};
