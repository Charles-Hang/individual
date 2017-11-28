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
		const {
			filename,
			content
		} = JSON.parse(ctx.request.body);
		const noBlogFile = await new Promise((resolve, reject) => {
			fs.access(path.join(os.homedir(), 'blogFiles'), function(err) {
				if (err) {
					resolve(err);
				} else {
					resolve();
				}
			});
		});
		if (noBlogFile) {
			fs.mkdirSync(path.join(os.homedir(), 'blogFiles'));
		}
		try {
			fs.writeFileSync(path.join(os.homedir(), 'blogFiles', filename), content);
		} catch (err) {
			ctx.throw(500, '服务器错误', err);
		};
		const reader = fs.createReadStream(path.join(os.homedir(), 'blogFiles', filename));

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
		// const rlEnd = await new Promise(resolve => {
		// 	rl.on('close', () => {
		// 		resolve();
		// 	});
		// }).catch(err => {
		// 	console.log('await rlEnd err', err);
		// });
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
			title: info.title ? info.title.trim() : '无题',
			publish: true,
			birthTime: info.date ? new Date(info.date) : Date.now(),
			tags: tagsId.length ? tagsId : [],
			categories: categoriesId.length ? categoriesId : [],
			url: path.join(os.homedir(), 'blogFiles', filename)
		}).catch(err => {
			ctx.throw(500, '服务器错误' + err);
		});
		console.log(result);
		ctx.body = 'success';
	},
	async editArticle(ctx, next) {
		const {
			filename,
			content,
			id
		} = JSON.parse(ctx.request.body);

		try {
			fs.writeFileSync(path.join(os.homedir(), 'blogFiles', filename), content);
		} catch (err) {
			ctx.throw(500, '服务器错误', err);
		};
		const reader = fs.createReadStream(path.join(os.homedir(), 'blogFiles', filename));

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
		console.log('info', info);
		const newTags = info.tags ? info.tags.trim().split(' ') : [];
		const newCategories = info.categories ? info.categories.trim().split(' ') : [];
		const newTitle = info.title ? info.title.trim() : '无题';
		const newUrl = path.join(os.homedir(), 'blogFiles', filename);

		const original = await Article
			.findById(id)
			.populate('tags')
			.populate('categories')
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		console.log('original', original);
		const {
			title,
			tags,
			categories,
			url
		} = original;
		if (newUrl !== url) {
			try {
				fs.unlinkSync(url);
			} catch (err) {
				ctx.throw(500, '服务器错误', err);
			}
		}
		const tagPromises = newTags.map(newTag => {
			let exist = false,
				existId;
			tags.forEach(tag => {
				if (tag.name === newTag) {
					exist = true;
					existId = tag._id;
				}
			});
			if (exist) {
				return new Promise(resolve => {
					resolve(existId);
				});
			} else {
				return Tag.findOneAndUpdate({
						name: newTag
					}, {
						$inc: {
							count: 1
						}
					})
					.then(result => {
						if (result) return result._id;
						return Tag.create({
							name: newTag,
							count: 1
						}).then(result => {
							return result._id;
						});
					})
					.catch(err => {
						ctx.throw(500, '服务器错误', err);
					});
			}
		});
		const newTagsId = await Promise.all(tagPromises);
		console.log('newTagsId', newTagsId);
		const tagUnLinkPromises = tags.map(tag => {
			if (!newTags.includes(tag.name)) {
				return Tag
					.findByIdAndUpdate(tag._id, {
						$inc: {
							count: -1
						}
					})
					.catch(err => {
						ctx.throw(500, '服务器错误', err);
					});
			}
		});
		await Promise.all(tagUnLinkPromises);

		const categoryPromises = newCategories.map(newCategory => {
			let exist = false,
				existId;
			categories.forEach(category => {
				if (category.name === newCategory) {
					exist = true;
					existId = category._id;
				}
			});
			if (exist) {
				return new Promise(resolve => {
					resolve(existId);
				});
			} else {
				return Category.findOneAndUpdate({
						name: newCategory
					}, {
						$inc: {
							count: 1
						}
					})
					.then(result => {
						if (result) return result._id;
						return Category.create({
							name: newCategory,
							count: 1
						}).then(result => {
							return result._id;
						});
					})
					.catch(err => {
						ctx.throw(500, '服务器错误', err);
					});
			}
		});
		const newCategoriesId = await Promise.all(categoryPromises);
		console.log('newCategoriesId', newCategoriesId);
		const categoryUnlinkPromises = categories.map(category => {
			if (!newCategories.includes(category.name)) {
				return Category
					.findByIdAndUpdate(category._id, {
						$inc: {
							count: -1
						}
					})
					.catch(err => {
						ctx.throw(500, '服务器错误', err);
					});
			}
		});
		await Promise.all(categoryUnlinkPromises);

		await Article
			.findByIdAndUpdate(id, {
				title: newTitle,
				tags: newTagsId,
				categories: newCategoriesId,
				url: newUrl
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		ctx.body = 'success';
	},
	async getPublishedArticles(ctx, next) {
		const page = parseInt(ctx.query.page);
		const limit = parseInt(ctx.query.limit);
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
			});
		const allCount = await Article
			.count({
				publish: true
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
	},
	async getArticlesByCategory(ctx, next) {
		const page = parseInt(ctx.query.page);
		const limit = parseInt(ctx.query.limit);
		const category = decodeURI(ctx.query.category);
		const categoryId = await Category
			.findOne({
				name: category
			})
			.then(result => {
				return result._id;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
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
			});
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
	},
	async getArticlesByTag(ctx, next) {
		const page = parseInt(ctx.query.page);
		const limit = parseInt(ctx.query.limit);
		const tag = decodeURI(ctx.query.tag);
		const tagId = await Tag
			.findOne({
				name: tag
			})
			.then(result => {
				return result._id;
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
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
			});
		ctx.body = JSON.stringify({
			allCount: allCount,
			articles: docs
		});
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
	},
	async getArticleContent(ctx, next) {
		const id = ctx.query.id;
		const article = await Article
			.findById(id)
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		const text = fs.readFileSync(article.url, 'utf8');
		const splits = article.url.split('/');
		ctx.body = JSON.stringify({
			filename: splits[splits.length - 1],
			content: text
		});
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
			});
		ctx.body = JSON.stringify(articles);
	},
	async togglePublish(ctx, next) {
		const body = JSON.parse(ctx.request.body);
		const publish = body.publish;
		const id = body.id;
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
				});
		});
		const categoriesDate = await Promise.all(categoryPromises);
		ctx.body = JSON.stringify(article);
	},
	async deleteArticle(ctx, next) {
		const {
			id
		} = JSON.parse(ctx.request.body);
		const article = await Article
			.findOne({
				_id: id
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		const {
			categories,
			tags,
			url
		} = article;
		const categoryPromises = categories.map(categoryId => {
			return Category
				.findByIdAndUpdate(categoryId, {
					$inc: {
						count: -1
					}
				})
				.catch(err => {
					ctx.throw(500, '服务器错误', err);
				});
		});
		const newCategories = await Promise.all(categoryPromises);

		const tagPromises = tags.map(tagId => {
			return Tag
				.findByIdAndUpdate(tagId, {
					$inc: {
						count: -1
					}
				})
				.catch(err => {
					ctx.throw(500, '服务器错误', err);
				});
		});
		const newTags = await Promise.all(tagPromises);

		try {
			fs.unlinkSync(url);
		} catch (err) {
			ctx.throw(500, '服务器错误', err);
		}
		const result = await Article
			.remove({
				_id: id
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		ctx.body = 'success';
	}
};

export default articleController;