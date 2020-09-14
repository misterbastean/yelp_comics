const Comic = require('../models/comic');
const Comment = require('../models/comment');

const comic_seeds = [
	{
  	title: "Watchmen",
  	description: "Watchmen is an American comic book maxiseries by the British creative team of writer Alan Moore, artist Dave Gibbons and colorist John Higgins.",
  	author: "Alan Moore",
  	publisher: "DC",
  	date: "1986-09-01",
  	series: "Watchmen",
  	issue: 1,
  	genre: "superhero",
  	color: true,
  	image_link: "https://upload.wikimedia.org/wikipedia/commons/6/65/Watchmen-cover.svg"
  },
  {
    title: "Batman: The Dark Knight Returns",
  	description: "Batman is a 1986 four-issue comic book miniseries starring Batman, written by Frank Miller, illustrated by Miller and Klaus Janson, and published by DC Comics.",
  	author: "Frank Miller",
  	publisher: "DC",
  	date: "1986-02-01",
  	series: "The Dark Knight",
  	issue: 1,
  	genre: "superhero",
  	color: true,
  	image_link: "https://upload.wikimedia.org/wikipedia/en/7/77/Dark_knight_returns.jpg"
  },
  {
    title: "Y: The Last Man",
  	description: "Y: The Last Man is a post-apocalyptic science fiction comic book series by Brian K. Vaughan and Pia Guerra published by Vertigo from 2002 through 2008.",
  	author: "Brian K. Vaughn",
  	publisher: "Vertigo",
  	date: "2002-09-01",
  	series: "Y: The Last Man",
  	issue: 1,
  	genre: "sci-fi",
  	color: true,
  	image_link: "https://upload.wikimedia.org/wikipedia/en/0/04/Y_-_The_Last_Man_23_-_Widow%27s_Pass_03_-_00_-_FC.jpg"
  }
]

const seed = async () => {
	// Delete all the current comics and comments
	await Comic.deleteMany();
	console.log("Deleted All The Comics!")
	
	await Comment.deleteMany();
	console.log("Deleted All the Comments!");
	
	// // Create three new comics
	// for (const comic_seed of comic_seeds) {
	// 	let comic = await Comic.create(comic_seed);
	// 	console.log("Created a new comic:", comic.title)
	// 	// Create a new comment for each comic
	// 	await Comment.create({
	// 		text: "I ruved this Romic Rook!",
	// 		user: "scooby_doo",
	// 		comicId: comic._id
	// 	})
	// 	console.log("Created a new comment!")
	// }
}


module.exports = seed;