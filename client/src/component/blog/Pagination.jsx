import React, {Component} from 'react';
import {Icon} from 'antd';

import styles from './pagination.css';

export default class Pagination extends Component {
	constructor(props) {
		super(props);
	}

	changePage(e) {
		const page = e.target.dataset.page;
		if(page === this.props.current) return;

		let targetPage;
		if(page === 'prev') {
			targetPage = this.props.current - 1;
		}else if(page === 'next') {
			targetPage = parseInt(this.props.current) + 1;
		}else {
			targetPage = page;
		}
		this.props.changePage(targetPage);
	}

	render() {
		console.log(this.props.current,this.props.pages)
		return (
			<div className={styles.wrapper} onClick={(e) => {this.changePage(e)}}>
				<div className={styles['top-line']}/>
				{this.props.current !== '1' && <Icon type="left" data-page="prev" className={styles.icon}/>}
				{this.props.current !== '1' && <button data-page="1">1</button>}
				{(() => {
					const current = parseInt(this.props.current);
					const max = parseInt(this.props.pages);
					const btns = [];
					btns.push(<button key={current} data-page={current} className="active">{current}</button>);
					if(current > 3) {
						btns.unshift(<button key={current - 1} data-page={current - 1}>{current - 1}</button>);
						btns.unshift(<Icon type="ellipsis" key="e-before" style={{fontSize: '16px'}}/>);
					}else if(current === 3) {
						btns.unshift(<button key="2" data-page="2">2</button>);
					}

					if(current < max - 2) {
						btns.push(<button key={current + 1} data-page={current + 1}>{current + 1}</button>);
						btns.push(<Icon type="ellipsis" key="e-after" style={{fontSize: '16px'}}/>);
					}else if(current === max - 2) {
						btns.push(<button key={max - 1} data-page={max - 1}>{max - 1}</button>);
					}
					return btns;
				})()}
				{this.props.current !== this.props.pages && <button data-page={this.props.pages}>{this.props.pages}</button>}
				{this.props.current !== this.props.pages && <Icon type="right" data-page="next" className={styles.icon}/>}
			</div>
		)
	}
}