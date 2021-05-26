// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
  players: [{
    player_id: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    bid: Number,
    buyer: String,
  }],
  minimumBid: Number,
  numberOfBlindBids: Number
  
});

AuctionSchema.statics = {
  /**
   * Create a Single New Auction
   * @param {object} newAuction - an instance of Auction
   * @returns {Promise<Auction, APIError>}
   */
  async createAuction(newAuction) {
    const duplicate = await this.findOne({ name: newAuction.name });
    if (duplicate) {
      throw new APIError(
        409,
        "Auction Already Exists",
        `There is already a Auction with name '${newAuction.name}'.`
      );
    }
    const Auction = await newAuction.save();
    return Auction.toObject();
  },
  /**
   * Delete a single Auction
   * @param {String} name - the Auction's name
   * @returns {Promise<Auction, APIError>}
   */
  async deleteAuction(name) {
    const deleted = await this.findOneAndRemove({ name });
    if (!deleted) {
      throw new APIError(404, "Auction Not Found", `No Auction '${name}' found.`);
    }
    return deleted.toObject();
  },
  /**
   * Get a single Auction by name
   * @param {String} name - the Auction's name
   * @returns {Promise<Auction, APIError>}
   */
  async readAuction(name) {
    const Auction = await this.findOne({ name });

    if (!Auction) {
      throw new APIError(404, "Auction Not Found", `No Auction '${name}' found.`);
    }
    return Auction.toObject();
  },
  /**
   * Get a list of Auctions
   * @param {Object} query - pre-formatted query to retrieve Auctions.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Auctions, APIError>}
   */
  async readAuctions(query, fields, skip, limit) {
    const Auctions = await this.find(query, fields)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 })
      .exec();
    if (!Auctions.length) {
      return [];
    }
    return Auctions.map(Auction => Auction.toObject());
  },
  /**
   * Patch/Update a single Auction
   * @param {String} name - the Auction's name
   * @param {Object} AuctionUpdate - the json containing the Auction attributes
   * @returns {Promise<Auction, APIError>}
   */
  async updateAuction(name, AuctionUpdate) {
    const Auction = await this.findOneAndUpdate({ name }, AuctionUpdate, {
      new: true
    });
    if (!Auction) {
      throw new APIError(404, "Auction Not Found", `No Auction '${name}' found.`);
    }
    return Auction.toObject();
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!AuctionSchema.options.toObject) AuctionSchema.options.toObject = {};
AuctionSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
AuctionSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Auction", AuctionSchema);
