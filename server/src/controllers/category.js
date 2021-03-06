import Category from '../models/categoryModel.js';

const categoryController = {
	async getCategories(ctx, next) {
		const categories = await Category
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
		ctx.body = JSON.stringify(categories);
	}
}

export default categoryController;