const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const nasabah = require('./components/mBanking/mBanking-route');
const bangking = require('./components/bangking/bangking-route')


module.exports = () => {
  const app = express.Router();

  authentication(app);
  nasabah(app);
  users(app);
  bangking(app);

  return app;
};
