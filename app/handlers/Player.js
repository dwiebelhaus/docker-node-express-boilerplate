// npm packages
const { validate } = require("jsonschema");

// app imports
const { Player } = require("../models");
const { APIError } = require("../helpers");
const { PlayerNewSchema, PlayerUpdateSchema } = require("../schemas");

/**
 * Validate the POST request body and create a new Player
 */
async function createPlayer(request, response, next) {
  const validation = validate(request.body, PlayerNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }

  try {
    const newPlayer = await Player.createPlayer(new Player(request.body));
    return response.status(201).json(newPlayer);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single Player
 * @param {String} name - the name of the Player to retrieve
 */
async function readPlayer(request, response, next) {
  const { name } = request.params;
  try {
    const Player = await Player.readPlayer(name);
    return response.json(Player);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single Player
 * @param {String} name - the name of the Player to update
 */
async function updatePlayer(request, response, next) {
  const { name } = request.params;

  const validation = validate(request.body, PlayerUpdateSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }

  try {
    const Player = await Player.updatePlayer(name, request.body);
    return response.json(Player);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single Player
 * @param {String} name - the name of the Player to remove
 */
async function deletePlayer(request, response, next) {
  const { name } = request.params;
  try {
    const deleteMsg = await Player.deletePlayer(name);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createPlayer,
  readPlayer,
  updatePlayer,
  deletePlayer
};
