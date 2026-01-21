const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find the user in MySQL
    const user = await User.findOne({ where: { username } });

    // 2. If user doesn't exist, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Compare the provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 4. Success! (You can also generate a JWT token here if needed)
    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
