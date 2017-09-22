import Mood from '../models/moodModel.js';

const moodController = {
	async createMood(ctx, next) {
		const body = ctx.request.body;
		console.log(ctx.request.body);
		const mood = await Mood.create({
			mood: body,
			date: Date.now()
		}).catch(err => {
			ctx.throw(500, '服务器端错误');
			next();
		});
		console.log(mood);
		ctx.body = 'ok';
		next();
	},
	async getMood(ctx, next) {
		// Mood.find()
	}
}

export default moodController;