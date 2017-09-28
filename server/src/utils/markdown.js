import showdown from 'showdown';
import toc from 'markdown-toc';
showdown.setFlavor('github');
const myext = {
	type: 'lang',
	filter: function(text) {
		const reg = /^<!--.*-->$/g
		text.replace(reg, '');
		return text;
	}
};
showdown.extension('myext', myext);

const md = (() => {
	const converter = new showdown.Converter();
	return {
		toHtml(text) {
			return converter.makeHtml(text);
		},
		toToc(text) {
			return toc(text, {
				slugify: function(str) {
					const middle = str.toLowerCase();
					return middle.replace(/\s/g, '-');
				}
			}).content;
		}
	}
})();

export default md;