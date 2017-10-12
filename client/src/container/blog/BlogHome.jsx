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
			articlesCount: 0,
			currentPage: '',
			allPage: '',
		};
		this.limit = 10;
		this.changePage = this.changePage.bind(this);
	}

	changePage(newPage) {
		this.getArticles(newPage,this.limit)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				this.setState({
					articles: articles,
					articlesCount: parseInt(result.allCount),
					allPage: Math.ceil(result.allCount / this.limit).toString(),
					currentPage: newPage.toString()
				});
			});
	}

	componentWillMount() {
		this.getArticles(1,this.limit)
			.then(result => {
				console.log(result);
				const articles = this.transformArticle(result.articles);
				this.setState({
					articles: articles,
					articlesCount: parseInt(result.allCount),
					allPage: Math.ceil(result.allCount / this.limit).toString(),
					currentPage: '1'
				});
			});
	}
	getArticles(page,limit) {
		return fetch(`/getPublishedArticles?page=${page}&limit=${limit}`).then(response => {
			return response.json();
		})
	}
	transformArticle(articles) {
		const result = [];
		articles.forEach(article => {
		 	const urlArr = article.url.split('/');
		 	const date = new Date(article.birthTime);
		 	const tags = article.tags.map(tag => tag.name);
			const obj = {
				id: article._id,
				title: article.title,
				fileName: urlArr[urlArr.length - 1],
				date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
				tags: tags
			};
			result.push(obj);
		});
		return result;
	}
	render() {
		return (
			<div className={styles['home-wrapper']}>
				{this.state.articles.map(article => <ArticleCard key={article.id} article={article}/>)}
				{this.state.articlesCount > this.limit &&
					<Pagination pages={this.state.allPage} current={this.state.currentPage} changePage={this.changePage}/>
				}
			</div>
		)
	}
}