import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import App from './container/App.jsx';

ReactDom.render(
	<App />,
	document.getElementById('app')
);

// //模块热替换的API
// if (module.hot) {
// 	module.hot.accept('./container/App.jsx', () => {
// 		render(App);
// 	})
// }