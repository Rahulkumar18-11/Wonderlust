const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/filter/:id", wrapAsync(listingController.filter));
router.get("/search", listingController.search);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// Reservation & Payment Checkout Routes
router
    .route("/:id/reservelisting")
    .get(isLoggedIn, wrapAsync(listingController.reserveListing))
    .post(isLoggedIn, wrapAsync(listingController.reserveListing));

router
    .route("/:id/payment")
    .get(isLoggedIn, wrapAsync(listingController.renderPaymentPage))
    .post(isLoggedIn, wrapAsync(listingController.renderPaymentPage));

router
    .route("/:id/payment/confirm")
    .post(isLoggedIn, wrapAsync(listingController.confirmPayment));

module.exports = router;
