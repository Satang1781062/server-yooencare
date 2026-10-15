require('dotenv').config();
const { sequelize, Branch } = require('../models');

(async () => {
  await sequelize.sync();
  if ((await Branch.count()) === 0) {
    await Branch.bulkCreate([
      { name: 'YooEnCare สาขาพระรามเก้า', address: 'สยามสแควร์ กรุงเทพฯ', phone: '02-000-0001' },
      { name: 'YooEnCare สาขาลาดพร้าว', address: 'ลาดพร้าว กรุงเทพฯ', phone: '02-000-0002' },
      { name: 'YooEnCare สาขาเชียงใหม่', address: 'นิมมานเหมินท์ เชียงใหม่', phone: '053-000-003' },
    ]);
    console.log('Seeded branches');
  }
  process.exit(0);
})();
