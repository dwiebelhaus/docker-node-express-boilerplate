// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: String,
  notes: String
});

playerSchema.statics = {
  /**
   * Create a Single New Player
   * @param {object} newPlayer - an instance of Player
   * @returns {Promise<Player, APIError>}
   */
  async createPlayer(newPlayer) {
    const duplicate = await this.findOne({ name: newPlayer.name });
    if (duplicate) {
      throw new APIError(
        409,
        "Player Already Exists",
        `There is already a Player with name '${newPlayer.name}'.`
      );
    }
    const Player = await newPlayer.save();
    return Player.toObject();
  },
  /**
   * Delete a single Player
   * @param {String} name - the Player's name
   * @returns {Promise<Player, APIError>}
   */
  async deletePlayer(name) {
    const deleted = await this.findOneAndRemove({ name });
    if (!deleted) {
      throw new APIError(404, "Player Not Found", `No Player '${name}' found.`);
    }
    return deleted.toObject();
  },
  /**
   * Get a single Player by name
   * @param {String} name - the Player's name
   * @returns {Promise<Player, APIError>}
   */
  async readPlayer(name) {
    const Player = await this.findOne({ name });

    if (!Player) {
      throw new APIError(404, "Player Not Found", `No Player '${name}' found.`);
    }
    return Player.toObject();
  },
  /**
   * Get a list of Players
   * @param {Object} query - pre-formatted query to retrieve Players.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Players, APIError>}
   */
  async readPlayers(query, fields, skip, limit) {
    const Players = await this.find(query, fields)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 })
      .exec();
    if (!Players.length) {
      return [];
    }
    return Players.map(Player => Player.toObject());
  },
  /**
   * Patch/Update a single Player
   * @param {String} name - the Player's name
   * @param {Object} PlayerUpdate - the json containing the Player attributes
   * @returns {Promise<Player, APIError>}
   */
  async updatePlayer(name, PlayerUpdate) {
    const Player = await this.findOneAndUpdate({ name }, PlayerUpdate, {
      new: true
    });
    if (!Player) {
      throw new APIError(404, "Player Not Found", `No Player '${name}' found.`);
    }
    return Player.toObject();
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!playerSchema.options.toObject) playerSchema.options.toObject = {};
playerSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
playerSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Player", playerSchema);
