const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('MemberCard', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    cardNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },          // แต้มคงเหลือ
    lifetimePoints: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },  // แต้มสะสมตลอดชีพ (ใช้คิด tier)
    tier: { type: DataTypes.ENUM('Silver', 'Gold', 'Platinum'), defaultValue: 'Silver' },
  }, { tableName: 'member_cards' });
