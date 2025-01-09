import { Channel } from '../models/Channel';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const seedData = async () => {
  try {
    // Skapa en admin-användare om den inte finns
    let adminUser = await User.findOne({ username: 'admin' });
    console.log('Existing admin user:', adminUser ? 'found' : 'not found');

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword
      });
      console.log('Admin user created with ID:', adminUser._id);
    }

    // Skapa en testanvändare om den inte finns
    let testUser = await User.findOne({ username: 'test' });
    if (!testUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);

      testUser = await User.create({
        username: 'test',
        email: 'test@example.com',
        password: hashedPassword
      });
      console.log('Test user created successfully');
    }

    // Skapa en låst kanal om den inte finns
    const privateChannel = await Channel.findOne({ name: 'private-chat' });
    if (!privateChannel) {
      await Channel.create({
        name: 'private-chat',
        description: 'A private channel for registered users only',
        isPrivate: true,
        members: [adminUser._id, testUser._id],
        createdBy: adminUser._id
      });
      console.log('Private channel created successfully');
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};