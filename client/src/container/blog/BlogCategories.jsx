import React, {Component} from 'react';
import {Link,Route} from 'react-router-dom';
import BlogCategory from '../../component/blog/BlogCategory.jsx';

import styles from './blogCategories.css';

export default class BlogCategories extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			categoriesCount: 0,
		};
	}

	componentWillMount() {
		this.getCategories().then(result => {
			this.setState({
				categories: result,
				categoriesCount: result.length
			});
		});
	}
	getCategories() {
		return fetch('/getCategories').then(response => {
			return response.json();
		});
	}
	render() {
		return (
			<div className={styles['categories-wrapper']}>
				<Route exact path={this.props.match.path} render={(props) => {
					return(
						<div>
							<h2 className={styles.title}>共计{this.state.categoriesCount}个分类</h2>
							<div className={styles['card-box']}>
								{this.state.categories.map(type => <TypeCard match={props.match} key={type.name} name={type.name} count={type.count}/>)}
							</div>
						</div>
					)
				}}/>
				<Route path={`${this.props.match.path}/:name`} component={BlogCategory}/>
			</div>
		)
	}
}

class TypeCard extends Component{
	constructor(props) {
		super(props);
		this.name = props.name;
		this.count = props.count;
		this.colors = ['#18232f','#e74c3c','#f0ad4e','#1abc9c','#5bc0de','#9b59b6','#34495e'];
		this.color = this.colors[Math.round(Math.random() * 6)];
	}

	handleHover(e) {
		// let target = e.target;
		// while(target.nodeName !== 'DIV') {
		// 	target = target.parentNode;
		// }
		// target.style.background = this.color;
		// target.style.color = '#fff';
	}

	handleLeave(e) {
		// let target = e.target;
		// while(target.nodeName !== 'DIV') {
		// 	target = target.parentNode;
		// }
		// target.style.background = '#f5f7f9';
		// target.style.color = '#000';

	}
	render() {
		return (
			<div
				className={styles['type-card']}
				onMouseOver={(e) => {this.handleHover(e)}}
				onMouseOut={(e) => {this.handleLeave(e)}}
			>
				<Link to={this.props.match.path + '/' + this.name}>
					<span>{this.name}</span>
					<span>({this.count})</span>
				</Link>
			</div>
		)
	}
}