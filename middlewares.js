const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schemaValidation");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.warn(`🛡️  [AUTHORIZATION DENIED] Access blocked to protected route "${req.method} ${req.originalUrl}" - User is NOT logged in`);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be Logged in!");
    return res.redirect("/login");
  }
  console.log(`🛡️  [AUTHORIZATION PERMITTED] User '${req.user.username}' authorized for "${req.method} ${req.originalUrl}"`);
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    console.warn(`🛡️  [AUTHORIZATION FAILED] Listing with ID: ${id} not found`);
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(req.user._id)) {
    console.warn(`🛡️  [AUTHORIZATION DENIED] User '${req.user.username}' denied modification of listing '${listing.title}' (Owner ID: ${listing.owner}, User ID: ${req.user._id})`);
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  console.log(`🛡️  [AUTHORIZATION PERMITTED] User '${req.user.username}' verified as owner of listing '${listing.title}'`);
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.warn("⚠️  [VALIDATION ERROR] Listing schema validation failed:", error.message);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.warn("⚠️  [VALIDATION ERROR] Review schema validation failed:", error.message);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    console.warn(`🛡️  [AUTHORIZATION FAILED] Review with ID: ${reviewId} not found`);
    req.flash("error", "Review does not exist!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(req.user._id)) {
    console.warn(`🛡️  [AUTHORIZATION DENIED] User '${req.user.username}' denied deletion of review (Author ID: ${review.author}, User ID: ${req.user._id})`);
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  console.log(`🛡️  [AUTHORIZATION PERMITTED] User '${req.user.username}' verified as author of review ID: ${reviewId}`);
  next();
};
