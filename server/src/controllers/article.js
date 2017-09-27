import Article from '../models/articleModel.js';
import Tag from '../models/tagModel.js';
import Category from '../models/categoryModel.js';
import path from 'path';
import fs from 'fs';
import os from 'os';
import md from '../utils/markdown.js';

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

		const tags = ['html', 'web1', 'haha'];
		const tagPromises = tags.map(tag => {
			const doc = Tag.findOneAndUpdate({
					name: tag
				}, {
					$inc: {
						count: 1
					}
				})
				.then(result => {
					if (result) return result;
					return Tag.create({
						name: tag,
						count: 1
					});
				})
				.catch(err => {
					ctx.throw(500, '服务器错误');
					next();
				});
			return doc;
		});
		const tagsData = await Promise.all(tagPromises);
		console.log(tagsData);
		const tagsId = tagsData.map((tagData, index) => {
			return tagData._id;
		});

		const categories = ['server', '笔记', 'web'];
		const categoryPromises = categories.map(category => {
			const doc = Category.findOneAndUpdate({
					name: category
				}, {
					$inc: {
						count: 1
					}
				})
				.then(result => {
					if (result) return result;
					return Category.create({
						name: category,
						count: 1
					});
				})
				.catch(err => {
					ctx.throw(500, '服务器错误');
					next();
				});
			return doc;
		});
		const categoriesDate = await Promise.all(categoryPromises);
		const categoriesId = categoriesDate.map(categoryDate => {
			console.log(categoryDate);
			return categoryDate._id;
		});

		const result = await Article.create({
			title: title,
			birthTime: Date.now(),
			tags: tagsId,
			categories: categoriesId,
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
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
		next();
	},
	async getArticlesByCategory(ctx, next) {
		const page = ctx.query.page;
		const limit = ctx.query.limit;
		const category = ctx.query.category;
		const categoryId = await Category
			.findOne({
				name: category
			})
			.then(result => {
				return result._id;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const docs = await Article
			.find({
				categories: {
					$in: [categoryId]
				}
			})
			.sort({
				birthTime: -1
			})
			.skip(limit * (page - 1))
			.limit(limit)
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const allCount = await Article
			.count({
				categories: {
					$in: [categoryId]
				}
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
		next();
	},
	async getArticlesByTag(ctx, next) {
		const page = ctx.query.page;
		const limit = ctx.query.limit;
		const tag = ctx.query.tag;
		const tagId = await Tag
			.findOne({
				name: tag
			})
			.then(result => {
				return result._id;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const docs = await Article
			.find({
				tags: {
					$in: [tagId]
				}
			})
			.sort({
				birthTime: -1
			})
			.skip(limit * (page - 1))
			.limit(limit)
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const allCount = await Article
			.count({
				tags: {
					$in: [tagId]
				}
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
		next();
	},
	async openArticle(ctx, next) {
		const id = ctx.query.id;
		const url = await Article
			.findOne({
				_id: id
			})
			.then(doc => {
				return doc.url
			})
			.catch(err => {
				ctx.throw(500, '服务器错误');
				next();
			});
		const text = fs.readFileSync(url, 'utf8');
		const html = md.toHtml(text);
		const toc = md.toToc(text);
		const tocHtml = md.toHtml(toc);
		console.log(toc);
		ctx.body = JSON.stringify({
			html: html,
			toc: tocHtml
		});
		next();
	}
};

export default articleController;