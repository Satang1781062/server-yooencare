require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    app.listen(PORT, () => console.log(`YooEnCare API running on :${PORT}`));
  } catch (e) {
    console.error('Cannot start server:', e);
    process.exit(1);
  }
})();
