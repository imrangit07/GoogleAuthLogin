// using Token

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./model/userModel");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect("mongodb://localhost:27017/googletest")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =======================
// Passport Config
// =======================
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // If user not found, create one
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "1d" }
        );

        // ✅ Attach token to user
        const userWithToken = {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: token,
        };

        return done(null, userWithToken);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// No sessions used here
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// =======================
// Routes
// =======================

// Step 1: Redirect to Google Login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Step 2: Callback after Google login
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/failure", session: false }),
  (req, res) => {
    const { token, id, name, email, picture } = req.user;

    // Encode user info in URL (URL-safe)
    const userData = encodeURIComponent(JSON.stringify({ id, name, email, picture, token }));

    res.redirect(`http://localhost:5173/success?user=${userData}`);
  }
);


// Logout Route (optional)
app.get("/auth/logout", (req, res) => {
  res.redirect("http://localhost:5173/");
});

// Protected Route Example
app.get("/user", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    res.json({ message: "User authenticated", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// =======================
// Start Server
// =======================
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
