const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');

router.get('/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

module.exports = router;