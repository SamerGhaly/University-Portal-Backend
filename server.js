require("dotenv").config();
const connectDB = require("./configurations/DBconfig");

const express = require("express");
const app = express();
const memberRoutes = require("./routers/memberRouter");
const facultyRoutes = require("./routers/facultyRouter");
const departmentRoutes = require("../milestone-1-team-64/routers/departmentRouter");
const scheduleModel = require("./models/scheduleModel");
const scheduleRouter = require("./routers/scheduleRouter");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/members", memberRoutes);

app.use("/faculties", facultyRoutes);

app.use("/departments", departmentRoutes);

app.use("/schedules", scheduleRouter);

app.listen(5000, () => {
  console.log("Server is up and running on port 5000");
});
