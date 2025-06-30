import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protectRoute from "../middleware/auth.middleware.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username should be at least 3 characters long" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit verification code
    const profileImage = `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}`;

    // ✅ Declare user FIRST
    const user = new User({
      name,
      email,
      username,
      password,
      profileImage,
      isVerified: false,
      verificationToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // ✅ Save user
    await user.save();

    // ✅ Now safe to send email
    await sendVerificationEmail(user.email, verificationToken);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    console.log("Stack trace:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.verificationToken || !user.verificationExpires)
      return res.status(400).json({ message: "No verification requested" });

    const isCodeValid = user.verificationToken === code;
    const isCodeExpired = Date.now() > user.verificationExpires;

    if (!isCodeValid)
      return res.status(400).json({ message: "Invalid verification code" });

    if (isCodeExpired)
      return res.status(400).json({ message: "Verification code expired" });

    user.isVerified = true; // Set user as verified
    // Clear token after success
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = code;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
    await user.save();

    await sendVerificationEmail(user.email, code);

    res.status(200).json({ message: "Verification code resent" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

    if (!user.isVerified) {
  return res.status(403).json({ message: "Please verify your email before logging in." });
}
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get current user
router.get("/me", protectRoute, (req, res) => {
  res.json(req.user);
});


export default router;