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
		}
	}
	
	try {
		const comic = await Comic.create(newComic);
		console.log(comic);
		res.redirect("/comics/" + comic._id);
	} catch (err) {
		console.log(err);
		res.send("You broke it... /comics POST");
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
		res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		res.send("Broken again... /comics/id PUT");
	}
	
})

//Delete
router.delete("/:id", checkComicOwner, async (req, res) => {
	try {
		const deletedComic = await Comic.findByIdAndDelete(req.params.id).exec();
		console.log("Deleted:", deletedComic);
		res.redirect("/comics");
	} catch (err) {
		console.log(err);
		res.send("Brokennnnn /comics/id DELETE");
	}
	
})



module.exports = router;