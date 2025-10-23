import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./Config/ConnectDB.js";
import authRoutes from "./Routes/auth.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./Models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();
ConnectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// Passport Google Strategy (optional: used by Routes/auth.js)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existing = await User.findOne({ googleId: profile.id });
        if (existing) return done(null, existing);
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails && profile.emails[0] && profile.emails[0].value,
          googleId: profile.id
        });
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

// Simple protected dashboard route example
app.get("/dashboard", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : (req.query.token || req.headers["x-access-token"] || req.headers["authorization"]);
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id).select("-password -__v");
    res.json({ message: "Welcome to dashboard", user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
