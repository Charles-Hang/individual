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
			});
		console.log(doc);
		if (!doc.length) {
			ctx.body = JSON.stringify({
				result: '用户名或密码有误！',
			});
		} else {
			const token = jwt.sign({
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
			}, 'hswxBlog');
			ctx.body = JSON.stringify({
				result: 'ok',
				token: token
			});
		}
	},

	async jwtVerify(ctx, next) {
		const token = ctx.get('authorization');
		console.log('token', token);
		const decoded = await new Promise(resolve => {
			jwt.verify(token, 'hswxBlog', (err, decoded) => {
				if (err) throw (err);
				resolve(decoded);
			});
		}).catch(err => {
			ctx.body = err.message;
		});
		if (decoded) {
			console.log(decoded);
			ctx.body = 'success';
		}
	},

	async loginVerify(ctx, next) {
		const {
			username,
			password
		} = JSON.parse(ctx.request.body);
		const doc = await User
			.find({
				username,
				password
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
		if (doc.length) {
			await next();
		} else {
			ctx.body = '用户名或密码有误！';
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
				});
			console.log(user);
			ctx.body = 'init admin successfully';
		} else {
			ctx.body = 'admin is already init';
		}
	}
};

export default userController;