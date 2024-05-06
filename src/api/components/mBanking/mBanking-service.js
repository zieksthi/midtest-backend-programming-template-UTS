const mBankingRepository = require('./mBanking-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { nasabah } = require('../../../models');

/**
 * Get users with pagination, filtering, and sorting
 * @param {object} query - MongoDB query object
 * @param {number} skip - Number of documents to skip
 * @param {number} limit - Maximum number of documents to return
 * @param {object} sort - MongoDB sort object
 * @returns {Promise<Array>} Array of users
 */

async function getNasabah(query, skip, limit, sort) {
  return nasabah.find(query).sort(sort).skip(skip).limit(limit);
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getNasabah1(id) {
  const nasabah = await mBankingRepository.getNasabah1(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    norek: user.norek,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createNasabah(name, no_rek, pin) {
  try {
    // Hash the provided PIN before storing it
    const hashedPin = await hashPassword(pin);

    // Create the user with the hashed PIN
    await mBankingRepository.createNasabah(name, no_rek, hashedPin);
    
    return true; // Return true if creation is successful
  } catch (err) {
    // Handle any errors here
    console.error("Error creating user:", err);
    return false; // Return false if creation fails
  }
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateNasabah(id, name, no_rek) {
  const na_sabah = await mBankingRepository.getNasabah1(id);

  // User not found
  if (!na_sabah) {
    return null;
  }

  try {
    await mBankingRepository.updateNasabah(id, name, no_rek);
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
async function deleteNasabah(id) {
  const nasabah = await mBankingRepository.getNasabah(id);

  // User not found
  if (!nasabah) {
    return null;
  }

  try {
    await mBankingRepository.deleteNasabah(id);
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
async function norekIsRegistered(no_rek) {
  const nasabah = await mBankingRepository.getbankbyrek(no_rek);

  if (nasabah) {
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
async function checkPin(nasabahId, pin) {
  const nasabah = await mBankingRepository.getNasabah(nasabahId);
  return passwordMatched(pin, nasabah.pin);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePin(userId, pin) {
  const nasabah = await mBankingRepository.getNasabah(nasabahId);

  // Check if user not found
  if (!nasabah) {
    return null;
  }

  const hashedPassword = await hashPassword(pin);

  const changeSuccess = await mBankingRepository.changePin(
    nasabahId,
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
async function getTotalNasabah(query) {
  return nasabah.countDocuments(query);
}

module.exports = {
  getNasabah,
  getNasabah1,
  createNasabah,
  updateNasabah,
  deleteNasabah,
  norekIsRegistered,
  checkPin,
  changePin,
  getTotalNasabah,
};
