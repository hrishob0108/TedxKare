import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/Admin.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tedxkare');
    
    const email = 'hrishobp@gmail.com';
    const password = 'hrishob0108'; // User requested password
    
    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.password = password;
      await admin.save();
      console.log(`✓ Seeded Admin password successfully updated for: ${email}`);
    } else {
      admin = new Admin({ email, password });
      await admin.save();
      console.log(`✓ Seeded Admin account successfully created: ${email}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
