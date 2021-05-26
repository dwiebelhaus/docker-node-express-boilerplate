// app imports
const { Player } = require("../models");
const { APIError, parseSkipLimit } = require("../helpers");

/**
 * List all the Players. Query params ?skip=0&limit=1000 by default
 */
async function readPlayers(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip) || 0;
  let limit = parseSkipLimit(request.query.limit, 1000) || 1000;
  if (skip instanceof APIError) {
    return next(skip);
  } else if (limit instanceof APIError) {
    return next(limit);
  }

  try {
    const Players = await Player.readPlayers({}, {}, skip, limit);
    return response.json(Players);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  readPlayers
};
