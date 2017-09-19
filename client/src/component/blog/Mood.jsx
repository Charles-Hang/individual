import React, {Component} from 'react';

import styles from './mood.css';

export default class Mood extends Component {
	render() {
		return(
			<div className={styles.mood}>
				<p className={styles.title}>心情</p>
			</div>
		)
	}
}