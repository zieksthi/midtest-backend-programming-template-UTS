const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const mBangkingSchema = require('./mbangking-schema')
const mSchema = require('./m-schema');
const usersSchema = require('./users-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const nasabah = mongoose.model('nasabah',mongoose.Schema(mSchema));
const Bangking = mongoose.model('bangking', mongoose.Schema(mBangkingSchema))

module.exports = {
  mongoose,
  User,
  nasabah,
  Bangking,
};
