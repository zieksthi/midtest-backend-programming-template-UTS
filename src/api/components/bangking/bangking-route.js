const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bangkingControllers = require('./bangking-controller');
const bangkingValidator = require('./bangking-validator');


  const route = express.Router();

  module.exports = (app) => {
    app.use('/bangking', route);
  
    // Get list of users
    route.get('/', authenticationMiddleware, bangkingControllers.getUsers);
  
    // Create user
    route.post(
      '/',
      authenticationMiddleware,
      celebrate(bangkingValidator.createUser),
      bangkingControllers.createUser
    );
  
    // Get user detail
    route.get('/:id', authenticationMiddleware, bangkingControllers.getUser);
  
    // Update user
    route.put(
      '/:id',
      authenticationMiddleware,
      celebrate(bangkingValidator.updateUser),
      bangkingControllers.updateUser
    );
  
    // Delete user
    route.delete('/:id', authenticationMiddleware, bangkingControllers.deleteUser);
  
    // Change password
    route.post(
      '/:id/change-password',
      authenticationMiddleware,
      celebrate(bangkingValidator.changePassword),
      bangkingControllers.changePassword
    );
  
    // Endpoint untuk mendapatkan daftar user dengan fitur pagination, pencarian, dan pengurutan
  route.get('/users', async (req, res) => {
    try {
      // Pagination
      const pageNumber = parseInt(req.query.page_number) || 1;
      const pageSize = parseInt(req.query.page_size) || 10;
      const skip = (pageNumber - 1) * pageSize;
  
      // Pencarian (opsional)
      const searchQuery = req.query.search ? { email: { $regex: req.query.search, $options: 'i' } } : {};
  
      // Pengurutan (opsional)
      const sortQuery = req.query.sort ? { [req.query.sort.split(':')[0]]: req.query.sort.split(':')[1] === 'desc' ? -1 : 1 } : {};
  
      // Query untuk mendapatkan jumlah total data
      const totalUsers = await User.countDocuments(searchQuery);
  
      // Query untuk mendapatkan data user dengan filter, pagination, dan sorting
      const users = await User.find(searchQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize);
  
      res.json({
        totalUsers,
        currentPage: pageNumber,
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  };
  
  
  

