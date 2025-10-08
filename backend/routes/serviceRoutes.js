const express = require('express');
const { createService, createServiceController } = require('../controllers/serviceController');
const realAuth = require('../middleware/auth');

// Export a function to allow injecting custom auth/controller middleware (for testing)
function getServiceRouter(auth = realAuth, createServiceHandler = createService) {
  const router = express.Router();
  router.post('/services', auth, createServiceHandler);
  return router;
}

module.exports = getServiceRouter;
