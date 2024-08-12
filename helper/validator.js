const { check } = require("express-validator");
exports.registerValidator = [
  check("firstName", "firstName is Required").not().isEmpty(),
  check("lastName", "lastName is Required").not().isEmpty(),
  check("email", "Please include valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is Required").not().isEmpty(),
  check("confirmPassword", "confirmPassword is Required").not().isEmpty(),
];
exports.loginValidator = [
  check("email", "Please include valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is Required").not().isEmpty(),
];

exports.shipmentValidator = [
  check("courierCompany", "courierCompany is Required").not().isEmpty(),
  check("trackingNumber", "trackingNumber is Required").not().isEmpty(),
  check("sentDate", "sentDate is Required").not().isEmpty(),
  check("estimatedDeliveryDate", "estimatedDeliveryDate is Required").not().isEmpty(),
  check("status", "status is Required").not().isEmpty(),
  check("dentistObj", "dentistObj is Required").not().isEmpty(),
  check("casesIds", "casesIds is Required").not().isEmpty(),
];