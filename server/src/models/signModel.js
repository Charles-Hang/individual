import mongoose from './db.js';

const signSchema = mongoose.Schema({
	content: String,
	date: {
		type: Date,
		default: Date.now
	},
});

const Sign = mongoose.model('signs', signSchema);

export default Sign;