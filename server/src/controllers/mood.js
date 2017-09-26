import Mood from '../models/moodModel.js';

const moodController = {
	async createMood(ctx, next) {
		const body = ctx.request.body;
		console.log(ctx.request.body);
		const mood = await Mood.create({
			content: body,
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
		const mood = await Mood
			.find()
			.sort({
				date: -1
			})
			.limit(1)
			.then(moods => {
				console.log(moods);
				if (moods.length) return moods[0].content;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		console.log(mood);
		ctx.body = mood;
		next();
	}
}

export default moodController;