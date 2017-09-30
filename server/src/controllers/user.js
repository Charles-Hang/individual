import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const userController = {
	async login(ctx, next) {
		const body = JSON.parse(ctx.request.body);
		const username = body.username;
		const password = body.password;
		console.log(username, password);
		const doc = await User
			.find({
				username,
				password
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
				next();
			});
		console.log(doc);
		if (!doc.length) {
			ctx.body = JSON.stringify({
				result: '用户名或密码有误！',
			});
			next();
		} else {
			const token = jwt.sign({
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
			}, 'hswxBlog');
			ctx.body = JSON.stringify({
				result: 'ok',
				token: token
			});
			next();
		}
	},
	async initAdmin(ctx, next) {
		const userCount = await User
			.count()
			.catch(err => {
				ctx.throw(500, '服务器错误')
			});
		console.log(userCount);
		if (userCount === 0) {
			const user = await User
				.create({
					username: 'hswxing',
					password: 'grzy0926'
				})
				.catch(err => {
					ctx.throw(500, '服务器错误', err);
					next();
				});
			console.log(user);
			ctx.body = 'init admin successfully';
			next();
		} else {
			ctx.body = 'admin is already init';
			next();
		}
	}
};

export default userController;