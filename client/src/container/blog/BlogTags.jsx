import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom';
import BlogTag from '../../component/blog/BlogTag.jsx';

import styles from './blogTags.css';

export default class BlogTags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: []
		}
	}

	render() {
		const tags = [{
			name: 'javascript',
			num: '5'
		},{
			name: 'react',
			num: '2'
		},{
			name: 'canvas',
			num: '8'
		},{
			name: 'canvassdf',
			num: '8'
		},{
			name: 'canvsdfas',
			num: '8'
		},{
			name: 'cas',
			num: '8'
		},{
			name: 'canas',
			num: '8'
		},{
			name: 'css',
			num: '8'
		},{
			name: '随笔',
			num: '8'
		}];
		return (
			<div className={styles['tags-wrapper']}>
				<Route exact path={this.props.match.path} render={(props) =>{
					return (
						<div>
							<h2 className={styles.title}>共计{}个标签</h2>
							<div className={styles['tags-box']}>
								{tags.map(tag => <Tag key={tag.name} match={props.match} {...tag}/>)}
							</div>
						</div>
					)
				}}/>
				<Route path={`${this.props.match.path}/:name`} component={BlogTag}/>
			</div>
		)
	}
}

// class Tag extends Component {
// 	constructor(props) {
// 		super(props);
// 	}

// 	render() {
// 		reutrn (
// 			<div className={styles.tag}>
// 				<span></span>
// 			</div>
// 		)
// 	}
// }

function Tag(props) {
	return (
		<div className={styles.tag}>
			<Link to={`${props.match.path}/${props.name}`}>
				<span>{props.name}</span>
				<span>({props.num})</span>
			</Link>
		</div>
	)
}