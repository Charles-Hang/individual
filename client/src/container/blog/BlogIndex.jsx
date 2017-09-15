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
import {Icon} from 'antd';

import styles from './blogIndex.css';

export default class BlogIndex extends Component {
	constructor() {
		super();
		this.state = {
			lastActive: null
		};
	}

	pathIn(pathname,path) {
		const paths = pathname.split('/');
		return paths.includes(path);
	}
    render() {
        return (
        	<div className={styles.background}>
        		<div className={styles.line} />
	        	<div className={styles.wrapper}>
	        		<div className={styles.nav}>
						<div className={styles['visiting-card']}>
							<h1>一首歌时间</h1>
							<p>是要两分，还是三分</p>
						</div>
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
							console.log(props);
							const pathReg = /^\/blog\/\d+\/\d+\/\d+\/\S+$/;
							if(pathReg.test(props.location.pathname)) {
								return <div>
									这是文章目录
								</div>
							}else{
								return <div className={styles.mood}>
									这是心情
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
        	</div>
        ) 
    }
}