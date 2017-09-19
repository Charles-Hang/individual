import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ArticleCard from '../../component/blog/ArticleCard.jsx';
import Pagination from '../../component/blog/Pagination.jsx';

import styles from './blogHome.css';

export default class BlogHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: '7',
			allPage: '13',
		}
		this.changePage = this.changePage.bind(this);
	}

	changePage(newPage) {
		console.log(newPage);
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
				{articles.map(article => <ArticleCard key={article.title + article.date} article={article}/>)}
				<Pagination pages={this.state.allPage} current={this.state.currentPage} changePage={this.changePage}/>
			</div>
		)
	}
}