const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Branch', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20) },
    latitude: { type: DataTypes.DECIMAL(10, 7) },
    longitude: { type: DataTypes.DECIMAL(10, 7) },
    openTime: { type: DataTypes.TIME, defaultValue: '09:00:00' },
    closeTime: { type: DataTypes.TIME, defaultValue: '18:00:00' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'branches' });
