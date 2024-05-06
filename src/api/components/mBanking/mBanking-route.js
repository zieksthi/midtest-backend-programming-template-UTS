const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const mBankingControllers = require('./mBanking-controller');
const mBankingValidator = require('./mBanking-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/nasabah', route);

  // Get list of users
  route.get('/', authenticationMiddleware, mBankingControllers.getNasabah1);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(mBankingValidator.createNasabah),
    mBankingControllers.createNasabah
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, mBankingControllers.getNasabah);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(mBankingValidator.updateNasabah),
    mBankingControllers.updateNasabah
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, mBankingControllers.deleteNasabah);

  // Change password
  route.post(
    '/:id/change-pin',
    authenticationMiddleware,
    celebrate(mBankingValidator.changePin),
    mBankingControllers.changePin
  );
}