import showdown from 'showdown';
import toc from 'markdown-toc';
showdown.setFlavor('github');
showdown.extension('myext', function() {
	return [{
		type: 'output',
		filter: function(text) {
			const msgReg = /^<!--.*-->$/gm;
			const newText = text.replace(msgReg, '');
			return newText;
		}
	}]
});

const md = (() => {
	const converter = new showdown.Converter({
		extensions: ['myext'],
		parseImgDimensions: true
	});
	return {
		toHtml(text) {
			return converter.makeHtml(text);
		},
		toToc(text) {
			return toc(text, {
				slugify: function(str) {
					let middle = str.toLowerCase();
					middle = middle.replace(/\(|\)/g, '');
					return middle.replace(/\s/g, '-');
				},
			}).content;
		}
	}
})();

export default md;