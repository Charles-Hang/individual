import showdown from 'showdown';
import toc from 'markdown-toc';
showdown.setFlavor('github');

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