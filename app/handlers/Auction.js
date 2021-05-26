// npm packages
const { validate } = require("jsonschema");

// app imports
const { Auction } = require("../models");
const { APIError } = require("../helpers");
const { AuctionNewSchema, AuctionUpdateSchema } = require("../schemas");

/**
 * Validate the POST request body and create a new Auction
 */
async function createAuction(request, response, next) {
  const validation = validate(request.body, AuctionNewSchema);
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
    const newAuction = await Auction.createAuction(new Auction(request.body));
    return response.status(201).json(newAuction);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single Auction
 * @param {String} name - the name of the Auction to retrieve
 */
async function readAuction(request, response, next) {
  const { name } = request.params;
  try {
    const Auction = await Auction.readAuction(name);
    return response.json(Auction);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single Auction
 * @param {String} name - the name of the Auction to update
 */
async function updateAuction(request, response, next) {
  const { name } = request.params;

  const validation = validate(request.body, AuctionUpdateSchema);
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
    const Auction = await Auction.updateAuction(name, request.body);
    return response.json(Auction);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single Auction
 * @param {String} name - the name of the Auction to remove
 */
async function deleteAuction(request, response, next) {
  const { name } = request.params;
  try {
    const deleteMsg = await Auction.deleteAuction(name);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createAuction,
  readAuction,
  updateAuction,
  deleteAuction
};
