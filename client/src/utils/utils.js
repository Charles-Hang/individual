const utils = {
	scrollTo(height) {
		const proportion = 5;
		const scrollTop = document.documentElement.scrollTop;
		let speed = Math.abs(scrollTop - height);
		const timer = setInterval(() => {
			if (scrollTop > height) {
				document.documentElement.scrollTop -= Math.ceil(speed / proportion);
			} else {
				document.documentElement.scrollTop += Math.ceil(speed / proportion);
			}
			speed = speed - Math.ceil(speed / proportion);
			if (scrollTop == height || speed == 0) {
				clearInterval(timer);
			}
		}, 30);
	},
	parserDate(date) {
		const d = new Date(date);
		console.log(d)
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}
}

export default utils;