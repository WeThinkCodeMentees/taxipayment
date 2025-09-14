const { db, collections, admin } = require('./firebase-config'); // Added 'admin' here
const { usersCollectionSchema, servicesCollectionSchema } = require('./collections-schema');

/**
 * Helper functions for Firestore collections
 */

// User Collection Helpers
const userHelpers = {
  // Create a new user document
  async createUser(userData) {
    const userDoc = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isServiceProvider: userData.isServiceProvider || false
    };
    
    const docRef = await collections.users.add(userDoc);
    return { id: docRef.id, ...userDoc };
  },

  // Get user by ID
  async getUserById(userId) {
    const doc = await collections.users.doc(userId).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { id: doc.id, ...doc.data() };
  },

  // Get user by email
  async getUserByEmail(email) {
    const snapshot = await collections.users.where('email', '==', email).get();
    if (snapshot.empty) {
      throw new Error('User not found');
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
};

// Service Collection Helpers
const serviceHelpers = {
  // Create a new service
  async createService(serviceData) {
    const serviceDoc = {
      title: serviceData.title,
      description: serviceData.description,
      price: serviceData.price,
      category: serviceData.category,
      location: serviceData.location,
      contact: serviceData.contact,
      ownerId: serviceData.ownerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      reviewCount: 0
    };

    const docRef = await collections.services.add(serviceDoc);
    return { id: docRef.id, ...serviceDoc };
  },

  // Get all services
  async getAllServices() {
    const snapshot = await collections.services.where('isActive', '==', true).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Filter services by category and/or location
  async filterServices(filters = {}) {
    let query = collections.services.where('isActive', '==', true);

    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }

    if (filters.location) {
      query = query.where('location', '==', filters.location);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get services by owner
  async getServicesByOwner(ownerId) {
    const snapshot = await collections.services.where('ownerId', '==', ownerId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

module.exports = { userHelpers, serviceHelpers };