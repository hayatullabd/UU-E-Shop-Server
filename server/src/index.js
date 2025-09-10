const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static("image"));

app.use(express.json());
app.use(cors());

const ProductRoute = require("./Routes/ProductRoute.js");
const CategoryRoute = require("./Routes/CategoryRoute.js");
const userRoutes = require("./Routes/userRoute");
const orderRoutes = require("./Routes/orderRoute");
const invoiceCountNo = require("./Routes/invoiceCountNoRoute");
const banner = require("./Routes/bannerRoute");
const LandingPage = require("./Routes/LandingPageRoute");
const brands = require("./Routes/brandsRoute");
const deliveryCost = require("./Routes/deliveryCostRoute");
const coupons = require("./Routes/couponsRoute");
const dashboard = require("./Routes/dashboardRoute");
const myShop = require("./Routes/myShopRoute");
const siteApiSetting = require("./Routes/siteApiSettingRoute");
const reviewRoute = require("./Routes/reviewRoute")
// accounts
const AccountsRoute = require("./AccountingModule/AccountsBalance/Routes/AccountsRoutes.js");
const variantRoute = require("./Routes/variantRoute")
const walletRoute = require("./Routes/walletRoute")
// expenses
const Expenses = require("./Expenses/Expense/ExpensesRoutes");
const ExpenseCategory = require("./Expenses/ExpensesCategory/ExpensesCategoryRoutes");
const ReturnExpenseRoute = require("./Expenses/ReturnExpenseMoney/ReturnExpenseRoutes");
const ExpenseCalculateRoute = require("./Expenses/ExpenseCalculate/ExpenseCalculateRoutes");
const ExpenseCalculateSubItemRoute = require("./Expenses/ExpenseCalculateSubItem/ExpenseCalculateSubItemRoutes");
const customRoutes = require("../src/boiler/collectionName/customRoutes")

const allowedOrigins = [
  "http://localhost:3000",
  // Add more origins if needed
];

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", CategoryRoute);

app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/invoice-count-no", invoiceCountNo);

app.use("/api/v1/banner", banner);
app.use("/api/v1/brands", brands);
app.use("/api/v1/delivery-cost", deliveryCost);
app.use("/api/v1/variant", variantRoute);

app.use("/api/v1/coupons", coupons);

app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/my-shop", myShop);
app.use("/api/v4/review", reviewRoute);
app.use("/api/v1/wallet", walletRoute); 


// here manage courier and fb pixel setup secrate code
app.use("/api/v1/site-api-setting", siteApiSetting);

// bellow account modules
app.use("/api/v2/accounts", AccountsRoute);

// expense modules
app.use('/api/v2/expenses', Expenses)
app.use('/api/v2/expense-category', ExpenseCategory)
app.use('/api/v2/return-expense-money', ReturnExpenseRoute)
app.use('/api/v2/expense-calculate', ExpenseCalculateRoute)
app.use('/api/v2/expense-calculate-sub-item', ExpenseCalculateSubItemRoute)

// landing page genarate moudle
app.use("/api/v2/landing-page", LandingPage);

// -----start auto boiler code
app.use("/api/v3/custom", customRoutes);

app.use(
  cors({
    origin: function(origin, callback) {
      // Check if the origin is in the allowedOrigins array or if it's undefined (for same-origin requests)
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("eccomerce server is running..."));

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Database connected and listing on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = app;
