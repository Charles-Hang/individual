import Sign from '../models/signModel.js';

const signController = {
	async createSign(ctx, next) {
		const body = ctx.request.body;
		console.log(ctx.request.body);
		const sign = await Sign.create({
			content: body,
			date: Date.now()
		}).catch(err => {
			ctx.throw(500, '服务器端错误');
		});
		console.log(sign);
		ctx.body = 'success';
	},
	async getSign(ctx, next) {
		const sign = await Sign
			.find()
			.sort({
				date: -1
			})
			.limit(1)
			.then(signs => {
				console.log(signs);
				if (signs.length) return signs[0].content;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
			});
		console.log(sign);
		ctx.body = sign;
	}
}

export default signController;