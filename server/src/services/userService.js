const User = require("../Models/userModel");

exports.createSignUpService = async (data) => {
  const result = await User.create(data);
  return result;
};
exports.getUserService = async (filters, queries) => {
  const result = await User.find(filters)
    .select("-password")
    .sort(queries.sort);
  const total = await User.countDocuments(filters);
  return { total, result };
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.getUserByIdService = async (id) => {
  const result = await User.findOne({ _id: id }).select("-password ");
  return result;
};
exports.getUserByEmailService = async (email) => {
  const result = await User.findOne({ email: email }).select("-password ");
  return result;
};
exports.deleteUserService = async (id) => {
  const result = await User.deleteOne({ _id: id });
  return result;
};
exports.updateUserService = async (id, data) => {
  const result = await User.updateOne({ _id: id }, data, {
    runValidators: true,
  });
  return result;
};
exports.getUserPasswordService = async (id) => {
  const result = await User.findOne({ _id: id }).select("password");
  return result;
};
