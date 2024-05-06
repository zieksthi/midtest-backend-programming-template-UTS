const { Bangking } = require('../../../models')

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return Bangking.find({});
}

/**
 * Get user detail
 * @param {string} id - Bangking ID
 * @returns {Promise}
 */
async function getUser(id) {
  return Bangking.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return Bangking.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - Bangking ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return Bangking.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - Bangking ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return Bangking.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return Bangking.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - Bangking ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return Bangking.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
