import React, {Component} from 'react';

import styles from './mood.css';

export default class Mood extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mood: []
		};
	}

	componentWillMount() {
		fetch('/getMood')
			.then(response => {
				console.log(response)
				return response.text();
			})
			.then(result => {
				const mood = result
					.split('\n')				
					.map((part,index) => {
						return <p
							key={part + index}
							style={{
								'overflowWrap': 'break-word',
								'wordBreak': 'break-all'
							}}
						>
							{part}
						</p>;
					});
				console.log(mood)
				this.setState({
					mood: mood
				});
			})
	}

	render() {
		return(
			<div className={styles.mood}>
				<p className={styles.title}>心情</p>
				{this.state.mood}
			</div>
		)
	}
}