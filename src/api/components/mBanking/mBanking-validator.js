const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createNasabah: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      no_rek: joi.string().min(1).required().label('Norek'),
      pin: joiPassword.string().min(6).max(100).required().label('Pin'),
      pin_confirm: joi.string()
      .required().label('Pin confirmation'),
    },
  },

  updateNasabah: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      norek: joi.string().min(1).max(100).required().label('Norek'),
    },
  },

  changePin: {
    body: {
      pin_old: joi.string().required().label('Old pin'),
      pin_new: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New in'),
      pin_confirm: joi.string().required().label('Pin confirmation'),
    },
  },
};
