// npm packages
const express = require("express");

// app imports
const { auctionsHandler, auctionHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readAuctions } = auctionsHandler;
const { createAuction, readAuction, updateAuction, deleteAuction } = auctionHandler;


/* All the Auctions Route */
router
  .route("")
  .get(readAuctions)
  .post(createAuction);

/* Single Auction by Name Route */
router
  .route("/:name")
  .get(readAuction)
  .patch(updateAuction)
  .delete(deleteAuction);

module.exports = router;
