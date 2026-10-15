const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('patient', 'admin'), defaultValue: 'patient' },
  }, { tableName: 'users' });
