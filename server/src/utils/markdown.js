import showdown from 'showdown';
import toc from 'markdown-toc';
showdown.setFlavor('github');
showdown.extension('myext', function() {
	return [{
		type: 'output',
		filter: function(text) {
			const regex = /^<!--.*-->$/gm;
			const newText = text.replace(regex, '');
			return newText;
		}
	}]
});

const md = (() => {
	const converter = new showdown.Converter({
		extensions: ['myext']
	});
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