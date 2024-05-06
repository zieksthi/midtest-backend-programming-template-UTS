const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise} - Promise resolved with the user object or null if not found
 */
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user by email');
  }
}

module.exports = {
  getUserByEmail,
};