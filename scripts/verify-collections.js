const { collections } = require('../firestore/firebase-config');

async function verifyCollections() {
  console.log('🔍 Verifying Firestore collections...');
  
  try {
    // Check users collection
    const usersSnapshot = await collections.users.limit(5).get();
    console.log(`Users collection: ${usersSnapshot.size} documents`);
    
    // Check services collection  
    const servicesSnapshot = await collections.services.limit(5).get();
    console.log(`Services collection: ${servicesSnapshot.size} documents`);
    
    // Show sample data
    console.log('\n📋 Sample Users:');
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.name} (${data.email})`);
    });
    
    console.log('\n📋 Sample Services:');
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.title} - R${data.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error verifying collections:', error);
  }
}

verifyCollections();