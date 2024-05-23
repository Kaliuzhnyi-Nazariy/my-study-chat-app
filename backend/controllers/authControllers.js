import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { generateAndSetCookies } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json("Passwords don't match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json("User is already exist!");
    }

    const boyDefaultAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const girlDefaultAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyDefaultAvatar : girlDefaultAvatar,
    });

    if (newUser) {
      await generateAndSetCookies(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json("Invalid credentials!");
    }
  } catch (error) {
    console.log("error in controllers/authControllers/signup", error.message);
    res.status(500).json("Internal server error!");
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const comparePasswords = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !comparePasswords) {
      return res.status(400).json("Invalid credentials!");
    }

    generateAndSetCookies(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      user: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in controllers/authControllers/login", error.message);
    res.status(500).json("Internal server error!");
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json("Logged out successfully!");
  } catch (error) {
    console.log("error in controllers/authControllers/logout", error.message);
    res.status(500).json("Internal server error!");
  }
};
