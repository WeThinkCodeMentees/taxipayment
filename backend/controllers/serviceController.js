function validateServiceFields(body) {
  const required = ['title', 'price', 'location', 'category', 'contact'];
  const missing = required.filter(field => !body[field]);
  return missing.length ? missing : null;
}

async function saveService(admin, service) {
  const docRef = await admin.firestore().collection('services').add(service);
  return docRef.id;
}

function createServiceController(admin) {
  return async (req, res) => {
    const missing = validateServiceFields(req.body);
    if (missing) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    const ownerId = req.user && req.user.uid;
    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }
    const { title, price, location, category, contact } = req.body;
    const service = {
      title,
      price,
      location,
      category,
      contact,
      ownerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    try {
      const id = await saveService(admin, service);
      return res.status(201).json({ id, ...service });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create service', details: err.message });
    }
  };
}

const { admin } = require('../../firestore/firebase-config');
exports.createService = createServiceController(admin);
exports.createServiceController = createServiceController;
