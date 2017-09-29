import React,{Component} from 'react';
import { 
	Link,
	Route,
 } from 'react-router-dom';
import BlogHome from './BlogHome.jsx';
import BlogCategories from './BlogCategories.jsx';
import BlogTags from './BlogTags.jsx';
import BlogArchives from './BlogArchives.jsx';
import BlogWatching from './BlogWatching.jsx';
import Content from '../../component/blog/Content.jsx';
import Mood from '../../component/blog/Mood.jsx';
import {Icon} from 'antd';
import utils from '../../utils/utils.js';

import styles from './blogIndex.css';

export default class BlogIndex extends Component {
	constructor() {
		super();
		this.state = {
			lastActive: null
		};
		this.toTopBtn = null;
		this.scrollHandling = this.scrollHandling.bind(this);
	}

	componentWillMount() {
		window.eventEmitter = {
		    _events: {},
		    dispatch: function (event, data = '', callback = '') {
		        if (!this._events[event]) return; // no one is listening to this event
		        for (let i = 0; i < this._events[event].length; i++) {
		            this._events[event][i](data,callback);
		        }
		    },
		    subscribe: function (event, callback) {
		        if (!this._events[event]) this._events[event] = []; // new event
		        this._events[event].push(callback);
		    },
		    unSubscribe: function(event){
		        if(this._events && this._events[event]) {
		            delete this._events[event];
		        }
		    }
		};
	}

	componentDidMount() {
		this.toTopBtn = document.getElementsByClassName(styles['to-top-btn'])[0];
		window.addEventListener('scroll',this.scrollHandling);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll',this.scrollHandling);
	}

	scrollHandling() {
		const scrollTop = document.documentElement.scrollTop;
		if(scrollTop >= 371) {
			this.toTopBtn.classList.add('active');
		}else{
			this.toTopBtn.classList.remove('active');
		}
	}

	pathIn(pathname,path) {
		const paths = pathname.split('/');
		return paths.includes(path);
	}

	handleItems(e) {
		e.target.classList.toggle('active');
	}

	handleMood(e) {
		e.target.classList.toggle('active');
	}

	scrollToTop() {
		utils.scrollTo(0);
	}

    render() {
        return (
        	<div className={styles.background}>
        		<div className={styles.line} />
	        	<div className={styles.wrapper}>
	        		<div className={styles.nav}>
						<div className={styles['visiting-card']}>
							<h1><Link to="/blog/back" style={{cursor: 'default'}}>一首歌时间</Link></h1>
							<p>是要两分，还是三分</p>
						</div>
						<Icon type="bars" className={styles['bar-icon']} onClick={(e) => {this.handleItems(e)}}/>
						<Route path={this.props.match.path} render={(props) => {
							const pathReg = /^\/blog\/\d+\/\d+\/\d+\/\S+$/;
							if(!pathReg.test(props.location.pathname)) {
								return <Icon
									type="coffee"
									className={styles['mood-icon']}
									onClick={(e) => {this.handleMood(e)}}
								/>
							}else {
								return null;
							}
						}}/>
						<ul className={styles['item-box']}>
							<li className={this.props.location.pathname === '/blog' ? 'active' : ''}>
								<Link to="/blog">
									<Icon type="home" style={{ fontSize: 16, color: '#e74c3c', marginRight: '10px'}} />
									首页
									<i className={`${styles['active-dot']} ${styles.dot1}`}/>
								</Link>
							</li>
							<li className={this.pathIn(this.props.location.pathname,'categories') ? 'active' : ''}>
								<Link to="/blog/categories">
									<Icon type="appstore-o" style={{ fontSize: 14, color: '#f0ad4e', marginRight: '10px'}} />
									分类
									<i className={`${styles['active-dot']} ${styles.dot2}`}/>
								</Link>
							</li>
							<li className={this.pathIn(this.props.location.pathname, 'tags') ? 'active' : ''}>
								<Link to="/blog/tags">
									<Icon
										type="tags-o"
										style={{ fontSize: 16, color: '#1abc9c', marginRight: '10px',verticalAlign: '-1px'}}
									/>
									标签
									<i className={`${styles['active-dot']} ${styles.dot3}`}/>
								</Link>
							</li>
							<li className={this.pathIn(this.props.location.pathname,'archives') ? 'active' : ''}>
								<Link to="/blog/archives">
									<Icon
										type="inbox"
										style={{ fontSize: 16, color: '#5bc0de', marginRight: '10px', verticalAlign: '-1px'}}
									/>
									归档
									<i className={`${styles['active-dot']} ${styles.dot4}`}/>
								</Link>
							</li>
						</ul>
						<Route path={this.props.match.path} render={(props) => {
							const pathReg = /^\/blog\/\d+\/\d+\/\d+\/\S+$/;
							if(pathReg.test(props.location.pathname)) {
								return <div >
									<Content />
								</div>
							}else{
								return <div className={styles.mood}>
									<Mood />
								</div>
							}
						}}/>
	        		</div>
	        		<div className={styles.main}>
	        			<Route exact path={this.props.match.path} component={BlogHome}/>
	        			<Route exact path={`${this.props.match.path}/:year(\\d+)/:month(\\d+)/:day(\\d+)/:name`} render={(props) => {
	        				this.state.lastActive && this.state.lastActive.classList.remove('active');
	        				return <BlogWatching {...props} />;
	        			}}/>
	        			<Route path={`${this.props.match.path}/categories`} component={BlogCategories}/>
	        			<Route path={`${this.props.match.path}/tags`} component={BlogTags}/>
	        			<Route path={`${this.props.match.path}/archives`} component={BlogArchives}/>
	        		</div>
	        	</div>
	        	<span className={styles['to-top-btn']} onClick={() => {this.scrollToTop()}}>
	        		<Icon type="to-top" />
	        	</span>
        	</div>
        ) 
    }
}