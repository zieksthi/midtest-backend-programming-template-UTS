const mBankingService = require('./mBanking-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request with pagination, sorting, and searching
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getNasabah(request, response, next) {
  try {
    let { page_number, page_size, search, sort } = request.query;

    // Default values for pagination
    page_number = parseInt(page_number) || 1;
    page_size = parseInt(page_size) || 10;

    let query = {};

    // Handle search
    if (search) {
      query.email = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Sorting
    let sortCriteria = {};
    if (sort) {
      const [sortField, sortOrder] = sort.split(":");
      sortCriteria[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    const totalUsers = await mBankingService.getTotalNasabah(query);
    const totalPages = Math.ceil(totalUsers / page_size);

    // Pagination
    const skip = (page_number - 1) * page_size;
    const users = await mBankingService.getNasabah(query, skip, page_size, sortCriteria);

    return response.status(200).json({
      page_number,
      page_size,
      total_users: totalUsers,
      total_pages: totalPages,
      users,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getNasabah1(request, response, next) {
  try {
    const user = await mBankingService.getNasabah(request.params.id);

    if (!nasabah) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(nasabah);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createNasabah(request, response, next) {
  try {
    const name = request.body.name;
    const no_rek = request.body.no_rek;
    const pin = request.body.pin;
    const pin_confirm = request.body.pin_confirm;

    // Check confirmation password
    if (pin !== pin_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await mBankingService.norekIsRegistered(no_rek);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await mBankingService.createNasabah(name, no_rek, pin);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, no_rek });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateNasabah(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const norek = request.body.norek;

    // Email must be unique
    const norekIsRegistered = await mBankingService.norekIsRegistered(norek);
    if (norekIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'rekening is already registered'
      );
    }

    const success = await mBankingService.updateNasabah(id, name, norek);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteNasabah(request, response, next) {
  try {
    const id = request.params.id;

    const success = await nasabahService.deleteNasabah(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete rekening'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePin(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.pin_new !== request.body.pin_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Pin confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await mBankingService.checkPin(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
    }

    const changeSuccess = await mBankingService.changePin(
      request.params.id,
      request.body.pin_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNasabah,
  getNasabah1,
  createNasabah,
  updateNasabah,
  deleteNasabah,
  changePin,
};
