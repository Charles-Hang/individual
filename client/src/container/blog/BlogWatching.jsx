import React, {Component} from 'react';

import styles from './blogWatching.css';

export default class BlogWatching extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const name = this.props.match.params.name;
		const id = sessionStorage.getItem(name);
		const container = document.getElementById('article-container');
		fetch(`/openArticle?id=${id}`)
			.then(response => {
				return response.text();
			})
			.then(result => {
				container.innerHTML = result;
			})
			.then(() => {
				const codes = document.querySelectorAll('pre code');
				codes.forEach(block => {
					hljs.highlightBlock(block);
				})
			})
	}

	render() {
		return (
			<div id="article-container" className={styles['article-container']}>
				
			</div>
		)
	}
}