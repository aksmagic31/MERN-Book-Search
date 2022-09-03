const db = require('../config/connection');
const { User } = require('../models');
const chalk = require('chalk');

const userData = [
    {
        username: 'TimDuncan',
        email: 'TD@spurs.com',
        password: '123456'

    },
    {
        username: 'JohnStockton',
        email: 'AssistKing@jazz.com',
        password: '123456'
    },
    {
        username: 'PaulPierce',
        email: 'Truth@celtics.com',
        password: '123456'
    },
    {
        username: 'StephCurry',
        email: 'splashNotBro@warriors.com',
        password: '123456'
    },

]

db.once('open', async () => {
  try {
    // always delete all tags before seeding
    await User.deleteMany({});
    await User.insertMany(userData);

    console.log(chalk.green('🗄  Users seeded! 🗄'));
    // process.exit() is used to end the process after the seed is done
    process.exit(0);

  } catch (err) {
    console.log(chalk.red(err));
  }
});
