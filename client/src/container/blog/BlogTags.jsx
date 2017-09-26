import React, {Component} from 'react';
import {Route,Link} from 'react-router-dom';
import BlogTag from '../../component/blog/BlogTag.jsx';

import styles from './blogTags.css';

export default class BlogTags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			tagsCount: 0
		};
	}

	componentWillMount() {
		this.getTags().then(result => {
			this.setState({
				tags: result,
				tagsCount: result.length
			});
		});
	}

	getTags() {
		return fetch('/getTags').then(response => {
			return response.json();
		});
	}

	render() {
		return (
			<div className={styles['tags-wrapper']}>
				<Route exact path={this.props.match.path} render={(props) =>{
					return (
						<div>
							<h2 className={styles.title}>共计{this.state.tagsCount}个标签</h2>
							<div className={styles['tags-box']}>
								{this.state.tags.map(tag => <Tag key={tag.name} match={props.match} {...tag}/>)}
							</div>
						</div>
					)
				}}/>
				<Route path={`${this.props.match.path}/:name`} component={BlogTag}/>
			</div>
		)
	}
}

function Tag(props) {
	return (
		<div className={styles.tag}>
			<Link to={`${props.match.path}/${props.name}`}>
				<span>{props.name}</span>
				<span>({props.count})</span>
			</Link>
		</div>
	)
}