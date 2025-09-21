const express = require('express');
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Mzansi Services Server running on port ${PORT}`));