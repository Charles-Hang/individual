import mongoose from './db.js';
const Schema = mongoose.Schema;

const articleSchema = mongoose.Schema({
	title: String,
	publish: Boolean,
	birthTime: {
		type: Date,
		default: Date.now
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'tags'
	}],
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'categories'
	}],
	url: String
});

const Article = mongoose.model('articles', articleSchema);

export default Article;