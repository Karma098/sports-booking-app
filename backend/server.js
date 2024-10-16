const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const centerRoutes = require("./routes/centerRoutes");
const courtsRouter = require("./routes/courtRoutes");
const bookingsRouter = require("./routes/bookingRoutes");
const sportsRouter = require("./routes/sportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/centers", centerRoutes);
app.use("/courts", courtsRouter);
app.use("/bookings", bookingsRouter);
app.use("/sports", sportsRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Welcome to the Sports Booking App API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
