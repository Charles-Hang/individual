import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const userController = {
	async login(ctx, next) {
		const body = JSON.parse(ctx.request.body);
		const username = body.username;
		const password = body.password;
		const doc = await User
			.find({
				username,
				password
			})
			.catch(err => {
				ctx.throw(500, '服务器错误', err);
			});
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
};

export default userController;