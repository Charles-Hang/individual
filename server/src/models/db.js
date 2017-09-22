import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/blog');
mongoose.connection.on('connected', () => {
	console.log('mongodb is connected');
});
mongoose.connection.on('disconnected', () => {
	console.log('mongodb is disconnected');
});
mongoose.connection.on('reconnected', () => {
	console.log('mongodb is reconnected');
});
mongoose.connection.on('error', (err) => {
	console.log('mongodb error:', err);
});

export default mongoose;