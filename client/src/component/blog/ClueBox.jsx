import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './clueBox.css';

export default class ClueBox extends Component {
	// props.data = [{
	// id
	// 	type
	// 	name
	// },{
	//	id
	// 	type
	// 	name
	// 	date
	// 	url
	// }
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={styles.wrapper}>
				{this.props.data.map(item => {
					return <Item key={item.id} {...item} />
				})}
			</div>
		)
	}
}

function Item(props) {
	if(props.type === 'large') {
		return(
			<div className={styles['large-item']}>
				<span>{props.name}</span>
			</div>
		)
	}else {
		return(
			<div className={styles['small-item']}>
				<span>{props.date}</span>
				<span className={styles['item-name']}>
					<Link to={props.url} onClick={() => {saveArticleId(props.fileName,props.id)}}>{props.name}</Link>
				</span>
				<i className={styles.line}/>
			</div>
		)
	}
}

function saveArticleId(fileName,id) {
	sessionStorage.setItem(fileName,id);
}