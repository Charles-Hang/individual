import mongoose from './db.js';
const Schema = mongoose.Schema;

const articleSchema = mongoose.Schema({
	title: String,
	birthTime: {
		type: Date,
		default: Date.now
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'tags'
	}],
	categories: [String],
	url: String
});

const Article = mongoose.model('articles', articleSchema);

export default Article;