import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './clueBox.css';

export default class ClueBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={styles.wrapper}>
				{this.props.data.map(item => {
					return <Item key={item.name + item.date} {...item} />
				})}
			</div>
		)
	}
}

function Item(props) {
	if(props.type === 'large') {
		return(
			<div className={styles['large-item']}>
				<span>{props.date}</span>
				<span>{props.name}</span>
			</div>
		)
	}else {
		return(
			<div className={styles['small-item']}>
				<span>{props.date}</span>
				<span className={styles['item-name']}><Link to={props.url}>{props.name}</Link></span>
				<i className={styles.line}/>
			</div>
		)
	}
	
}