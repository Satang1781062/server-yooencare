const sequelize = require('../config/database');
const User = require('./user.model')(sequelize);
const Branch = require('./branch.model')(sequelize);
const Appointment = require('./appointment.model')(sequelize);
const MemberCard = require('./memberCard.model')(sequelize);
const PointTransaction = require('./pointTransaction.model')(sequelize);

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });
Branch.hasMany(Appointment, { foreignKey: 'branchId' });
Appointment.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

User.hasOne(MemberCard, { foreignKey: 'userId' });
MemberCard.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PointTransaction, { foreignKey: 'userId' });
PointTransaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Branch, Appointment, MemberCard, PointTransaction };
