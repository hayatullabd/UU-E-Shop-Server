const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const {
  createSignUpService,
  getUserService,
  getUserByIdService,
  deleteUserService,
  updateUserService,
  getUserPasswordService,
  findUserByEmail,
  getUserByEmailService,
} = require("../services/userService");

const {
  checkWithIdService,
  checkWithEmailService,
} = require("../utils/chekWithid");
const { generateToken } = require("../utils/token");
const config = require("../config/config");
const User = require("../Models/userModel");
const { ObjectID } = require("bson");
const axios = require('axios');

/* const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
   

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html: `<p>Hii ${name}, please copy the link and <a href="${process.env.multer_url}/api/v1/user/forgot-password?token=${token}">reset your password</a> </p>`,
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent", info.response);
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}; */
const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html: `<p>Hii ${name}, please copy the link and <a href="${process.env.clientUrl}/auth/reset-new-password/${token}">reset your password</a> </p>`,
    };

    const info = await transporter.sendMail(mailOption);
    console.log("Mail has been sent", info.response);
  } catch (err) {
    console.log(err.message);
  }
};

exports.singUp = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, confirmPassword } = req.body;

    const user2 = await findUserByEmail(email);
    if (user2) {
      return res.status(401).json({
        status: "fail",
        message: "This email already use",
      });
    }

    const user = {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    };

    if (!email) {
      return res.status(501).json({
        status: "success",
        message: "please provide email",
      });
    }
    if (!password || !confirmPassword) {
      return res.status(501).json({
        status: "success",
        message: "please check password and confirm password",
      });
    }

    const activitionToken = creactActivitonToken(user);
    const activationCode = activitionToken.activationCode;

    const message = `Your ameezi Registration OTP is: ${activationCode}`

    const api_key = process.env.SMS_API_KEY;
    const sender_Id = process.env.SMS_SENDER_ID;

    // const response = await axios.post(`https://sms.mram.com.bd/smsapi?api_key=${api_key}&type=text&contacts=88${phone}&senderid=${sender_Id}&msg=${message}`);

    res.status(200).json({
      status: "success",
      message: `Pleace chack your Phone ${phone}`,
      data: { token: activitionToken.token, code: activationCode },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message,
      message: "server error"
    });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { token, activationCode } = req.body;

    console.log(token);

    const newUser = jwt.verify(token, process.env.ACTIVATION_SECRETE);

    console.log(newUser);

    if (newUser.activationCode !== activationCode) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP code",

      });
    }

    const { fullName, phone, email, password, confirmPassword } = newUser.user;

    const user = await createSignUpService({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    });
    const { password: pwd, ...others } = user.toObject();
    const token2 = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "successfully signup",
      data: { token, user: others },
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
      message: "server error"
    });
  }
};



const creactActivitonToken = (user) => {
  console.log(user);

  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode: activationCode },
    process.env.ACTIVATION_SECRETE,
    { expiresIn: "5m" }
  );

  return { token, activationCode: activationCode };
};

exports.createUserFun = async (req, res, next) => {
  try {
    const data = req.body;

    const createuser = await User.create(data)

    res.status(200).json({
      status: "success",
      message: "user create successfully",
      data: createuser,
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
}

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        message: "Please provide your credential",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "No user Found. Please Create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        message: "email or password are not correct",
      });
    }

    const { password: pwd, forgetPasswordToken, ...others } = user.toObject();

    const token = generateToken(user);
    res.status(200).json({
      status: "success",
      message: "successfully logged in",
      data: { token, user: others },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await findUserByEmail(req?.user?.email);

    const { password, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      data: {
        data: others,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

// ---------get users--------

exports.getUsers = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    let queries = {};

    if (req.query.search) {
      let oldFilters = filters;
      filters = {
        ...oldFilters,
        $or: [
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
          { fullName: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    if (req.query.sort) {
      let sortCateory = req.query.sort;
      sortCateory = sortCateory.split(",").join(" ");
      queries.sort = sortCateory;
    }

    if (req.query.fields) {
      let selectCategory = req.query.fields.split(",").join(" ");
      queries.fields = selectCategory;
    }

    const user = await getUserService(filters, queries);

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  console.log("from user id", id)
  try {

    const isIdAvaiable = await checkWithIdService(id, User);
    if (!isIdAvaiable) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't find user",
      });
    }

    const user = await getUserByIdService(id);

    res.status(200).json({
      status: "success",
      message: "user Update done",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error",
      error: error.message,
    });
  }
};
exports.getUserByQuery = async (req, res) => {
  const { email } = req.query;

  try {
    const isIdAvaiable = await checkWithEmailService(email, User);
    if (!isIdAvaiable) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't find user",
      });
    }

    const user = await getUserByEmailService(email);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error",
      error: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const isIdAvaiable = await checkWithIdService(id, User);
    if (!isIdAvaiable) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't delete user",
      });
    }

    const result = await deleteUserService(id);

    res.status(200).json({
      status: "success",
      message: "user deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error. couldn't delete user ",
      error: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const incomingChangeData = req.body;
    if (incomingChangeData.email || incomingChangeData.password) {
      return res.status(400).json({
        status: "fail",
        message: "Couldn't change your email",
      });
    }

    const isIdAvaiable = await checkWithIdService(id, User);
    if (!isIdAvaiable) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't update",
      });
    }

    const result = await updateUserService(id, req.body);

    if (!result.modifiedCount) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't update",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Internal error. couldn't update user ",
      error: error.message,
    });
  }
};
exports.updateMeny = async (req, res) => {
  try {
    const result = await User.updateMany({}, { $set: { status: "active" } });
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Internal error. couldn't update user ",
      error: error.message,
    });
  }
};

// chnage password
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const incomingChangeData = req.body;

    const isIdAvaiable = await checkWithIdService(id, User);
    if (!isIdAvaiable) {
      return res.status(400).json({
        status: "fail",
        message: "couldn't update",
      });
    }
    const user = await getUserPasswordService(id);

    const isPasswordValid = bcrypt.compareSync(
      incomingChangeData.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Your old password is wrong.Please Try again!",
      });
    }

    const newPassword = req.body.password;

    const passwordRegex = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
    );
    if (!passwordRegex.test(newPassword)) {
      return res.status(401).json({
        status: "fail",
        message: "New Password not strong enough!",
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword);

    // const result = await updateUserService(id, req.body);
    const result = await updateUserService(id, { password: hashedPassword });

    if (!result.modifiedCount) {
      return res.status(400).json({
        status: "fail",
        message: "Password no changed.",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Internal error. couldn't update user ",
      error: error.message,
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(200).json({
        status: "fail",
        message: "This Email does not Exists.",
      });
    }
    const randomString = randomstring.generate();
    const data = await User.updateOne(
      { email },
      { forgetPasswordToken: randomString }
    );

    sendResetPasswordMail(userData.fullName, userData.email, randomString);

    res.status(200).json({
      status: "success",
      message: "check your inbox",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// password reset after forgot password using token

exports.resetPasswordWithToken = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(200).json({
        status: "fail",
        message: "Reset Link has been expired",
      });
    }

    if (req.body.password.length < 4) {
      return res.status(200).json({
        status: "fail",
        message: "new password too small",
      });
    }

    const newPassword = bcrypt.hashSync(req.body.password);

    const userData = await User.findOne({ forgetPasswordToken: token });
    if (!userData) {
      return res.status(200).json({
        status: "fail",
        message: "Reset Link has been expired",
      });
    }

    const data = await User.findOneAndUpdate(
      { _id: ObjectID(userData._id) },
      { forgetPasswordToken: "", password: newPassword },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "password reset done",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
