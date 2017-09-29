import React, {Component} from 'react';
import utils from '../../utils/utils.js';

import styles from './content.css';

export default class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeLis: [],
		};
		this.content = null;
		this.contentPosition = this.contentPosition.bind(this);
	}

	componentDidMount() {
		const content = document.getElementsByClassName(styles.content)[0];
		let contentTop = 0,
			target = content;
		while(target) {
			contentTop += target.offsetTop;
			target = target.offsetParent;
		}
		this.setState({
			contentTop: contentTop
		});
		this.content = content;
		window.eventEmitter.subscribe('content',(data) => {
			content.innerHTML += data;
			window.eventEmitter.dispatch('contentReceived');
		});
		window.eventEmitter.subscribe('highlightContent',(id) => {
			const target = this.content.querySelector(`[href="#${id}"]`);
			if(!target) return;
			if(this.state.activeLis.length) {
				this.state.activeLis.forEach(li => {
					li.classList.remove('active');
				})
				const newActiveLis = this.updateActiveLis(target.parentElement);
				this.setState({
					activeLis: newActiveLis
				});
			}else {
				const newActiveLis = this.updateActiveLis(target.parentElement);
				this.setState({
					activeLis: newActiveLis
				});
			}
		})
		window.addEventListener('scroll', this.contentPosition);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.contentPosition);
		window.eventEmitter.unSubscribe('content');
		window.eventEmitter.unSubscribe('highlightContent');
	}

	anchorPosition() {
		
	}

	contentPosition() {
		if(window.innerWidth < 1200) return;
		const docScrollTop = document.documentElement.scrollTop;
		if(this.state.contentTop <= docScrollTop) {
			this.content.style.position = 'fixed';
			this.content.style.top = '0';
		}else {
			this.content.style.position = 'static';
		}

	}


	extendItem(e) {
		e.preventDefault();
		let li;
		if(e.target.nodeName !== 'A') {
			return;
		}else{
			li = e.target.parentElement;
		}
		if(this.state.activeLis.length) {
			const activeLis = this.state.activeLis;
			activeLis.forEach(li => {
				li.classList.remove('active');
			})
			const newActiveLis = this.updateActiveLis(li);
			this.setState({
				activeLis: newActiveLis
			});
		}else{
			const newActiveLis = this.updateActiveLis(li);
			this.setState({
				activeLis: newActiveLis
			});
		}
		
		const header = document.getElementById(e.target.hash.slice(1));
		let offsetHeader = header;
		let scrollTop = offsetHeader.offsetTop;
		while(offsetHeader.offsetParent) {
			offsetHeader = offsetHeader.offsetParent;
			scrollTop += offsetHeader.offsetTop;
		}
		utils.scrollTo(scrollTop);
	}

	updateActiveLis(target) {
		const lis = [];
		target.classList.add('active');
		lis.push(target);
		while(target.parentElement.nodeName !== 'DIV') {
			target = target.parentElement;
			if(target.nodeName === 'LI') {
				target.classList.add('active');
				lis.push(target);
			}
		}
		return lis;
	}

	render() {
		return(
			<div className={styles.content} onClick={(e) => {this.extendItem(e)}}>
				<p className={styles.title}>文章目录</p>
			</div>
		)
	}
}