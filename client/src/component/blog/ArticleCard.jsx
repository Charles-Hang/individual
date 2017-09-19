import React,{Component} from 'react';
import {
	Link
} from 'react-router-dom';

import styles from './articleCard.css';

export default class ArticleCard extends Component {
	constructor(props) {
		super(props);
		this.colors = ['#18232f','#1abc9c','#9b59b6','#5bc0de','#f0ad4e','#e74c3c','#34495e'];
		this.color = this.colors[Math.round(Math.random() * 6)]; // 标签颜色
	}

	getPath() {
		const date = this.props.article.date.split('-').join('/');
		return `/blog/${date}/${this.props.article.fileName}`;
	}
	render() {
		return(
			<div className={styles.card}>
				<h1 className={styles.title}>
					<Link to={this.getPath()} style={{dispaly: 'block'}}>
						{this.props.article.title}
					</Link>
				</h1>
				<div className={styles.msg}>
					<div>发表于 {this.props.article.date}</div>
					<i className={styles['msg-gap']}/>
					{this.props.article.tags.map(tag => (
						<div key={tag} className={styles.tags} style={{background: this.color}}>
							<i className={styles['tag-triangle']} style={{borderRightColor: this.color}}/>
							<Link to={`/blog/tags/${tag}`} style={{marginRight: '10px'}}>{tag}</Link>
						</div>
					))}
				</div>
				<div style={{marginLeft: '40px',marginRight: '40px'}}>
				</div>
				<div className={styles.bottom}/>
			</div>
		)
	}
}