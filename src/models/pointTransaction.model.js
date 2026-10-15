const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('PointTransaction', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.ENUM('earn', 'redeem', 'adjust'), allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false }, // ค่าบวก = ได้, ค่าลบ = ใช้
    description: { type: DataTypes.STRING(255) },
    appointmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    tableName: 'point_transactions',
    indexes: [{ fields: ['user_id', 'created_at'] }],
  });
