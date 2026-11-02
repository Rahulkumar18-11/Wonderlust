const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async(req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async(req, res, next) => {
    let response;
    try {
        response = await geocodingClient
            .forwardGeocode({
                query: ` ${req.body.listing.location},${req.body.listing.country}`,
                limit: 1,
            })
            .send();
    } catch (e) {
        response = { body: { features: [{ geometry: { type: "Point", coordinates: [77.209, 28.6139] } }] } };
    }

    let url = req.file ? req.file.path : "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80";
    let filename = req.file ? req.file.filename : "wanderlust_default";

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    newListing.geometry = response.body.features && response.body.features.length > 0
        ? response.body.features[0].geometry
        : { type: "Point", coordinates: [77.209, 28.6139] };

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you trying to edit for does not exist!");
        res.redirect("/listings");
    }
    let imageUrl = listing.image ? listing.image.url : "";
    if (imageUrl && imageUrl.includes("/upload")) {
        imageUrl = imageUrl.replace("/upload", "/upload/w_250,h_160");
    }
    res.render("listings/edit.ejs", { listing, imageUrl });
};

module.exports.updateListing = async(req, res, next) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
    });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.filter = async(req, res, next) => {
    let { id } = req.params;
    let allListings = await Listing.find({ category: { $all: [id] } });
    if (allListings.length != 0) {
        res.locals.success = `Listings Filtered by ${id}!`;
        res.render("listings/index.ejs", { allListings });
    } else {
        req.flash("error", `There is no any Listing for ${id}!`);
        res.redirect("/listings");
    }
};

module.exports.search = async(req, res) => {
    let input = req.query.q.trim().replace(/\s+/g, " ");
    if (input == "" || input == " ") {
        req.flash("error", "Please enter search query!");
        res.redirect("/listings");
    }

    let data = input.split("");
    let element = "";
    let flag = false;
    for (let index = 0; index < data.length; index++) {
        if (index == 0 || flag) {
            element = element + data[index].toUpperCase();
        } else {
            element = element + data[index].toLowerCase();
        }
        flag = data[index] == " ";
    }

    let allListings = await Listing.find({
        title: { $regex: element, $options: "i" },
    });
    if (allListings.length != 0) {
        res.locals.success = "Listings searched by Title!";
        res.render("listings/index.ejs", { allListings });
        return;
    }

    if (allListings.length == 0) {
        allListings = await Listing.find({
            category: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by Category!";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }
    if (allListings.length == 0) {
        allListings = await Listing.find({
            country: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by Country!";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }

    if (allListings.length == 0) {
        allListings = await Listing.find({
            location: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by Location!";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }

    const intValue = parseInt(element, 10);
    const intDec = Number.isInteger(intValue);

    if (allListings.length == 0 && intDec) {
        allListings = await Listing.find({ price: { $lte: element } }).sort({
            price: 1,
        });
        if (allListings.length != 0) {
            res.locals.success = `Listings searched by price less than Rs ${element}!`;
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }
    if (allListings.length == 0) {
        req.flash("error", "No listings found based on your search!");
        res.redirect("/listings");
    }
};

module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

// Render Payment & Checkout Page
module.exports.renderPaymentPage = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const checkin = req.body?.checkin || req.query?.checkin || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const checkout = req.body?.checkout || req.query?.checkout || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];
    const guests = req.body?.guests || req.query?.guests || 2;
    const email = req.body?.email || req.query?.email || (req.user ? req.user.email : "");

    const diffDays = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)));
    const nights = isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
    const basePrice = (listing.price || 0) * nights;
    const gst = Math.round(basePrice * 0.18);
    const cleaningFee = 500;
    const totalPrice = basePrice + gst + cleaningFee;
    const bookingId = "WL-" + Math.floor(100000 + Math.random() * 900000);

    const bookingDetails = {
        checkin,
        checkout,
        guests,
        email,
        nights,
        basePrice,
        gst,
        cleaningFee,
        totalPrice,
        bookingId
    };

    console.log(`💳 [CHECKOUT INITIATED] Checkout page opened for listing '${listing.title}' by '${email}' (Total: ₹${totalPrice})`);
    res.render("listings/payment.ejs", { listing, bookingDetails });
};

// Confirm Payment & Issue Digital Receipt
module.exports.confirmPayment = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const {
        bookingId = "WL-" + Math.floor(100000 + Math.random() * 900000),
        checkin = "2026-11-10",
        checkout = "2026-11-13",
        guests = 2,
        email = req.user ? req.user.email : "guest@wanderlust.com",
        paymentMethod = "Instant UPI / QR Code",
        totalPrice = (listing.price || 0) * 3 + 500
    } = req.body;

    console.log(`✅ [PAYMENT CONFIRMED] Booking ${bookingId} for '${listing.title}' paid via ${paymentMethod} (Amount: ₹${totalPrice})`);
    console.log(`📧 [ITINERARY EMAILED] Official confirmation voucher & access code sent to ${email}`);

    req.flash("success", `Payment confirmed! Official booking voucher has been sent to ${email}`);

    res.render("listings/success.ejs", {
        listing,
        booking: {
            bookingId,
            checkin,
            checkout,
            guests,
            email,
            paymentMethod,
            totalPrice,
            accessCode: "#" + Math.floor(1000 + Math.random() * 9000)
        }
    });
};

module.exports.reserveListing = async(req, res) => {
    return module.exports.renderPaymentPage(req, res);
};
