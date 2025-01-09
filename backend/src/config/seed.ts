import { Channel } from '../models/Channel';
import { User } from '../models/User';

export const seedData = async () => {
  try {
    // Skapa en admin-användare om den inte finns
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123'
      });
    }

    // Skapa en låst kanal om den inte finns
    const privateChannel = await Channel.findOne({ name: 'private-chat' });
    if (!privateChannel) {
      await Channel.create({
        name: 'private-chat',
        description: 'A private channel for registered users only',
        isPrivate: true,
        members: [adminUser._id],
        createdBy: adminUser._id
      });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};