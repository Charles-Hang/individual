import Article from '../models/articleModel.js';
import Tag from '../models/tagModel.js';
import Category from '../models/categoryModel.js';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import os from 'os';
import md from '../utils/markdown.js';

const articleController = {
	async createArticle(ctx, next) {
		const file = ctx.request.fields.files[0];
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

		const info = {};
		const rl = readline.createInterface({
			input: reader
		});
		rl.on('line', (line) => {
			const reg = /^<!--(.*)-->$/g;
			if (!reg.test(line)) {
				rl.close();
			} else {
				console.log(line);
				const newLine = line.replace(reg, '$1');
				const item = newLine.trim().split(':');
				console.log('item', item);
				if (item[0] !== 'date') {
					info[item[0]] = item[1];
				} else {
					item.shift();
					info.date = item.join(':');
				}
			}
		});
		const rlEnd = await new Promise(resolve => {
			rl.on('close', () => {
				resolve();
			});
		}).catch(err => {
			console.log('await rlEnd err', err);
		});
		console.log('info', info)

		let tags,
			tagsId = [],
			categories,
			categoriesId = [];
		tags = info.tags ? info.tags.trim().split(' ') : null;
		console.log(tags);
		if (tags && tags.length) {
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
						ctx.throw(500, '服务器错误', err);
						next();
					});
				return doc;
			});
			const tagsData = await Promise.all(tagPromises);
			console.log(tagsData);
			tagsId = tagsData.map((tagData, index) => {
				return tagData._id;
			});
		}

		categories = info.categories ? info.categories.trim().split(' ') : null;
		console.log(categories);
		if (categories && categories.length) {
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
						ctx.throw(500, '服务器错误', err);
						next();
					});
				return doc;
			});
			const categoriesDate = await Promise.all(categoryPromises);
			categoriesId = categoriesDate.map(categoryDate => {
				console.log(categoryDate);
				return categoryDate._id;
			});
		}

		const result = await Article.create({
			title: info.title || '无题',
			publish: true,
			birthTime: info.date ? new Date(info.date) : Date.now(),
			tags: tagsId.length ? tagsId : [],
			categories: categoriesId.length ? categoriesId : [],
			url: path.join(os.homedir(), 'blogFiles', file.name)
		}).catch(err => {
			ctx.throw(500, '服务器错误' + err);
			next();
		});
		console.log('meicuomeicuo');
		console.log(result);
		ctx.body = 'successful';
		next();
	},
	async getPublishedArticles(ctx, next) {
		const page = ctx.query.page;
		const limit = ctx.query.limit;
		const docs = await Article
			.find({
				publish: true
			})
			.sort({
				'birthTime': -1
			})
			.skip(limit * (page - 1))
			.limit(limit)
			.populate('tags')
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const allCount = await Article
			.count({
				publish: true
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
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
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const docs = await Article
			.find({
				publish: true,
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
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const allCount = await Article
			.count({
				publish: true,
				categories: {
					$in: [categoryId]
				}
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
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
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const docs = await Article
			.find({
				publish: true,
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
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const allCount = await Article
			.count({
				publish: true,
				tags: {
					$in: [tagId]
				}
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
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
		const doc = await Article
			.findOne({
				_id: id
			})
			.populate('tags')
			.populate('categories')
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const text = fs.readFileSync(doc.url, 'utf8');
		const html = md.toHtml(text);
		const toc = md.toToc(text);
		const tocHtml = md.toHtml(toc);
		ctx.body = JSON.stringify({
			html: html,
			toc: tocHtml,
			info: {
				title: doc.title,
				date: doc.birthTime,
				tags: doc.tags,
				categories: doc.categories
			}
		});
		next();
	},
	async getAllArticles(ctx, next) {
		const articles = await Article
			.find()
			.sort({
				birthTime: -1
			})
			.populate('tags')
			.populate('categories')
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
				next();
			});
		ctx.body = JSON.stringify(articles);
		next();
	},
	async togglePublish(ctx, next) {
		console.log(ctx.headers, ctx.header);
		const body = JSON.parse(ctx.request.body);
		const publish = body.publish;
		const id = body.id;
		console.log(publish, id, body);
		const article = await Article
			.findOneAndUpdate({
				_id: id
			}, {
				$set: {
					publish: publish
				}
			}, {
				new: true
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
				next();
			});
		const tagPromises = article.tags.map(tag => {
			return Tag.update({
					_id: tag
				}, {
					$inc: {
						count: publish ? 1 : -1
					}
				})
				.catch(err => {
					ctx.throw(500, '服务器错误', err);
					next();
				});
		});
		const tagsData = await Promise.all(tagPromises);
		const categoryPromises = article.categories.map(category => {
			return Category.update({
					_id: category
				}, {
					$inc: {
						count: publish ? 1 : -1
					}
				})
				.catch(err => {
					ctx.throw(500, '服务器错误', err);
					next();
				});
		});
		const categoriesDate = await Promise.all(categoryPromises);
		ctx.body = JSON.stringify(article);
		next();
	}
};

export default articleController;