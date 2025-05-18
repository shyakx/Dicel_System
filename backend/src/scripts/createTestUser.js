const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dicel-erp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const testUser = new User({
      email: 'cr@test.com',
      password: hashedPassword,
      department: 'ClientRelations',
      role: 'Employee',
      firstName: 'Test',
      lastName: 'User'
    });

    await testUser.save();
    console.log('Test user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser(); 