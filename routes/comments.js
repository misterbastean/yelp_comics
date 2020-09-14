const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Comic = require('../models/comic');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

// New Comment - Show Form
router.get("/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {comicId: req.params.id})
})


// Create Comment - Actually Update DB
router.post("/", isLoggedIn, async (req, res) => {
	try {
		const comment = await Comment.create({
			user: {
				id: req.user._id,
				username: req.user.username
			},
			text: req.body.text,
			comicId: req.body.comicId
		});
		console.log(comment);
		res.redirect(`/comics/${req.body.comicId}`)
	} catch (err) {
		console.log(err);
		res.send("Broken again... POST comments")
	}
	
})

// Edit Comment - Show the edit form
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
	try {
		const comic = await Comic.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("comic:", comic)
		console.log("comment:", comment)
		res.render("comments_edit", {comic, comment});
	} catch (err) {
		console.log(err);
		res.send("Broke Comment Edit GET")
	}
})

// Update Comment - Actually update in DB
router.put("/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		console.log(comment);
		res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		res.send("Brokeeeeee comment PUT")
	}
})

// Delete Comment - Duh
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		res.send("Broken again comment DELETE")
	}
})

module.exports = router;