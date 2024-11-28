import { Channel } from '../models/Channel'
import { User } from '../models/User'

export const setupDefaultChannels = async () => {
  try {
    // Skapa en admin-användare om den inte finns
    let adminUser = await User.findOne({ email: 'admin@chappy.com' })

    if (!adminUser) {
      adminUser = await User.create({
        username: 'Admin',
        email: 'admin@chappy.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        avatarColor: 'text-purple-500'
      })
    }

    // Skapa standardkanaler om de inte finns
    const defaultChannels = [
      {
        name: 'allmänt',
        description: 'Allmän diskussion för alla användare',
        isPrivate: false
      },
      {
        name: 'nyheter',
        description: 'Nyheter och uppdateringar',
        isPrivate: false
      }
    ]

    for (const channel of defaultChannels) {
      const exists = await Channel.findOne({ name: channel.name })
      if (!exists) {
        await Channel.create({
          ...channel,
          createdBy: adminUser._id,
          members: [adminUser._id]
        })
      }
    }

    console.log('✅ Default channels have been set up')
  } catch (error) {
    console.error('Error setting up default channels:', error)
  }
}