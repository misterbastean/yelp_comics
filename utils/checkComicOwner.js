const Comic = require('../models/comic');

const checkComicOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {  // Check if the user is logged in
		// If logged in, check if they own the comic
		const comic = await Comic.findById(req.params.id).exec();
		if (comic.owner.id.equals(req.user._id)) {
			next();
		} else { // If not, redirect back to show page
			res.redirect("back");
		}
	} else { // If not logged in, redirect to /login
		res.redirect("/login");
	}
}

module.exports = checkComicOwner;