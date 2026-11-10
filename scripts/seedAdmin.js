require('dotenv').config();

const { connectDB, getDB, closeDB } = require('../src/config/db');
const { hashPassword } = require('../src/services/password.service');
const env = require('../src/config/env');

async function run() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  await connectDB();

  const users = getDB().collection('users');

  const existingAdmin = await users.findOne({ email });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    await closeDB();
    return;
  }

  const passwordHash = await hashPassword(password);

  await users.insertOne({
    name: 'Admin',
    email,
    password: passwordHash,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('Admin user created successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  await closeDB();
}

run()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exit(1);
  });