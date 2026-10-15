const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    branchId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    treatment: { type: DataTypes.STRING(150), allowNull: false },
    appointmentDate: { type: DataTypes.DATEONLY, allowNull: false },
    timeSlot: { type: DataTypes.STRING(5), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
    },
    note: { type: DataTypes.TEXT },
  }, {
    tableName: 'appointments',
    indexes: [{ fields: ['branch_id', 'appointment_date', 'time_slot'] }],
  });
