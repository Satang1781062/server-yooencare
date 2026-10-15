const { MemberCard, PointTransaction } = require('../models');

// ปรับระดับสมาชิกได้ที่นี่ (อิงแต้มสะสมตลอดชีพ)
const TIERS = [
  { name: 'Silver', min: 0 },
  { name: 'Gold', min: 500 },
  { name: 'Platinum', min: 1500 },
];

const tierFor = (lifetime) => [...TIERS].reverse().find((t) => lifetime >= t.min);
const nextTierFor = (lifetime) => TIERS.find((t) => t.min > lifetime) || null;
const cardNumberFor = (userId) => `YEC${String(userId).padStart(8, '0')}`;

async function getOrCreateCard(userId, transaction) {
  const [card] = await MemberCard.findOrCreate({
    where: { userId },
    defaults: { cardNumber: cardNumberFor(userId) },
    transaction,
  });
  return card;
}

async function awardPoints({ userId, points, description, appointmentId }, transaction) {
  const card = await getOrCreateCard(userId, transaction);
  card.points += points;
  card.lifetimePoints += points;
  card.tier = tierFor(card.lifetimePoints).name;
  await card.save({ transaction });
  await PointTransaction.create(
    { userId, type: 'earn', points, description, appointmentId }, { transaction });
  return card;
}

function toDto(card) {
  const cur = tierFor(card.lifetimePoints);
  const next = nextTierFor(card.lifetimePoints);
  return {
    cardNumber: card.cardNumber,
    tier: cur.name,
    points: card.points,
    lifetimePoints: card.lifetimePoints,
    nextTier: next ? next.name : null,
    pointsToNextTier: next ? next.min - card.lifetimePoints : 0,
    tierProgress: next ? (card.lifetimePoints - cur.min) / (next.min - cur.min) : 1,
  };
}

module.exports = { getOrCreateCard, awardPoints, toDto };
