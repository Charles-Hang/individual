import mongoose from './db.js';

const tagSchema = mongoose.Schema({
	name: String,
	date: {
		type: Date,
		default: Date.now
	},
});

const Tag = mongoose.model('tags', tagSchema);
export default Tag;