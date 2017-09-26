import showdown from 'showdown';
showdown.setFlavor('github');

const md = (() => {
	const converter = new showdown.Converter();
	return {
		toHtml(text) {
			return converter.makeHtml(text);
		}
	}
})();

export default md;