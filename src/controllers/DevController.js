// Controllers receives the reqs (routes will call the controllers), then will form an answer.
// Max methods in one controller (INDEX, SHOW, STORE, UPDATE, DELETE), so, "LIKE" in other controller.
const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    // search the logged user.
    const { user } = req.headers;

    // Get all the information about the logged user (likes, dislikes...).
    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      // $and means that this filter will pass only when all the reqs are okay and not if just one or two are okay.
      $and: [
        { _id: { $ne: user } }, // 'ne' = not equal. So... Id's that is different from the looged id.
        { _id: { $nin: loggedDev.likes } }, //'nin' = not in "list". So... Get all the users that this user does not give like yet.
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    return res.json(users);
  },

  // Search the user on GitHub using 'axios'.
  async store(req, res) {
    // to get 'username' only from 'body'.
    const { username } = req.body;

    // Check if the users was already registered (findOne user that is equal to username).
    // findOne from 'mongoose'.
    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    // To create a new user.
    // async & await when use 'axios'.
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    // What do we want from response.data?
    const { name, bio, avatar_url: avatar } = response.data;

    // To store these informations got on GitHub in the Database.
    // Will show only these informations.
    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};
