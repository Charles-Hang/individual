import React, {Component} from 'react';

import styles from './blogWatching.css';

export default class BlogWatching extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: []
		}
		this.container = null;
		this.findHighLight = this.findHighLight.bind(this);
	}

	componentDidMount() {
		const name = this.props.match.params.name;
		const id = sessionStorage.getItem(name);
		const container = document.getElementById('article-container');
		this.container = container;
		fetch(`/openArticle?id=${id}`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				let timer;
				window.eventEmitter.subscribe('contentReceived',() => {
					timer && clearInterval(timer);
				});
				timer = setInterval(() => {
					window.eventEmitter.dispatch('content',decodeURI(result.toc));
				},300);
				window.eventEmitter.dispatch('content',decodeURI(result.toc));
				container.innerHTML += result.html;
				console.log(result);
			})
			.then(() => {
				const headers = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6'));
				this.setState({
					headers: headers
				});
				console.log(headers);
				const codes = document.querySelectorAll('pre code');
				codes.forEach(block => {
					hljs.highlightBlock(block);
				})
			});
		window.addEventListener('scroll',this.findHighLight);
	}

	findHighLight() {
		const scrollTop = document.documentElement.scrollTop;
		const nextIndex = this.state.headers.findIndex((header,index) => {
			let headerTop = header.offsetTop;
			while(header.offsetParent) {
				header = header.offsetParent;
				headerTop += header.offsetTop;
			}
			if(headerTop >= scrollTop) {
				return true;
			}
		});
		let highlightId = this.state.headers[0].id;
		if(nextIndex > 0) {
			highlightId = this.state.headers[nextIndex - 1].id;
		}
		window.eventEmitter.dispatch('highlightContent', highlightId);
	}

	render() {
		return (
			<div id="article-container" className={styles['article-container']}>
				
			</div>
		)
	}
}