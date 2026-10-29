require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const mongoUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
    return initDB();
  })
  .then(() => {
    console.log("DB initialization completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Initialization error:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  try {
    let adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
      const newUser = new User({ email: "admin@wanderlust.com", username: "admin" });
      adminUser = await User.register(newUser, "admin123");
      console.log("Created default admin user (username: admin, password: admin123)");
    }

    await Listing.deleteMany({});

    const defaultGeometry = { type: "Point", coordinates: [77.209, 28.6139] };

    const cleanedData = initData.data.map((obj) => {
      const item = { ...obj };
      delete item._id;
      delete item.__v;
      item.reviews = [];
      item.owner = adminUser._id;
      if (!item.geometry || !item.geometry.coordinates || item.geometry.coordinates.length !== 2) {
        item.geometry = defaultGeometry;
      }
      return item;
    });

    await Listing.insertMany(cleanedData);
    console.log(`DB is initialized with ${cleanedData.length} listings!`);
  } catch (error) {
    console.error("Error initializing DB:", error);
    throw error;
  }
};
