const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../config/service-account-key.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mzansi-services-app-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// Collection references
const collections = {
  users: db.collection('users'),
  services: db.collection('services')
};

module.exports = { admin, db, collections };