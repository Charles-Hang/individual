import jwt from 'jsonwebtoken';

const jwtVerify = async(ctx, next) => {
	const token = ctx.get('authorization');
	console.log('token', token);
	const decoded = await new Promise(resolve => {
		jwt.verify(token, 'hswxBlog', (err, decoded) => {
			if (err) throw (err);
			resolve(decoded);
		});
	}).catch(err => {
		ctx.throw(401, 'token err', err);
	});
	if (decoded) {
		console.log(decoded);
		await next();
	}
}

export default jwtVerify;