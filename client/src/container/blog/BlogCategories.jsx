import React, {Component} from 'react';

import styles from './blogCategories.css';

export default class BlogCategories extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const types = [{
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
			<div className={styles['categories-wrapper']}>
				<h2 className={styles.title}>共计{}个分类</h2>
				<div className={styles['card-box']}>
					{types.map(type => <TypeCard key={type.name} name={type.name} num={type.num}/>)}
				</div>
			</div>
		)
	}
}

class TypeCard extends Component{
	constructor(props) {
		super(props);
		this.name = props.name;
		this.num = props.num;
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
				<span>{this.name}</span>
				<span>({this.num})</span>
			</div>
		)
	}
}