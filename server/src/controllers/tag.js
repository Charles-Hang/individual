import Tag from '../models/tagModel.js';

const tagController = {
	async getTags(ctx, next) {
		const tags = await Tag
			.find({
				count: {
					$ne: 0
				}
			})
			.sort({
				date: -1
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
			});
		ctx.body = JSON.stringify(tags);
	}
}

export default tagController;