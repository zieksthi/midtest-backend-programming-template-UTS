const { na_sabah } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getNasabah() {
  return na_sabah.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getNasabah1(id) {
  return na_sabah.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createNasabah(name, no_rek, pin) {
  return na_sabah.create({
    name,
    no_rek,
    pin,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateNasabah(id, name, norek) {
  return na_sabah.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        norek,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteNasabah(id) {
  return na_sabah.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getbankbyrek(no_rek) {
  return na_sabah.find({ no_rek });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePin(id, pin) {
  return na_sabah.updateOne({ _id: id }, { $set: { pin } });
}

module.exports = {
  getNasabah,
  getNasabah1,
  createNasabah,
  updateNasabah,
  deleteNasabah,
  getbankbyrek,
  changePin,
};
