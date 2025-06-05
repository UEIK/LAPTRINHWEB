const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const corsConfig = require("./middleware/corsConfig");
const { sequelize } = require("./config/dbConfig");
const { connectDB } = require("./config/dbConfig");

//const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cartRoutes");
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes")
const reportRoutes = require('./routes/reportRoutes');

require("./models/AssociationsRelationship");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

// MIDDLEWARE
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

// ROUTE
// app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api", loginRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use('/api/reports', reportRoutes);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};
startServer();