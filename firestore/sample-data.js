/**
 * Sample data for testing Firestore collections
 * This represents our story characters: Thandi (hairstylist) and Sipho (customer)
 */

const sampleUsers = [
  {
    name: 'Thandi Mthembu',
    email: 'thandi@mzansiservices.com',
    phone: '0721234567',
    location: 'Soweto, Johannesburg',
    isServiceProvider: true
  },
  {
    name: 'Sipho Ndlovu', 
    email: 'sipho@email.com',
    phone: '0732345678',
    location: 'Alexandra, Johannesburg',
    isServiceProvider: false
  }
];

const sampleServices = [
  {
    title: 'Professional Hair Braiding',
    description: 'Expert braiding services for all hair types. Specializing in box braids, cornrows, and protective styles.',
    price: 150.00,
    category: 'Beauty & Hair',
    location: 'Soweto, Johannesburg',
    contact: '0721234567',
    // ownerId will be set when we create the user
  },
  {
    title: 'Mobile Car Wash',
    description: 'Professional car washing service that comes to you. Interior and exterior cleaning.',
    price: 80.00,
    category: 'Automotive',
    location: 'Sandton, Johannesburg', 
    contact: '0743456789',
  }
];

module.exports = { sampleUsers, sampleServices };