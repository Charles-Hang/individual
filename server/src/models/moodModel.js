import mongoose from './db.js';

const moodSchema = mongoose.Schema({
	mood: String,
	date: {
		type: Date,
		default: Date.now
	},
});

const Mood = mongoose.model('mood', moodSchema);

export default Mood;