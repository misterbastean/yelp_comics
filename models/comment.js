const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	text: String,
	comicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comic"
	}
});

module.exports = mongoose.model("comment", commentSchema);