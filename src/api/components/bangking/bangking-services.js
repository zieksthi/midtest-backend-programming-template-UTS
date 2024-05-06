const bangkingRepository = require('./bangking-repository')
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { Bangking } = require('../../../models')

/**
 * Get users with pagination, filtering, and sorting
 * @param {object} query - MongoDB query object
 * @param {number} skip - Number of documents to skip
 * @param {number} limit - Maximum number of documents to return
 * @param {object} sort - MongoDB sort object
 * @returns {Promise<Array>} Array of users
 *




/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */


async function getUsers(query, skip, limit, sort) {
  return Bangking.find(query).sort(sort).skip(skip).limit(limit);
}

async function getUser(id) {
  const user = await bangkingRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await bangkingRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await bangkingRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await bangkingRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await bangkingRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await bangkingRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await bangkingRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await bangkingRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await bangkingRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await bangkingRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Get total number of users based on query
 * @param {object} query - MongoDB query object
 * @returns {Promise<number>} Total number of users
 */
async function getTotalUsers(query) {
  return Bangking.countDocuments(query);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getTotalUsers,
};
