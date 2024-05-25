import User from "../models/userSchema.js";

export const getSidebarUsers = async (req, res) => {
  try {
    const isLoggedIn = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: isLoggedIn } }).select(
      "-password"
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(
      "error in controllers/userConrollers/getSidebarUser",
      error.message
    );
    res.status(500).json("Internal server error!");
  }
};
