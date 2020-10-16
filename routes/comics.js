const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkComicOwner = require('../utils/checkComicOwner');

// Index
router.get("/", async (req, res) => {
	console.log(req.user);
	try {
		const comics = await Comic.find().exec();
		res.render("comics", {comics});
	} catch (err) {
		console.log(err);
		res.send("you broke it... /index");
	}
})

// Create
router.post("/", isLoggedIn, async (req, res) => {
	const genre = req.body.genre.toLowerCase();
	const newComic = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date,
		series: req.body.series,
		issue: req.body.issue,
		genre,
		color: !!req.body.color,
		image_link: req.body.image_link,
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		upvotes: [req.user.username],
		downvotes: []
	}
	
	try {
		const comic = await Comic.create(newComic);
		req.flash("success", "Comic created!");
		res.redirect("/comics/" + comic._id);
	} catch (err) {
		req.flash("error", "Error creating comic")
		res.redirect("/comics");
	}
})

// New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("comics_new");
})

// Search
router.get("/search", async (req, res) => {
	try {
		const comics = await Comic.find({
			$text: {
				$search: req.query.term
			}
		});
		res.render("comics", {comics});
	} catch (err) {
		console.log(err);
		res.send("broken search")
	}
})

// Genre
router.get("/genre/:genre", async (req, res) => {
	// Check if the given genre is valid
	const validGenres = ["superhero", "manga", "slice-of-life", "humor", "sci-fi", "fantasy", "horror", "action", "nonfiction"];
	if (validGenres.includes(req.params.genre.toLowerCase())) {
		const comics = await Comic.find({genre: req.params.genre}).exec();
		res.render("comics", {comics});
	} else {
		res.send("Please enter a valid genre")
	}
});

// Show
router.get("/:id", async (req, res) => {
	try {
		const comic = await Comic.findById(req.params.id).exec();
		const comments = await Comment.find({comicId: req.params.id});
		res.render("comics_show", {comic, comments})
	} catch (err) {
		console.log(err);
		res.send("You broke it... /comics/:id")
	}
})

// Edit
router.get("/:id/edit", checkComicOwner, async (req, res) => {
	const comic = await Comic.findById(req.params.id).exec();
	res.render("comics_edit", {comic});
})

// Update
router.put("/:id", checkComicOwner, async (req, res) => {
	const genre = req.body.genre.toLowerCase();
	const comicBody = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date,
		series: req.body.series,
		issue: req.body.issue,
		genre,
		color: !!req.body.color,
		image_link: req.body.image_link
	}
	
	try {
		const comic = await Comic.findByIdAndUpdate(req.params.id, comicBody, {new: true}).exec();
		req.flash("success", "Comic updated!")
		res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		req.flash("error", "Error updating comic");
		res.redirect("/comics");
	}
	
})

//Delete
router.delete("/:id", checkComicOwner, async (req, res) => {
	try {
		const deletedComic = await Comic.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "Comic deleted!");
		res.redirect("/comics");
	} catch (err) {
		console.log(err);
		req.flash("error", "Error deleting comic");
		res.redirect("back");
	}
	
})



module.exports = router;