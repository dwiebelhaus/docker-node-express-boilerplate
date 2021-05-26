// npm packages
const express = require("express");

// app imports
const { playerHandler, playersHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readPlayers } = playersHandler;
const { createPlayer, readPlayer, updatePlayer, deletePlayer } = playerHandler;

/* All the Players Route */
router
  .route("")
  .get(readPlayers)
  .post(createPlayer);

/* Single Players by Name Route */
router
  .route("/:name")
  .get(readPlayer)
  .patch(updatePlayer)
  .delete(deletePlayer);

module.exports = router;
