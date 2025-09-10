// here import all schema if you need check

// const User = require("../models/user.model");

exports.checkWithIdService = async (id, modelName) => {
  const result = await modelName.findOne({ _id: id });
  if (result?.role) {
    return true;
  } else {
    return false;
  }
};
exports.checkWithEmailService = async (email, modelName) => {
  const result = await modelName.findOne({ email: email });
  if (result?.role) {
    return true;
  } else {
    return false;
  }
};
