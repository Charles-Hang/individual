import Article from '../models/articleModel.js';
import Tag from '../models/tagModel.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

const articleController = {
	async createArticle(ctx, next) {
		const file = ctx.request.fields.files[0];
		const title = ctx.request.fields.title;
		const hasBlogFile = await new Promise((resolve, reject) => {
			fs.access(path.join(os.homedir(), 'blogFiles'), function(err) {
				if (err) {
					resolve(err);
				} else {
					resolve();
				}
			});
		});
		if (hasBlogFile) {
			fs.mkdirSync(path.join(os.homedir(), 'blogFiles'));
		}
		const reader = fs.createReadStream(file.path);
		const stream = fs.createWriteStream(path.join(os.homedir(), 'blogFiles', file.name));
		reader.pipe(stream);

		const tags = ['css', 'canvas'];
		const promises = tags.map((tag) => {
			const doc = Tag.findOneAndUpdate({
				name: tag
			}, {
				$set: {}
			}, {
				upsert: true
			}).catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
			return doc;
		});
		const tagsData = await Promise.all(promises);
		const tagsId = tagsData.map(tagData => {
			console.log(tagData);
			return tagData._id;
		});
		const result = await Article.create({
			title: title,
			birthTime: Date.now(),
			tags: tagsId,
			categories: ['test'],
			url: path.join(os.homedir(), 'blogFiles', file.name)
		}).catch(err => {
			ctx.throw(500, '服务器错误');
			next();
		});
		console.log('meicuomeicuo');
		console.log(result);
		ctx.body = 'successful';
		next();
	},
	async getArticles(ctx, next) {
		const page = ctx.query.page;
		const limit = ctx.query.limit;
		const docs = await Article
			.find()
			.sort({
				'birthTime': -1
			})
			.skip(limit * (page - 1))
			.limit(limit)
			.populate('tags')
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const allCount = await Article
			.count()
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		console.log(docs);
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
		next();
	}
};

export default articleController;