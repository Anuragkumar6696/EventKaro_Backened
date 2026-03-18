const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connect = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const eventRoutes = require("./routes/eventRoutes");   // ⭐ NEW

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */

app.use("/api/auth", authRoutes);

app.use("/api/college", collegeRoutes);

app.use("/api/superadmin", superAdminRoutes);

app.use("/api/event", eventRoutes);   // ⭐ EVENT MODULE ADDED

/* ---------- SERVER ---------- */

const startServer = async () => {
  try {

    await connect();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });

  } catch (err) {
    console.log("❌ DB Connection Failed");
  }
};

startServer();