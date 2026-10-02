const express = require('express');
const controller = require('../controllers/productController');
const { cacheGet, invalidateCache } = require('../middleware/cache');

const router = express.Router();

router.get('/', cacheGet, controller.list);
router.get('/:id', cacheGet, controller.get);
router.post('/', invalidateCache, controller.create);
router.put('/:id', invalidateCache, controller.replace);
router.patch('/:id', invalidateCache, controller.patch);
router.delete('/:id', invalidateCache, controller.remove);

module.exports = router;
