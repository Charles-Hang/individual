import mongoose from './db.js';

const moodSchema = mongoose.Schema({
	content: String,
	date: {
		type: Date,
		default: Date.now
	},
});

const Mood = mongoose.model('moods', moodSchema);

export default Mood;