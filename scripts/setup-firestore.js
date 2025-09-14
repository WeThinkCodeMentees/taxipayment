/**
 * Script to set up Firestore collections and add sample data
 * Run this to initialize your database structure
 */

const { userHelpers, serviceHelpers } = require('../firestore/collection-helpers');
const { sampleUsers, sampleServices } = require('../firestore/sample-data');

async function setupFirestore() {
  console.log('🔥 Setting up Firestore collections...');
  
  try {
    // Create sample users
    console.log('Creating sample users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const user = await userHelpers.createUser(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Create sample services
    console.log('Creating sample services...');
    const thandiUser = createdUsers.find(user => user.name === 'Thandi Mthembu');
    
    // Assign Thandi as owner of the hair braiding service
    sampleServices[0].ownerId = thandiUser.id;
    sampleServices[1].ownerId = thandiUser.id; // For demo purposes

    for (const serviceData of sampleServices) {
      const service = await serviceHelpers.createService(serviceData);
      console.log(`✅ Created service: ${service.title}`);
    }

    console.log('🎉 Firestore setup completed successfully!');
    
    // Test the setup
    console.log('\n🧪 Testing the setup...');
    const allServices = await serviceHelpers.getAllServices();
    console.log(`Found ${allServices.length} services in the database`);
    
    const hairServices = await serviceHelpers.filterServices({ category: 'Beauty & Hair' });
    console.log(`Found ${hairServices.length} beauty services`);

  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupFirestore();
}

module.exports = setupFirestore;