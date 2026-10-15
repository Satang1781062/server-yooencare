const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const a = require('../controllers/auth.controller');
const b = require('../controllers/branch.controller');
const ap = require('../controllers/appointment.controller');
const m = require('../controllers/member.controller');

router.post('/auth/register', a.register);
router.post('/auth/login', a.login);
router.get('/auth/me', auth, a.me);

router.get('/branches', auth, b.list);
router.get('/branches/:id', auth, b.detail);
router.get('/branches/:id/availability', auth, ap.availability);

router.post('/appointments', auth, ap.create);
router.get('/appointments/me', auth, ap.mine);
router.patch('/appointments/:id/cancel', auth, ap.cancel);
router.patch('/appointments/:id/complete', auth, role('admin'), ap.complete);

router.get('/member/card', auth, m.card);
router.get('/member/transactions', auth, m.transactions);

module.exports = router;
