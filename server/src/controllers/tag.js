import Tag from '../models/tagModel.js';

const tagController = {
	async getTags(ctx, next) {
		const tags = await Tag
			.find()
			.sort({
				date: -1
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next()
			});
		ctx.body = JSON.stringify(tags);
		next();
	}
}

export default tagController;