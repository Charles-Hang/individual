import React, {Component} from 'react';

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
			console.log(target.parentElement);
			if(this.state.activeLis.length) {
				const newActiveLis = this.updateActiveLis(target.parentElement,this.state.activeLis);
				this.setState({
					activeLis: newActiveLis
				});
			}else {
				this.state.activeLis.push(target.parentElement);
				this.setState({
					activeLis: this.state.activeLis
				});
			}
			target.parentElement.classList.add('active');
		})
		window.addEventListener('scroll', this.contentPosition);
	}

	anchorPosition() {
		
	}

	contentPosition() {
		const docScrollTop = document.documentElement.scrollTop;
		if(this.state.contentTop <= docScrollTop) {
			console.log(docScrollTop,this.state.contentTop);
			this.content.style.position = 'fixed';
			this.content.style.top = '0';
		}else {
			console.log(docScrollTop,this.state.contentTop);
			this.content.style.position = 'static';
		}
	}


	extendItem(e) {
		let li;
		if(e.target.nodeName === 'LI') {
			li = e.target;
		}else{
			li = e.target.parentElement;
		}
		console.log(this.state.activeLis,'fklsd')
		if(this.state.activeLis.length) {
			const activeLis = this.state.activeLis;
			const newActiveLis = this.updateActiveLis(li,activeLis);
			console.log('new',newActiveLis)
			this.setState({
				activeLis: newActiveLis
			});
		}else{
			this.state.activeLis.push(li);
			this.setState({
				activeLis: this.state.activeLis
			});
		}
		console.log(this.state.activeLis);
		li.classList.add('active');
	}

	updateActiveLis(target,activeLis) {
		const lastLi = activeLis[activeLis.length - 1];
		if(this.isParent(target,lastLi)) {
			activeLis.push(target);
			console.log('isParent')
			return activeLis;
		}else{
			console.log('isnotparent')
			const abandonedLi = activeLis.pop();
			abandonedLi.classList.remove('active');
			if(activeLis.length){
				return this.updateActiveLis(target,activeLis);
			}else{
				return [target];
			}
		}
	}

	isParent(target,parent) {
		let item = target;
		while(item.parentElement) {
			item = item.parentElement;
			if(item === parent) {
				return true;
			}
		}
		return false;
	}

	render() {
		return(
			<div className={styles.content} onClick={(e) => {this.extendItem(e)}}>
				<p className={styles.title}>文章目录</p>
			</div>
		)
	}
}