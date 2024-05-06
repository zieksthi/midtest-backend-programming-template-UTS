const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT_DURATION = 30 * 60 * 1000; // 30 menit dalam milidetik
const loginAttempts = {};

async function checkLoginCredentials(email, password) {
  try {
    await handleLoginAttempt(email); // Panggil handleLoginAttempt sebelum memeriksa kredensial login
    const user = await authenticationRepository.getUserByEmail(email);

    const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
    const passwordChecked = await passwordMatched(password, userPassword);

    if (user && passwordChecked) {
      await handleLoginAttempt(email, true); // Panggil handleLoginAttempt dengan flag keberhasilan jika login berhasil

      return {
        email: user.email,
        name: user.name,
        user_id: user.id,
        token: generateToken(user.email, user.id),
      };
    } else {
      throw new Error('Wrong email or password');
    }
  } catch (error) {
    throw error;
  }
}

async function handleLoginAttempt(email, success = false) {
  if (!loginAttempts[email]) {
    // Inisialisasi data percobaan login jika belum ada
    loginAttempts[email] = {
      attempts: 0,
      lastAttempt: null,
    };
  }

  const now = Date.now();

  if (success) {
    // Reset data percobaan login jika login berhasil
    loginAttempts[email].attempts = 0;
    loginAttempts[email].lastAttempt = null;
    return;
  }

  // Perbarui data percobaan login
  loginAttempts[email].attempts++;
  loginAttempts[email].lastAttempt = now;

  // Cek apakah batasan percobaan login telah tercapai
  if (loginAttempts[email].attempts >= MAX_LOGIN_ATTEMPTS) {
    // Cek apakah sudah melebihi waktu timeout
    if (now - loginAttempts[email].lastAttempt < LOGIN_TIMEOUT_DURATION) {
      throw new Error('Too many failed login attempts');
    } else {
      // Reset data percobaan login jika sudah melebihi waktu timeout
      loginAttempts[email].attempts = 0;
      loginAttempts[email].lastAttempt = null;
    }
  }
}

module.exports = {
  checkLoginCredentials,
};