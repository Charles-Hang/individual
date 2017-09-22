import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ArticleCard from '../../component/blog/ArticleCard.jsx';
import Pagination from '../../component/blog/Pagination.jsx';

import styles from './blogHome.css';

export default class BlogHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			currentPage: '',
			allPage: '',

		}
		this.changePage = this.changePage.bind(this);
	}

	changePage(newPage) {
		this.getArticles(newPage,5)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				this.setState({
					articles: articles,
					allPage: Math.ceil(result.allCount / 5).toString(),
					currentPage: newPage.toString()
				});
			});
	}

	componentDidMount() {
		this.getArticles(1,5)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				this.setState({
					articles: articles,
					allPage: Math.ceil(result.allCount / 5).toString(),
					currentPage: '1'
				});
			});
	}
	getArticles(page,limit) {
		return fetch(`/getArticles?page=${page}&limit=${limit}`).then(response => {
			return response.json();
		}).then(result => {
			return result;
		});
	}
	transformArticle(articles) {
		const result = [];
		articles.forEach(article => {
		 	const urlArr = article.url.split('/');
		 	const date = new Date(article.birthTime);
			const obj = {
				title: article.title,
				fileName: urlArr[urlArr.length - 1],
				date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
				tags: article.tags
			};
			result.push(obj);
		});
		return result;
	}
	render() {
		const articles = [{
			title: '[学习笔记]深入理解CSS定位机制之浮动与绝对定位',
			fileName: 'klsjdk',
			date: '2014-5-5',
			tags: ['javascript', 'canvas']
		},{
			title: '这是另一个标题',
			fileName: 'klsjdk',
			date: '2017-9-19',
			tags: ['react']
		},{
			title: '这是另一个另一9个标题',
			fileName: 'klsjdk',
			date: '2017-9-0',
			tags: ['react']
		},{
			title: '这是另一个9标题',
			fileName: 'klsjdk',
			date: '2017-9-19',
			tags: ['react']
		},{
			title: '这是个标题',
			fileName: 'klsjdk',
			date: '2017-9-0',
			tags: ['react']
		}];
		return (
			<div className={styles['home-wrapper']}>
				{this.state.articles.map(article => <ArticleCard key={article.title + article.date} article={article}/>)}
				<Pagination pages={this.state.allPage} current={this.state.currentPage} changePage={this.changePage}/>
			</div>
		)
	}
}