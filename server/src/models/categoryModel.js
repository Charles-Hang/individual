import mongoose from './db.js';

const categorySchema = mongoose.Schema({
	name: String,
	count: Number,
	date: {
		type: Date,
		default: Date.now
	}
});

const Category = mongoose.model('categories', categorySchema);
export default Category;