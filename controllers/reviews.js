const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log(`💬 [REVIEW CREATED] New review added for listing: '${listing.title}' by '${req.user.username}'`);
  req.flash("success", "New review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.updateReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndUpdate(reviewId, req.body.review);
  console.log(`📝 [REVIEW UPDATED] Review ID: ${reviewId} updated by user: '${req.user.username}'`);
  req.flash("success", "Review updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log(`🗑️  [REVIEW DELETED] Review ID: ${reviewId} removed by user: '${req.user.username}'`);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
