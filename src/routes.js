const express = require("express");
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");
const routes = express.Router();

// GET (SEARCH), POST (CREATE), PUT (EDIT), DELETE (DEL)
// get = search.
routes.get("/devs", DevController.index);

// post = create.
routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);
// How to access the ":devId"? >> LikeController, req.params

module.exports = routes;
