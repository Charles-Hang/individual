import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import utils from '../../utils/utils.js';

import styles from './blogWatching.css';

export default class BlogWatching extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: [],
			date: '',
			title: '',
			tags: [],
			categories: []
		};
		this.container = null;
		this.findHighLight = this.findHighLight.bind(this);
		this.findHighLightDebounce = null;
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
				this.setState({
					title: result.info.title,
					date: utils.parseDate(result.info.date),
					tags: result.info.tags,
					categories: result.info.categories
				});
			})
			.then(() => {
				const headers = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6'));
				this.setState({
					headers: headers
				});
				const codes = document.querySelectorAll('pre code');
				Array.from(codes).forEach(block => {
					hljs.highlightBlock(block);
				})
			});
		this.findHighLightDebounce = this.debounce(this.findHighLight,200);
		window.addEventListener('scroll',this.findHighLightDebounce);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll',this.findHighLightDebounce);
		window.eventEmitter.unSubscribe('contentReceived');
	}

	debounce(fuc,delay) {
		let timer;
		return function() {
			if(timer) clearTimeout(timer);
			timer = setTimeout(() => {
				fuc();
			},delay);
		}
	}

	findHighLight() {
		const scrollTop = document.documentElement.scrollTop;
		const nextIndex = this.state.headers.findIndex((header,index) => {
			let headerTop = header.offsetTop;
			while(header.offsetParent) {
				header = header.offsetParent;
				headerTop += header.offsetTop;
			}
			if(headerTop > scrollTop) {
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
			<div className={styles.wrapper}>
				<header className={styles.header}>
					<h1 className={styles.title}>{this.state.title}</h1>
					<div className={styles.meta}>
						{this.state.date && <span>发表于 {this.state.date}</span>}
						{!!this.state.categories.length && <i className={styles.gap}/>}
						{!!this.state.categories.length &&
							<span>
								分类：
								{this.state.categories.map(category => {
									return <Link
										key={category._id}
										className={styles.link}
										to={`/blog/categories/${category.name}`}
									>
										{category.name}
									</Link>;
								})}
							</span>
						}
						{!!this.state.tags.length && <i className={styles.gap}/>}
						{!!this.state.tags.length &&
							<span>
								标签：
								{this.state.tags.map(tag => {
									return <Link
										key={tag._id}
										className={styles.link}
										to={`/blog/tags/${tag.name}`}
									>
										{tag.name}
									</Link>
								})}
							</span>
						}
					</div>
				</header>
				<div id="article-container" className={styles['article-container']} />
			</div>
		)
	}
}