const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    console.log(req.io, req.connectedUsers);

    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev does not exist" });
    }

    // To see if the users had match.
    if (targetDev.likes.includes(loggedDev._id)) {
      // Get the which user is logged.
      // req.connectedUsers[user] = Get all the users by 'connectedUsers' and the especific one by 'user' by 'findById(user).
      const loggedSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[devId];

      if (loggedSocket) {
        // Saying to the logged user that he matched the targetDev.
        req.io.to(loggedSocket).emit('match', targetDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    // push is able here because "likes" is a vetor. "push" = add info in some array.
    // loggedDev = user logged. + Info "likes" + targetDev._id. => Add the targetDev into the loggedDev list of likes.
    loggedDev.likes.push(targetDev._id);

    // To save what was edited (likes) in the targetDev.
    await loggedDev.save();

    return res.json(loggedDev);
  }
};
