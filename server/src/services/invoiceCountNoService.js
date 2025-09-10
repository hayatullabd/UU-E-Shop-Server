const InvoiceNumber = require("../Models/invoiceCountNoModel");

exports.getInvoiceNumberService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await InvoiceNumber.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await InvoiceNumber.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createInvoiceNumberService = async (data) => {
  const result = await InvoiceNumber.create(data);
  return result;
};

exports.getInvoiceNumberByIdService = async (id) => {
  const result = await InvoiceNumber.findById(id)
    .populate("user", "fullName email")
    .populate("InvoiceNumberItem.product", "name price");

  return result;
};

exports.updateInvoiceNumberByIdService = async (id, data) => {
  const result = await InvoiceNumber.updateOne({ _id: id }, data);
  return result;
};
exports.deleteInvoiceNumber = async (id) => {
  const result = await InvoiceNumber.deleteOne({ _id: id });
  return result;
};
